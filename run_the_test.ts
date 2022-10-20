/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  doc,
  getDocs,
  Firestore,
  CollectionReference,
  collection,
  writeBatch,
  orderBy,
  limit,
  limitToLast,
  query,
  Query,
  startAt
} from '@firebase/firestore';

import { log } from './logging';

/**
 * Runs the test.
 *
 * Replace the body of this function with the code you would like to execute
 * when the user clicks the "Run Test" button in the UI.
 *
 * @param db the `Firestore` instance to use.
 */
export async function runTheTest(db: Firestore) {
  const collection_ = await populateDb(db);
  await doLimitQuery(collection_);
  await doLimitToLastQuery(collection_);
}

async function doLimitQuery(collection_: CollectionReference) {
  const query_ = query(collection_, orderBy('rating'), startAt(5), limit(3));
  log(`Running limit query in ${collection_.id}`);
  await showQueryResults(query_);
}

async function doLimitToLastQuery(collection_: CollectionReference) {
  const query_ = query(
    collection_,
    orderBy('rating'),
    startAt(5),
    limitToLast(3)
  );
  log(`Running limit-to-last query in ${collection_.id}`);
  await showQueryResults(query_);
}

async function showQueryResults(query_: Query) {
  const querySnapshot = await getDocs(query_);
  for (const docSnapshot of querySnapshot.docs) {
    log(`Got doc '${docSnapshot.id}' with rating ${docSnapshot.get('rating')}`);
  }
}

async function populateDb(db: Firestore): Promise<CollectionReference> {
  const collectionId =
    'LimitToLastTest-websdk-' + doc(collection(db, 'abc')).id;
  const collection_ = collection(db, collectionId);
  const writeBatch_ = writeBatch(db);
  const numDocs = 20;

  for (let i = 0; i < numDocs; i++) {
    const doc_ = doc(collection_, `doc${i}`);
    writeBatch_.set(doc_, { rating: i });
  }

  log(`Creating ${numDocs} documents in collection ${collectionId}`);
  await writeBatch_.commit();

  return collection_;
}
