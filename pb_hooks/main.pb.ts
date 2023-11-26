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
		console.log(randomPass);

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


cronAdd("midnight_update", "@midnight", () => {
	$app.dao().runInTransaction((txDao) => {

		const now = new DateTime(); // current date and time

		const maxAgeInDays = 30; // Stores the view history for 1 month

		const maxCreatedDate = new DateTime(now.time().addDate(0,0,-maxAgeInDays).string());

		const records = txDao.findRecordsByFilter(
			"latest_views",                                 // collection
			"created <= {:maxCreated}", 					// filter
			"+created",                                   	// sort
			0,                                            	// limit
			0,                                             	// limit
			{ maxCreated: maxCreatedDate },
		)

		console.log(`Deleting ${records.length} records`);

		records.forEach(record=>{
			if(record){
				txDao.deleteRecord(record);
			}
		})
	})

});


routerAdd('POST', 'api/educautf/views', (c) => {
	
	const data = $apis.requestInfo(c)?.data;
	if (data === undefined) return c.json(400, {message: "data is undefined!"});

	const collectionName = data.collectionName; 	// articles or chapters
	const recordId = data.recordId;					// record id

	if (collectionName === undefined || recordId === undefined) {
		throw new BadRequestError('Invalid request');
	}

	$app.dao().runInTransaction((txDao) => {
		const record = txDao.findRecordById(collectionName, recordId)

		record.set('views', record.getInt('views') + 1);
		txDao.saveRecord(record);

		const latest_views_collection = txDao.findCollectionByNameOrId("latest_views")
		
		const latest_views_record = new Record(latest_views_collection, {
			[collectionName]: record.id,
		})
		
		const requestAuthor = c.get("authRecord");
		if (requestAuthor) {
			// @ts-ignore
			latest_views_record.set("user", requestAuthor.id)
		}

		txDao.saveRecord(latest_views_record)
	})
	
	return c.json(200, { message: "Number of views updated!" });
});

/*
routerAdd('GET', 'api/tes', (c) => {
	$app.dao().runInTransaction((txDao) => {

		const now = new DateTime(); // current date and time

		const maxAgeInDays = 1;

		const maxCreatedDate = new DateTime(now.time().addDate(0,0,-maxAgeInDays).string());

		const records = txDao.findRecordsByFilter(
			"latest_views",                                 // collection
			"created <= {:maxCreated}", 					// filter
			"+created",                                   	// sort
			0,                                            	// limit
			0,                                             	// limit
			{ maxCreated: maxCreatedDate },
		)
		console.log(`Deleting ${records.length} records`);

		records.forEach(record=>{
			if(record){
				txDao.deleteRecord(record);
			}
		})
	})
	
});
*/