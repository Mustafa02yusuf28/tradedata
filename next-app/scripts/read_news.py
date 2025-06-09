import os
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from datetime import datetime

class DateTimeEncoder(json.JSONEncoder):
    """ Custom JSON encoder to handle datetime objects """
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def read_latest_news():
    """
    Connects to MongoDB and retrieves the 10 most recent news items,
    sorted correctly by timestamp.
    """
    # Load environment variables from .env file
    load_dotenv()
    uri = os.getenv("MONGODB_URI")

    if not uri:
        print("Error: MONGODB_URI not found. Please check your .env file.")
        return

    try:
        with MongoClient(uri, server_api=ServerApi('1')) as client:
            client.admin.command('ping')
            print("Successfully connected to MongoDB!")

            db = client['financialjuice']
            collection = db['news']

            # Fetch the 10 most recent news items, sorted by timestamp descending
            # This is the key part: .sort("timestamp", -1)
            latest_news = list(collection.find().sort("timestamp", -1).limit(10))

            print("\n--- Latest 10 News Headlines (in correct order) ---")
            print(json.dumps(latest_news, indent=2, cls=DateTimeEncoder))

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    read_latest_news() 