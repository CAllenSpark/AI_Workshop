#!/usr/bin/env python3
"""
AI Narrator Export Generator

Generates a self-contained JSON export designed for consumption by AI
narrators, language models, and game engines. The format follows the
narrator-export.schema.json specification.

Key design principles:
- Flat structure: all cross-references resolved inline
- Redundancy is intentional: each entry contains full text of related entities
- Context summaries for each era provide narrative grounding
- Source citations preserved for verification

Output: research/vashon-island/narrator-export.json
"""

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "research" / "vashon-island"


def load_json(path):
    with open(path) as f:
        return json.load(f)


# Era definitions with context summaries
ERA_DEFINITIONS = [
    {
        "key": "prehistory",
        "name": "Prehistory",
        "start": "~15000 BCE",
        "end": "~1750 CE",
        "context_summary": (
            "The Vashon Stade of the Fraser Glaciation carved the deep channels of "
            "Puget Sound and deposited the glacial till that forms the island's terrain. "
            "As ice retreated around 12,000 BCE, ecological succession transformed bare "
            "glacial landscape into dense temperate rainforest over 5,000-7,000 years. "
            "Salmon colonized the newly formed waterways approximately 14,900 years ago, "
            "establishing the ecological foundation for all subsequent human habitation."
        ),
    },
    {
        "key": "indigenous",
        "name": "Indigenous Peoples",
        "start": "~10000 BCE",
        "end": "~1850",
        "context_summary": (
            "The sx̌ʷəbabš (S'Homamish) people, a Coast Salish group, were the primary "
            "inhabitants of Vashon and Maury Islands. They maintained at least five village "
            "sites and practiced a seasonal round of salmon fishing, shellfish harvesting, "
            "cedar craft, and camas gathering. The Burton Acres Shell Midden documents "
            "continuous habitation from at least 500 BCE. Their descendants are enrolled "
            "members of the Puyallup Tribe."
        ),
    },
    {
        "key": "exploration",
        "name": "European Exploration",
        "start": "1790",
        "end": "1850",
        "context_summary": (
            "European contact began with Spanish expeditions in 1790-1791 that discovered "
            "but did not enter Puget Sound. Captain George Vancouver's 1792 British expedition "
            "produced the first detailed surveys and named Vashon Island after his friend "
            "Captain James Vashon. The Hudson's Bay Company established Fort Nisqually in 1833, "
            "and the Wilkes Expedition mapped the island in 1841, laying groundwork for "
            "American territorial claims."
        ),
    },
    {
        "key": "logging-treaty",
        "name": "Logging & Treaty Era",
        "start": "1850",
        "end": "1870",
        "context_summary": (
            "The Donation Land Claim Act of 1850 opened Vashon Island to Euro-American "
            "settlement. The Medicine Creek Treaty of 1854 dispossessed indigenous peoples "
            "of their ancestral lands. Commercial logging began in 1852, with the island's "
            "estimated 200 million board feet of old-growth timber drawing lumber companies "
            "like Pope and Talbot, who filed the first formal land claim in 1864."
        ),
    },
    {
        "key": "pioneer",
        "name": "Pioneer Settlement",
        "start": "1865",
        "end": "1900",
        "context_summary": (
            "Between 1865 and 1900, homesteaders established the island's first permanent "
            "Euro-American communities. Key developments included the Mosquito Fleet steamer "
            "service connecting the island to Seattle and Tacoma, the founding of the first "
            "school in 1882, and the 1885 Chautauqua Assembly. Burton and Vashon Landing "
            "emerged as commercial centers. A Chinese fishing community existed at Manzanita, "
            "and Japanese immigrants began arriving in the 1890s."
        ),
    },
    {
        "key": "growth-industry",
        "name": "Growth & Industry",
        "start": "1890",
        "end": "1910",
        "context_summary": (
            "The 1890s brought rapid growth: strawberry farming (particularly by Japanese "
            "American families) became the island's signature industry, the Martinolich "
            "Shipbuilding drydock operated at Dockton, brick manufacturing used glacial "
            "clay deposits, and Burton emerged as the social and commercial center. The "
            "Harrington-Beall Greenhouse Company pioneered commercial floriculture. Population "
            "grew from 944 in 1900 to over 2,800."
        ),
    },
    {
        "key": "early-20th-century",
        "name": "Early 20th Century",
        "start": "1900",
        "end": "1942",
        "context_summary": (
            "The early 20th century saw the island transform from frontier to established "
            "rural community. The first auto ferry arrived in 1916. Japanese American families "
            "like the Mukais innovated cold-process strawberry barreling and operated thriving "
            "farms. Camp Sealth was founded in 1920. Puget Mill Company industrially logged "
            "10 square miles. The population tripled. A tombolo was built connecting Vashon "
            "and Maury Islands in 1916."
        ),
    },
    {
        "key": "wwii",
        "name": "World War II Era",
        "start": "1941",
        "end": "1946",
        "context_summary": (
            "The WWII era devastated Vashon's Japanese American community. Executive Order "
            "9066 led to the forced removal of 50+ Japanese Americans on May 16, 1942, to "
            "internment camps including Pinedale, Tule Lake, Minidoka, and Heart Mountain. "
            "The Mukai family self-exiled to Oregon to avoid internment. Very few families "
            "returned after the war. Army units were stationed on the island for Puget Sound "
            "defense, and the agricultural sector that Japanese Americans had built collapsed."
        ),
    },
    {
        "key": "state-ferry",
        "name": "State Ferry Era",
        "start": "1951",
        "end": "1970",
        "context_summary": (
            "Washington State Ferries began service on June 1, 1951, replacing private "
            "operators and permanently connecting the island to the mainland. A 1953 Nike "
            "missile base was established during the Cold War. The 1959 bridge proposal "
            "was defeated by islanders who valued their rural, water-bound identity. This "
            "period defined the island's character as deliberately separate from suburban "
            "development on the mainland."
        ),
    },
    {
        "key": "modern",
        "name": "Modern Era",
        "start": "1970",
        "end": "present",
        "context_summary": (
            "The modern era brought arts community growth, environmental conservation, and "
            "economic diversification. Stewart Brothers Coffee (later acquired by Starbucks) "
            "opened in 1982. K2 Sports manufactured skis on-island. The Vashon-Maury Island "
            "Land Trust (1989) protects over 2,000 acres. The Glacier Northwest gravel mine "
            "controversy galvanized environmental activism. The Mukai Farm received National "
            "Register status in 1994. The island maintains its rural character while supporting "
            "organic farming, artists, and a close-knit community of ~11,000 residents."
        ),
    },
]


def build_export():
    # Load all data
    timeline = load_json(RESEARCH / "timeline.json")
    people_data = load_json(RESEARCH / "people.json")
    places_data = load_json(RESEARCH / "places.json")
    env_data = load_json(RESEARCH / "environment.json")

    entries = timeline.get("entries", [])
    people = {p["name"]: p for p in people_data.get("people", [])}
    places = {p["name"]: p for p in places_data.get("places", [])}
    env_features = env_data.get("environment_features", [])

    # Build export entries with inline cross-references
    export_entries = []
    for entry in entries:
        export_entry = {
            "id": entry["id"],
            "title": entry["title"],
            "date_start": entry["date_start"],
            "era": entry["era"],
            "layers": entry["layers"],
            "description": entry["description"],
        }
        if entry.get("date_end"):
            export_entry["date_end"] = entry["date_end"]
        if entry.get("details"):
            export_entry["details"] = entry["details"]
        if entry.get("tags"):
            export_entry["tags"] = entry["tags"]

        # Resolve people inline
        if entry.get("people"):
            inline_people = []
            for pname in entry["people"]:
                if pname in people:
                    p = people[pname]
                    inline_people.append({
                        "id": p["id"],
                        "name": p["name"],
                        "role": p.get("role", "historical figure"),
                        "description": p.get("description", ""),
                    })
                else:
                    inline_people.append({
                        "id": "unknown",
                        "name": pname,
                        "role": "historical figure",
                    })
            export_entry["people"] = inline_people

        # Resolve places inline
        if entry.get("places"):
            inline_places = []
            for plname in entry["places"]:
                if plname in places:
                    pl = places[plname]
                    inline_places.append({
                        "id": pl["id"],
                        "name": pl["name"],
                        "type": pl.get("type", "region"),
                        "description": pl.get("description", ""),
                    })
                else:
                    inline_places.append({
                        "id": "unknown",
                        "name": plname,
                        "type": "region",
                    })
            export_entry["places"] = inline_places

        # Include sources
        if entry.get("sources"):
            export_entry["sources"] = entry["sources"]

        export_entries.append(export_entry)

    # Build top-level people array
    export_people = []
    for p in people_data.get("people", []):
        record = {
            "id": p["id"],
            "name": p["name"],
            "description": p.get("description", ""),
            "role": p.get("role", "historical figure"),
        }
        if p.get("period"):
            record["birth_year"] = p["period"]  # best available
        if p.get("related_entries"):
            record["related_entry_ids"] = p["related_entries"]
        export_people.append(record)

    # Build top-level places array
    export_places = []
    for pl in places_data.get("places", []):
        record = {
            "id": pl["id"],
            "name": pl["name"],
            "type": pl.get("type", "region"),
            "description": pl.get("description", ""),
        }
        if pl.get("coordinates"):
            record["coordinates"] = pl["coordinates"]
        if pl.get("related_entries"):
            record["related_entry_ids"] = pl["related_entries"]
        export_places.append(record)

    # Build export
    export = {
        "export_metadata": {
            "setting": "Vashon Island, WA",
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "entry_count": len(entries),
            "version": "1.0",
        },
        "eras": ERA_DEFINITIONS,
        "entries": export_entries,
        "people": export_people,
        "places": export_places,
        "environment_features": [
            {
                "id": f["id"],
                "name": f["name"],
                "type": f["type"],
                "description": f["description"],
                "time_relevance": f["time_relevance"],
            }
            for f in env_features
        ],
    }

    return export


def main():
    print("=== AI Narrator Export Generator ===\n")

    export = build_export()

    out_path = RESEARCH / "narrator-export.json"
    with open(out_path, "w") as f:
        json.dump(export, f, indent=2, ensure_ascii=False)

    # Stats
    meta = export["export_metadata"]
    print(f"Setting:      {meta['setting']}")
    print(f"Generated:    {meta['generated_at']}")
    print(f"Entries:      {meta['entry_count']}")
    print(f"Eras:         {len(export['eras'])}")
    print(f"People:       {len(export['people'])}")
    print(f"Places:       {len(export['places'])}")
    print(f"Environment:  {len(export['environment_features'])}")
    print(f"\nWrote {out_path}")
    print(f"File size: {out_path.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
