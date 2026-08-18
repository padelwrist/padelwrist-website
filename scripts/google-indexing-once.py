import json
import os
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

API_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
SCOPE = "https://www.googleapis.com/auth/indexing"
SITEMAP = Path("sitemap.xml")


def load_credentials():
    raw = os.environ.get("GOOGLE_INDEXING_API_JSON")
    if not raw:
        raise RuntimeError("GOOGLE_INDEXING_API_JSON secret is missing")
    info = json.loads(raw)
    credentials = service_account.Credentials.from_service_account_info(info, scopes=[SCOPE])
    credentials.refresh(Request())
    return credentials


def sitemap_urls():
    root = ET.parse(SITEMAP).getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text.strip() for node in root.findall("sm:url/sm:loc", ns) if node.text]
    urls = sorted(set(urls))
    if not urls:
        raise RuntimeError("No URLs found in sitemap.xml")
    if len(urls) > 100:
        raise RuntimeError(f"Refusing to submit {len(urls)} URLs in this one-off run; expected at most 100")
    for url in urls:
        if not url.startswith("https://padelwrist.com/"):
            raise RuntimeError(f"Unexpected sitemap URL: {url}")
    return urls


def main():
    credentials = load_credentials()
    urls = sitemap_urls()
    headers = {
        "Authorization": f"Bearer {credentials.token}",
        "Content-Type": "application/json",
    }

    print(f"Submitting {len(urls)} canonical sitemap URLs to Google's Indexing API once.")
    failures = []

    for index, url in enumerate(urls, start=1):
        response = requests.post(
            API_ENDPOINT,
            headers=headers,
            json={"url": url, "type": "URL_UPDATED"},
            timeout=30,
        )
        print(f"[{index}/{len(urls)}] {response.status_code} {url}")
        if response.status_code not in (200, 202):
            failures.append((url, response.status_code, response.text[:500]))
        time.sleep(0.15)

    if failures:
        print("\nSubmission failures:", file=sys.stderr)
        for url, status, body in failures:
            print(f"- {status} {url}: {body}", file=sys.stderr)
        raise SystemExit(1)

    print("All URLs were accepted by the API. Acceptance is a crawl notification, not a guarantee of indexing.")


if __name__ == "__main__":
    main()
