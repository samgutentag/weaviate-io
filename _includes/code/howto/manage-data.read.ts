// How-to: Manage data -> Retrieve objects - TypeScript examples
// run with: node --loader=ts-node/esm manage-data.update.ts
import assert from 'assert';

// ================================
// ===== INSTANTIATION-COMMON =====
// ================================

import weaviate from 'weaviate-ts-client';

// ===== Instantiation shown on snippet
const client = weaviate.client({
  scheme: 'https',
  host: 'edu-demo.weaviate.network',  // Replace with your Weaviate URL
  apiKey: new weaviate.ApiKey('learn-weaviate'),  // If auth is on. Replace w/ your Weaviate instance API key.
});

let result;

// =======================
// ===== Read object =====
// =======================

// ReadObject START
result = await client.data
  .getterById()
  .withClassName('JeopardyQuestion')
  .withId('00ff6900-e64f-5d94-90db-c8cfa3fc851b')
  .do();

console.log(JSON.stringify(result, null, 2));
// ReadObject END

// Test
assert.equal(result.properties['answer'], 'San Francisco');


// ===================================
// ===== Read object with vector =====
// ===================================

// ReadObjectWithVector START
result = await client.data
  .getterById()
  .withClassName('JeopardyQuestion')
  .withId('00ff6900-e64f-5d94-90db-c8cfa3fc851b')
  // highlight-start
  .withVector()
  // highlight-end
  .do();

console.log(JSON.stringify(result, null, 2));
// ReadObjectWithVector END

// Test
assert.equal(result.vector.length, 1536);


// ==================================
// ===== Check object existence =====
// ==================================

// CheckObject START
// TODO: broken, see https://github.com/weaviate/typescript-client/issues/63
result = await client.data
  // highlight-start
  .checker()
  // highlight-end
  .withClassName('JeopardyQuestion')
  .withId('00ff6900-e64f-5d94-90db-c8cfa3fc851b')
  .do();

console.log(result);
// CheckObject END

// assert.equal(result, true);  TODO: https://github.com/weaviate/typescript-client/issues/63
