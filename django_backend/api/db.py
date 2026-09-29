import os
import json
from pathlib import Path
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from django.conf import settings

# Global memory storage fallback when MongoDB daemon is not actively running
memory_store = {
    'moods': [],
    'journals': [],
    'sleep': [],
    'activities': []
}

def load_seed_data_to_memory():
    try:
        seed_path = Path(settings.BASE_DIR).parent / 'seed_data.json'
        if seed_path.exists():
            with open(seed_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for col in ['moods', 'journals', 'sleep', 'activities']:
                    items = data.get(col, [])
                    formatted = []
                    for idx, item in enumerate(items):
                        item_copy = dict(item)
                        if '_id' not in item_copy:
                            item_copy['_id'] = str(ObjectId())
                        formatted.append(item_copy)
                    memory_store[col] = formatted
            print("[Django API] Pre-loaded seed datasets into memory store.")
    except Exception as e:
        print(f"[Django API] Could not load seed data: {e}")

load_seed_data_to_memory()

def get_mongo_db():
    try:
        client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        return client[settings.MONGODB_NAME]
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
        return None

def format_doc(doc):
    if not doc:
        return None
    if isinstance(doc, dict):
        doc['_id'] = str(doc.get('_id', ''))
    return doc

class MongoCollectionHelper:
    def __init__(self, collection_name):
        self.col_name = collection_name

    def find_all(self):
        db = get_mongo_db()
        if db is not None:
            docs = list(db[self.col_name].find().sort('date', -1))
            return [format_doc(d) for d in docs]
        return memory_store.get(self.col_name, [])

    def find_by_id(self, item_id):
        db = get_mongo_db()
        if db is not None:
            try:
                doc = db[self.col_name].find_one({'_id': ObjectId(item_id)})
            except Exception:
                doc = db[self.col_name].find_one({'_id': item_id})
            return format_doc(doc)
        
        for item in memory_store.get(self.col_name, []):
            if str(item.get('_id')) == str(item_id):
                return item
        return None

    def insert_one(self, data):
        data_copy = dict(data)
        db = get_mongo_db()
        if db is not None:
            res = db[self.col_name].insert_one(data_copy)
            data_copy['_id'] = str(res.inserted_id)
            return data_copy
        
        data_copy['_id'] = str(ObjectId())
        memory_store.setdefault(self.col_name, []).insert(0, data_copy)
        return data_copy

    def update_one(self, item_id, data):
        db = get_mongo_db()
        if db is not None:
            try:
                oid = ObjectId(item_id)
                db[self.col_name].update_one({'_id': oid}, {'$set': data})
                doc = db[self.col_name].find_one({'_id': oid})
            except Exception:
                db[self.col_name].update_one({'_id': item_id}, {'$set': data})
                doc = db[self.col_name].find_one({'_id': item_id})
            return format_doc(doc)

        items = memory_store.get(self.col_name, [])
        for idx, item in enumerate(items):
            if str(item.get('_id')) == str(item_id):
                updated = {**item, **data}
                memory_store[self.col_name][idx] = updated
                return updated
        return None

    def delete_one(self, item_id):
        db = get_mongo_db()
        if db is not None:
            try:
                res = db[self.col_name].delete_one({'_id': ObjectId(item_id)})
            except Exception:
                res = db[self.col_name].delete_one({'_id': item_id})
            return res.deleted_count > 0

        initial_len = len(memory_store.get(self.col_name, []))
        memory_store[self.col_name] = [i for i in memory_store.get(self.col_name, []) if str(i.get('_id')) != str(item_id)]
        return len(memory_store.get(self.col_name, [])) < initial_len
