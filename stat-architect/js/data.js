// ============================================================
// LiF: Arden Character Builder — Data Layer
// Source: staticData.dlpack extraction + Python prototype
// ============================================================

const SKILL_CAPS = { crafting: 1600, combat: 400, minor: 800 };

// Skill trees: canonical name → tier + parent
// "Thrower" is the canonical name (matches SKILL_DETAILS)
const SKILL_TREES = {
  Crafting: {
    "Artisan":             { tier: 1, parent: null },
    "Construction":        { tier: 2, parent: "Artisan" },
    "Masonry":             { tier: 3, parent: "Construction" },
    "Architecture":        { tier: 4, parent: "Masonry" },

    "Mining":              { tier: 1, parent: null },
    "Materials Processing":{ tier: 2, parent: "Mining" },
    "Precious Prospecting":{ tier: 3, parent: "Materials Processing" },
    "Jewelry":             { tier: 4, parent: "Precious Prospecting" },

    "Forestry":            { tier: 1, parent: null },
    "Carpentry":           { tier: 2, parent: "Forestry" },
    "Bowcraft":            { tier: 3, parent: "Carpentry" },
    "Warfare Engineering": { tier: 4, parent: "Bowcraft" },

    "Kilning":             { tier: 1, parent: null },
    "Forging":             { tier: 2, parent: "Kilning" },
    "Weaponsmithing":      { tier: 3, parent: "Forging" },
    "Armorsmithing":       { tier: 4, parent: "Weaponsmithing" },

    "Household":           { tier: 1, parent: null },
    "Farming":             { tier: 2, parent: "Household" },
    "Cooking":             { tier: 3, parent: "Farming" },
    "Tailoring":           { tier: 4, parent: "Cooking" },

    "Gathering":           { tier: 1, parent: null },
    "Herbalism":           { tier: 2, parent: "Gathering" },
    "Healing":             { tier: 3, parent: "Herbalism" },
    "Alchemy":             { tier: 4, parent: "Healing" },

    "Hunting":             { tier: 1, parent: null },
    "Procuration":         { tier: 2, parent: "Hunting" },
    "Animal Lore":         { tier: 3, parent: "Procuration" },
    "Warhorse Training":   { tier: 4, parent: "Animal Lore" },
  },
  Combat: {
    "Cavalry":             { tier: 1, parent: null },
    "Knight":              { tier: 2, parent: "Cavalry" },
    "Lancer":              { tier: 3, parent: "Knight" },

    "Militia":             { tier: 1, parent: null },
    "Spearman":            { tier: 2, parent: "Militia" },
    "Guard":               { tier: 3, parent: "Spearman" },

    "Footman":             { tier: 1, parent: null },
    "Swordsman":           { tier: 2, parent: "Footman" },
    "Huscarl":             { tier: 3, parent: "Swordsman" },

    "Thrower":             { tier: 1, parent: null },
    "Archer":              { tier: 2, parent: "Thrower" },
    "Ranger":              { tier: 3, parent: "Archer" },

    "Assaulter":           { tier: 1, parent: null },
    "Vanguard":            { tier: 2, parent: "Assaulter" },
    "Berserker":           { tier: 3, parent: "Vanguard" },

    "Unit and Formation":  { tier: 1, parent: null },
    "Equipment Maintain":  { tier: 1, parent: null },
    "Battle Survival":     { tier: 1, parent: null },
    "Demolition":          { tier: 1, parent: null },
  },
  Minor: {
    "Movement":            { tier: 1, parent: null },
    "General Actions":     { tier: 1, parent: null },
    "Horseback Riding":    { tier: 1, parent: null },
    "Swimming":            { tier: 1, parent: null },
    "Authority":           { tier: 1, parent: null },
    "Piety":               { tier: 1, parent: null },
    "Mentoring":           { tier: 1, parent: null },
    "Arts":                { tier: 1, parent: null },
  }
};

// Combat chains for visual layout (chain rows then standalone rows)
const COMBAT_CHAINS = [
  ["Cavalry", "Knight", "Lancer"],
  ["Militia", "Spearman", "Guard"],
  ["Footman", "Swordsman", "Huscarl"],
  ["Thrower", "Archer", "Ranger"],
  ["Assaulter", "Vanguard", "Berserker"],
];
const COMBAT_STANDALONES = ["Unit and Formation", "Equipment Maintain", "Battle Survival", "Demolition"];

// Crafting chains for visual layout
const CRAFTING_CHAINS = [
  ["Artisan", "Construction", "Masonry", "Architecture"],
  ["Mining", "Materials Processing", "Precious Prospecting", "Jewelry"],
  ["Forestry", "Carpentry", "Bowcraft", "Warfare Engineering"],
  ["Kilning", "Forging", "Weaponsmithing", "Armorsmithing"],
  ["Household", "Farming", "Cooking", "Tailoring"],
  ["Gathering", "Herbalism", "Healing", "Alchemy"],
  ["Hunting", "Procuration", "Animal Lore", "Warhorse Training"],
];

// ============================================================
// SKILL DETAILS: unlocks at each level threshold
// ============================================================
const SKILL_DETAILS = {
  "Artisan": {
    0:   { actions: ["Raise/Lower Ground Level","Pour on the Ground","Create a Primitive Tool","Make a Snowball","Deconstruct"], items: ["Primitive Sickle","Primitive Shovel","Primitive Axe","Primitive Pickaxe","Primitive Knife","Sling","Fishing Pole","Mortar and Pestle","Plant Fiber","Bark Box","Snowball","Snare"], recipes: [] },
    30:  { actions: ["Use shovel to Flat Downward Slope","Use shovel to Flat Ground","Use shovel to Flat Upward Slope"], items: [], recipes: [] },
    60:  { actions: ["Terraforming actions speed 20% faster"], items: [], recipes: [] },
    90:  { actions: ["Can find rare minerals in the ground (1%)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Increased base chance of finding rare minerals (1.5%)"], items: [], recipes: [] },
  },
  "Construction": {
    0:   { actions: ["Build Stone Road","Build Simple Construction","Repair"], items: [], recipes: [] },
    30:  { actions: ["Build Slate Road"], items: ["Engineer's Outfit"], recipes: [] },
    60:  { actions: ["Build Marble Road"], items: [], recipes: [] },
    90:  { actions: ["Can construct a variety of complex objects"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Can construct a Wooden Pillar with a Shield"], items: [], recipes: [] },
  },
  "Masonry": {
    0:   { actions: ["Build Construction"], items: [], recipes: [] },
    30:  { actions: ["Can build stone fortifications and a warehouse"], items: [], recipes: [] },
    60:  { actions: ["Can build advanced wooden and stone constructions"], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Can set up flags"], items: [], recipes: [] },
  },
  "Architecture": {
    0:   { actions: ["Build Complex Construction","Castle Wall","Local Trading Post"], items: [], recipes: [] },
    30:  { actions: ["All castle wall variants","Towers","3-story houses (27 recipes)"], items: [], recipes: [] },
    60:  { actions: ["Castle Tower Angle","Gatehouses","Drawbridge Platform","St. Jorvik's Church"], items: [], recipes: [] },
    90:  { actions: ["Castle Keep","Large Houses"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Fountain"], items: [], recipes: [] },
  },
  "Mining": {
    0:   { actions: ["Look for Copper Deposits","Dig a Tunnel (Up/Forward/Down)","Collapse","Mine Copper Ore"], items: [], recipes: [] },
    30:  { actions: ["Look for Iron Deposits","Mine Iron Ore"], items: [], recipes: [] },
    60:  { actions: ["Can find raw gems in ore (2% chance)","Mine Gold & Silver Ore","Reinforce mine walls","Mine Silver Ore","Mine Gold"], items: [], recipes: [] },
    90:  { actions: ["Can find rare mineral ingredients in ore (1% chance)","Harden mine walls with supporting beams","Construct Supporting Column"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Increased gem chance (2.5%) and rare mineral chance (1.5%)","Produced beams more durable"], items: [], recipes: [] },
  },
  "Materials Processing": {
    0:   { actions: ["Shape","Shape Stones"], items: [], recipes: ["Shaped Rock (Rock ×20)","Shaped Granite (Granite ×20)","Marble Plate (Marble ×20)"] },
    30:  { actions: ["Mold"], items: ["Stonecutter's Outfit"], recipes: ["Basic clay items"] },
    60:  { actions: ["Mix"], items: [], recipes: ["Unfired mortar"] },
    90:  { actions: ["Sculpt"], items: [], recipes: ["Pottery"] },
    100: { actions: ["Permanent +10 bonus to Luck","Materials Processing actions speed 20% faster"], items: [], recipes: [] },
  },
  "Precious Prospecting": {
    0:   { actions: ["Look for Silver Deposits","Wash Ore","Wash"], items: [], recipes: [] },
    30:  { actions: ["Look for Gold Deposits"], items: [], recipes: [] },
    60:  { actions: ["Hew","Can hew raw/rough gems to obtain semi-precious and precious gems"], items: [], recipes: [] },
    90:  { actions: ["Chance of successful hewing is doubled"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Increased probability of finding nuggets and successful hewing"], items: [], recipes: [] },
  },
  "Jewelry": {
    0:   { actions: ["Create Jewelry"], items: [], recipes: ["Simple Rings"] },
    30:  { actions: ["Repair Jewelry"], items: [], recipes: ["Rings","Necklaces"] },
    60:  { actions: ["Can craft rings and necklaces with gems"], items: [], recipes: [] },
    90:  { actions: ["Can craft complex jewelry with multiple metals and gems","Can craft exceptional jewelry (+20% quality + creator's signature)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Better chance to craft exceptional jewelry"], items: [], recipes: [] },
  },
  "Forestry": {
    0:   { actions: ["Cut Down","Gather Bark/Sprout/Branch","Chop"], items: [], recipes: [] },
    30:  { actions: ["Plant Birch Tree","Uproot","Plant Spruce/Hazel Tree"], items: [], recipes: [] },
    60:  { actions: ["Plant Maple/Pine/Aspen/Apple/Mulberry Tree"], items: [], recipes: [] },
    90:  { actions: ["Plant Elm/Oak/Juniper Tree","Can find rare ingredients inside trees (1%)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Better quality sprouts","Rare ingredient chance 1.5%","Forestry actions speed 20% faster"], items: [], recipes: [] },
  },
  "Carpentry": {
    0:   { actions: ["Craft","Make Repair Kit","Create Furniture","Saw out Billet/Board/Building Log"], items: [], recipes: [] },
    30:  { actions: ["Use Workbench"], items: ["Carpenter's Outfit"], recipes: [] },
    60:  { actions: ["Can craft advanced furniture and wooden parts","Can craft large shields","Chance to invent heavy shield blueprint"], items: [], recipes: [] },
    90:  { actions: ["Can craft large furniture","Can craft horse carts","Can craft gates module","Can craft heavy shields from regional resources"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Can craft decorated furniture","Carpentry actions speed 20% faster"], items: [], recipes: [] },
  },
  "Bowcraft": {
    0:   { actions: ["Craft Archer's Gear"], items: [], recipes: [] },
    30:  { actions: ["Can craft regular bows and crossbows","Can craft dull arrows and bolts"], items: [], recipes: [] },
    60:  { actions: ["Can craft advanced bows and crossbows","Can craft advanced ammunition"], items: [], recipes: [] },
    90:  { actions: ["Can craft composite bow and heavy crossbow","Chance to create exceptional bows/crossbows (+20% quality + signature)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Slightly better chance for exceptional bows/crossbows","Can craft firework ammunition"], items: [], recipes: [] },
  },
  "Warfare Engineering": {
    0:   { actions: ["Make Naphtha Ammo","Prepare Warfare Gear"], items: [], recipes: ["Small Warfare Kits"] },
    30:  { actions: ["Create Warfare Construction"], items: [], recipes: ["Medium Warfare Kits","Siege Ladder Kits"] },
    60:  { actions: ["Build a Trebuchet","Craft Naphtha Barrels (trebuchet ammo)"], items: [], recipes: ["Large Warfare Kits"] },
    90:  { actions: ["Build a Tent (spawn point during Judgement Hour)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Build a Decorated Tent (Judgement Hour spawn)","Warfare Engineering actions speed 20% faster"], items: [], recipes: [] },
  },
  "Kilning": {
    0:   { actions: ["Use Kiln Bellows","Manage Kiln","Pull Out of the Kiln"], items: [], recipes: [] },
    30:  { actions: ["Glassblowing"], items: [], recipes: [] },
    60:  { actions: ["Can make glass bottles","Can craft a load of items at once"], items: [], recipes: [] },
    90:  { actions: ["Can make alchemical glassware"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Kilning actions speed 20% faster"], items: [], recipes: [] },
  },
  "Forging": {
    0:   { actions: ["Forge Metal Tools","Manage Furnace","Smelt","Use Furnace Bellows"], items: [], recipes: [] },
    30:  { actions: ["Can smelt ingots from iron and copper","Can forge metal tools and parts"], items: ["Blacksmith's Outfit"], recipes: [] },
    60:  { actions: ["Can smelt steel","Can smelt gold/silver bars","Can forge advanced tools from metal","Can melt down metals with Rocksalt and Brimstone"], items: [], recipes: [] },
    90:  { actions: ["Can melt down (recycle) metal tools, weapons, and armor","Can smelt Vostascus steel"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Forging actions speed 20% faster","Waste less materials recycling metal items"], items: [], recipes: [] },
  },
  "Weaponsmithing": {
    0:   { actions: ["Forge Weapons"], items: [], recipes: [] },
    30:  { actions: [], items: [], recipes: [] },
    60:  { actions: ["Can forge advanced melee weapons and packs of throwing weapons"], items: [], recipes: [] },
    90:  { actions: ["Chance to create exceptional weapons (+20% quality + creator's signature)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","20% chance to reduce Weaponsmithing action duration","Slightly better chance for exceptional melee weapons"], items: [], recipes: [] },
  },
  "Armorsmithing": {
    0:   { actions: ["Forge Armor Parts"], items: [], recipes: [] },
    30:  { actions: ["Make Armor"], items: [], recipes: [] },
    60:  { actions: ["Can craft regular armor","Chance to invent heavy armor blueprint"], items: [], recipes: [] },
    90:  { actions: ["Can craft heavy armor","Can craft armor for horses","Chance to invent royal armor blueprint","Chance to create exceptional armor (+20% quality + signature)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","20% chance to reduce Armorsmithing action duration","Better chance for exceptional armor","Can craft royal armor"], items: [], recipes: [] },
  },
  "Household": {
    0:   { actions: ["Grind Grain","Create a Campfire","Add Fuel","Cook with Pot","Prepare","Cook"], items: [], recipes: [] },
    30:  { actions: ["Weave"], items: [], recipes: [] },
    60:  { actions: ["Extract Honey"], items: [], recipes: [] },
    90:  { actions: ["Extract Silk Filaments","Run/Stop Millstones"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Household abilities speed 20% faster"], items: [], recipes: [] },
  },
  "Farming": {
    0:   { actions: ["Use Shovel to plow","Sow Wild Barley/Rye/Cabbage/Carrots/Flax/Onion/Peas/Potatoes/Wheat/Oat","Plow with Plough","Harvest Crops","Pour Water"], items: ["Cook's Outfit"], recipes: [] },
    30:  { actions: ["Sow Peas/Cabbage/Onions/Carrots/Potatoes","Sow Wild Grapes","Press"], items: ["Cook's Outfit"], recipes: [] },
    60:  { actions: ["Sow Barley/Wheat/Rye/Oat"], items: [], recipes: [] },
    90:  { actions: ["Sow Grapes","Sow Flax","Fertilize"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Farming abilities speed 20% faster"], items: [], recipes: [] },
  },
  "Cooking": {
    0:   { actions: ["Bake","Cook"], items: [], recipes: [] },
    30:  { actions: ["Brew","Cool Down","Crush Fruits","Warm Up","Extract Beverage"], items: [], recipes: [] },
    60:  { actions: ["Flavour","4-ingredient recipes"], items: [], recipes: [] },
    90:  { actions: ["5-ingredient recipes"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Cooking abilities speed 20% faster","Exceptional Alcohol","Duration Cooldown 20%","+20% Quality","Creator's Signature"], items: [], recipes: [] },
  },
  "Tailoring": {
    0:   { actions: ["Use Loom","Use Spinning Wheel","Sew"], items: [], recipes: ["Simple clothes"] },
    30:  { actions: ["Sew Armor"], items: [], recipes: [] },
    60:  { actions: [], items: [], recipes: [] },
    90:  { actions: ["Chance to create exceptional armor (+20% quality + creator's signature)"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Tailoring abilities speed 20% faster","Better chance for exceptional armor"], items: [], recipes: [] },
  },
  "Gathering": {
    0:   { actions: ["Gather Throwing Stones/Berries/Wild Plants/Flint Stone/Edibles/Materials/Branches/Apples/Nuts"], items: [], recipes: [] },
    30:  { actions: ["Gather Herbs","Look For Herbs"], items: [], recipes: [] },
    60:  { actions: ["Gather Silkworm Cocoons"], items: [], recipes: [] },
    90:  { actions: ["Can gather Pristine Herbs"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Increased chance to gather higher quality herbs"], items: [], recipes: [] },
  },
  "Herbalism": {
    0:   { actions: ["Mix a preparation","Single Effect","2-ingredient Max"], items: [], recipes: [] },
    30:  { actions: ["Single Effect","3-ingredient Max"], items: ["Herbalist's Outfit"], recipes: [] },
    60:  { actions: ["Harvest","Grow Herbs","Plant","Low Quality Naphtha flux and Flavour <60Q"], items: [], recipes: [] },
    90:  { actions: ["2x Effect","3-ingredient Max"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Herbalism abilities speed 20% faster","Stronger Magnitude","20% chance to reduce Gathering ability duration"], items: [], recipes: [] },
  },
  "Healing": {
    0:   { actions: ["Treat to Revive","Treat Wounds","Inspect Patient"], items: [], recipes: [] },
    30:  { actions: ["Treat Fractures"], items: [], recipes: [] },
    60:  { actions: ["Treat Severe Injuries"], items: [], recipes: [] },
    90:  { actions: ["Treat Anywhere on Body"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","20% chance to reduce Healing ability duration","Awaken"], items: [], recipes: [] },
  },
  "Alchemy": {
    0:   { actions: ["Mix a Cocktail","Max 2 Effects","3-ingredient Max"], items: [], recipes: [] },
    30:  { actions: ["2x effect cocktails","3 ingredients + 1 Catalyst"], items: [], recipes: [] },
    60:  { actions: ["Craft High-Quality Naphtha","Craft Flavour >60Q"], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck","Stronger magnitude of alchemical effects","20% chance to reduce Alchemy ability duration","Transmute into Vostaskus"], items: [], recipes: [] },
  },
  "Hunting": {
    0:   { actions: ["Fish","Skin","Look for Tracks of Peaceful Animals","Slaughter!"], items: [], recipes: [] },
    30:  { actions: ["Can set up snare traps","Check/Set/Pick up a Snare"], items: [], recipes: [] },
    60:  { actions: ["Can track aggressive animals","Can set up animal traps","Pick up/Set a Trap","Look for Tracks of Aggressive Animals"], items: [], recipes: [] },
    90:  { actions: ["Can gather alchemical ingredients from animal carcasses"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck while hunting/fishing","Luck affects probability of catching fish and reducing hunting/fishing duration by 20%"], items: [], recipes: [] },
  },
  "Procuration": {
    0:   { actions: ["Create Bone Glue","Use Tanning Tub","Pick Up"], items: [], recipes: [] },
    30:  { actions: ["Dry a Hide","Pick up a Hide"], items: ["Breeder's Outfit"], recipes: [] },
    60:  { actions: ["Can use tanning tub to tan leather"], items: [], recipes: [] },
    90:  { actions: ["Use Big Tanning Tub"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck during Procuration","20% chance to reduce Procuration ability duration"], items: [], recipes: [] },
  },
  "Animal Lore": {
    0:   { actions: ["Manage","Harvest","Clean","Slaughter"], items: [], recipes: [] },
    30:  { actions: ["Tame"], items: [], recipes: [] },
    60:  { actions: [], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck while taming","Luck affects probability of successful taming"], items: [], recipes: [] },
  },
  "Warhorse Training": {
    0:   { actions: ["Finish Training","Train Warhorse"], items: [], recipes: [] },
    30:  { actions: ["Can train a hardy warhorse from a regular warhorse"], items: [], recipes: [] },
    60:  { actions: ["Armor Horse"], items: [], recipes: [] },
    90:  { actions: ["Can train a spirited warhorse from a regular horse with quality higher than 90"], items: [], recipes: [] },
    100: { actions: ["Can train a royal warhorse from a heavy warhorse of 100 quality","Permanent +10 bonus to Luck during horse training","20% chance to reduce training time"], items: [], recipes: [] },
  },

  // ── COMBAT ──────────────────────────────────────────────
  "Cavalry": {
    0:   { actions: ["Makes usage of one-handed weapons while mounted possible"], items: ["Practice Bastard"], recipes: [] },
    30:  { actions: [], items: ["Light Chainmail Helm","Light Chainmail Tunic","Light Chainmail Vambraces","Light Chainmail Gauntlets","Light Chainmail Leggings","Light Chainmail Greaves","Reinforced Light Chainmail (full set)","Masterwork Light Chainmail (full set)","Big Falchion","Sharpened Big Falchion","Perfect Big Falchion"], recipes: [] },
    60:  { actions: [], items: ["Bastard Sword","Sharpened Bastard Sword","Perfect Bastard Sword"], recipes: [] },
    90:  { actions: ["Lower chance of falling out of the saddle in battle"], items: [], recipes: [] },
    100: { actions: ["Unlocks a trick move with hand-and-a-half sword"], items: [], recipes: [] },
  },
  "Knight": {
    0:   { actions: [], items: ["Knight Sword","Sharpened Knight Sword","Perfect Knight Sword","Regular Chainmail (full set)","Reinforced Regular Chainmail (full set)","Masterwork Regular Chainmail (full set)"], recipes: [] },
    30:  { actions: [], items: [], recipes: [] },
    60:  { actions: ["Required to ride spirited and hardy warhorses","Chance that enemy pikes will slide off without harming horse/rider"], items: ["Heavy Heater Shield"], recipes: [] },
    90:  { actions: ["Unlocks 'Iron Grip' — immune to falling out of saddle for a short period"], items: [], recipes: [] },
    100: { actions: ["Unlocks a trick move with a knight sword"], items: [], recipes: [] },
  },
  "Lancer": {
    0:   { actions: [], items: ["Jousting Lance","Sharpened Jousting Lance","Perfect Jousting Lance"], recipes: [] },
    30:  { actions: [], items: ["Heavy Chainmail (full set)","Reinforced Heavy Chainmail (full set)","Masterwork Heavy Chainmail (full set)"], recipes: [] },
    60:  { actions: [], items: ["Lance","Sharpened Lance","Perfect Lance","Heavy Warhorses","Better Aim with Lance"], recipes: [] },
    90:  { actions: ["Longer couching when using any lance","Unstoppable — heavy horse galloping 5+ sec becomes impervious (except Wall of Pikes/Defensive Fence)","Can knock down multiple players without losing speed"], items: ["Royal Chainmail (full set)","Reinforced Royal Chainmail (full set)","Masterwork Royal Chainmail (full set)","Decorated Jousting Lance variants"], recipes: [] },
    100: { actions: ["Required to ride royal warhorses","Blesses heavy/royal warhorses — earth rumbles near them when galloping"], items: [], recipes: [] },
  },
  "Militia": {
    0:   { actions: [], items: ["Primitive Knife","Sickle","Primitive Shovel","Staff variants","Balanced Staff variants","Cooking Pot","Fishing Pole","Believer's tools (Knife/Hatchet/Saw/Sickle/etc.)","Knools Sickle","Knools Pickaxe"], recipes: [] },
    30:  { actions: [], items: ["Novice Padded (full set)","Reinforced Novice Padded (full set)","Masterwork Novice Padded (full set)","Pitchfork","Sharpened Pitchfork","Perfect Pitchfork"], recipes: [] },
    60:  { actions: ["Chance to cause knockdown with unarmed blow to the head","Unlocks a Special Attack after stunning your opponent"], items: ["War Scythe","Sharpened War Scythe","Perfect War Scythe"], recipes: [] },
    90:  { actions: ["Chance to disarm opponent after successful parry against a pole weapon","Unlocks a Special Attack after a successful parry"], items: [], recipes: [] },
    100: { actions: ["Unlocks a trick move when unarmed or with a militia weapon"], items: [], recipes: [] },
  },
  "Spearman": {
    0:   { actions: [], items: ["Spear","Sharpened Spear","Perfect Spear"], recipes: [] },
    30:  { actions: ["Thrusting with a pike makes you immobile for the duration of the attack"], items: ["Awl Pike variants","Short Pike variants","Regular Padded (full set)","Reinforced Regular Padded (full set)","Masterwork Regular Padded (full set)"], recipes: [] },
    60:  { actions: [], items: ["Boar Spear variants","Bec de Corbin variants","Medium Pike variants"], recipes: [] },
    90:  { actions: ["Required to use spears and shields simultaneously (except Bec de Corbin)","Unlocks a Special Attack on a knocked down person"], items: ["Long Pike variants"], recipes: [] },
    100: { actions: ["Unlocks a trick move with spears and pikes"], items: [], recipes: [] },
  },
  "Guard": {
    0:   { actions: [], items: ["Glaive","Sharpened Glaive","Perfect Glaive"], recipes: [] },
    30:  { actions: [], items: ["Partisan variants","Heavy Padded (full set)","Reinforced Heavy Padded (full set)","Masterwork Heavy Padded (full set)"], recipes: [] },
    60:  { actions: ["Unlocks a Special Attack after a successful parry","Unlocks a Special Attack after hitting a horse"], items: ["Pollaxe variants","Guisarme variants"], recipes: [] },
    90:  { actions: ["Chance to throw rider off saddle with an overhead attack"], items: ["Royal Padded (full set)","Reinforced Royal Padded (full set)","Masterwork Royal Padded (full set)"], recipes: [] },
    100: { actions: ["Unlocks a trick move with pole weapons"], items: [], recipes: [] },
  },
  "Footman": {
    0:   { actions: [], items: ["Blacksmith's Hammer","Primitive Hammer","Practice Axe","Mallet","Primitive Axe","Hatchet","Primitive Shield","Knool's Axe"], recipes: [] },
    30:  { actions: [], items: ["War Axe variants","Light Scale (full set)","Reinforced Light Scale (full set)","Masterwork Light Scale (full set)"], recipes: [] },
    60:  { actions: ["Skullsplitter! combo (right slash–overhead–left slash)","Power Strike effect with the last hit deals guaranteed fracture","Power Strike is an unblockable hit"], items: ["Nordic Axe variants","Targe Shield"], recipes: [] },
    90:  { actions: ["Knock-Knock! combo (overhead×3)","Deals triple damage to a shield with the last attack"], items: ["Battle Axe variants"], recipes: [] },
    100: { actions: ["Unlocks a trick move with one-handed axes"], items: [], recipes: [] },
  },
  "Swordsman": {
    0:   { actions: [], items: ["Practice Sword"], recipes: [] },
    30:  { actions: ["Unlocks a Special Attack after a successful block"], items: ["Light Saber variants","Scimitar variants","Heater Shield","Regular Scale (full set)","Reinforced Regular Scale (full set)","Masterwork Regular Scale (full set)"], recipes: [] },
    60:  { actions: ["Unlocks 'Shield Bash' attack","Unlocks 'Flurry of Blows!' combo","Unlocks Special Attack after successful block","Unlocks Special Attack on a knocked down person"], items: ["Nordic Sword variants","Gross Messer variants","Kite Shield","Small Kite Shield"], recipes: [] },
    90:  { actions: ["Required to sprint while covering behind shield","Unlocks 'Thousand Cuts!' combo","Unlocks Special Attack after drawing weapon from belt"], items: ["Falchion variants","Heavy Targe Shield","Heavy Kite Shield","Heavy Iron Shield"], recipes: [] },
    100: { actions: ["Unlocks a trick move with one-handed swords"], items: [], recipes: [] },
  },
  "Huscarl": {
    0:   { actions: [], items: ["Cudgel","Sharpened Cudgel","Perfect Cudgel"], recipes: [] },
    30:  { actions: ["Unlocks a Special Attack after a successful parry"], items: ["Flanged Mace","Iron Round Shield","Heavy Scale (full set)","Reinforced Heavy Scale (full set)","Masterwork Heavy Scale (full set)"], recipes: [] },
    60:  { actions: ["Point of Vulnerability! combo (overhead–left slash–right slash)","Chance to knock down opponent with the last hit","Unlocks a Special Attack after stunning your opponent"], items: ["War Pick variants","Tower Shield"], recipes: [] },
    90:  { actions: ["Another Hole! combo (overhead–swing–overhead)","Guaranteed fracture to your opponent with the last hit"], items: ["Morning Star","Royal Scale (full set)","Reinforced Royal Scale (full set)","Masterwork Royal Scale (full set)"], recipes: [] },
    100: { actions: ["Unlocks a trick move with one-handed maces and piercing weapons"], items: [], recipes: [] },
  },
  "Thrower": {
    0:   { actions: [], items: ["Simple Bow","Snowball","Throwing Knife","Stones","Wooden Arrow","Gloom's Bomb"], recipes: [] },
    30:  { actions: [], items: ["Throwing Axe","Novice Leather (full set)","Reinforced Novice Leather (full set)","Masterwork Novice Leather (full set)"], recipes: [] },
    60:  { actions: [], items: ["Javelin"], recipes: [] },
    90:  { actions: [], items: ["Naphtha Pot"], recipes: [] },
    100: { actions: [], items: ["Firework Pot"], recipes: [] },
  },
  "Archer": {
    0:   { actions: ["Use Arrow Stand"], items: ["Light Crossbow","Wooden Bolt","Arrow","Bolt"], recipes: [] },
    30:  { actions: ["Increases reloading speed and gives better aiming when using ranged weapons"], items: ["Shortbow","Dull Arrow","Dull Bolt","Regular Leather (full set)","Reinforced Regular Leather (full set)","Masterwork Regular Leather (full set)"], recipes: [] },
    60:  { actions: ["Unlocks ability to place Arrow Stand (shortens reload time)","Unlocks 'Stopping Power' — next crossbow shot stuns enemy for 1 second"], items: ["Composite Bow"], recipes: [] },
    90:  { actions: ["Unlocks 'Arrow to the Knee!' — next arrow slows enemy by 10% (50% if hits leg)"], items: [], recipes: [] },
    100: { actions: [], items: ["Firework Arrow"], recipes: [] },
  },
  "Ranger": {
    0:   { actions: [], items: ["Arbalest","Broadhead Arrow"], recipes: [] },
    30:  { actions: ["Use Pavise"], items: ["Heavy Leather (full set)","Reinforced Heavy Leather (full set)","Masterwork Heavy Leather (full set)"], recipes: [] },
    60:  { actions: ["Create Defensive Fence","Piercing Bolt"], items: ["Longbow","Firearrow"], recipes: [] },
    90:  { actions: ["Volley"], items: ["Heavy Crossbow","Pavise","Royal Leather (full set)","Reinforced Royal Leather (full set)","Masterwork Royal Leather (full set)"], recipes: [] },
    100: { actions: [], items: ["Firework Bolt"], recipes: [] },
  },
  "Assaulter": {
    0:   { actions: [], items: ["Primitive Pickaxe","Pickaxe","Hardened Steel Pickaxe","Practice Longsword","Believer's Pickaxe"], recipes: [] },
    30:  { actions: ["Unlocks a Special Attack after a successful parry"], items: ["Claymore variants","Estoc variants","Iron Plate (full set)","Reinforced Iron Plate (full set)","Masterwork Iron Plate (full set)"], recipes: [] },
    60:  { actions: ["Power Overwhelming! combo (right swing–left swing–thrust)","Power Strike effect with the last hit","Unlocks a Special Attack after a successful parry"], items: ["Zweihaender variants"], recipes: [] },
    90:  { actions: ["Dismember! combo (right–left–right or left–right–left with two-handed/hand-and-a-half sword)","Chance to knock down opponent with the last hit","Unlocks a Special Attack after drawing weapon from back"], items: ["Flamberge variants","Knool's Chieftain Sword"], recipes: [] },
    100: { actions: ["Unlocks a trick move with two-handed swords"], items: [], recipes: [] },
  },
  "Vanguard": {
    0:   { actions: [], items: ["Practice Great Axe","Practice Maul"], recipes: [] },
    30:  { actions: ["Unlocks a Special Attack on a knocked down person","Unlocks a Special Attack after stunning your opponent"], items: ["Bardiche variants","Half Plate (full set)","Reinforced Half Plate (full set)","Masterwork Half Plate (full set)"], recipes: [] },
    60:  { actions: ["Unlocks Pounce attack — chance to knock down opponent behind a shield","Unlocks 'Execution!' combo (left–right–overhead with two-handed axe)","Unlocks 'Crunchy!' combo (left–right–right or right–left–left)"], items: ["Sledge Hammer variants","Maul variants","Knool's Bear Axe"], recipes: [] },
    90:  { actions: ["Unlocks 'Kneel before me!' combo — chance to knock down opponent","Unlocks a Special Attack after a successful parry"], items: ["Broad Axe variants"], recipes: [] },
    100: { actions: ["Unlocks a trick move with two-handed axes and maces"], items: [], recipes: [] },
  },
  "Berserker": {
    0:   { actions: ["Taunt — increases your Strength for a short period after shouting at your enemy"], items: [], recipes: [] },
    30:  { actions: ["Coward! — gives speed boost to targeted enemy but also a chance to stumble; gives trembling hands (reduces ranged accuracy)"], items: ["Full Plate (full set)","Reinforced Full Plate (full set)","Masterwork Full Plate (full set)"], recipes: [] },
    60:  { actions: ["Arghhhh! — chance to remove all slowing and poisoning effects from yourself"], items: [], recipes: [] },
    90:  { actions: ["You are Mine! — makes targeted enemy more vulnerable and increases your speed"], items: ["Royal Full Plate (full set)","Reinforced Royal Full Plate (full set)","Masterwork Royal Full Plate (full set)"], recipes: [] },
    100: { actions: ["Proper Taunt — performs a taunt with animation"], items: [], recipes: [] },
  },
  "Unit and Formation": {
    0:   { actions: ["Invite to Unit","Wall/Wedge/Circle Formation","Kick from Unit","Leave Unit","Transfer Leadership"], items: [], recipes: [] },
    30:  { actions: ["Hold Your Ground — increases defense, decreases speed of all unit members"], items: [], recipes: [] },
    60:  { actions: ["Charge! — increases damage dealt by unit members for 20 seconds","Can receive maximum bonus from orders and formations"], items: [], recipes: [] },
    90:  { actions: ["Move! — provides movement bonus to all unit members in range"], items: [], recipes: [] },
    100: { actions: ["Formation zone color is visually distinct"], items: [], recipes: [] },
  },
  "Equipment Maintain": {
    0:   { actions: ["Maintain Equipment","Repair Equipment"], items: [], recipes: [] },
    30:  { actions: ["Can perform maintenance actions on armor and shields"], items: [], recipes: [] },
    60:  { actions: ["Chance to recover projectiles (20%)"], items: [], recipes: [] },
    90:  { actions: ["Apply a Poison","Can coat blades of equipped one-handed weapons with poison"], items: [], recipes: [] },
    100: { actions: ["Chance to recover projectiles (22%)"], items: [], recipes: [] },
  },
  "Battle Survival": {
    0:   { actions: ["Treat Bleeding","Treat Patient"], items: [], recipes: [] },
    30:  { actions: ["Can bandage torso bleeding wounds"], items: [], recipes: [] },
    60:  { actions: ["5% chance to double fatal Hard HP damage transformed into Soft HP (affected by Luck)"], items: [], recipes: [] },
    90:  { actions: ["Can bandage wounds on the head","10% chance to double fatal Hard HP → Soft HP (affected by Luck)"], items: [], recipes: [] },
    100: { actions: ["11% chance to double fatal Hard HP → Soft HP (affected by Luck)"], items: [], recipes: [] },
  },
  "Demolition": {
    0:   { actions: ["Wreck","Create Stone Ammo","Light/Extinguish Wick"], items: ["Torch","Siege Torch"], recipes: [] },
    30:  { actions: ["Can use Siege Torch"], items: [], recipes: [] },
    60:  { actions: ["Manage Trebuchet","Fire","Rotate Trebuchet"], items: [], recipes: [] },
    90:  { actions: ["Torch and Siege Torch deal more damage"], items: [], recipes: [] },
    100: { actions: ["Can shoot with cows (just for fun)"], items: [], recipes: [] },
  },

  // ── MINOR ───────────────────────────────────────────────
  "Movement": {
    0:   { actions: ["Lift Object","Drop Object","Move"], items: [], recipes: [] },
    30:  { actions: [], items: [], recipes: [] },
    60:  { actions: [], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: [], items: [], recipes: [] },
  },
  "Horseback Riding": {
    0:   { actions: ["Get Off","Get On","Hide","Leave Horse","Get Horse","Refresh Horse","Release"], items: [], recipes: [] },
    30:  { actions: [], items: [], recipes: [] },
    60:  { actions: [], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: [], items: [], recipes: [] },
  },
  "Swimming": {
    0:   { actions: [], items: [], recipes: [] },
    30:  { actions: [], items: [], recipes: [] },
    60:  { actions: [], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: [], items: [], recipes: [] },
  },
  "Mentoring": {
    0:   { actions: ["Attend this School","Become a Mentor of this School"], items: [], recipes: [] },
    30:  { actions: ["Can mentor tier 2 and secondary skills"], items: [], recipes: [] },
    60:  { actions: ["Can mentor tier 3 skills"], items: [], recipes: [] },
    90:  { actions: ["Can mentor all skills"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck during mentoring","Luck affects probability of teaching a bonus amount of skill"], items: [], recipes: [] },
  },
  "Piety": {
    0:   { actions: ["Pray"], items: ["Makthird's Outfit","Archimankur's Outfit","Pilgrim Outfit"], recipes: [] },
    30:  { actions: ["Can set up an altar"], items: [], recipes: [] },
    60:  { actions: ["Can perform ritual in temple"], items: ["Monk's Outfit"], recipes: [] },
    90:  { actions: ["Can bless a temple or a sanctuary"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck during prayer","Luck affects probability of successful prayer"], items: [], recipes: [] },
  },
  "Authority": {
    0:   { actions: ["Initiate Holy Judgement","Destroy","Sacrifice","Rename","Increase the Fief","Initiate Protective Judgement","Trade","Remote Outposts Support","Claim Remove","Build/Manage the Monument","Expel the Intruders","Worship","Invite to Guild","Build/Upgrade Building","Claim Private Land","Declare Battle/Lesser Battle","Barter","Manage Object Rights","Claim/Build/Rule Outpost","Enslave"], items: [], recipes: [] },
    30:  { actions: [], items: [], recipes: [] },
    60:  { actions: [], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: [], items: [], recipes: [] },
  },
  "Arts": {
    0:   { actions: ["Can paint small paintings","Create Decorations","Sacrifice Experience"], items: [], recipes: [] },
    30:  { actions: ["Can make a Deer trophy"], items: [], recipes: [] },
    60:  { actions: ["Can paint paintings","Can make a Moose trophy"], items: [], recipes: [] },
    90:  { actions: ["Can paint big paintings","Can make a Bear trophy"], items: [], recipes: [] },
    100: { actions: ["Permanent +10 bonus to Luck while creating works of art","20% chance to reduce ability duration"], items: [], recipes: [] },
  },
  "General Actions": {
    0:   { actions: ["Drink","Eat","Rest","Sit","Get Up","Loot","Repair","Open/Close Doors & Gates","Equip","Look in Inventory/Bag","Follow/Unfollow","Harness/Unharness","Set Fire","Interact","Bind to Longhouse","Various emotes (Dance/Honor/etc.)","IB Enlistment"], items: ["Basic Rings","Basic Amulets","Novice Tunic","Novice Leather Armor"], recipes: [] },
    30:  { actions: [], items: [], recipes: [] },
    60:  { actions: [], items: [], recipes: [] },
    90:  { actions: [], items: [], recipes: [] },
    100: { actions: [], items: [], recipes: [] },
  },
};

// ============================================================
// XP MULTIPLIERS — ExpToSkillMult values confirmed from skill_types.xml
// (extracted from staticData.dlpack, cross-checked 2026-05-24)
// Base rate calibration: ~10,000 XP/hr → T1 skill 0→90 ≈ 63h, T4 0→100 ≈ 400h
// (consistent with 6-month seasonal design; actual times vary with food quality,
//  premium subscription, new-player 75% bonus first 14 days, and server rates)
// ============================================================
const EXP_MULTIPLIERS = {
  // Crafting — confirmed from skill_types.xml (ExpToSkillMult)
  "Artisan": 1, "Mining": 1, "Forestry": 1, "Gathering": 1,
  "Kilning": 1, "Household": 1, "Hunting": 1,
  "Construction": 2, "Carpentry": 2, "Farming": 2,
  "Materials Processing": 2, "Forging": 2, "Herbalism": 2, "Procuration": 2,
  "Masonry": 3, "Bowcraft": 3, "Weaponsmithing": 3,
  "Cooking": 3, "Healing": 3, "Animal Lore": 3, "Precious Prospecting": 3,
  "Architecture": 5, "Warfare Engineering": 5, "Armorsmithing": 5,
  "Tailoring": 5, "Alchemy": 5, "Jewelry": 5, "Warhorse Training": 5,
  // Combat — confirmed from skill_types.xml (ExpToSkillMult)
  "Cavalry": 1, "Militia": 1, "Footman": 1, "Thrower": 1, "Assaulter": 1,
  "Knight": 2, "Spearman": 2, "Swordsman": 2, "Archer": 2, "Vanguard": 2,
  "Lancer": 5, "Guard": 5, "Huscarl": 5, "Ranger": 5, "Berserker": 5,
  "Unit and Formation": 3, "Equipment Maintain": 3, "Battle Survival": 3, "Demolition": 3,
  // Minor — confirmed from skill_types.xml (ExpToSkillMult)
  "Movement": 1, "General Actions": 1, "Arts": 1,
  "Horseback Riding": 1, "Swimming": 1,
  "Authority": 3, "Piety": 3, "Mentoring": 3,
};

// Brief descriptions for the info panel
const SKILL_DESCRIPTIONS = {
  "Artisan": "Can raise and lower terrain. Can create a camp and primitive tools.",
  "Construction": "Unlocks construction of roads and buildings.",
  "Masonry": "Unlocks stone fortifications and advanced constructions.",
  "Architecture": "Unlocks the most complex buildings including castles and churches.",
  "Mining": "Unlocks mining of ore deposits and tunnel digging.",
  "Materials Processing": "Unlocks shaping and molding of stone and clay materials.",
  "Precious Prospecting": "Unlocks silver/gold prospecting and gem hewing.",
  "Jewelry": "Unlocks crafting of rings, necklaces, and gem-set jewelry.",
  "Forestry": "Unlocks tree cutting, chopping, and eventually tree planting.",
  "Carpentry": "Unlocks crafting of wooden furniture, tools, and constructions.",
  "Bowcraft": "Unlocks crafting of bows, crossbows, and ammunition.",
  "Warfare Engineering": "Unlocks crafting of siege equipment and warfare constructions.",
  "Kilning": "Unlocks kiln operations for glass and ceramic production.",
  "Forging": "Unlocks smelting of metals and forging of metal tools.",
  "Weaponsmithing": "Unlocks crafting of metal weapons from simple to exceptional.",
  "Armorsmithing": "Unlocks crafting of metal armor from chainmail to royal plate.",
  "Household": "Unlocks basic cooking, weaving, and household production.",
  "Farming": "Unlocks plowing, sowing, and harvesting of crops.",
  "Cooking": "Unlocks advanced food preparation, brewing, and recipes.",
  "Tailoring": "Unlocks sewing of clothes and light armor from cloth and leather.",
  "Gathering": "Unlocks gathering of wild plants, herbs, and materials.",
  "Herbalism": "Unlocks mixing preparations and growing herbs for alchemy.",
  "Healing": "Unlocks medical treatment of wounds, fractures, and severe injuries.",
  "Alchemy": "Unlocks crafting of alchemical cocktails and advanced reagents.",
  "Hunting": "Unlocks fishing, tracking, skinning, and trapping.",
  "Procuration": "Unlocks hide processing, tanning, and leather production.",
  "Animal Lore": "Unlocks managing, harvesting, and taming of animals.",
  "Warhorse Training": "Unlocks training of warhorses from basic to royal quality.",
  "Cavalry": "Makes one-handed weapons usable while mounted. Unlocks mounted equipment.",
  "Knight": "Unlocks advanced mounted combat and heavy equipment.",
  "Lancer": "Unlocks lance combat and the ability to ride the most powerful warhorses.",
  "Militia": "Base melee skill. Unlocks militia weapons and basic combat techniques.",
  "Spearman": "Unlocks spears, pikes, and polearm combat techniques.",
  "Guard": "Unlocks advanced polearms and specialized anti-cavalry techniques.",
  "Footman": "Unlocks axe combat and progressively heavier scale armor.",
  "Swordsman": "Unlocks sword combat with shields, combos, and special attacks.",
  "Huscarl": "Unlocks mace and blunt weapon combat with devastating combos.",
  "Thrower": "Unlocks throwing weapons and basic ranged combat.",
  "Archer": "Unlocks bows, crossbows, and advanced ranged combat abilities.",
  "Ranger": "Unlocks the most powerful ranged weapons, Pavise, and Volley.",
  "Assaulter": "Unlocks two-handed sword combat with powerful combo attacks.",
  "Vanguard": "Unlocks two-handed axe and mace combat with crowd-control abilities.",
  "Berserker": "Unlocks taunts and psychological combat abilities for disruption.",
  "Unit and Formation": "Unlocks unit leadership, formations, and tactical commands.",
  "Equipment Maintain": "Unlocks equipment maintenance, repair, poison coating, and projectile recovery.",
  "Battle Survival": "Unlocks battlefield first aid and life-saving combat techniques.",
  "Demolition": "Unlocks wrecking, siege weapon operation, and fire-based combat.",
  "Movement": "Unlocks object lifting, dropping, and basic movement interactions.",
  "General Actions": "Unlocks all basic interactions: eating, resting, equipping, emotes.",
  "Horseback Riding": "Unlocks the ability to mount, ride, and manage horses.",
  "Swimming": "Governs swimming speed and duration in water.",
  "Authority": "Unlocks all claim and territory management actions.",
  "Piety": "Unlocks prayer, altar setup, temple rituals, and blessing.",
  "Mentoring": "Unlocks the ability to mentor other players in skills.",
  "Arts": "Unlocks painting, decoration crafting, and trophy making.",
};

// ============================================================
// PRESET BUILDS — clickable build templates
// skills: { skillName: targetLevel }  (cascade handles parents)
// ============================================================
const PRESET_BUILDS = {
  Crafting: [
    {
      id: 'blacksmith',
      name: 'Blacksmith',
      icon: '⚒',
      desc: 'Master of metal — forge weapons and armor from raw ore.',
      skills: { 'Kilning': 90, 'Forging': 90, 'Weaponsmithing': 60, 'Armorsmithing': 60 },
    },
    {
      id: 'builder',
      name: 'Master Builder',
      icon: '🏰',
      desc: 'Raise castles and infrastructure — the backbone of any settlement.',
      skills: { 'Artisan': 90, 'Construction': 90, 'Masonry': 60, 'Architecture': 60 },
    },
    {
      id: 'prospector',
      name: 'Prospector',
      icon: '⛏',
      desc: 'Dig deep for precious minerals and craft fine jewelry.',
      skills: { 'Mining': 90, 'Materials Processing': 60, 'Precious Prospecting': 60, 'Jewelry': 60 },
    },
    {
      id: 'homesteader',
      name: 'Homesteader',
      icon: '🌾',
      desc: 'Farm the land, feed your guild, and clothe your allies.',
      skills: { 'Household': 90, 'Farming': 90, 'Cooking': 60, 'Tailoring': 60 },
    },
    {
      id: 'woodsman',
      name: 'Woodsman',
      icon: '🌲',
      desc: 'Master of the forest — timber, bows, and livestock.',
      skills: { 'Forestry': 90, 'Carpentry': 60, 'Hunting': 90, 'Procuration': 60, 'Animal Lore': 60 },
    },
    {
      id: 'healer',
      name: 'Alchemist',
      icon: '⚗',
      desc: 'Herbalism, healing, and alchemy — keep your allies alive.',
      skills: { 'Gathering': 90, 'Herbalism': 90, 'Healing': 60, 'Alchemy': 60 },
    },
  ],
  Combat: [
    {
      id: 'swordsman',
      name: 'Huscarl',
      icon: '⚔',
      desc: 'Heavy infantry — sword, shield, and battlefield endurance.',
      skills: { 'Footman': 90, 'Swordsman': 90, 'Huscarl': 60, 'Equipment Maintain': 60, 'Battle Survival': 60 },
    },
    {
      id: 'ranger',
      name: 'Ranger',
      icon: '🏹',
      desc: 'Swift and deadly at range — archery and skirmishing.',
      skills: { 'Thrower': 90, 'Archer': 90, 'Ranger': 60, 'Battle Survival': 60 },
    },
    {
      id: 'knight',
      name: 'Knight',
      icon: '🐴',
      desc: 'Mounted shock trooper — charge, break lines, and withdraw.',
      skills: { 'Cavalry': 90, 'Knight': 90, 'Lancer': 60, 'Equipment Maintain': 60 },
    },
    {
      id: 'berserker',
      name: 'Berserker',
      icon: '🪓',
      desc: 'Relentless assault — break through any defense at close range.',
      skills: { 'Assaulter': 90, 'Vanguard': 90, 'Berserker': 60, 'Battle Survival': 60, 'Unit and Formation': 60 },
    },
  ],
  Minor: [
    {
      id: 'clergy',
      name: 'Clergy',
      icon: '✝',
      desc: 'Dedicate yourself to faith and community leadership.',
      skills: { 'Piety': 100, 'Authority': 90, 'Mentoring': 60 },
    },
    {
      id: 'horseman',
      name: 'Horseman',
      icon: '🐎',
      desc: 'Mount up — riding, mobility, and general field skills.',
      skills: { 'Horseback Riding': 100, 'Movement': 90, 'General Actions': 60 },
    },
  ],
};
