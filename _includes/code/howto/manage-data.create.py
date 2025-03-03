# How-to: Manage-data -> Create objects - Python examples
import os

# ================================
# ===== INSTANTIATION-COMMON =====
# ================================

import weaviate
import json

# Instantiate the client with the user/password and OpenAI api key
client = weaviate.Client(
    'http://localhost:8080',  # Replace with your Weaviate URL
    # auth_client_secret=weaviate.AuthApiKey('YOUR-WEAVIATE-API-KEY'),  # Replace w/ your Weaviate API key
    additional_headers={
        'X-OpenAI-Api-Key': os.environ['OPENAI_APIKEY']  # Replace w/ your OPENAI API key
    }
)

class_name = 'JeopardyQuestion'


# ============================
# ===== Define the class =====
# ============================

class_definition = {
    'class': 'JeopardyQuestion',
    'description': 'A Jeopardy! question',
    'vectorizer': 'text2vec-openai',
}


# Clean slate
if client.schema.exists('JeopardyQuestion'):
    client.schema.delete_class('JeopardyQuestion')
if not client.schema.exists('JeopardyQuestion'):
    client.schema.create_class(class_definition)


# =========================
# ===== Create object =====
# =========================

# CreateObject START
uuid = client.data_object.create({
    'question': 'This vector DB is OSS & supports automatic property type inference on import',
    # 'answer': 'Weaviate',  # schema properties can be omitted
    'somePropNotInTheSchema': 123,  # will be automatically added as a number property
}, 'JeopardyQuestion')

print(uuid)  # the return value is the object's UUID
# CreateObject END

# Test
result = client.data_object.get_by_id(uuid, class_name=class_name)
assert result['properties']['somePropNotInTheSchema'] == 123


# ============================================
# ===== Create object with id and vector =====
# ============================================

# CreateObjectWithIdAndVector START
uuid = client.data_object.create(
    data_object={
        'question': 'This vector DB is OSS and supports automatic property type inference on import',
        'answer': 'Weaviate',
    },
    class_name='JeopardyQuestion',
    # highlight-start
    uuid='12345678-e64f-5d94-90db-c8cfa3fc1234',
    vector=[0.12345] * 1536
    # highlight-end
)

print(uuid)  # the return value is the object's UUID
# CreateObjectWithIdAndVector END

# Test
result = client.data_object.get_by_id(uuid, class_name=class_name)
assert result['properties'] == {
    'question': 'This vector DB is OSS and supports automatic property type inference on import',
    'answer': 'Weaviate'
}


# ===========================
# ===== Validate object =====
# ===========================

# ValidateObject START
# highlight-start
result = client.data_object.validate(
# highlight-end
    data_object={
      'question': 'This vector DB is open-source and supports auto-schema',
      'answer': 'Weaviate',
      'thisPropShouldNotEndUpInTheSchema': -1,
    },
    class_name='JeopardyQuestion',
    uuid='12345678-1234-1234-1234-123456789012',
)

# "invalid object: no such prop with name 'thisPropShouldNotEndUpInTheSchema' found..."
print(json.dumps(result, indent=2))
# ValidateObject END

assert 'thisPropShouldNotEndUpInTheSchema' in result['error'][0]['message']
