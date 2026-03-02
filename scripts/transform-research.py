#!/usr/bin/env python3
"""
Transform Pipeline: Markdown Research → Structured JSON

Reads the markdown research files and timeline.json, then generates:
- research/vashon-island/people.json
- research/vashon-island/places.json
- research/vashon-island/environment.json

Each output file contains an array of entities conforming to their respective schemas.
Cross-references are bidirectional: timeline entries reference entity IDs, and entities
reference timeline entry IDs.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "research" / "vashon-island"


def load_timeline():
    with open(RESEARCH / "timeline.json") as f:
        data = json.load(f)
    return data["entries"]


def parse_people_md():
    """Parse people.md into structured person records."""
    text = (RESEARCH / "people.md").read_text()
    people = []
    # Split on ### headers (person entries)
    blocks = re.split(r"\n### ", text)
    for block in blocks[1:]:  # skip preamble
        lines = block.strip().split("\n")
        name = lines[0].strip()
        who = ""
        period = ""
        significance = ""
        related = []
        for line in lines[1:]:
            line = line.strip()
            if line.startswith("- **Who:**"):
                who = line.replace("- **Who:**", "").strip()
            elif line.startswith("- **Period:**"):
                period = line.replace("- **Period:**", "").strip()
            elif line.startswith("- **Significance:**"):
                significance = line.replace("- **Significance:**", "").strip()
            elif line.startswith("- **Related entries:**"):
                raw = line.replace("- **Related entries:**", "").strip()
                related = [e.strip() for e in raw.split(",") if e.strip()]
        if name:
            people.append({
                "name": name,
                "who": who,
                "period": period,
                "significance": significance,
                "related_entries": related,
            })
    return people


def parse_places_md():
    """Parse places.md into structured place records."""
    text = (RESEARCH / "places.md").read_text()
    places = []
    blocks = re.split(r"\n### ", text)
    for block in blocks[1:]:
        lines = block.strip().split("\n")
        name = lines[0].strip()
        ptype = ""
        description = ""
        related = []
        for line in lines[1:]:
            line = line.strip()
            if line.startswith("- **Type:**"):
                ptype = line.replace("- **Type:**", "").strip()
            elif line.startswith("- **Description:**"):
                description = line.replace("- **Description:**", "").strip()
            elif line.startswith("- **Related entries:**"):
                raw = line.replace("- **Related entries:**", "").strip()
                related = [e.strip() for e in raw.split(",") if e.strip()]
        if name:
            places.append({
                "name": name,
                "type": ptype,
                "description": description,
                "related_entries": related,
            })
    return places


def parse_environment_md():
    """Parse environment.md into structured environment features."""
    text = (RESEARCH / "environment.md").read_text()
    features = []

    # Extract features by section headers and content
    sections = [
        ("Glacial Origins", "geology", "~15000 BCE to present"),
        ("Stratigraphy", "geology", "~15000 BCE to present"),
        ("Puget Sound Formation", "hydrology", "~14000 BCE to present"),
        ("Terrain", "geology", "~12000 BCE to present"),
        ("Post-Glacial Succession", "ecology", "~12000 BCE to ~8000 BCE"),
        ("Historic Forest Cover", "ecology", "pre-contact to 1852"),
        ("Deforestation & Recovery", "ecology", "1852 to present"),
        ("Marine Environment", "ecology", "~14000 BCE to present"),
        ("Agricultural Landscape", "ecology", "pre-contact to present"),
        ("Conservation", "conservation", "1989 to present"),
        ("Pacific Maritime", "climate", "present"),
        ("Holocene Climatic Optimum", "climate", "~7500 BCE to ~2500 BCE"),
    ]

    # Extract related entries from the markdown
    related_map = {}
    for match in re.finditer(r"\*\*Related entries:\*\*\s*(.+)", text):
        entries_str = match.group(1).strip()
        # Find which section this belongs to by looking backwards
        pos = match.start()
        for section_name, _, _ in sections:
            section_pos = text.find(f"### {section_name}")
            if section_pos == -1:
                section_pos = text.find(f"### {section_name.split('(')[0].strip()}")
            if section_pos != -1 and section_pos < pos:
                related_map[section_name] = [
                    e.strip() for e in entries_str.split(",") if e.strip()
                ]

    # Build environment feature entries
    for section_name, ftype, time_rel in sections:
        # Extract the text content for this section
        header_pattern = f"### {re.escape(section_name)}"
        match = re.search(header_pattern, text)
        if not match:
            # Try partial match
            header_pattern = f"### {re.escape(section_name.split('(')[0].strip())}"
            match = re.search(header_pattern, text)
        if not match:
            continue

        start = match.end()
        # Find next section header
        next_header = re.search(r"\n##[#]? ", text[start:])
        end = start + next_header.start() if next_header else len(text)
        content = text[start:end].strip()

        # Remove "Related entries" lines from content
        content = re.sub(r"\*\*Related entries:\*\*.*", "", content).strip()
        # Clean up markdown formatting for description
        content = re.sub(r"\n+", " ", content)
        content = re.sub(r"\s+", " ", content).strip()
        # Truncate to reasonable length for description
        if len(content) > 500:
            content = content[:497] + "..."

        related = related_map.get(section_name, [])
        features.append({
            "name": section_name,
            "type": ftype,
            "description": content,
            "time_relevance": time_rel,
            "related_entries": related,
        })

    return features


def map_place_type(raw_type):
    """Map raw markdown place types to schema enum values."""
    mapping = {
        "island": "island",
        "body of water": "body-of-water",
        "waterway": "waterway",
        "harbor": "harbor",
        "peninsula": "peninsula",
        "beach": "beach",
        "geographic point": "geographic-point",
        "geographic area": "geographic-area",
        "wetland ecosystem": "wetland",
        "settlement / community": "settlement",
        "heritage site": "heritage-site",
        "youth camp": "youth-camp",
        "public park": "public-park",
        "community gathering space": "community-space",
        "business / landmark": "business",
        "historic indigenous site": "historic-site",
        "historic gathering point": "gathering-point",
        "ferry terminal": "ferry-terminal",
        "road": "road",
        "internment / relocation site": "internment-site",
        "historic location": "internment-site",
        "school": "school",
        "historic mill town": "mill-town",
        "historic fort": "fort",
        "historic territory / region": "territory",
    }
    return mapping.get(raw_type.lower(), "region")


def infer_role(who_text, significance_text):
    """Infer a short role from the person's description."""
    who_lower = (who_text + " " + significance_text).lower()
    if "archaeolog" in who_lower:
        return "archaeologist"
    if "explorer" in who_lower or "naval" in who_lower:
        return "explorer"
    if "governor" in who_lower:
        return "government official"
    if "chief" in who_lower:
        return "tribal leader"
    if "homestead" in who_lower or "settler" in who_lower:
        return "homesteader"
    if "missionary" in who_lower:
        return "missionary"
    if "captain" in who_lower and "ferry" in who_lower:
        return "ferry captain"
    if "teacher" in who_lower or "school" in who_lower or "education" in who_lower:
        return "educator"
    if "farmer" in who_lower or "strawberry" in who_lower or "agricultur" in who_lower:
        return "farmer"
    if "historian" in who_lower:
        return "historian"
    if "artist" in who_lower or "sculptor" in who_lower:
        return "artist"
    if "writer" in who_lower or "author" in who_lower or "poet" in who_lower:
        return "writer"
    if "logger" in who_lower or "lumber" in who_lower or "timber" in who_lower:
        return "logger"
    if "business" in who_lower or "entrepreneur" in who_lower or "company" in who_lower:
        return "business owner"
    if "activist" in who_lower or "communit" in who_lower:
        return "community leader"
    if "coffee" in who_lower or "roast" in who_lower:
        return "entrepreneur"
    if "military" in who_lower or "army" in who_lower:
        return "military"
    if "tribe" in who_lower or "tribal" in who_lower or "indigenous" in who_lower:
        return "indigenous people"
    if "coast salish" in who_lower:
        return "indigenous people"
    if "research" in who_lower:
        return "researcher"
    return "historical figure"


def build_people_json(parsed_people, timeline_entries):
    """Build the structured people.json with assigned IDs."""
    # Collect all unique person names from timeline
    timeline_people = set()
    for entry in timeline_entries:
        for p in entry.get("people", []):
            timeline_people.add(p)

    # Build name-to-entry mapping from timeline
    name_to_entries = {}
    for entry in timeline_entries:
        for p in entry.get("people", []):
            name_to_entries.setdefault(p, []).append(entry["id"])

    people_json = []
    assigned = set()

    for i, person in enumerate(parsed_people, start=1):
        pid = f"person-{i:03d}"
        name = person["name"]
        assigned.add(name)

        # Merge related entries from markdown and timeline cross-references
        related = set(person.get("related_entries", []))
        if name in name_to_entries:
            related.update(name_to_entries[name])
        # Check partial name matches for timeline refs
        for tname in timeline_people:
            if name in tname or tname in name:
                related.update(name_to_entries.get(tname, []))

        record = {
            "id": pid,
            "name": name,
            "description": person.get("significance", person.get("who", "")),
            "role": infer_role(person.get("who", ""), person.get("significance", "")),
        }
        if person.get("period"):
            record["period"] = person["period"]
        if related:
            record["related_entries"] = sorted(related)

        people_json.append(record)

    # Add any timeline-referenced people not in people.md
    next_id = len(people_json) + 1
    for tname in sorted(timeline_people):
        if tname not in assigned:
            # Check if name is a substring match
            found = False
            for a in assigned:
                if tname.lower() in a.lower() or a.lower() in tname.lower():
                    found = True
                    break
            if not found:
                pid = f"person-{next_id:03d}"
                next_id += 1
                people_json.append({
                    "id": pid,
                    "name": tname,
                    "description": f"Referenced in Vashon Island timeline entries.",
                    "role": "historical figure",
                    "related_entries": sorted(name_to_entries.get(tname, [])),
                })

    return people_json


def build_places_json(parsed_places, timeline_entries):
    """Build the structured places.json with assigned IDs."""
    # Collect all place names from timeline
    name_to_entries = {}
    for entry in timeline_entries:
        for p in entry.get("places", []):
            name_to_entries.setdefault(p, []).append(entry["id"])

    places_json = []
    assigned = set()

    for i, place in enumerate(parsed_places, start=1):
        pid = f"place-{i:03d}"
        name = place["name"]
        assigned.add(name)

        # Merge related entries
        related = set(place.get("related_entries", []))
        if name in name_to_entries:
            related.update(name_to_entries[name])

        record = {
            "id": pid,
            "name": name,
            "type": map_place_type(place.get("type", "region")),
            "description": place.get("description", ""),
        }
        if related:
            record["related_entries"] = sorted(related)

        places_json.append(record)

    # Add timeline-referenced places not in places.md
    next_id = len(places_json) + 1
    timeline_places = set()
    for entry in timeline_entries:
        for p in entry.get("places", []):
            timeline_places.add(p)

    for tname in sorted(timeline_places):
        if tname not in assigned:
            pid = f"place-{next_id:03d}"
            next_id += 1
            places_json.append({
                "id": pid,
                "name": tname,
                "type": "region",
                "description": f"Location referenced in Vashon Island timeline.",
                "related_entries": sorted(name_to_entries.get(tname, [])),
            })

    return places_json


def build_environment_json(parsed_features):
    """Build the structured environment.json with assigned IDs."""
    env_json = []
    for i, feature in enumerate(parsed_features, start=1):
        eid = f"env-{i:03d}"
        record = {
            "id": eid,
            "name": feature["name"],
            "type": feature["type"],
            "description": feature["description"],
            "time_relevance": feature["time_relevance"],
        }
        if feature.get("related_entries"):
            record["related_entries"] = sorted(feature["related_entries"])
        env_json.append(record)
    return env_json


def build_name_to_id_maps(people_json, places_json):
    """Build lookup maps from entity names to IDs."""
    people_map = {}
    for p in people_json:
        people_map[p["name"]] = p["id"]
    places_map = {}
    for p in places_json:
        places_map[p["name"]] = p["id"]
    return people_map, places_map


def main():
    print("=== Writer's Research Companion — Transform Pipeline ===\n")

    # 1. Load source data
    print("Loading timeline.json...")
    entries = load_timeline()
    print(f"  → {len(entries)} timeline entries loaded")

    print("Parsing people.md...")
    parsed_people = parse_people_md()
    print(f"  → {len(parsed_people)} person entries parsed")

    print("Parsing places.md...")
    parsed_places = parse_places_md()
    print(f"  → {len(parsed_places)} place entries parsed")

    print("Parsing environment.md...")
    parsed_env = parse_environment_md()
    print(f"  → {len(parsed_env)} environment features parsed")

    # 2. Build structured JSON
    print("\nBuilding people.json...")
    people_json = build_people_json(parsed_people, entries)
    print(f"  → {len(people_json)} person records")

    print("Building places.json...")
    places_json = build_places_json(parsed_places, entries)
    print(f"  → {len(places_json)} place records")

    print("Building environment.json...")
    env_json = build_environment_json(parsed_env)
    print(f"  → {len(env_json)} environment feature records")

    # 3. Build name→ID maps for cross-referencing
    people_map, places_map = build_name_to_id_maps(people_json, places_json)

    # 4. Write output files
    out_people = RESEARCH / "people.json"
    with open(out_people, "w") as f:
        json.dump({"people": people_json}, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {out_people} ({len(people_json)} records)")

    out_places = RESEARCH / "places.json"
    with open(out_places, "w") as f:
        json.dump({"places": places_json}, f, indent=2, ensure_ascii=False)
    print(f"Wrote {out_places} ({len(places_json)} records)")

    out_env = RESEARCH / "environment.json"
    with open(out_env, "w") as f:
        json.dump({"environment_features": env_json}, f, indent=2, ensure_ascii=False)
    print(f"Wrote {out_env} ({len(env_json)} records)")

    # 5. Write name→ID mapping file (useful for validation and future import)
    mapping = {
        "people": {name: pid for name, pid in people_map.items()},
        "places": {name: pid for name, pid in places_map.items()},
    }
    out_mapping = RESEARCH / "id-mapping.json"
    with open(out_mapping, "w") as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    print(f"Wrote {out_mapping}")

    # Summary
    print(f"\n=== Transform Complete ===")
    print(f"People:      {len(people_json)} records")
    print(f"Places:      {len(places_json)} records")
    print(f"Environment: {len(env_json)} features")
    print(f"Mapping:     {len(people_map)} people + {len(places_map)} places")


if __name__ == "__main__":
    main()
