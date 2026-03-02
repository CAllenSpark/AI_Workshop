#!/usr/bin/env python3
"""
Build Search Index

Generates a Fuse.js-compatible search index from all entity JSON files.
The output is a single JSON file that can be loaded directly by Fuse.js
in the browser for client-side full-text search.

Output: research/vashon-island/search-index.json
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "research" / "vashon-island"


def load_json(path):
    with open(path) as f:
        return json.load(f)


def build_index():
    # Load all entity data
    timeline = load_json(RESEARCH / "timeline.json")
    people_data = load_json(RESEARCH / "people.json")
    places_data = load_json(RESEARCH / "places.json")
    env_data = load_json(RESEARCH / "environment.json")

    entries = timeline.get("entries", [])
    people = people_data.get("people", [])
    places = places_data.get("places", [])
    env_features = env_data.get("environment_features", [])

    # Build ID → name lookups
    people_map = {p["name"]: p["id"] for p in people}
    places_map = {p["name"]: p["id"] for p in places}

    index_records = []

    # Timeline entries — primary search targets
    for entry in entries:
        record = {
            "id": entry["id"],
            "type": "timeline",
            "title": entry["title"],
            "date_start": entry.get("date_start", ""),
            "era": entry.get("era", ""),
            "layers": entry.get("layers", []),
            "description": entry.get("description", ""),
            "details": entry.get("details", ""),
            "tags": entry.get("tags", []),
            "people_names": entry.get("people", []),
            "place_names": entry.get("places", []),
        }
        index_records.append(record)

    # People — searchable by name, description, role
    for person in people:
        record = {
            "id": person["id"],
            "type": "person",
            "title": person["name"],
            "description": person.get("description", ""),
            "role": person.get("role", ""),
            "period": person.get("period", ""),
            "related_entries": person.get("related_entries", []),
        }
        index_records.append(record)

    # Places — searchable by name, description, type
    for place in places:
        record = {
            "id": place["id"],
            "type": "place",
            "title": place["name"],
            "description": place.get("description", ""),
            "place_type": place.get("type", ""),
            "related_entries": place.get("related_entries", []),
        }
        index_records.append(record)

    # Environment features — searchable by name, description, type
    for feature in env_features:
        record = {
            "id": feature["id"],
            "type": "environment",
            "title": feature["name"],
            "description": feature.get("description", ""),
            "env_type": feature.get("type", ""),
            "time_relevance": feature.get("time_relevance", ""),
            "related_entries": feature.get("related_entries", []),
        }
        index_records.append(record)

    return index_records


def build_fuse_config():
    """Generate the Fuse.js configuration for this search index."""
    return {
        "keys": [
            {"name": "title", "weight": 2.0},
            {"name": "description", "weight": 1.0},
            {"name": "details", "weight": 0.5},
            {"name": "role", "weight": 0.8},
            {"name": "tags", "weight": 0.7},
            {"name": "people_names", "weight": 0.8},
            {"name": "place_names", "weight": 0.8},
            {"name": "period", "weight": 0.3},
            {"name": "place_type", "weight": 0.3},
            {"name": "env_type", "weight": 0.3},
        ],
        "threshold": 0.4,
        "includeScore": True,
        "includeMatches": True,
        "minMatchCharLength": 2,
    }


def main():
    print("=== Building Search Index ===\n")

    records = build_index()
    config = build_fuse_config()

    output = {
        "fuse_config": config,
        "records": records,
    }

    out_path = RESEARCH / "search-index.json"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # Stats
    type_counts = {}
    for r in records:
        t = r["type"]
        type_counts[t] = type_counts.get(t, 0) + 1

    print(f"Total indexed records: {len(records)}")
    for t, c in sorted(type_counts.items()):
        print(f"  {t}: {c}")
    print(f"\nWrote {out_path}")
    print(f"File size: {out_path.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
