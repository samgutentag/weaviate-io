import assert from 'assert';

// ================================
// ===== INSTANTIATION-COMMON =====
// ================================

import weaviate from 'weaviate-ts-client';

// ===== Instantiation shown on snippet
const client = weaviate.client({
  scheme: 'https',
  host: 'some-endpoint.weaviate.network',  // Replace with your Weaviate URL
  apiKey: new weaviate.ApiKey('YOUR-WEAVIATE-API-KEY'),  // If authentication is on. Replace w/ your Weaviate instance API key
});

let result;

// ==============================
// ===== BASIC GET EXAMPLES =====
// ==============================

// BasicGetJS
result = await client
  .graphql
  .get()
  .withClassName('JeopardyQuestion')
  .withFields('question')
  .do();

console.log(JSON.stringify(result, null, 2));
// END BasicGetJS

// Test
assert('JeopardyQuestion' in result.data.Get);
let questionKeys = new Set(Object.keys(result.data.Get.JeopardyQuestion[0]));
assert.deepEqual(questionKeys, new Set(['question']));
// End test


// ===================================
// ===== GET WITH LIMIT EXAMPLES =====
// ===================================

// GetWithLimitJS
result = await client
  .graphql
  .get()
  .withClassName('JeopardyQuestion')
  .withFields('question')
  // highlight-start
  .withLimit(1)
  // highlight-end
  .do();

console.log(JSON.stringify(result, null, 2));
// END GetWithLimitJS

// Test
assert('JeopardyQuestion' in result.data.Get);
assert.equal(result.data.Get.JeopardyQuestion.length, 1);
questionKeys = new Set(Object.keys(result.data.Get.JeopardyQuestion[0]));
assert.deepEqual(questionKeys, new Set(['question']));
// End test


// ===================================
// ===== GET WITH LIMIT AND OFFSET EXAMPLES =====
// ===================================

// GetWithLimitOffsetJS
result = await client
  .graphql
  .get()
  .withClassName('JeopardyQuestion')
  .withFields('question')
  // highlight-start
  .withLimit(1)
  .withOffset(1)
  // highlight-end
  .do();

console.log(JSON.stringify(result, null, 2));
// END GetWithLimitOffsetJS

// Test
assert.deepEqual(result.data.Get, {
  JeopardyQuestion: [
    {
      question: 'Pythons are oviparous, meaning they do this',
    },
  ],
});
// End test


// ===================================
// ===== GET PROPERTIES EXAMPLES =====
// ===================================

// GetPropertiesJS
result = await client
  .graphql
  .get()
  .withClassName('JeopardyQuestion')
  // highlight-start
  .withFields('question answer points')
  // highlight-end
  .withLimit(1)
  .do();

console.log(JSON.stringify(result, null, 2));
// END GetPropertiesJS

// Test
assert('JeopardyQuestion' in result.data.Get);
assert.equal(result.data.Get.JeopardyQuestion.length, 1);
questionKeys = new Set(Object.keys(result.data.Get.JeopardyQuestion[0]));
assert.deepEqual(result.data.Get, {
  JeopardyQuestion: [
    {
      answer: 'Jonah',
      points: 100,
      question: 'This prophet passed the time he spent inside a fish offering up prayers',
    },
  ],
});
// End test


// ======================================
// ===== GET OBJECT VECTOR EXAMPLES =====
// ======================================

// GetObjectVectorJS
result = await client
  .graphql
  .get()
  .withClassName('JeopardyQuestion')
  // highlight-start
  .withFields('_additional {vector}')
  // highlight-end
  .withLimit(1)
  .do();

console.log(JSON.stringify(result, null, 2));
// END GetObjectVectorJS

// Test
assert('JeopardyQuestion' in result.data.Get);
assert.equal(result.data.Get.JeopardyQuestion.length, 1);
let additionalKeys = new Set(Object.keys(result.data.Get.JeopardyQuestion[0]._additional));
assert.deepEqual(additionalKeys, new Set(['vector']));
// End test


// ==================================
// ===== GET OBJECT ID EXAMPLES =====
// ==================================

// GetObjectIdJS
result = await client
  .graphql
  .get()
  .withClassName('JeopardyQuestion')
  // highlight-start
  .withFields('_additional { id }')
  // highlight-end
  .withLimit(1)
  .do();

console.log(JSON.stringify(result, null, 2));
// END GetObjectIdJS

// Test
assert('JeopardyQuestion' in result.data.Get);
assert.equal(result.data.Get.JeopardyQuestion.length, 1);
additionalKeys = new Set(Object.keys(result.data.Get.JeopardyQuestion[0]._additional));
assert.deepEqual(additionalKeys, new Set(['id']));
// End test

// =======================================
// ===== GET WITH CROSS-REF EXAMPLES =====
// =======================================


// GetWithCrossRefsJS
result = await client.graphql
  .get()
  .withClassName('JeopardyQuestion')
  // highlight-start
  .withFields(`
  question
  hasCategory {
    ... on JeopardyCategory {
      title
    }
  }`)
  // highlight-end
  .withLimit(2)
  .do();

console.log(JSON.stringify(result, null, 2));
// END GetWithCrossRefsJS

// Test
assert('JeopardyQuestion' in result.data.Get);
assert.equal(result.data.Get.JeopardyQuestion.length, 2);
const questionValues = new Set(result.data.Get.JeopardyQuestion.map(q => q.question));
assert.deepEqual(questionValues, new Set([
  'This prophet passed the time he spent inside a fish offering up prayers',
  'Pythons are oviparous, meaning they do this',
]));
// End test
