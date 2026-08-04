#!/usr/bin/env python3
"""Deploy this repo to Vercel production via the REST API.

The Vercel CLI requires a user-level token lookup (/v2/user) that team-scoped
tokens can't satisfy, which broke the previous `npx vercel --prod` CI step.
This script uses the same underlying deployments API the CLI uses, but skips
the user resolution entirely: upload file blobs, create a production
deployment, poll until READY.

Requires: VERCEL_TOKEN env var. No third-party dependencies.
"""
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request

TOKEN = os.environ.get("VERCEL_TOKEN")
TEAM = "team_kLu0HX8TQb2RH72ARs0ikmnM"
PROJECT = "prj_JkWQTALTDSwDO1wtnkKtSMUYdlWu"
NAME = "karta-website"

EXCLUDE_DIRS = {".git", "node_modules", ".next", ".vercel", "__pycache__"}

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)

if not TOKEN:
    fail("VERCEL_TOKEN is not set")

def collect_files():
    out = []
    for root, dirs, names in os.walk("."):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for n in names:
            out.append(os.path.join(root, n)[2:])
    return out

def upload(path):
    with open(path, "rb") as f:
        data = f.read()
    sha = hashlib.sha1(data).hexdigest()
    req = urllib.request.Request(
        f"https://api.vercel.com/v2/files?teamId={TEAM}",
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "x-vercel-digest": sha,
            "Content-Type": "application/octet-stream",
        },
    )
    try:
        with urllib.request.urlopen(req) as r:
            r.read()
    except urllib.error.HTTPError as e:
        if e.code != 409:  # 409 = blob already known to Vercel, fine
            fail(f"upload failed for {path}: HTTP {e.code} {e.read()[:200]}")
    return {"file": path, "sha": sha, "size": len(data)}

def main():
    files = collect_files()
    print(f"uploading {len(files)} files…")
    manifest = [upload(p) for p in files]
    print("creating production deployment…")
    body = json.dumps({
        "name": NAME,
        "project": PROJECT,
        "target": "production",
        "files": manifest,
    }).encode()
    req = urllib.request.Request(
        f"https://api.vercel.com/v13/deployments?teamId={TEAM}",
        data=body,
        method="POST",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as r:
            dep = json.loads(r.read())
    except urllib.error.HTTPError as e:
        fail(f"deployment create failed: HTTP {e.code} {e.read()[:300]}")
    dep_id = dep["id"]
    print(f"deployment {dep_id} → https://{dep.get('url')}")

    for _ in range(60):  # up to 10 minutes
        req = urllib.request.Request(
            f"https://api.vercel.com/v13/deployments/{dep_id}?teamId={TEAM}",
            headers={"Authorization": f"Bearer {TOKEN}"},
        )
        with urllib.request.urlopen(req) as r:
            state = json.loads(r.read()).get("readyState")
        print("state:", state)
        if state == "READY":
            print("deploy complete")
            return
        if state in ("ERROR", "CANCELED"):
            fail(f"deployment ended in state {state}")
        time.sleep(10)
    fail("timed out waiting for deployment to become READY")

if __name__ == "__main__":
    main()
