#!/usr/bin/env python3
"""
Data Validation Script

Validates all JSON data files against their schemas and checks cross-reference
integrity between timeline entries and entity files (people, places, environment).

Exit codes:
  0 = all validations pass
  1 = validation errors found
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "research" / "vashon-island"
SCHEMAS = ROOT / "research" / "schemas"

errors = []
warnings = []


def error(msg):
    errors.append(msg)
    print(f"  ERROR: {msg}")


def warn(msg):
    warnings.append(msg)
    print(f"  WARN:  {msg}")


def ok(msg):
    print(f"  OK:    {msg}")


def load_json(path):
    with open(path) as f:
        return json.load(f)


def validate_id_pattern(entity_id, pattern, entity_type):
    if not re.match(pattern, entity_id):
        error(f"{entity_type} ID '{entity_id}' does not match pattern {pattern}")
        return False
    return True


def validate_timeline():
    print("\n--- Validating timeline.json ---")
    data = load_json(RESEARCH / "timeline.json")
    entries = data.get("entries", [])

    if not entries:
        error("No entries found in timeline.json")
        return []

    ok(f"{len(entries)} entries loaded")

    # Check for duplicate IDs
    ids = [e["id"] for e in entries]
    dupes = set(x for x in ids if ids.count(x) > 1)
    if dupes:
        error(f"Duplicate timeline IDs: {dupes}")
    else:
        ok("No duplicate IDs")

    # Validate each entry
    valid_eras = {
        "prehistory", "indigenous", "exploration", "logging-treaty",
        "pioneer", "growth-industry", "early-20th-century", "wwii",
        "state-ferry", "modern"
    }
    valid_layers = {"event", "person", "place", "environment"}

    for entry in entries:
        eid = entry.get("id", "???")
        if not validate_id_pattern(eid, r"^[a-z][a-z0-9]*-[0-9]{3}$", "Timeline"):
            continue
        if entry.get("era") not in valid_eras:
            error(f"{eid}: invalid era '{entry.get('era')}'")
        for layer in entry.get("layers", []):
            if layer not in valid_layers:
                error(f"{eid}: invalid layer '{layer}'")
        if not entry.get("sources"):
            error(f"{eid}: no sources")
        if not entry.get("description"):
            error(f"{eid}: empty description")

    # Check era coverage
    era_counts = {}
    for entry in entries:
        era = entry.get("era", "unknown")
        era_counts[era] = era_counts.get(era, 0) + 1

    for era in valid_eras:
        count = era_counts.get(era, 0)
        if count < 5:
            error(f"Era '{era}' has only {count} entries (minimum: 5)")
        else:
            ok(f"Era '{era}': {count} entries")

    return entries


def validate_people():
    print("\n--- Validating people.json ---")
    data = load_json(RESEARCH / "people.json")
    people = data.get("people", [])

    if not people:
        error("No people found in people.json")
        return []

    ok(f"{len(people)} person records loaded")

    ids = [p["id"] for p in people]
    dupes = set(x for x in ids if ids.count(x) > 1)
    if dupes:
        error(f"Duplicate person IDs: {dupes}")
    else:
        ok("No duplicate IDs")

    for person in people:
        pid = person.get("id", "???")
        validate_id_pattern(pid, r"^person-[0-9]{3}$", "Person")
        if not person.get("name"):
            error(f"{pid}: empty name")
        if not person.get("description"):
            error(f"{pid}: empty description")
        if not person.get("role"):
            error(f"{pid}: empty role")

    return people


def validate_places():
    print("\n--- Validating places.json ---")
    data = load_json(RESEARCH / "places.json")
    places = data.get("places", [])

    if not places:
        error("No places found in places.json")
        return []

    ok(f"{len(places)} place records loaded")

    ids = [p["id"] for p in places]
    dupes = set(x for x in ids if ids.count(x) > 1)
    if dupes:
        error(f"Duplicate place IDs: {dupes}")
    else:
        ok("No duplicate IDs")

    for place in places:
        pid = place.get("id", "???")
        validate_id_pattern(pid, r"^place-[0-9]{3}$", "Place")
        if not place.get("name"):
            error(f"{pid}: empty name")
        if not place.get("type"):
            error(f"{pid}: empty type")
        if not place.get("description"):
            error(f"{pid}: empty description")

    return places


def validate_environment():
    print("\n--- Validating environment.json ---")
    data = load_json(RESEARCH / "environment.json")
    features = data.get("environment_features", [])

    if not features:
        error("No features found in environment.json")
        return []

    ok(f"{len(features)} environment feature records loaded")

    valid_types = {"geology", "ecology", "climate", "hydrology", "soil", "conservation"}

    ids = [f["id"] for f in features]
    dupes = set(x for x in ids if ids.count(x) > 1)
    if dupes:
        error(f"Duplicate environment IDs: {dupes}")
    else:
        ok("No duplicate IDs")

    for feature in features:
        fid = feature.get("id", "???")
        validate_id_pattern(fid, r"^env-[0-9]{3}$", "Environment")
        if not feature.get("name"):
            error(f"{fid}: empty name")
        if feature.get("type") not in valid_types:
            error(f"{fid}: invalid type '{feature.get('type')}'")
        if not feature.get("description"):
            error(f"{fid}: empty description")
        if not feature.get("time_relevance"):
            error(f"{fid}: empty time_relevance")

    return features


def validate_cross_references(entries, people, places, env_features):
    print("\n--- Validating Cross-References ---")

    # Build lookup sets
    entry_ids = {e["id"] for e in entries}
    people_names = {p["name"] for p in people}
    place_names = {p["name"] for p in places}

    # Check timeline people references
    timeline_people = set()
    for entry in entries:
        for pname in entry.get("people", []):
            timeline_people.add(pname)

    missing_people = timeline_people - people_names
    # Allow partial matches
    actually_missing = set()
    for mp in missing_people:
        found = False
        for pn in people_names:
            if mp.lower() in pn.lower() or pn.lower() in mp.lower():
                found = True
                break
        if not found:
            actually_missing.add(mp)

    if actually_missing:
        warn(f"{len(actually_missing)} timeline people not in people.json: {sorted(actually_missing)[:5]}...")
    else:
        ok("All timeline people covered in people.json")

    # Check timeline places references
    timeline_places = set()
    for entry in entries:
        for pname in entry.get("places", []):
            timeline_places.add(pname)

    missing_places = timeline_places - place_names
    if missing_places:
        warn(f"{len(missing_places)} timeline places not in places.json: {sorted(missing_places)[:5]}...")
    else:
        ok("All timeline places covered in places.json")

    # Check entity back-references point to valid entry IDs
    bad_refs = 0
    for person in people:
        for ref in person.get("related_entries", []):
            if ref not in entry_ids:
                bad_refs += 1
                warn(f"Person '{person['name']}' references non-existent entry {ref}")
    for place in places:
        for ref in place.get("related_entries", []):
            if ref not in entry_ids:
                bad_refs += 1
                warn(f"Place '{place['name']}' references non-existent entry {ref}")
    for feature in env_features:
        for ref in feature.get("related_entries", []):
            if ref not in entry_ids:
                bad_refs += 1
                warn(f"Environment '{feature['name']}' references non-existent entry {ref}")

    if bad_refs == 0:
        ok("All entity back-references point to valid timeline entries")
    else:
        error(f"{bad_refs} broken back-references found")

    # Check all entries have sources
    sourceless = [e["id"] for e in entries if not e.get("sources")]
    if sourceless:
        error(f"{len(sourceless)} entries without sources: {sourceless}")
    else:
        ok(f"All {len(entries)} entries have sources")


def main():
    print("=" * 60)
    print("Writer's Research Companion — Data Validation")
    print("=" * 60)

    entries = validate_timeline()
    people = validate_people()
    places = validate_places()
    env_features = validate_environment()

    if entries and people and places and env_features:
        validate_cross_references(entries, people, places, env_features)

    # Summary
    print("\n" + "=" * 60)
    print("VALIDATION SUMMARY")
    print("=" * 60)
    print(f"Errors:   {len(errors)}")
    print(f"Warnings: {len(warnings)}")

    if errors:
        print("\nERRORS:")
        for e in errors:
            print(f"  - {e}")
        print(f"\nResult: FAIL ({len(errors)} errors)")
        sys.exit(1)
    else:
        print(f"\nResult: PASS (0 errors, {len(warnings)} warnings)")
        sys.exit(0)


if __name__ == "__main__":
    main()
