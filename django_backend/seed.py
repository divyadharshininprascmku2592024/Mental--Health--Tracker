import json
from pathlib import Path
from pymongo import MongoClient
from bson import ObjectId

def run_seed():
    seed_path = Path(__file__).resolve().parent.parent / 'seed_data.json'
    if not seed_path.exists():
        print(f"Error: Seed file not found at {seed_path}")
        return

    with open(seed_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    try:
        client = MongoClient('mongodb://127.0.0.1:27017/', serverSelectionTimeoutMS=3000)
        db = client['mental_health_db']
        client.admin.command('ping')
        
        db.moods.delete_many({})
        db.journals.delete_many({})
        db.sleep.delete_many({})
        db.activities.delete_many({})

        if 'moods' in data:
            db.moods.insert_many(data['moods'])
        if 'journals' in data:
            db.journals.insert_many(data['journals'])
        if 'sleep' in data:
            db.sleep.insert_many(data['sleep'])
        if 'activities' in data:
            db.activities.insert_many(data['activities'])

        print(" Successfully seeded MongoDB database via Python!")
    except Exception as e:
        print(f" Could not connect to MongoDB on 127.0.0.1:27017: {e}")
        print("Note: Django backend will continue using its memory store fallback seamlessly.")

if __name__ == '__main__':
    run_seed()
