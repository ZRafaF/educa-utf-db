// Copyright (c) 2023 Rafael Farias
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/// <reference path="../pb_data/types.d.ts" />

// Intercepts article creation and creates an attachment relation
onRecordAfterCreateRequest((e) => {
	const record = e.record;
	if (record) {
		const collection = $app.dao()?.findCollectionByNameOrId('attachments');
		const attachmentRecord = new Record(collection, {
			id: record.id,
			article: record.id,
			user: record.get('user'),
		});

		$app.dao()?.saveRecord(attachmentRecord);
		record.set('attachments', record.id);
		$app.dao()?.saveRecord(record);
	}
}, 'articles');

routerAdd('POST', 'api/educautf/utfpr-auth', (c) => {
	const createNewUtfUser = (username, usersRecord) => {
		// Creates a new user and assigns a random string as its password
		const randomPass = $security.randomString(32);

		const form = new RecordUpsertForm($app, usersRecord);
		form.loadData({
			username: username,
			name: `UTF_${username}`,
			password: randomPass,
			passwordConfirm: randomPass,
		});

		form.submit();
	};

	const isUtfUserValid = (username, password) => {
		const UTF_AUTH_TOKEN = $os.getenv('UTF_AUTH_TOKEN');

		const res = $http.send({
			url: 'https://unions.netfy.me/api/',
			method: 'GET',
			body: JSON.stringify({
				token: UTF_AUTH_TOKEN,
				option: 'is_user',
				user: username,
				pass: password,
			}),
			headers: { 'content-type': 'application/json' },
			timeout: 30,
		});

		const jsonResponse = res.json[0];

		if (!jsonResponse.acesso_api)
			throw new BadRequestError("UTFPR's API Token is not valid");

		if (!jsonResponse.status_api)
			throw new BadRequestError("UTFPR's API is not working properly");

		if (!jsonResponse.allow_login)
			throw new BadRequestError('Invalid user or password');

		return true;
	};
	const data = $apis.requestInfo(c)?.data;
	if (data === undefined) return c.json(500, {});

	const username = data.username;
	const password = data.password;

	if (password === undefined || username === undefined) {
		throw new BadRequestError('Invalid request');
	}
	if (!isUtfUserValid(username, password)) {
		throw new BadRequestError('Invalid credentials');
	}
	const collection = $app.dao()?.findCollectionByNameOrId('users');
	const record = new Record(collection);

	try {
		$app.dao()?.findFirstRecordByData('users', 'username', username);
	} catch (error) {
		createNewUtfUser(username, record);
	}

	// This part can fail and will return a error
	const authUserRecord = $app
		.dao()
		?.findFirstRecordByData('users', 'username', username);
	if (authUserRecord === undefined) {
		return c.json(500, {});
	}

	// const newToken = $tokens.recordAuthToken($app, record);
	// return c.json(200, { token: newToken, record: authUserRecord });
	return $apis.recordAuthResponse($app, c, authUserRecord, null);
});

cronAdd('midnight_update', '@midnight', () => {
	$app.dao().runInTransaction((txDao) => {
		const now = new DateTime(); // current date and time

		const maxAgeInDays = 30; // Stores the view history for 1 month

		const maxCreatedDate = new DateTime(
			now.time().addDate(0, 0, -maxAgeInDays).string()
		);

		const records = txDao.findRecordsByFilter(
			'latest_views', // collection
			'created <= {:maxCreated}', // filter
			'+created', // sort
			0, // limit
			0, // limit
			{ maxCreated: maxCreatedDate }
		);

		records.forEach((record) => {
			if (record) {
				txDao.deleteRecord(record);
			}
		});

		$app.logger().info(
			'Deleted old latest_views records',
			'Found',
			records.length
		);
	});
});

routerAdd('POST', 'api/educautf/views', (c) => {
	function isNullOrUndefined(value) {
		return value === undefined || value === null;
	}

	const data = $apis.requestInfo(c)?.data;
	if (data === undefined)
		return c.json(400, { message: 'data is undefined!' });

	const collectionName = data.collectionName; // articles or chapters
	const recordId = data.recordId; // record id

	if (isNullOrUndefined(collectionName) || isNullOrUndefined(recordId)) {
		throw new BadRequestError('Invalid request');
	}

	$app.dao().runInTransaction((txDao) => {
		const record = txDao.findRecordById(collectionName, recordId);

		record.set('views', record.getInt('views') + 1);
		txDao.saveRecord(record);

		const latest_views_collection =
			txDao.findCollectionByNameOrId('latest_views');

		const latest_views_record = new Record(latest_views_collection, {
			[collectionName]: record.id,
		});

		const requestAuthor = c.get('authRecord');
		if (requestAuthor) {
			// @ts-ignore
			latest_views_record.set('user', requestAuthor.id);
		}

		txDao.saveRecord(latest_views_record);
	});

	return c.json(200, { message: 'Number of views updated!' });
});

// // Testing route
// routerAdd('GET', 'api/tes', (c) => {
// 	try {
// 		const now = new DateTime(); // current date and time

// 		const minAgeInDays = 1;

// 		const minCreatedDate = new DateTime(
// 			now.time().addDate(0, 0, -minAgeInDays).string()
// 		);

// 		const key_words_stats_record = $app.dao().findRecordsByFilter(
// 			'key_words_stats', // collection
// 			'articles_references = 0 && chapters_references = 0 && created <= {:minCreated}', // filter
// 			'+created', // sort
// 			0, // limit
// 			0, // limit
// 			{ minCreated: `${minCreatedDate}` } // optional filter params
// 		);

// 		const key_words_ids = [];

// 		for (let key_words_stats of key_words_stats_record) {
// 			if (key_words_stats) {
// 				key_words_ids.push(key_words_stats.id);
// 			}
// 		}

// 		const key_words_records = $app
// 			.dao()
// 			.findRecordsByIds('key_words', key_words_ids);

// 		let num_of_deleted_records = 0;
// 		for (let key_words_record of key_words_records) {
// 			if (key_words_record) {
// 				$app.dao().deleteRecord(key_words_record);
// 				num_of_deleted_records++;
// 			}
// 		}

// 		$app.logger().info(
// 			'Deleted unreferenced key_words',
// 			'Found',
// 			key_words_stats_record.length,
// 			'Deleted',
// 			num_of_deleted_records
// 		);
// 	} catch (error) {
// 		$app.logger().error(
// 			'Error while deleting unreferenced key_words',
// 			'error',
// 			error
// 		);
// 	}
// });

// Removes old unused keywords, runs at midnight
cronAdd('key_words_pruner', '@midnight', () => {
	try {
		const now = new DateTime(); // current date and time

		const minAgeInDays = 1;

		const minCreatedDate = new DateTime(
			now.time().addDate(0, 0, -minAgeInDays).string()
		);

		const key_words_stats_record = $app.dao().findRecordsByFilter(
			'key_words_stats', // collection
			'articles_references = 0 && chapters_references = 0 && created <= {:minCreated}', // filter
			'+created', // sort
			0, // limit
			0, // limit
			{ minCreated: `${minCreatedDate}` } // optional filter params
		);

		const key_words_ids = [];

		for (let key_words_stats of key_words_stats_record) {
			if (key_words_stats) {
				key_words_ids.push(key_words_stats.id);
			}
		}

		const key_words_records = $app
			.dao()
			.findRecordsByIds('key_words', key_words_ids);

		let num_of_deleted_records = 0;
		for (let key_words_record of key_words_records) {
			if (key_words_record) {
				$app.dao().deleteRecord(key_words_record);
				num_of_deleted_records++;
			}
		}

		$app.logger().info(
			'Deleted unreferenced key_words',
			'Found',
			key_words_stats_record.length,
			'Deleted',
			num_of_deleted_records
		);
	} catch (error) {
		$app.logger().error(
			'Error while deleting unreferenced key_words',
			'error',
			error
		);
	}
});

routerAdd('POST', 'api/educautf/likes', (c) => {
	function isNullOrUndefined(value) {
		return value === undefined || value === null;
	}

	const data = $apis.requestInfo(c)?.data;
	if (data === undefined)
		return c.json(400, { message: 'data is undefined!' });

	const authRecord = c.get('authRecord');

	const collectionName = data.collectionName; // articles or chapters
	const recordId = data.recordId; // record id
	const action = data.action; // add or remove

	if (
		isNullOrUndefined(collectionName) ||
		isNullOrUndefined(recordId) ||
		isNullOrUndefined(action)
	) {
		throw new BadRequestError(
			'Invalid request, it should contain {collectionName: "articles" or "chapters", recordId: "recordId" and action: "add" or "remove"}'
		);
	}

	if (isNullOrUndefined(authRecord)) {
		throw new BadRequestError(
			'Invalid request, author record is undefined.'
		);
	}

	const fieldName = `liked_${collectionName}`;
	let likesArray = authRecord.get(fieldName);

	if (isNullOrUndefined(likesArray)) {
		throw new BadRequestError('Invalid request, likesArray is undefined.');
	}

	const recordIsInArray = likesArray.includes(recordId);

	let returnMessage = 'Record was added successfully!';

	if (recordIsInArray && action === 'add')
		returnMessage = 'Record is already in the array!';

	if (!recordIsInArray && action === 'remove')
		returnMessage = 'Record is not in the array!';

	if (!recordIsInArray && action === 'add') likesArray.push(recordId);

	if (recordIsInArray && action === 'remove')
		likesArray = likesArray.filter((id) => id !== recordId);

	authRecord.set(fieldName, likesArray);
	$app.dao().saveRecord(authRecord);
	const record = $app
		.dao()
		.findRecordById(`${collectionName}_stats`, recordId);
	const likes = record.getInt('likes');

	return c.json(200, {
		message: returnMessage,
		likes: likes,
		userRecord: authRecord,
	});
});

onAfterBootstrap((e) => {
	function slugify(str) {
		return String(str)
			.normalize('NFKD') // split accented characters into their base characters and diacritical marks
			.replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
			.trim() // trim leading or trailing whitespace
			.toLowerCase() // convert to lowercase
			.replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
			.replace(/\s+/g, '-') // replace spaces with hyphens
			.replace(/-+/g, '-'); // remove consecutive hyphens
	}

	const articlesRecords = $app.dao().findRecordsByFilter(
		'articles', // collection
		"slug = ''", // filter
		'+created', // sort
		0, // limit
		0 // limit
	);

	const chaptersRecords = $app.dao().findRecordsByFilter(
		'chapters', // collection
		"slug = ''", // filter
		'+created', // sort
		0, // limit
		0 // limit
	);

	for (const record of articlesRecords) {
		const title = record.get('title');
		const slug = slugify(title);
		record.set('slug', slug);

		$app.dao().saveRecord(record);
		$app.logger().info(
			'Added slug to article:',
			'title',
			title,
			'slug',
			slug
		);
	}

	for (const record of chaptersRecords) {
		const title = record.get('title');
		const slug = slugify(title);
		record.set('slug', slug);

		$app.dao().saveRecord(record);
		$app.logger().info(
			'Added slug to article:',
			'title',
			title,
			'slug',
			slug
		);
	}
});

onRecordAfterCreateRequest(
	(e) => {
		function slugify(str) {
			return String(str)
				.normalize('NFKD') // split accented characters into their base characters and diacritical marks
				.replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
				.trim() // trim leading or trailing whitespace
				.toLowerCase() // convert to lowercase
				.replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
				.replace(/\s+/g, '-') // replace spaces with hyphens
				.replace(/-+/g, '-'); // remove consecutive hyphens
		}
		const record = e.record;
		const title = record.get('title');
		const slug = slugify(title);
		record.set('slug', slug);

		$app.dao().saveRecord(record);
	},
	'chapters',
	'articles'
);

onRecordAfterUpdateRequest(
	(e) => {
		function slugify(str) {
			return String(str)
				.normalize('NFKD') // split accented characters into their base characters and diacritical marks
				.replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
				.trim() // trim leading or trailing whitespace
				.toLowerCase() // convert to lowercase
				.replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
				.replace(/\s+/g, '-') // replace spaces with hyphens
				.replace(/-+/g, '-'); // remove consecutive hyphens
		}
		const record = e.record;
		const title = record.get('title');
		const slug = slugify(title);
		record.set('slug', slug);

		$app.dao().saveRecord(record);
	},
	'chapters',
	'articles'
);
