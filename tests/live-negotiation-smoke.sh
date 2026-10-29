#!/usr/bin/env bash
set -euo pipefail
base="$(printf '%s' "$1" | sed 's#/$##')"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
fetch() {
  local path="$1" accept="$2" label="$3"
  curl --silent --show-error --max-time 20 --dump-header "$work/$label.headers" \
    --output "$work/$label.body" --write-out '%{http_code}' \
    --header "Accept: $accept" "$base$path"
}
has_header() { grep -Eiq "$2" "$work/$1.headers"; }
echo "Checking $base/clubs/..."
ready=false
for attempt in $(seq 1 12); do
  status="$(fetch '/clubs/' 'text/markdown' md || true)"
  if [[ "$status" == "200" ]] && has_header md '^content-type: text/markdown' && grep -q '^# ' "$work/md.body"; then
    ready=true
    break
  fi
  echo "Attempt $attempt: Markdown not yet available (HTTP $status); retrying"
  sleep 10
done
[[ "$ready" == true ]] || { echo "Live Markdown response not verified"; exit 1; }
has_header md '^vary:.*accept' || exit 1
has_header md '^link:.*rel="alternate".*type="text/html"' || exit 1
has_header md '^x-robots-tag:.*noindex' || exit 1

status="$(fetch '/clubs/' 'text/html, text/markdown;q=0.5' html)"
[[ "$status" == "200" ]] || exit 1
has_header html '^content-type: text/html' || exit 1
has_header html '^vary:.*accept' || exit 1
has_header html '^link:.*type="text/markdown"' || exit 1
grep -qi '<html' "$work/html.body" || exit 1

status="$(fetch '/clubs/' '*/*' wildcard)"
[[ "$status" == "200" ]] || exit 1
has_header wildcard '^content-type: text/html' || exit 1

status="$(fetch '/clubs/' 'application/json' unsupported)"
[[ "$status" == "406" ]] || { echo "Expected 406 for unsupported Accept, got $status"; exit 1; }

status="$(fetch '/clubs.md' 'text/html' direct)"
[[ "$status" == "200" ]] || exit 1
has_header direct '^content-type: text/markdown' || exit 1

status="$(fetch '/not-a-real-page-12345/' 'text/markdown' missing)"
[[ "$status" == "404" ]] || { echo "Unknown page returned HTTP $status, expected 404"; exit 1; }

echo "Verified live Markdown/HTML negotiation, links, noindex and 404/406 handling."
