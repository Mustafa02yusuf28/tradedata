import asyncio
import random
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import json
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from datetime import datetime, UTC

# Load environment variables from .env file
load_dotenv()

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

async def scrape_financial_juice():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080}
        )
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = await context.new_page()
        try:
            await page.goto("https://www.financialjuice.com/home", timeout=90000)
            await page.wait_for_timeout(5000)
            await page.locator('body').click()
            await page.wait_for_selector("#mainFeed", state="attached", timeout=60000)
            await page.wait_for_selector(".headline-item", state="visible", timeout=60000)
            
            print("Waiting 10 seconds for the live feed to update...")
            await page.wait_for_timeout(10000) # Increased wait time

            main_feed_html = await page.inner_html("#mainFeed")
            
            # Save the scraped HTML for debugging
            with open("debug_feed.html", "w", encoding="utf-8") as f:
                f.write(main_feed_html)
            print("Saved the raw feed to debug_feed.html")

            soup = BeautifulSoup(main_feed_html, "html.parser")
            all_items = soup.find_all(class_="headline-item")

            print(f"Found {len(all_items)} total items in the feed. Their IDs are:")
            all_ids = [item.get('data-headlineid', 'N/A') for item in all_items]
            print(all_ids)

            news_list = []
            for item in all_items:
                if len(news_list) >= 10:
                    break
                headline_id = item.get('data-headlineid')
                title_element = item.find(class_="headline-title-nolink")
                if title_element and headline_id:
                    title = title_element.text.strip()
                    time_element = item.find(class_="time")
                    time = time_element.text.strip() if time_element else "No time found"
                    if "GO PRO" not in time:
                        news_list.append({
                            "_id": headline_id,  # Use as MongoDB unique key
                            "title": title,
                            "time": time,
                            "timestamp": datetime.now(UTC)
                        })
            uri = os.getenv("MONGODB_URI")
            with MongoClient(uri, server_api=ServerApi('1')) as client:
                try:
                    client.admin.command('ping')
                    print("Pinged your deployment. You successfully connected to MongoDB!")
                except Exception as e:
                    print(f"MongoDB connection failed: {e}")
                    return news_list
                db = client['financialjuice']
                collection = db['news']
                collection.create_index('timestamp', expireAfterSeconds=172800)
                for news_item in news_list:
                    collection.update_one(
                        {"_id": news_item["_id"]},
                        {"$setOnInsert": news_item},
                        upsert=True
                    )
            return news_list
        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="error_screenshot.png")
            print("A screenshot named 'error_screenshot.png' has been saved to help diagnose the issue.")
            return None
        finally:
            await context.close()
            await browser.close()

if __name__ == "__main__":
    news = asyncio.run(scrape_financial_juice())
    if news:
        print(json.dumps(news, indent=2, cls=DateTimeEncoder)) 