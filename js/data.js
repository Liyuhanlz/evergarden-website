// All the words and pictures the site shows. Edit this file to change content.
window.EG = (() => {
"use strict";

// ---------------------------------------------------------------------
//  About you
// ---------------------------------------------------------------------
const MAKER = {
  name: "Liyuhan Zhou",
  role: "B.S. Computer Science, Cal State Fullerton",
  bio: "Liyuhan Zhou is a Computer Science student at California State University, Fullerton, with an interest in game development. Her passion for computing began in high school, where she received a Senior Award from the Computer Science Department. After transferring from Santiago Canyon College, where she completed the Honors Program, she continued her studies at CSUF as an Honors student. Through her Senior Honors Project, she further explored game development, earning First Place at the Computer Science Annual Showcase and recognition as a finalist in the ECS Student Project Innovation Expo. She plans to pursue a career in game development and create innovative interactive experiences.",
  awards: [
    "First Place, Computer Science Annual Showcase",
    "Finalist, ECS Student Project Innovation Expo",
  ],
  links: [
    { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/liyuhan-zhou-48a53b338/" },
  ],
};

const ABSTRACT = {
  text: [
    "Virtual reality (VR) offers a level of engagement and physical interaction that traditional PC, console, and mobile games cannot replicate, allowing players to interact with objects much like they would in the real world. This creative project, Evergarden, explores how an immersive VR environment can enhance players' sense of relaxation while providing educational value for K-12 students who are unfamiliar with agriculture and food sources.",
    "Drawing on research about VR game satisfaction and agricultural education, as well as farming games such as Stardew Valley and Minecraft, Evergarden was developed in Unity using C# for Meta Quest 3. Players plant, water, and harvest crops and interact with farm animals, while interactive UI displays provide information about each crop and animal.",
    "The prototype demonstrates how hands-on VR farming can combine relaxing gameplay with informal learning about agriculture. This project highlights the potential of VR as a tool for experiential learning beyond entertainment.",
  ],
  keywords: ["virtual reality", "agricultural education", "experiential learning", "game design", "relaxation"],
};

// Farm icons cut from the generated icon sheet, in assets/art/icons/
// (sprout, watering-can, corn, barn, chicken-coop, cow, horse ... 43 in all)
const icon = (name) => `assets/art/icons/${name}.png`;
const ICONS = {
  sprout: icon("sprout"),
  wateringCan: icon("watering-can"),
  corn: icon("corn"),
  barn: icon("barn"),
  coop: icon("chicken-coop"),
  cat: "assets/art/cat-hang.webp",
  crate: icon("crate"),
};

// Menu order. `transition` names a function in transitions.js.
const PAGES = [
  { route: "game", label: "The game", icon: "sprout", color: "#7CC46B", transition: "sprout" },
  { route: "play", label: "How it plays", icon: "wateringCan", color: "#FFD66B", transition: "gentle" },
  { route: "facts", label: "Fun facts", icon: "corn", color: "#FFF9EC", transition: "gentle" },
  { route: "gallery", label: "Gallery", icon: "barn", color: "#B9E28C", transition: "gentle" },
  { route: "build", label: "Behind the build", icon: "coop", color: "#FFD66B", transition: "gentle" },
  { route: "maker", label: "Meet the maker", icon: "cat", color: "#7CC46B", transition: "gentle" },
  { route: "refs", label: "References", icon: "crate", color: "#FFF9EC", transition: "gentle" },
];

// APA 7 reference list, grouped for the References page. `html` may use <i>
// for titles; the URL is shown and linked separately.
const REFERENCES = [
  { group: "Tutorials", items: [
    { html: "Unity Unlocked. (2025, April 12). <i>How to make simple day/night cycle in Unity</i> [Video]. YouTube.", url: "https://www.youtube.com/watch?v=3M1W6cT98RM" },
    { html: "Valem Tutorials. (n.d.). <i>Home</i> [YouTube channel]. YouTube. Retrieved November 10, 2026, from", url: "https://www.youtube.com/@ValemTutorials", note: "Where I started learning VR game development." },
    { html: "Valem Tutorials. (2025, November 23). <i>How to make a VR game in Unity – Part 6: Ray and poke interactor</i> [Video]. YouTube.", url: "https://www.youtube.com/watch?v=rMaYhvgyi0U" },
  ] },
  { group: "3D models", items: [
    { html: "JustCreate. (2023). <i>Low poly farm pack lite</i> [3D models]. Unity Asset Store. Used for the tomatoes, watering can, trees, and crates.", url: "https://assetstore.unity.com/packages/3d/environments/industrial/low-poly-farm-pack-lite-188100" },
    { html: "Poly Ronin. (2025). <i>Low poly archaeological adventurer tools</i> [3D models]. Unity Asset Store. Used for the magnifying glass.", url: "https://assetstore.unity.com/packages/3d/props/tools/low-poly-archaeological-adventurer-tools-312995" },
    { html: "Quaternius. (n.d.-a). <i>Ultimate animated animal pack</i> [3D models]. Used for the farm animals.", url: "https://quaternius.com/packs/ultimateanimatedanimals.html" },
    { html: "Quaternius. (n.d.-b). <i>Ultimate animated character pack</i> [3D models]. Used for the NPCs.", url: "https://quaternius.com/packs/ultimatedanimatedcharacter.html" },
    { html: "Quaternius. (n.d.-c). <i>Ultimate crops pack</i> [3D models]. Used for the tomato and corn crops.", url: "https://quaternius.com/packs/ultimatecrops.html" },
    { html: "RetroStyle Games. (2026). <i>Low poly cow 3D model – Holstein dairy rigged animated HDRP</i> [3D model]. Unity Asset Store.", url: "https://assetstore.unity.com/packages/3d/characters/animals/mammals/low-poly-cow-3d-model-holstein-dairy-rigged-animated-hdrp-377614" },
    { html: "synistersyrup. (n.d.). <i>Chicken coop</i> [3D model]. Sketchfab. Licensed under CC BY 4.0 (http://creativecommons.org/licenses/by/4.0/).", url: "https://skfb.ly/6WLTL" },
  ] },
  { group: "Audio", items: [
    { html: "Into the Ambience. (2023, June 2). <i>Relax on the farm – Nature relaxation video</i> [Video]. YouTube. Used for background sounds.", url: "https://www.youtube.com/watch?v=ziM6AXAlf80" },
    { html: "Oh Happy Hen. (2023, June 26). <i>Volume up to hear some happy chicken sounds</i> [Video]. YouTube.", url: "https://www.youtube.com/shorts/dFZa2KZ4fG4" },
    { html: "ProSounds. (2021, June 17). <i>Goat – Sound effect | ProSounds</i> [Video]. YouTube.", url: "https://www.youtube.com/watch?v=1r4ArWJugvY" },
    { html: "Sounds of Nature. (2014, June 9). <i>Sheep sound</i> [Video]. YouTube.", url: "https://www.youtube.com/watch?v=x3c0JgZ59QQ" },
  ] },
  { group: "Farm facts", items: [
    { html: "Encyclopaedia Britannica. (n.d.). Broccoli. In <i>Encyclopaedia Britannica</i>. Retrieved October 4, 2026, from", url: "https://www.britannica.com/plant/broccoli" },
    { html: "Encyclopaedia Britannica. (n.d.). Carrot. In <i>Encyclopaedia Britannica</i>. Retrieved October 4, 2026, from", url: "https://www.britannica.com/plant/carrot" },
    { html: "Encyclopaedia Britannica. (n.d.). Cattle. In <i>Britannica for Students</i>. Retrieved October 4, 2026, from", url: "https://kids.britannica.com/students/article/cattle/273566" },
    { html: "Encyclopaedia Britannica. (n.d.). Cauliflower. In <i>Encyclopaedia Britannica</i>. Retrieved October 4, 2026, from", url: "https://www.britannica.com/plant/cauliflower" },
    { html: "Encyclopaedia Britannica. (n.d.). Chicken. In <i>Encyclopaedia Britannica</i>. Retrieved October 4, 2026, from", url: "https://www.britannica.com/animal/chicken" },
    { html: "Encyclopaedia Britannica. (n.d.). Corn. In <i>Encyclopaedia Britannica</i>. Retrieved October 4, 2026, from", url: "https://www.britannica.com/plant/corn-plant" },
    { html: "Encyclopaedia Britannica. (n.d.). Dairy industry. In <i>Britannica for Students</i>. Retrieved October 4, 2026, from", url: "https://kids.britannica.com/students/article/dairy-industry/273899" },
    { html: "Encyclopaedia Britannica. (n.d.). Goat. In <i>Britannica for Students</i>. Retrieved October 4, 2026, from", url: "https://kids.britannica.com/students/article/goat/274580" },
    { html: "Encyclopaedia Britannica. (n.d.). Horse. In <i>Britannica for Students</i>. Retrieved October 4, 2026, from", url: "https://kids.britannica.com/students/article/horse/274947" },
    { html: "Encyclopaedia Britannica. (n.d.). Sheep. In <i>Britannica for Students</i>. Retrieved October 4, 2026, from", url: "https://kids.britannica.com/students/article/sheep/277023" },
    { html: "Encyclopaedia Britannica. (n.d.). Tomato. In <i>Encyclopaedia Britannica</i>. Retrieved October 4, 2026, from", url: "https://www.britannica.com/plant/tomato" },
    { html: "Tong, C., Schuh, M., &amp; MacKenzie, J. (2024). <i>Growing tomatoes in home gardens</i>. University of Minnesota Extension.", url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-tomatoes" },
    { html: "University of Minnesota Extension. (n.d.). <i>Crop and field planning tools for vegetable farmers</i>. Retrieved October 4, 2026, from", url: "https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/crop-and-field-planning-tools-for-vegetable-farmers" },
    { html: "U.S. Department of Agriculture, Economic Research Service. (n.d.). <i>Dairy situation at a glance</i> [Data set].", url: "https://ers.usda.gov/sites/default/files/_laserfiche/DataFiles/48685/dairy-situation-glance.csv" },
  ] },
  { group: "AI tools", items: [
    { html: "Anthropic. (2026). <i>Claude</i> (Opus 5.5) [Large language model]. Used through Claude Code to vibe code this website.", url: "https://claude.ai/" },
    { html: "OpenAI. (2026). <i>ChatGPT</i> [Large language model]. Used to generate the in-game UI icons and the website icons.", url: "https://chatgpt.com/" },
  ] },
];

const STEPS = [
  ["Till", "farm-day", "Grab the <b>hoe</b> from the tool rack and swing it to turn grass into soil."],
  ["Plant", "seed-bag", "Choose seeds from your backpack and shake the <b>seed bag</b> over the tilled ground."],
  ["Water", "tutorial", "Tilt the <b>watering can</b> to pour. Every watered day, your crops grow a stage."],
  ["Harvest", "farm-dusk", "Pluck ripe <b>tomatoes and corn</b> one at a time, with a soft buzz in your hand for each."],
  ["Trade", "merchant-shop", "Sell your harvest to the <b>merchant</b> for gold, then buy seeds for tomorrow."],
  ["Animals", "barn-night", "Pet the <b>chickens, goats, sheep and horses</b>, collect eggs, and ring the <b>bell</b> to call everyone home."],
];

// What each Quest 3 controller button does
const HANDS = [
  { hand: "Left hand", keys: [
    ["Stick", "Walk around the farm"],
    ["X", "Show crop status on each plot"],
    ["Y", "Open your backpack"],
    ["Menu", "Pause and change the volume"],
    ["Grip", "Hold to grab"],
  ] },
  { hand: "Right hand", keys: [
    ["Stick", "Turn to look around"],
    ["A", "Pick a ripe crop, talk, collect eggs"],
    ["B", "Next page of an info window"],
    ["Trigger", "Grab from a distance, press menu buttons"],
    ["Grip", "Hold to grab tools, fruit and the bell rope"],
  ] },
];

const CROPS = [
  { id: "tomato", icon: "tomato", name: "Tomato", days: 3, yield: 5, regrow: 4,
    about: "Surprise! A tomato is really a fruit, a juicy berry full of tiny seeds.",
    real: "Ready in about 65 to 85 days after planting outside. Farmers stake or cage the plants to keep the fruit off the ground.",
    facts: ["Wild tomatoes first grew in the Andes Mountains of South America!", "The word tomato comes from tomatl, a word in the Aztec language.", "Tomatoes aren't only red. They can be yellow, green or even purple!", "Tomatoes are cousins of eggplants! Their leaves are poisonous, so only eat the fruit."] },
  { id: "corn", icon: "corn", name: "Corn", days: 3, yield: 2,
    about: "Corn is actually a giant grass! Each ear is wrapped up in leafy husks.",
    real: "Ready in about 70 to 85 days after planting the seeds.",
    facts: ["People in southern Mexico first grew corn about 10,000 years ago!", "Each strand of corn silk leads to just one kernel!", "Corn kernels can be red, blue, pink or even black!", "Popcorn pops because heat makes the water inside each kernel expand until it bursts!"] },
  { id: "broccoli", icon: "broccoli", name: "Broccoli", days: 2, yield: 3, regrow: 3,
    about: "Broccoli is a kind of cabbage! We eat its flower buds and stalk.",
    real: "Ready in about 55 to 65 days after planting outside. If it isn't picked, its buds open into little yellow flowers.",
    facts: ["Ancient Romans grew broccoli in Italy!", "Broccoli plants grow about 2 to 3 feet tall.", "Broccoli is packed with vitamins A, C and K!"] },
  { id: "cauliflower", icon: "cabbage", name: "Cauliflower", days: 2, yield: 3,
    about: "Cauliflower is a kind of cabbage! Its white head, called the curd, is made of flowers that haven't opened yet.",
    real: "Ready in about 75 to 80 days after planting outside. Farmers tie the big leaves over the head to shade it.",
    facts: ["Cauliflower isn't only white. It can be orange, purple, green or brown too!", "Cauliflower likes cool weather, around 60°F, to grow its head.", "If cauliflower gets too dry, it only grows small heads."] },
  { id: "carrot", icon: "carrot", name: "Carrot", days: 1, yield: 4,
    about: "Carrots are roots that grow underground! The part we eat is called a taproot.",
    real: "Ready in about 55 to 75 days after planting the seeds.",
    facts: ["Carrots aren't only orange. They can be white, yellow or purple too!", "People probably started farming carrots in Central Asia about 1,000 years ago!", "Carrots are full of carotene, which your body turns into vitamin A!", "Wild carrots have a fancy name: Queen Anne's lace!"] },
];

const SHOTS = [
  ["farm-day", "The farm plots at midday"],
  ["corn-dusk", "Corn ready to pick at dusk"],
  ["farm-dusk", "Harvest time as the sun goes down"],
  ["sprouts", "Carrot sprouts on watered soil"],
  ["carrot-info", "Learning about carrots"],
  ["seed-bag", "Choosing seeds from the backpack"],
  ["merchant-shop", "Trading at the merchant's booth"],
  ["tutorial", "Watering the crops"],
  ["barn-night", "The barn and farmhouse after dark"],
  ["farmhouse-night", "The farmhouse at night"],
];

return { MAKER, ABSTRACT, ICONS, PAGES, REFERENCES, STEPS, HANDS, CROPS, SHOTS };
})();
