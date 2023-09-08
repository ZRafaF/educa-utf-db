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

// fires only for "posts" collections
onRecordViewRequest((e) => {
  const record = e.record;
  if (record) {
    let currentViews = record.getInt("views");
    record.set("views", currentViews + 1);
    $app.dao()?.saveRecord(record);
  }
}, "posts");
