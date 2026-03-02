#!/usr/bin/env python3
"""
AI Narrator Export Generator v2

Generates a self-contained JSON export designed for AI narrators hosting
fantasy-meets-reality adventures. Includes:
- Era atmosphere blocks (mood, soundscape, sensory data)
- Adventure hooks with fantasy integration points
- Fantasy layer (temporal anomalies, liminal spaces, historical gaps)
- Hazard register (natural and social dangers)
- Narrator system prompt
- Enriched place descriptions with sensory profiles
- All cross-references resolved inline

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


# ---------- NARRATOR SYSTEM PROMPT ----------

NARRATOR_SYSTEM_PROMPT = """You are the Narrator — an AI game master hosting a fantasy-meets-reality adventure set on Vashon Island, Washington. Your knowledge base contains verified historical and geographical facts about this real place spanning from prehistory (~15,000 BCE) to the present day.

## Your Core Principles

1. NEVER CONTRADICT ESTABLISHED FACT. The historical record is sacred. Real people lived and died here. Real injustices occurred. Your facts come from the knowledge base; your fiction lives in the spaces between.

2. Fantasy elements exist in the GAPS of history — unexplained events, archaeological silences, liminal spaces. When a player encounters something supernatural, it should feel like discovering a hidden truth, not a contradiction of known history.

3. Treat sensitive topics with gravity. Japanese American internment, indigenous displacement, and racial violence are not adventure fodder — they are real human experiences. Present them with respect, complexity, and the voices of those affected.

4. Ground every scene in sensory detail. Use the atmosphere blocks and sensory profiles. What does the player see, hear, smell? Make them feel present in the place and time.

## How to Use the Knowledge Base

### Eras
The `eras` array contains 10 historical periods, each with:
- `context_summary`: Historical overview (use for background knowledge)
- `atmosphere`: Mood, sounds, smells, social dynamics (use for scene-setting)

When a player is in an era, load its atmosphere block and let it color your descriptions.

### Entries
The `entries` array contains historical events with inline resolved people and places. When narrating:
- Use `description` for quick references
- Use `details` for deep dives when players investigate
- Use `tags` to find thematically related entries
- Use `sources` when a player challenges a fact
- Check `narrator_notes` for guidance on sensitive entries

### People (NPCs)
The `people` array contains character profiles. For key NPCs with personality/motivation data, embody them as characters. For minor figures, use their role and description to improvise appropriately. Never put words in a real historical person's mouth that contradict their known beliefs or actions.

### Places
The `places` array contains location data with sensory profiles and spatial relationships. Use these to describe what the player sees when they arrive, narrate travel between locations, and show how a place changes across eras.

### Fantasy Layer
The `fantasy_layer` section defines where supernatural elements live:
- `temporal_anomalies`: Places where time is thin
- `liminal_spaces`: Boundaries between the mundane and the numinous
- `historical_gaps`: Periods where fantasy can fill the silence
- `unexplained_facts`: Real mysteries that fantasy can illuminate

### Adventure Hooks
The `adventure_hooks` array contains pre-designed narrative opportunities with types (mystery, conflict, discovery, survival, moral_dilemma, time_echo) and optional fantasy_potential.

### Hazards
The `hazards` section lists natural and social dangers. Always check narrator_note fields for guidance on sensitive topics.

## Time Travel Rules
Players can jump between eras. When they do:
1. Describe the transition (the world blurs, sounds shift, the light changes)
2. Re-establish the scene using the new era's atmosphere block
3. Show what changed at their current location
4. Introduce era-appropriate NPCs and tensions

## When You Don't Know
If a player asks about something not in the knowledge base:
1. Say "The historical record is silent on that"
2. Offer what you do know from adjacent entries
3. If appropriate, use it as a fantasy integration point"""


# ---------- ERA DEFINITIONS WITH ATMOSPHERE ----------

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
        "atmosphere": {
            "mood": "Primordial. The land is being born. Ice gives way to water, bare rock to moss, silence to birdsong — over millennia.",
            "visual_palette": "Blue-white glacial ice, gray till, emerging green. Meltwater streams cutting through gravel. The slow creep of lodgepole pine across barren ground.",
            "soundscape": "Cracking ice, rushing meltwater, wind over open tundra. Later: birdsong, salmon splashing in newly formed streams, rain on fir canopy.",
            "smells": "Cold mineral air near glaciers. Wet earth. Later: cedar, salmon, rain-soaked moss.",
            "social_dynamics": "Empty of humans for millennia, then the first arrivals — cautious, resourceful people following salmon and game into a new landscape.",
            "daily_life": "Seasonal movement following food sources. Fishing. Gathering. Reading the land for what it can provide.",
            "tensions": "Survival against raw nature. The land is generous but unforgiving — tides, weather, predators."
        },
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
        "atmosphere": {
            "mood": "Settled abundance. The people know this land intimately — every cove, every salmon run, every camas meadow. Deep time made daily.",
            "visual_palette": "Dense forest of towering cedar and fir. Longhouses of split cedar planks. Canoes on gravel beaches. Smoke rising from cooking fires. Clam garden walls at low tide.",
            "soundscape": "Waves on gravel. Raven calls. Cedar crackling in fire pits. Songs and storytelling in the longhouse. Paddle strokes on calm water.",
            "smells": "Cedar smoke, roasting salmon, salt air, crushed camas bulbs baking in earth ovens, seaweed drying on racks.",
            "social_dynamics": "Extended family networks. Potlatch gift economy. Seasonal gatherings bring people from across Puget Sound. Elders hold knowledge. Cedar connects everything — houses, canoes, clothing, medicine.",
            "daily_life": "Dawn fishing runs. Women weaving cedar bark. Children on the beach. Smoke-drying salmon for winter. Seasonal movement between village sites.",
            "tensions": "Inter-tribal diplomacy. Resource competition during lean years. The first distant rumors of pale-skinned strangers to the south."
        },
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
        "atmosphere": {
            "mood": "Awe mixed with foreboding. Europeans see paradise and opportunity; indigenous peoples see the beginning of the end.",
            "visual_palette": "Tall ships in the sound. Longboats rowing toward shore. Officers with brass telescopes. Unbroken old-growth forest to the waterline. No clearings. No roads.",
            "soundscape": "Creak of ship rigging. Oars in water. Shouts between boats. The forest is overwhelmingly quiet — no engine noise, no roads, just water, wind, and birds.",
            "smells": "Tar and hemp from the ships. Salt spray. The rich, almost overwhelming green smell of old-growth forest approaching from the water.",
            "social_dynamics": "Cautious first contact. Trading and mutual observation. British formality meets Coast Salish diplomacy. Names being assigned to places that already have names.",
            "daily_life": "Survey parties rowing along the shore, sketching coastlines. Indigenous people watching from headlands. Trade of metal goods for fish and curiosity.",
            "tensions": "Two worlds meeting. The visitors will leave, but the maps they draw will bring settlers. Smallpox has already arrived ahead of them."
        },
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
        "atmosphere": {
            "mood": "Violent transformation. Ancient forest falling. A people displaced. The sound of axes is the sound of one world ending and another beginning.",
            "visual_palette": "Fresh stumps wider than a man is tall. Ox teams dragging logs on skid roads to the beach. Sawdust floating on harbor water. First crude cabins in raw clearings.",
            "soundscape": "Axes biting wood. Crash of falling giants. Ox chains. Sawmill whine from the beach. An unnatural silence in the forest where birdsong should be.",
            "smells": "Fresh-cut timber — overwhelming, sweet, sharp. Sawdust. Ox sweat. Campfire smoke in cold morning air.",
            "social_dynamics": "Lumber company crews — rough, transient men. A few homesteaders staking claims. The S'Homamish forced to leave their ancestral home. Treaty commissioners making promises that will be broken.",
            "daily_life": "Logging from dawn to dusk. Dangerous, brutal work. The only way off the island is by boat. Supply runs from Seattle or Tacoma. Isolation.",
            "tensions": "Indigenous dispossession is raw and recent. Land claim disputes. The forest is so vast it seems inexhaustible — but it isn't."
        },
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
        "atmosphere": {
            "mood": "Frontier optimism mixed with isolation. Everything is being built for the first time. Neighbors depend on each other because there is no one else.",
            "visual_palette": "Raw timber buildings, muddy wagon roads, stump-filled clearings, split-rail fences. The forest wall still close on all sides. Hand-painted signs.",
            "soundscape": "Hammers on nails. Steamship whistles three times a day. Chickens. A school bell. Children playing. Wind in the remaining fir trees.",
            "smells": "Woodsmoke from every chimney. Baking bread. Cedar shingles being split. Horse manure on the road. Salt air drifting up from the harbor.",
            "social_dynamics": "Tight-knit homesteader families. Mutual aid and barn raisings. The steamer schedule is the rhythm of life. Church on Sundays. Everyone knows everyone.",
            "daily_life": "Farm chores at dawn. General store visits. Waiting for the mail steamer. School for children. Community socials at the Chautauqua hall.",
            "tensions": "Isolation from mainland services — no doctor, no fire brigade. Chinese fishing community at Manzanita faces hostility. Land being cleared faster than it can be farmed."
        },
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
        "atmosphere": {
            "mood": "Boom-time energy. The island is becoming something. Strawberry fields in neat rows, hammers at the drydock, kilns firing bricks from glacial clay.",
            "visual_palette": "Strawberry fields climbing hillsides. The Dockton drydock with ships in cradles. Brick kilns glowing. Greenhouses catching afternoon light. Burton bustling with commerce.",
            "soundscape": "Steamship whistles. Hammers on ship hulls at the drydock. Japanese farmers calling to each other across strawberry rows. Market-day chatter in Burton.",
            "smells": "Ripe strawberries in summer. Brick kiln smoke. Rose greenhouses. Creosote from the drydock. Fresh bread from Burton bakery.",
            "social_dynamics": "Japanese American families becoming the backbone of agriculture. Martinolich shipyard employing dozens. Burton is the social hub. Multiple ethnicities coexisting — uneasily at times.",
            "daily_life": "Strawberry harvest from May to July is all-consuming. Steamer connections to Seattle for commerce. Community dances. Baseball games.",
            "tensions": "Racial dynamics between white settlers and Japanese farmers. The Panic of 1893 lingers. Competition for land. The old-growth forest is nearly gone."
        },
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
        "atmosphere": {
            "mood": "Optimistic modernization. The frontier is becoming a community. Roads are being graded, the ferry brings automobiles, telephones connect farms.",
            "visual_palette": "Graded dirt roads. Model T Fords alongside horse carts. Telephone poles. The new Vashon-Maury tombolo road. Camp Sealth cabins. Mukai Farm's orderly operation.",
            "soundscape": "Auto engines coughing to life. Ferry horns. Telephone rings. Camp Sealth children singing. Industrial logging — steam donkeys and sawmill shriek.",
            "smells": "Exhaust from early automobiles. Strawberry barrels being sealed with wax. Camp Sealth campfire smoke. Sawmill sawdust. Coffee at the general store.",
            "social_dynamics": "Japanese American families are the agricultural elite — innovative, hardworking, successful. This breeds both respect and resentment. The island has a newspaper, a school, churches.",
            "daily_life": "Ferry commuters to Seattle. Farm work. Logging crews. Summer campers at Sealth. Community events at the Grange hall.",
            "tensions": "Anti-Asian sentiment simmering beneath surface civility. Industrial logging denuding the landscape. The approaching shadow of war."
        },
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
        "atmosphere": {
            "mood": "Grief, guilt, and silence. The island's Japanese American neighbors are gone overnight. Farms stand empty. No one talks about it.",
            "visual_palette": "Abandoned strawberry fields going to seed. Boarded-up farmhouses. Army jeeps on island roads. Blackout curtains in windows. Overgrown Japanese gardens.",
            "soundscape": "Military vehicles. Radio news broadcasts. An unnatural quiet on farms that should be humming with work. Rain on empty greenhouses.",
            "smells": "Untended fields rotting. Military diesel. Damp, closed-up houses losing the scent of their families.",
            "social_dynamics": "Collective shame, though few admit it. Some neighbors profited from buying Japanese American property cheap. Others tried to help. The community fractures along these lines.",
            "daily_life": "War rationing. Victory gardens. Military patrols. Scanning the sky and sound for threats. Writing letters to sons overseas.",
            "tensions": "The injustice of internment. Profiteers vs. allies. Fear of invasion. The agricultural economy collapsing without Japanese American expertise."
        },
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
        "atmosphere": {
            "mood": "Quiet determination. The island chose to stay an island. The ferry is the lifeline and the boundary. Life is slower here, and that's the point.",
            "visual_palette": "Green-and-white state ferries. Mid-century modern houses. The Nike missile radar tower on the hilltop. Pastures where strawberry fields once were. Second-growth forest thickening.",
            "soundscape": "Ferry horn announcing arrivals and departures. Car tires on the new paved roads. Birds returning to regrown forest. Radar equipment humming at the Nike base.",
            "smells": "Ferry diesel. Fresh asphalt. Blackberry brambles overtaking abandoned farm equipment. Coffee brewing in a new island cafe.",
            "social_dynamics": "A community defined by what it refused — the bridge, suburbia, the mainland pace. Artists and writers beginning to discover the island.",
            "daily_life": "Ferry commuters. Rural living with a growing creative class. The Nike base is a strange Cold War intrusion. Hunting, fishing, gardening.",
            "tensions": "Development pressure vs. rural preservation. The bridge debate left scars. Cold War anxiety — the missile base is a reminder the world could end."
        },
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
        "atmosphere": {
            "mood": "Creative, independent, fiercely protective of place. The island is a refuge from the modern world while being fully part of it.",
            "visual_palette": "Art galleries in converted barns. Organic farm stands. Land Trust trail markers. The Mukai Farm with its interpretive signs. Kayaks on car roofs waiting for the ferry.",
            "soundscape": "Ferry announcements. Live music from the Red Bicycle. Farmers market chatter. Electric car hum. Rain on the roof of a coffee shop.",
            "smells": "Artisan coffee roasting. Organic compost. Salt air. Wood-fired pizza. Lavender farms.",
            "social_dynamics": "Artists, farmers, telecommuters, families. Expensive real estate tension — long-time residents vs. wealthy newcomers. Environmental activism as community identity.",
            "daily_life": "Ferry to Seattle for work. Farmers market on Saturday. Hiking Land Trust trails. Community theater. Island potlucks.",
            "tensions": "Gentrification and affordability. Gravel mine controversy. Balancing growth with rural character. Reconciling with historical injustices."
        },
    },
]


# ---------- ADVENTURE HOOKS ----------

ADVENTURE_HOOKS = [
    {
        "type": "mystery",
        "title": "The Vanished Village of Manzanita",
        "description": "A Chinese fishing community existed at Manzanita in the 1880s. They vanished completely — no graves, no ruins, no records of departure. Anti-Chinese violence swept the Pacific Northwest in 1885-1886. What happened to them?",
        "related_entries": ["pio-009"],
        "related_places": ["Manzanita"],
        "era_range": ["pioneer"],
        "fantasy_potential": "The community didn't leave — they found something in the tidal caves beneath the bluffs, a passage to somewhere else entirely. Their fishing nets are still down there, perfectly preserved in salt water that doesn't age things the way it should."
    },
    {
        "type": "time_echo",
        "title": "The Garden That Remembers",
        "description": "Kuni Mukai's Japanese garden survived decades of neglect after internment. Plants she shaped in the 1930s still grow in the patterns she designed. The garden was restored and the farm placed on the National Register in 1994.",
        "related_entries": ["ear-001", "ear-004", "ww2-001", "mod-010"],
        "related_places": ["Mukai Farm"],
        "era_range": ["early-20th-century", "wwii", "modern"],
        "fantasy_potential": "The garden exists partly outside normal time. Kuni's care anchored something here. At dawn, touching certain plants triggers sensory echoes — Japanese being spoken, the smell of cooking, lantern light. The garden remembers its family."
    },
    {
        "type": "discovery",
        "title": "The Shell Midden's Deepest Layers",
        "description": "The Burton Acres Shell Midden documents continuous human habitation from at least 500 BCE — over 2,500 years of shells, tools, and fire pits layered in one place. But what's beneath the oldest layer?",
        "related_entries": ["ind-002"],
        "related_places": ["Burton Acres Shell Midden"],
        "era_range": ["prehistory", "indigenous"],
        "fantasy_potential": "The deepest layer of the midden contains shells from species that no longer exist in Puget Sound — or anywhere. Whoever left them was here before the ice retreated, which should be impossible."
    },
    {
        "type": "survival",
        "title": "The Great Fire of 1893",
        "description": "A wildfire burned logged-off areas near Center for two days in 1893, nearly reaching the town before a wind shift saved it. The same year, the national financial Panic collapsed the island's economy.",
        "related_entries": ["pio-013"],
        "related_places": ["Vashon Island"],
        "era_range": ["pioneer"],
        "fantasy_potential": "The fire revealed something in the burned landscape — stone foundations that no one built, too old for any settler, too geometrically perfect for indigenous construction. By the time people came to investigate, second-growth had already covered them."
    },
    {
        "type": "conflict",
        "title": "The Medicine Creek Betrayal",
        "description": "The 1854 Medicine Creek Treaty forced the S'Homamish people off their ancestral lands. Governor Isaac Stevens used translators who may have deliberately mistranslated terms. The S'Homamish were not even named in the treaty.",
        "related_entries": ["log-001", "log-002"],
        "related_places": ["Vashon Island", "Medicine Creek"],
        "era_range": ["logging-treaty"],
        "fantasy_potential": "The S'Homamish elders spoke words of binding at the treaty site — not in Lushootseed but in an older language. The land remembers the promise that was broken. In certain places, at certain times, the original agreement reasserts itself."
    },
    {
        "type": "mystery",
        "title": "The Cold War Bunker",
        "description": "A Nike missile base operated on Vashon Island from 1953 during the Cold War. The base was decommissioned, but underground facilities may remain. What was really being watched for?",
        "related_entries": ["fer-002"],
        "related_places": ["Vashon Island"],
        "era_range": ["state-ferry"],
        "fantasy_potential": "The radar didn't just watch for Soviet missiles. The operators logged anomalous contacts — objects moving through Puget Sound at impossible speeds, deep beneath the surface. The logs were classified and the base was shut down shortly after."
    },
    {
        "type": "moral_dilemma",
        "title": "The Neighbor's Choice",
        "description": "When Japanese American families were forcibly removed in 1942, their farms and possessions had to be sold or abandoned in days. Some neighbors bought property at fair value to hold in trust. Others exploited the desperation.",
        "related_entries": ["ww2-001", "ww2-003"],
        "related_places": ["Vashon Island"],
        "era_range": ["wwii"],
        "fantasy_potential": None
    },
    {
        "type": "discovery",
        "title": "200 Million Board Feet",
        "description": "When logging began in the 1850s, the island held an estimated 200 million board feet of old-growth timber — trees centuries old, some over 200 feet tall. A few survivors remain in the deepest ravines.",
        "related_entries": ["log-001", "log-004"],
        "related_places": ["Shinglemill Creek", "Judd Creek"],
        "era_range": ["logging-treaty", "modern"],
        "fantasy_potential": "The surviving old-growth trees are not just old — they remember. Trees that were saplings when the S'Homamish lived here. One of them, deep in a ravine, has marks carved into its bark in a language no one can read."
    },
    {
        "type": "time_echo",
        "title": "The Mosquito Fleet Ghost",
        "description": "Dozens of small steamships — the 'Mosquito Fleet' — connected Puget Sound islands to the mainland from the 1870s through the 1930s. Many sank or were beached. On foggy mornings, islanders sometimes claim to hear a steam whistle that doesn't match any modern vessel.",
        "related_entries": ["pio-002"],
        "related_places": ["Puget Sound", "Vashon Landing"],
        "era_range": ["pioneer", "growth-industry", "modern"],
        "fantasy_potential": "One of the lost steamships still runs its route — but only in the fog. Passengers who board it arrive at their destination, but in the wrong year."
    },
    {
        "type": "discovery",
        "title": "The Glacial Erratic",
        "description": "Scattered across the island are glacial erratics — boulders carried from hundreds of miles away by the ice sheet and dropped when it melted. Each one is a piece of a distant mountain, stranded far from home.",
        "related_entries": ["pre-001", "pre-006"],
        "related_places": ["Vashon Island"],
        "era_range": ["prehistory", "modern"],
        "fantasy_potential": "One particular erratic, deep in the forest, is warm to the touch. It hums at a frequency just below hearing. It came from somewhere the ice should not have been."
    },
    {
        "type": "conflict",
        "title": "The Gravel Mine War",
        "description": "Glacier Northwest proposed extracting 7.5 million tons of gravel per year from Maury Island. Islanders fought it for over a decade. The site was finally purchased for conservation in 2010 for $36 million.",
        "related_entries": ["mod-008"],
        "related_places": ["Maury Island"],
        "era_range": ["modern"],
        "fantasy_potential": "The mining exposed something in the glacial deposits — a layer that shouldn't exist. The company wanted to keep digging. The islanders thought they were just saving trees and orca habitat. They were saving something much older."
    },
    {
        "type": "mystery",
        "title": "The S'Homamish Name",
        "description": "The sx̌ʷəbabš (S'Homamish) means 'people of the big river' — but Vashon Island has no big river. Only small creeks. Why would an island people name themselves after a river?",
        "related_entries": ["ind-001"],
        "related_places": ["Vashon Island"],
        "era_range": ["indigenous"],
        "fantasy_potential": "There was a river once — not of water, but of something else. The S'Homamish remember it in their name even though the river itself has not flowed in living memory. It runs underground now, and where it surfaces, strange things grow."
    },
]


# ---------- FANTASY LAYER ----------

FANTASY_LAYER = {
    "temporal_anomalies": [
        {
            "location": "Burton Acres Shell Midden",
            "description": "3,000+ years of continuous habitation layered in one spot. Time runs thin here — objects from different eras surface together. Archaeological digs have found items in strata where they shouldn't be.",
            "eras_affected": ["prehistory", "indigenous", "modern"]
        },
        {
            "location": "Vashon-Maury Tombolo",
            "description": "The artificial land bridge connecting the two islands (built 1916) joins what nature kept separate. The junction point sometimes feels unstable — not physically, but temporally. Low tide reveals older things than the tombolo.",
            "eras_affected": ["early-20th-century", "modern"]
        },
        {
            "location": "Mukai Farm Garden",
            "description": "Kuni Mukai's garden survived decades of neglect in ways horticulturists find difficult to explain. Plants maintained their shapes without pruning. The garden is a living memory anchor.",
            "eras_affected": ["early-20th-century", "wwii", "modern"]
        },
    ],
    "liminal_spaces": [
        {
            "name": "Old-Growth Ravines",
            "description": "The last surviving ancient trees hide in the deepest ravines where loggers couldn't reach. The forest floor is thick with centuries of moss and shadow. It feels older than the rest of the island because it is.",
            "locations": ["Shinglemill Creek ravine", "Judd Creek canyon"]
        },
        {
            "name": "Tidal Caves and Bluff Faces",
            "description": "The eroding glacial bluffs expose layers of geological time — clay, sand, gravel from 15,000 years ago. At extreme low tides, cave-like openings appear at the base of bluffs that are submerged most of the time.",
            "locations": ["Western bluffs", "Point Robinson", "Colvos Passage shore"]
        },
        {
            "name": "Whispering Firs Bog",
            "description": "A fragile wetland ecosystem — the Land Trust's founding conservation project. Bog plants grow in acidic, oxygen-poor water that preserves organic material for millennia. What's preserved down in the peat?",
            "locations": ["Central Vashon interior"]
        },
        {
            "name": "Decommissioned Nike Missile Base",
            "description": "Cold War infrastructure slowly being reclaimed by forest. Underground bunkers, radar platforms, fenced perimeters. The military left, but not everything they monitored stopped happening.",
            "locations": ["Central Vashon hilltop"]
        },
    ],
    "historical_gaps": [
        {
            "period": "~8000 BCE – 500 BCE",
            "description": "Nearly 7,500 years between the establishment of old-growth forest and the earliest confirmed midden deposits. People were here, but where exactly? The interior of the island is archaeologically silent.",
            "fantasy_potential": "Something in the interior kept people near the coast. The forest was not empty — it was occupied by something else."
        },
        {
            "period": "1870–1880 (inter-settlement period)",
            "description": "After early logging claims but before real homesteading. The island was partially logged, sparsely inhabited, and largely unmonitored. A decade in shadow.",
            "fantasy_potential": "People came and went in this period without anyone recording their presence. What were they looking for? What did they find?"
        },
        {
            "period": "1946–1951 (post-war, pre-ferry)",
            "description": "After WWII but before state ferry service. The island was between identities — the old agricultural community gone, the new commuter/artist community not yet arrived.",
            "fantasy_potential": "An island between stories. For a few years, Vashon had no narrative. In that silence, other narratives could take root."
        },
    ],
    "unexplained_facts": [
        {
            "fact": "The name sx̌ʷəbabš (S'Homamish) means 'people of the big river' but Vashon Island has no big river.",
            "fantasy_potential": "The river is real but not physical. It flows through time, not space. The S'Homamish lived along its banks in a way that geography alone can't explain."
        },
        {
            "fact": "Glacial erratics on the island include rocks from the Canadian Rockies, carried hundreds of miles by ice. Some are found in places the ice sheet's path can't fully account for.",
            "fantasy_potential": "Not all the erratics were carried by ice. Some were placed here deliberately, markers in a pattern only visible from above — or from another time."
        },
        {
            "fact": "Salmon colonized Puget Sound waterways approximately 14,900 years ago in two separate waves — from the south and from the north simultaneously, as if responding to a signal.",
            "fantasy_potential": "The salmon followed something upstream that no longer exists. The runs remember the path even though the reason is forgotten."
        },
        {
            "fact": "The 1922 wildfire burned the width of the south end for two miles but stopped abruptly at a line that doesn't correspond to any natural firebreak.",
            "fantasy_potential": "Something stopped the fire. Not wind, not water, not a road. A line in the ground that fire will not cross."
        },
    ],
}


# ---------- HAZARDS ----------

HAZARDS = {
    "natural": [
        {
            "type": "tidal",
            "description": "Strong tidal currents in Colvos Passage (west) and Dalco Passage (south). Tidal range of 12-14 feet exposes extensive mudflats. Extreme low tides can strand boats; extreme high tides flood low shoreline areas.",
            "severity": "moderate",
            "eras": ["all"]
        },
        {
            "type": "bluff_erosion",
            "description": "Glacial bluffs on west and north shores are actively eroding. The contrast between permeable till and impermeable clay creates instability. Landslides occur after heavy rain, especially in winter.",
            "severity": "high",
            "eras": ["all"]
        },
        {
            "type": "wildfire",
            "description": "Documented major fires in 1893 (near Center, burned 2 days) and 1922 (burned width of south end for 2 miles). Logged-over areas with slash debris are especially vulnerable in dry summers.",
            "severity": "high",
            "eras": ["pioneer", "growth-industry", "early-20th-century"]
        },
        {
            "type": "weather",
            "description": "Pacific storms bring heavy rain and wind October-March. Fog can be dense, especially in spring and fall. Maritime conditions are generally mild but hypothermia risk exists for those caught unprepared.",
            "severity": "moderate",
            "eras": ["all"]
        },
        {
            "type": "isolation",
            "description": "The island is accessible only by water. Before state ferry service (1951), a missed steamer could mean days of waiting. Medical emergencies require boat transport to the mainland.",
            "severity": "high",
            "eras": ["pioneer", "growth-industry", "early-20th-century", "wwii"]
        },
    ],
    "social": [
        {
            "type": "indigenous_displacement",
            "description": "The Medicine Creek Treaty of 1854 forcibly dispossessed the S'Homamish people of their ancestral lands. This is the foundational injustice of the island's settler history. The S'Homamish are not historical artifacts — their descendants are enrolled members of the Puyallup Tribe today.",
            "severity": "critical",
            "eras": ["logging-treaty", "pioneer"],
            "narrator_note": "Present indigenous perspectives with dignity. The S'Homamish had a 10,000+ year relationship with this land. Narrate the loss with the weight it deserves."
        },
        {
            "type": "anti_asian_violence",
            "description": "Anti-Chinese riots swept the Pacific Northwest in 1885-1886. The Chinese fishing community at Manzanita vanished in this period. Anti-Japanese sentiment culminated in the 1942 internment.",
            "severity": "critical",
            "eras": ["pioneer", "growth-industry", "early-20th-century", "wwii"],
            "narrator_note": "Never trivialize racial violence. These arcs should educate and move players, not exploit trauma for entertainment. Center the experiences of those affected."
        },
        {
            "type": "japanese_american_internment",
            "description": "Executive Order 9066 led to the forced removal of 50+ Japanese Americans from Vashon Island on May 16, 1942. Families lost farms, homes, and community. Very few returned after the war.",
            "severity": "critical",
            "eras": ["wwii"],
            "narrator_note": "This is the emotional heart of the Vashon Island story. Handle with care. Players should understand the human cost — the gardens left untended, the equipment sold for pennies, the children taken from the only home they'd known."
        },
        {
            "type": "economic_inequality",
            "description": "Modern Vashon faces gentrification pressure. Median home prices far exceed what long-time residents and workers can afford. Artists and farmers who defined the island's character are being priced out.",
            "severity": "moderate",
            "eras": ["modern"],
            "narrator_note": "Present multiple perspectives. Newcomers love the island too. The tension is real but not simple."
        },
    ],
}


# ---------- MISSING PEOPLE TO ADD ----------

ADDITIONAL_PEOPLE = [
    {
        "id": "person-093",
        "name": "George Vancouver",
        "description": "Captain of HMS Discovery. Led the 1791-1795 British expedition that produced the first detailed charts of the Pacific Northwest coast. Named Vashon Island after his friend Captain James Vashon on June 1, 1792.",
        "role": "Royal Navy captain and explorer",
        "birth_year": "1757",
        "death_year": "1798",
        "personality": "Meticulous, formal, ill-tempered when challenged. Genuinely awed by the Pacific Northwest landscape despite himself. Suffering from chronic illness.",
        "motivation": "Chart every inlet for the Crown. Establish British claims before the Spanish or Americans.",
        "speech_style": "Formal 18th-century English. 'I should think, Mr. Puget, that this harbor merits closer inspection.'",
        "relationships": {
            "Peter Puget": "Trusted subordinate. Vancouver respects his thoroughness.",
            "James Vashon": "Close friend and fellow officer. The island's naming was a personal tribute."
        },
        "adventure_role": "quest_giver",
    },
    {
        "id": "person-094",
        "name": "Charles Wilkes",
        "description": "U.S. Navy lieutenant who led the United States Exploring Expedition (1838-1842). Surveyed Puget Sound in 1841, naming Maury Island, Quartermaster Harbor, and nearly all of Vashon-Maury Island's coastal points.",
        "role": "U.S. Navy explorer and surveyor",
        "birth_year": "1798",
        "death_year": "1877",
        "personality": "Imperious, detail-obsessed, driven. Views the Pacific Northwest as American destiny.",
        "motivation": "Map American claims before the British can contest them. His surveys will determine borders.",
        "speech_style": "Clipped, authoritative American naval speech. 'Mark that point. Name it for Quartermaster Jenkins.'",
        "adventure_role": "authority_figure",
    },
    {
        "id": "person-095",
        "name": "Isaac Stevens",
        "description": "First Governor of Washington Territory. Negotiated the Medicine Creek Treaty (1854) that dispossessed Coast Salish peoples of their ancestral lands. Used aggressive, possibly deceptive negotiation tactics.",
        "role": "Territorial governor and treaty negotiator",
        "birth_year": "1818",
        "death_year": "1862",
        "personality": "Ambitious, ruthless, charming when it served his purpose. Believed in American expansion with genuine fervor.",
        "motivation": "Open the territory for settlement. Build his political career. Genuinely believes he is bringing civilization.",
        "speech_style": "Politician's eloquence masking iron will. 'The Great Father in Washington wishes only peace and prosperity for his red children.'",
        "relationships": {
            "S'Homamish leaders": "Adversarial. Uses translators who may deliberately mistranslate.",
            "Settlers": "Popular champion. Delivers the land they want."
        },
        "adventure_role": "antagonist",
    },
    {
        "id": "person-096",
        "name": "Franklin Pierce",
        "description": "14th President of the United States. Signed the Medicine Creek Treaty into law, making the dispossession of Coast Salish peoples federal policy.",
        "role": "U.S. President",
        "birth_year": "1804",
        "death_year": "1869",
        "adventure_role": "authority_figure",
    },
    {
        "id": "person-097",
        "name": "Masahiro Mukai",
        "description": "Japanese American farmer who pioneered cold-process strawberry barreling in 1926, revolutionizing the island's strawberry industry. Built one of the most successful farms on Vashon. Rather than face internment in 1942, took his family to self-exile in Oregon.",
        "role": "Farmer, innovator, and community leader",
        "birth_year": "~1880s",
        "personality": "Quiet, dignified, innovative. Solves problems through ingenuity rather than confrontation. Deep respect for the land.",
        "motivation": "Protect his family. Build something lasting. Prove that hard work transcends prejudice.",
        "speech_style": "Measured, practical. Speaks softly but with absolute certainty when it matters.",
        "relationships": {
            "Kuni Mukai": "Wife. Partner in every sense. Her garden is his favorite place.",
            "Island community": "Respected but never fully accepted. His success breeds both admiration and resentment."
        },
        "adventure_role": "survivor",
    },
    {
        "id": "person-098",
        "name": "Kuni Mukai",
        "description": "Japanese American garden designer and farmer's wife. Created the celebrated garden at the Mukai farmstead, blending Japanese aesthetics with Pacific Northwest plants. The garden she left behind in 1942 survived decades of neglect.",
        "role": "Garden designer and cultural preservationist",
        "personality": "Artistic, resilient, deeply connected to the land. Creates beauty as an act of cultural persistence.",
        "motivation": "Maintain cultural identity in a foreign land. Create something that outlasts prejudice.",
        "speech_style": "Gentle, observant. Points things out rather than instructing. 'Look how the moss has taken to this stone.'",
        "adventure_role": "guardian",
    },
    {
        "id": "person-099",
        "name": "B.D. Kimball",
        "description": "Founded the first school on Vashon Island in 1882 in a log cabin at Vashon Landing. The school served as church, community center, and meeting hall.",
        "role": "Educator and community builder",
        "adventure_role": "mentor",
    },
    {
        "id": "person-100",
        "name": "L.B. Coe",
        "description": "Donated land for the 1885 Chautauqua Assembly on Vashon Island, which brought educational and cultural programming to the frontier community.",
        "role": "Philanthropist and community supporter",
        "adventure_role": "ally",
    },
    {
        "id": "person-101",
        "name": "Dave Stewart",
        "description": "Co-founded Stewart Brothers Coffee on Vashon Island in 1982, which was later acquired by Starbucks. One of the early artisan coffee roasters in the Pacific Northwest.",
        "role": "Entrepreneur and coffee roaster",
        "adventure_role": "ally",
    },
    {
        "id": "person-102",
        "name": "Jim Stewart",
        "description": "Co-founded Stewart Brothers Coffee with his brother Dave on Vashon Island in 1982. The company pioneered craft coffee roasting before the concept was mainstream.",
        "role": "Entrepreneur and coffee roaster",
        "adventure_role": "ally",
    },
    {
        "id": "person-103",
        "name": "B.P. Harrington",
        "description": "Co-founded the Harrington-Beall Greenhouse Company on Vashon Island (~1888), one of the earliest commercial floriculture operations in the Pacific Northwest. Grew roses and orchids.",
        "role": "Horticulturist and entrepreneur",
        "adventure_role": "ally",
    },
    {
        "id": "person-104",
        "name": "John Beall",
        "description": "Co-founded the Harrington-Beall Greenhouse Company with B.P. Harrington (~1888). Pioneered commercial greenhouse growing on Vashon Island.",
        "role": "Horticulturist and entrepreneur",
        "adventure_role": "ally",
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

    # Add missing people to the lookup
    additional_by_name = {p["name"]: p for p in ADDITIONAL_PEOPLE}
    for name, p in additional_by_name.items():
        if name not in people:
            people[name] = p

    # Build name aliases for people with alternate name forms
    # e.g., "Captain James Vashon" -> also match "James Vashon"
    aliases = {}
    for name, p in list(people.items()):
        # Strip title prefixes
        for prefix in ["Captain ", "Lt. ", "Governor ", "President "]:
            if name.startswith(prefix):
                short = name[len(prefix):]
                if short not in people:
                    aliases[short] = p
        # Handle parenthetical aliases like "Miles F. Hatch (also Miles Hatch)"
        if "(also " in name:
            base = name.split(" (also ")[0]
            alt = name.split("(also ")[1].rstrip(")")
            if base not in people:
                aliases[base] = p
            if alt not in people:
                aliases[alt] = p
    people.update(aliases)

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

    # Build top-level people array (original + additional)
    export_people = []
    seen_names = set()
    for p in list(people_data.get("people", [])) + ADDITIONAL_PEOPLE:
        if p["name"] in seen_names:
            continue
        seen_names.add(p["name"])
        record = {
            "id": p["id"],
            "name": p["name"],
            "description": p.get("description", ""),
            "role": p.get("role", "historical figure"),
        }
        if p.get("birth_year") or p.get("period"):
            record["birth_year"] = p.get("birth_year") or p.get("period", "")
        if p.get("death_year"):
            record["death_year"] = p["death_year"]
        if p.get("personality"):
            record["personality"] = p["personality"]
        if p.get("motivation"):
            record["motivation"] = p["motivation"]
        if p.get("speech_style"):
            record["speech_style"] = p["speech_style"]
        if p.get("relationships"):
            record["relationships"] = p["relationships"]
        if p.get("secrets"):
            record["secrets"] = p["secrets"]
        if p.get("adventure_role"):
            record["adventure_role"] = p["adventure_role"]
        if p.get("related_entries") or p.get("related_entry_ids"):
            record["related_entry_ids"] = p.get("related_entries") or p.get("related_entry_ids", [])
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
        if pl.get("sensory"):
            record["sensory"] = pl["sensory"]
        if pl.get("spatial"):
            record["spatial"] = pl["spatial"]
        if pl.get("related_entries"):
            record["related_entry_ids"] = pl["related_entries"]
        export_places.append(record)

    # Filter adventure hooks to remove None fantasy_potential
    clean_hooks = []
    for hook in ADVENTURE_HOOKS:
        clean_hook = {k: v for k, v in hook.items() if v is not None}
        clean_hooks.append(clean_hook)

    # Build export
    export = {
        "export_metadata": {
            "setting": "Vashon Island, WA",
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "entry_count": len(entries),
            "version": "2.0",
        },
        "narrator_system_prompt": NARRATOR_SYSTEM_PROMPT,
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
        "adventure_hooks": clean_hooks,
        "fantasy_layer": FANTASY_LAYER,
        "hazards": HAZARDS,
    }

    return export


def main():
    print("=== AI Narrator Export Generator v2 ===\n")

    export = build_export()

    out_path = RESEARCH / "narrator-export.json"
    with open(out_path, "w") as f:
        json.dump(export, f, indent=2, ensure_ascii=False)

    # Stats
    meta = export["export_metadata"]
    print(f"Setting:           {meta['setting']}")
    print(f"Version:           {meta['version']}")
    print(f"Generated:         {meta['generated_at']}")
    print(f"Entries:           {meta['entry_count']}")
    print(f"Eras:              {len(export['eras'])}")
    print(f"People:            {len(export['people'])}")
    print(f"Places:            {len(export['places'])}")
    print(f"Environment:       {len(export['environment_features'])}")
    print(f"Adventure Hooks:   {len(export['adventure_hooks'])}")
    print(f"Fantasy Anomalies: {len(export['fantasy_layer']['temporal_anomalies'])}")
    print(f"Liminal Spaces:    {len(export['fantasy_layer']['liminal_spaces'])}")
    print(f"Historical Gaps:   {len(export['fantasy_layer']['historical_gaps'])}")
    print(f"Hazards (natural): {len(export['hazards']['natural'])}")
    print(f"Hazards (social):  {len(export['hazards']['social'])}")
    print(f"System Prompt:     {len(export['narrator_system_prompt'])} chars")
    print(f"\nWrote {out_path}")
    print(f"File size: {out_path.stat().st_size / 1024:.1f} KB")

    # Check for remaining unresolved references
    unknown_count = sum(
        1 for e in export["entries"]
        for p in e.get("people", [])
        if p["id"] == "unknown"
    )
    if unknown_count:
        print(f"\n⚠ {unknown_count} unresolved person references remaining")
    else:
        print("\n✓ All person references resolved")


if __name__ == "__main__":
    main()
