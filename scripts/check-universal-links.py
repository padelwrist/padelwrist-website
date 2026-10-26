#!/usr/bin/env python3
"""Static checks for PadelWrist Universal Links (no network or third-party modules)."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
expected_id = "RJZUA257YQ.com.padelwrist.PadelWrist"
required_paths = {"/match/*", "/event/*"}

aasa_path = root / ".well-known" / "apple-app-site-association"
root_copy = root / "apple-app-site-association"
aasa = json.loads(aasa_path.read_text("utf-8"))
assert aasa == json.loads(root_copy.read_text("utf-8")), "AASA endpoints differ"
entries = aasa["applinks"]["details"]
assert len(entries) == 1, "Unexpected app association entries"
assert entries[0]["appIDs"] == [expected_id], "Team ID or bundle identifier mismatch"
assert {component["/"] for component in entries[0]["components"]} == required_paths, "Missing or overly broad paths"
assert not any(component.get("exclude") for component in entries[0]["components"])

headers = (root / "_headers").read_text("utf-8")
for path in ("/.well-known/apple-app-site-association", "/apple-app-site-association"):
    assert path + "\n  Content-Type: application/json" in headers, f"JSON type missing for {path}"

redirects = (root / "_redirects").read_text("utf-8")
for path, fallback in (("/match/*", "/join-match/index.html"), ("/event/*", "/join-event/index.html")):
    assert f"{path} {fallback} 200" in redirects, f"Expected internal fallback proxy for {path}"
    html = (root / fallback.lstrip("/")).read_text("utf-8")
    assert 'name="robots" content="noindex,nofollow' in html
    assert 'name="referrer" content="no-referrer"' in html

assert "applinks:padelwrist.com" not in redirects, "Unexpected redirect instead of HTTPS asset"
print("AASA paths, app ID, content types and private invitation fallbacks passed.")
