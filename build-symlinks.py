#!/usr/bin/env python3
"""Create titlecase->lowercase symlinks for riding paths.

Gatsby 2 generated directories as lowercase on disk, but the client JS
requests paths with the original titlecase (e.g. /riding/Abbotsford).
Netlify matched these case-insensitively; nginx does not. This script
runs during the Docker image build on a case-sensitive filesystem and
creates a symlink for every titlecase variant referenced in the JS
redirect table.
"""
import os
import re
import glob
import sys


def extract_slugs():
    slugs = set()
    pattern = re.compile(r'"toPath":"(/riding/(?:[^"\\]|\\.)+)"')
    for js in glob.glob("*.js"):
        try:
            with open(js, "r", encoding="utf-8", errors="ignore") as f:
                data = f.read()
        except OSError:
            continue
        for match in pattern.finditer(data):
            path = match.group(1)
            # Unescape JS string escapes we actually expect to see.
            path = path.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
            slug = path[len("/riding/"):]
            if slug:
                slugs.add(slug)
    return slugs


def make_symlinks(slugs, parent_dir):
    """Create parent_dir/<TitleCase> -> <lowercase> symlinks."""
    if not os.path.isdir(parent_dir):
        print(f"[skip] {parent_dir} does not exist", file=sys.stderr)
        return 0
    created = 0
    skipped_missing = 0
    skipped_exists = 0
    for slug in slugs:
        lower = slug.lower()
        if lower == slug:
            continue
        target = os.path.join(parent_dir, lower)
        link = os.path.join(parent_dir, slug)
        if not os.path.exists(target):
            skipped_missing += 1
            continue
        if os.path.lexists(link):
            skipped_exists += 1
            continue
        os.symlink(lower, link)
        created += 1
    print(
        f"[{parent_dir}] created={created} skipped_missing={skipped_missing} "
        f"skipped_exists={skipped_exists}"
    )
    return created


def main():
    slugs = extract_slugs()
    print(f"Found {len(slugs)} riding slugs in JS bundles")
    total = 0
    total += make_symlinks(slugs, "riding")
    total += make_symlinks(slugs, "page-data/riding")
    print(f"Total symlinks created: {total}")


if __name__ == "__main__":
    main()
