// Copyright (c) 2023 Rafael Farias
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/// <reference path="../pb_data/types.d.ts" />

/*
// fires when the "post" collection is updated
onRecordAfterUpdateRequest((e) => {
  const record = e.record;
  if (record) {
    const formattedTitle = record
      .get("title")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .toLowerCase();
    const newSlug = formattedTitle + "-" + record.id;
    record.set("slug", newSlug);
    $app.dao()?.saveRecord(record);
  }
}, "posts");
*/

/*

// fires when the "post" collection is created
onRecordAfterCreateRequest((e) => {
  const record = e.record;
  if (record) {
    const formattedTitle = record
      .get("title")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .toLowerCase();
    const newSlug = formattedTitle + "-" + record.id;
    record.set("slug", newSlug);
    $app.dao()?.saveRecord(record);
  }
}, "posts");
*/

// fires only for "articles" and "chapters" collections
onRecordViewRequest(
	(e) => {
		const record = e.record;
		if (record) {
			let currentViews = record.getInt('views');
			record.set('views', currentViews + 1);
			$app.dao()?.saveRecord(record);
		}
	},
	'articles',
	'chapters'
);

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
