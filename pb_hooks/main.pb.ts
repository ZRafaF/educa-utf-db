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
      let currentViews = record.getInt("views");
      record.set("views", currentViews + 1);
      $app.dao()?.saveRecord(record);
    }
  },
  "articles",
  "chapters"
);

// Intercepts article creation and creates an attachment relation
onRecordAfterCreateRequest((e) => {
  const record = e.record;
  if (record) {
    const collection = $app.dao()?.findCollectionByNameOrId("attachments");
    const attachmentRecord = new Record(collection, {
      id: record.id,
      article: record.id,
      user: record.get("user"),
    });

    $app.dao()?.saveRecord(attachmentRecord);
    record.set("attachments", record.id);
    $app.dao()?.saveRecord(record);
  }
}, "articles");

// // Handles image optimization
// onRecordAfterUpdateRequest((e) => {
//   //console.log(JSON.stringify($filepath.base("1")));

//   //const cmd = $os.cmd("ls");

//   // execute the command and return its standard output as string
//   //const output = cmd?.output();

//   e.uploadedFiles.files.forEach((file) => {
//     const path =
//       e.record?.baseFilesPath() + `/${file.name}`;
//     console.log(path);
//     const myFile = $filepath.dir(path);
//     $os.remove(path);
//     console.log(JSON.stringify(myFile));
//   });

//   // console.log(JSON.stringify(e.uploadedFiles));
// }, "attachments");

onRecordBeforeAuthWithPasswordRequest((e) => {
  const isUtfUser = (input) => {
    // Use a regular expression to match the pattern: 'a' followed by numbers
    const regex = /^a\d+$/;

    // Test the input against the regular expression
    return regex.test(input);
  };

  if (isUtfUser(e.identity)) {
    const UTF_AUTH_TOKEN = $os.getenv("UTF_AUTH_TOKEN");
    const ENCRYPTION_KEY = $os.getenv("ENCRYPTION_KEY");

    console.log(`UTF_AUTH_TOKEN: ${UTF_AUTH_TOKEN}`);
    console.log(`ENCRYPTION_KEY: ${ENCRYPTION_KEY}`);

    console.log(`password: ${e.password}`);

    const encryptedPass = $security.encrypt(e.password, ENCRYPTION_KEY);
    console.log(`encrypted password: ${encryptedPass}`);
    const decryptedPass = $security.decrypt(encryptedPass, ENCRYPTION_KEY);
    console.log(`decrypted password: ${decryptedPass}`);

    const res = $http.send({
      url: "https://unions.netfy.me/api/",
      method: "GET",
      body: JSON.stringify({
        token: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        option: "is_user",
        user: "XXXXXXXX",
        pass: "XXXXXXXXXX",
      }),
      headers: { "content-type": "application/json" },
      timeout: 120, // in seconds
    });
    const jsonResponse = res.json;
    console.log(JSON.stringify(jsonResponse[0]));
  }
});
