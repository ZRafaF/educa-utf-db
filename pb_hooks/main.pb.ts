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

// Handles image optimization
onRecordAfterUpdateRequest((e) => {
  //console.log(JSON.stringify($filepath.base("1")));

  const cmd = $os.cmd("ls");

  // execute the command and return its standard output as string
  const output = cmd?.output();

  console.log(output);

  // e.uploadedFiles.files.forEach((file) => {
  //   const path =
  //     $app.dataDir() + "/" + e.record?.baseFilesPath() + `/${file.name}`;
  //   console.log(path);
  //   const myFile = $filepath.dir(path);

  //   $os.remove(path);
  //   console.log(JSON.stringify(myFile));
  // });

  // console.log(JSON.stringify(e.uploadedFiles));
}, "attachments");
