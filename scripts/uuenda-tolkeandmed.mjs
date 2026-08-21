/*
  SERVERI SISU KITSAS TÕLKEUUENDUS.

  Eesti fail on allikas. Seda ei asendata vaikepuuga: eesti poolel muutuvad
  ainult allpool loetletud Minust-lehe salmiseletused ning Fotograafia teenuse
  sisu ja hinnakaart. Inglise failis
  uuendatakse nende tõlked ja need harud, mis on serveris eesti sisust maha
  jäänud. Enne kirjutamist tehakse mõlemast failist varukoopia ning kirjutus
  on aatomiline.

  Vaikimisi ainult kontrollib. Kirjutamiseks:
      node scripts/uuenda-tolkeandmed.mjs --kirjuta
*/

import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const juur = path.join(import.meta.dirname, "..");
const andmed = path.join(juur, "data");
const etTee = path.join(andmed, "sisu.et.json");
const enTee = path.join(andmed, "sisu.en.json");
const kirjuta = process.argv.includes("--kirjuta");

function katkesta(sonum) {
  throw new Error(sonum);
}

function klooni(vaartus) {
  return structuredClone(vaartus);
}

function kontrolli(tingimus, sonum) {
  if (!tingimus) katkesta(sonum);
}

const et = JSON.parse(await readFile(etTee, "utf8"));
const vanaEn = JSON.parse(await readFile(enTee, "utf8"));
const uusEt = klooni(et);
const uusEn = klooni(vanaEn);

kontrolli(Array.isArray(et.teenused) && et.teenused.length === 6, "Eesti teenuseid peab olema kuus.");
kontrolli(Array.isArray(vanaEn.teenused) && vanaEn.teenused.length === 6, "Inglise teenuseid peab olema kuus.");
kontrolli(
  et.teenused[2]?.loigud?.[3]?.includes("Jumal on sind loonud"),
  "Stiiliselguse praegust mõtteahelat ei leitud — katkestan, et uuemat sisu mitte rikkuda.",
);

/* Minust — ainult need viis serveri eesti selgitust lähevad lühemaks. */
const lyhikesedEt = [
  "Vaim võib soovida head, kuid inimese jõust ei piisa. Jeesus kutsub meid valvama ja palvetama ning toetuma Jumala jõule.",
  "Me võime teada, mis on õige, kuid oma jõust ei piisa. Vajame Jumala armu, tõde ja juhtimist.",
  "Tugev elu ei sünni üksnes tõe teadmisest, vaid selle järgi elamisest. Jumala sõna on vundament, mis kannab.",
  "Süda vajab selgust, kellele kuulume ja mis meie valikuid juhib. Jumal kutsub meid elama jagamatu südamega Tema tões.",
  "Kristust järgides loobume vajadusest kõike ise juhtida ja usaldame oma elu Jumala kätte.",
];
const lyhikesedEn = [
  "The spirit may desire what is good, but human strength is not enough. Jesus calls us to watch and pray, relying on God's strength.",
  "We may know what is right, yet our own strength is not enough. We need God's grace, truth and guidance.",
  "A strong life grows not only from knowing the truth, but from living by it. God's Word is the foundation that carries us.",
  "The heart needs clarity about whom we belong to and what guides our choices. God calls us to live in His truth with an undivided heart.",
  "Following Christ means releasing the need to control everything ourselves and entrusting our lives to God.",
];

kontrolli(
  uusEt.minust?.pooordumine?.kirjakohad?.length >= 5,
  "Minust-lehe salme ei leitud oodatud kujul.",
);

for (let i = 0; i < 5; i++) {
  uusEt.minust.pooordumine.kirjakohad[i].selgitus = lyhikesedEt[i];
  uusEn.minust.pooordumine.kirjakohad[i].selgitus = lyhikesedEn[i];
}

/* Fotograafia — kliendi kinnitatud tervikkogemus; muud eesti teenused säilivad. */
uusEt.teenused[5] = {
  ...uusEt.teenused[5],
  nimi: "FOTOGRAAFIA",
  alapealkiri: "Ehe ajatu Sina",
  luhike: "",
  sissejuhatus:
    "90 minutit Püha Ruumi ja portreefotosessioon stuudios — üks terviklik kogemus, kus saad aeglustuda, olla kohal ja lasta nähtavaks sellel, kes sa päriselt oled.",
  loigud: [
    "Sa ei pea oskama kaamera ees olla. Juhendan sind rahulikult, et saaksid ennast vabalt ja loomulikult tunda.",
    "Mustvalge foto jätab alles selle, mis on oluline — valguse, kohalolu ja inimese enda.",
  ],
  plokid: [
    {
      pealkiri: "Püha Ruum — 90 minutit",
      loigud: [
        "Enne kaamera ette astumist võtame aja, et aeglustuda, kuulata ja märgata, mis on sinus praegu päriselt kohal. See loob sessioonile rahuliku ja tähendusliku lähtekoha.",
      ],
    },
    {
      pealkiri: "Portreefotosessioon stuudios",
      loigud: [
        "Sessioon jätkub stuudios. Ma juhendan sind õrnalt läbi valguse, liikumise ja erinevate pooside, kuid jätan alles ruumi päris hetkedele ja sinu loomulikule kohalolule.",
      ],
    },
    {
      pealkiri: "Sinu fotod",
      loigud: [
        "Pärast sessiooni saad valiku hoolikalt töödeldud mustvalgeid portreesid — ajatud fotod, mis kannavad sinu olemust, mitte ainult välist kuju.",
      ],
    },
  ],
  nimekirjaPealkiri: "Kogemus sisaldab …",
  nimekiri: [
    "90 minutit Püha Ruumi",
    "rahulikult juhendatud portreefotosessiooni stuudios",
    "valikut töödeldud mustvalgeid portreesid",
  ],
  tsitaat: {
    tekst: "“Ma tänan sind, et olen nii kardetavalt ja imeliselt loodud.”\n\nPsalm 139:14",
    selgitus: "Ajatu Sina — aeg peatuda ja märgata seda, mis sinus on ainulaadne ja ajatu.",
  },
};

uusEt.hinnakiri[5] = {
  ...uusEt.hinnakiri[5],
  nimi: "Fotograafia",
  kestus: "90 min + fotosessioon",
  kirjeldus: "Püha Ruum, portreefotosessioon stuudios ja töödeldud mustvalged pildid.",
};

/* Avaleht — praeguse eesti kutsumuse täpne ingliskeelne vaste. */
uusEn.avaleht.kutsumus = {
  silt: "Calling",
  tsitaat:
    "God has called me to create a space where a person can slow down, be heard, and find clarity and peace in the light of God's presence and His Word.",
  loigud: [
    "This can happen in conversation and prayer, but also through bringing order to the home or wardrobe, or through self-expression.\n\nGod cares for the whole person, and the inner and outer are connected — what takes place in the heart and how it is expressed in our lives.",
  ],
  valjendusSissejuhatus: "It may take the form of:",
  valjendus: [
    "• listening and reflection",
    "• making sense of life and direction",
    "• noticing the identity and gifts given by God",
    "• bringing order to the home and wardrobe",
    "• making more conscious choices in life and style",
  ],
};

/* Minust — serveri lühike kirjakoha selgitus ja uuendatud lõputsitaat. */
uusEn.minust.kirjakoht.selgitus =
  "Created in God's image, every person carries unique worth and beauty.";
uusEn.minust.lopp.tsitaat =
  "Everything good within us is a gift from God. My wish is to help people notice it and grow in their relationship with God.";

/*
  Teenused. Slugid on olemasolevad avalikud aadressid ja jäävad inglise failist
  puutumata; kogu nähtav sisu järgib praegust eesti massiivikuju.
*/
const slugid = vanaEn.teenused.map((teenus) => teenus.slug);
uusEn.teenused = [
  {
    slug: slugid[0],
    nimi: "SACRED SPACE",
    alapealkiri: "Presence in Christ",
    luhike: "",
    sissejuhatus:
      "I believe that God touches and guides people through different encounters, experiences and seasons of life.\n\nIt has become important to me to walk alongside people in a way that helps them slow down, listen and notice again what truly matters.",
    loigud: [
      "All of this happens in faith and prayer, and all glory belongs to God, from whom true change comes.",
    ],
    plokid: [
      {
        pealkiri: "Psalm 62:1",
        loigud: [
          "“My soul rests in God alone. My salvation is from him.”",
          "In silence we turn back to God.",
        ],
      },
      {
        pealkiri: "Luke 21:34",
        loigud: [
          "“So be careful, or your hearts will be weighed down…”",
          "God calls us to pause and turn back to Him.",
        ],
      },
      {
        pealkiri: "— Back into God's presence",
        loigud: [
          "And perhaps this is precisely why God calls us back into simplicity — into deeper silence, peace and His presence. To a place where the noise subsides, the heart turns to God and His voice once again has room in our lives.",
          "Silence reveals the truth …",
        ],
      },
      {
        pealkiri: "Isaiah 30:15",
        loigud: [
          "“You will be saved in returning and rest. Your strength will be in quietness and confidence, but you refused.”",
          "In silence and trust we find strength in God.",
        ],
      },
      {
        pealkiri: "Luke 5:16",
        loigud: [
          "“But he withdrew himself into the desert and prayed.”",
          "In silence we experience God's presence and guidance.",
        ],
      },
      {
        pealkiri: "Luke 10:41–42",
        loigud: [
          "In the story of Martha and Mary, Jesus gently says to Martha:\n\n“You are worried and troubled about many things, but one thing is needed. Mary has chosen the good part, which will not be taken away from her.”",
          "In pausing, we learn to choose God's presence before activity.",
        ],
      },
      {
        pealkiri: "Biblical stillness …",
        loigud: [
          "… is an inner silence in which a person stops striving and begins to listen to God.",
          "In silence we turn more consciously to God, learn to rest in His presence and notice His guidance.",
        ],
      },
      {
        pealkiri: "Where are we really going?",
        loigud: [
          "And perhaps this is the deeper direction of our journey — not towards ever more doing, experiencing or knowing, but back into God's presence.",
          "When the noise subsides and we remain in God's presence, the truth about our life, worth and calling begins to appear more clearly.\n\nIn this way, step by step, we move closer to God and grow ever more into the person He has created us to be.",
        ],
      },
      {
        pealkiri: "I help you slow down",
        loigud: [
          "When the noise subsides, the truth becomes visible. Clarity gives rise to choices that are in harmony with who God has created you to be.",
        ],
      },
    ],
    nimekirjaPealkiri: "IN SACRED SPACE there may arise …",
    nimekiri: ["PEACE", "CLARITY", "ENCOURAGEMENT", "FAITH", "HOPE", "A NEW DIRECTION"],
    toon: vanaEn.teenused[0].toon,
    tsitaat: { tekst: "", selgitus: "" },
  },
  {
    slug: slugid[1],
    nimi: "1:1 JOURNEY",
    alapealkiri: "Coming into order",
    luhike: "",
    sissejuhatus:
      "A month-long journey in which spiritual, emotional and physical life begin to come into order together.\n\nSometimes we do not need more knowledge, but a space where everything can quietly become clear.",
    loigud: [
      "We meet once a week over the course of one month. On a fixed day. In a fixed rhythm. Not in order to “do more”, but to begin truly to see.",
      "We look honestly at your life: what supports you and what does not, including how you use your time — where your energy goes and where it quietly disappears.",
      "— We do not hurry change. But neither do we avoid the truth.",
      "I believe that our bodies and surroundings deserve attention. The Bible reminds us that our body is a temple of the Holy Spirit. That is why a whole life also includes rest, recovery, caring for our body and noticing our boundaries.",
      "— Home can be a quiet environment where we can breathe, rest, recover and simply be.",
    ],
    plokid: [
      {
        pealkiri: "Physical ordering",
        loigud: [
          "Physical ordering is also part of this journey — your space, wardrobe and everyday surroundings.\n\nWhat surrounds us affects our peace, attention and daily rhythm. Sometimes outer disorder can reflect inner overwhelm, and sometimes simplifying what is outside helps create more room for inner clarity.",
        ],
      },
      {
        pealkiri: "Relationships and activities",
        loigud: [
          "We also look at your relationships, responsibilities and everyday activities. We learn to notice where your time and energy go — what carries you, what drains you and what God has truly called you to in this season of life.",
        ],
      },
      {
        pealkiri: "And little by little",
        loigud: [
          "… more clarity, simplicity and openness begin to emerge.\n\nNot through greater effort, but through bringing the spiritual, emotional and physical world into order.",
        ],
      },
      { pealkiri: "— THIS JOURNEY", loigud: [] },
    ],
    nimekirjaPealkiri: "Together we look at what needs ordering in your life",
    nimekiri: [],
    toon: vanaEn.teenused[1].toon,
    tsitaat: {
      tekst: "... is a movement towards the truth that sets us free.",
      selgitus: "If you feel that you are ready for this, then this journey is for you.",
    },
  },
  {
    slug: slugid[2],
    nimi: "STYLE CLARITY",
    alapealkiri: "Essence made visible",
    luhike: "",
    sissejuhatus: "The first step towards your style, wardrobe and more conscious choices.",
    loigud: [
      "Style is not only appearance. It can express your essence, values and season of life.",
      "— “I will give thanks to you, for I am fearfully and wonderfully made.”\nPsalm 139:14",
      "Style clarity helps you understand your natural style direction, notice what truly supports you and make more conscious choices.",
      "God created you → your essence has value\n→ style is one form of expressing it → style clarity helps you notice it more consciously.",
    ],
    plokid: [
      {
        pealkiri: "3 questionnaires + personal reflection + visual style direction",
        loigud: [
          "This is not simply about filling in questionnaires. It is about making sense of your personal style.",
        ],
      },
      {
        pealkiri: "A personal visual style direction",
        loigud: [
          "This is your personal visual map — one that supports your essence and gives your style a clearer direction.",
          "",
        ],
      },
      {
        pealkiri: "Style essence and presence",
        loigud: [
          "Style essence is your being, values, character, beauty and unique expression.\n\nPresence expresses how your inner being becomes visible in the way you carry yourself, dress and inhabit a space.",
        ],
      },
    ],
    nimekirjaPealkiri: "YOU GAIN CLARITY …",
    nimekiri: [
      "• what your main style essence is and what gives it depth",
      "• what your natural presence is and how it affects others",
      "• which tones, cuts, materials and details support you",
      "• in which clothes you feel truly yourself",
      "• which visual direction helps your essence become more visible",
    ],
    toon: vanaEn.teenused[2].toon,
    tsitaat: {
      tekst: "This is a personal reflection on how your essence, style and presence meet one another.",
      selgitus: "",
    },
  },
  {
    slug: slugid[3],
    nimi: "WARDROBE INVENTORY",
    alapealkiri: "Lightness · Peace · Joy",
    luhike: "",
    sissejuhatus:
      "A wardrobe inventory is not only about sorting. It is an opportunity to notice whether your wardrobe reflects who you are today.",
    loigud: [
      "What supports you, and what no longer adorns you?",
      "We also notice what truly suits you, what it is time to let go of and how to express your essence more honestly.",
    ],
    plokid: [],
    nimekirjaPealkiri: "Together we look at",
    nimekiri: [
      "• what supports you",
      "• what keeps your essence from becoming visible",
      "• what can be combined in a new way",
      "• what it is time to let go of peacefully",
      "• what is worth passing on for reuse or giving away",
      "• what is missing from your wardrobe",
    ],
    toon: vanaEn.teenused[3].toon,
    tsitaat: {
      tekst:
        "“The result is a wardrobe that creates more lightness, clarity and peace — and is in harmony with your essence and your life.”",
      selgitus: "",
    },
  },
  {
    slug: slugid[4],
    nimi: "CONSCIOUS SHOPPING",
    alapealkiri: "Choices guided by need",
    luhike: "",
    sissejuhatus:
      "Conscious shopping is an experience that supports you in making considered choices guided by need, rather than pressure or emotion.\n\nOnce the wardrobe has been reviewed, shopping can become far more conscious.",
    loigud: [],
    plokid: [],
    nimekirjaPealkiri: "Now you know …",
    nimekiri: [
      "• what your wardrobe truly needs",
      "• which tones, cuts and materials support you",
      "• what suits your life, body and essence",
      "• how to make choices consciously and calmly",
      "• what helps you feel more like yourself",
    ],
    toon: vanaEn.teenused[4].toon,
    tsitaat: {
      tekst: "“People look at what is before their eyes, but the Lord looks at the heart.”\n\n1 Samuel 16:7",
      selgitus: "The outer can begin to reflect who you truly are.",
    },
  },
  {
    slug: slugid[5],
    nimi: "PHOTOGRAPHY",
    alapealkiri: "Your genuine, timeless self",
    luhike: "",
    sissejuhatus:
      "90 minutes of Sacred Space and a portrait session in the studio — one complete experience in which you can slow down, be present and allow who you truly are to become visible.",
    loigud: [
      "You do not need to know how to be in front of a camera. I will guide you calmly so that you can feel free and natural.",
      "A black-and-white photograph leaves what matters — the light, the presence and the person themselves.",
    ],
    plokid: [
      {
        pealkiri: "Sacred Space — 90 minutes",
        loigud: [
          "Before stepping in front of the camera, we take time to slow down, listen and notice what is genuinely present within you. This gives the session a calm and meaningful starting point.",
        ],
      },
      {
        pealkiri: "Portrait session in the studio",
        loigud: [
          "The experience continues in the studio. I gently guide you through light, movement and different poses while leaving room for real moments and your natural presence.",
        ],
      },
      {
        pealkiri: "Your photographs",
        loigud: [
          "After the session, you receive a selection of carefully edited black-and-white portraits — timeless photographs that carry your essence, not only your outward appearance.",
        ],
      },
    ],
    nimekirjaPealkiri: "The experience includes …",
    nimekiri: [
      "90 minutes of Sacred Space",
      "a calmly guided portrait session in the studio",
      "a selection of edited black-and-white portraits",
    ],
    toon: vanaEn.teenused[5].toon,
    tsitaat: {
      tekst: "“I will give thanks to you, for I am fearfully and wonderfully made.”\n\nPsalm 139:14",
      selgitus: "Timeless You — time to pause and notice what is unique and timeless within you.",
    },
  },
];

uusEn.teenusedLeht.hero.tekst =
  "The services are not separate worlds, but different expressions of one calling. Sacred Space is at the centre — they are all united by a desire to support the whole person in God's presence.";
uusEn.teenusedLeht.tsitaadiSilt = "";
uusEn.teenuseLeht.nimekirjaSilt = "";

uusEn.hinnakiriLeht.hero.pealkiri = "Clarity before we begin";
uusEn.hinnakiriLeht.tsitaat =
  "Your worth is already in God. I help you notice it and express it.";
uusEn.hinnakiriLeht.tsitaadiSilt =
  "“Because you are precious in my eyes and honoured …” Isaiah 43:4";

uusEn.hinnakiri = [
  {
    nimi: "Sacred Space | Sacred Presence",
    kestus: "1 hour",
    hind: et.hinnakiri[0].hind,
    kirjeldus: "Conversation, listening, reflection and prayer. We meet either in person or online.",
  },
  {
    nimi: "1:1 journey",
    kestus: "One month, once a week",
    hind: et.hinnakiri[1].hind,
    kirjeldus:
      "Four meetings on a fixed day and in a fixed rhythm.\n\nTogether we look at your life, space, style, wardrobe, relationships and activities — the spiritual, emotional and physical world come into order together.",
  },
  {
    nimi: "Style clarity",
    kestus: "2–3 hours",
    hind: et.hinnakiri[2].hind,
    kirjeldus: "Mapping your style essence: tones, cuts, materials and what truly supports you.",
  },
  {
    nimi: "Wardrobe ordering",
    kestus: "2–4 hours",
    hind: "from 150 €",
    kirjeldus:
      "We go through the wardrobe together. What remains is order, clarity and an understanding of what suits you and what is missing.",
  },
  {
    nimi: "Conscious shopping",
    kestus: "up to 3 hours",
    hind: "from 150 €",
    kirjeldus: "A practical and inspiring experience that will continue to serve you.",
  },
  {
    nimi: "Photography",
    kestus: "90 min + photo session",
    hind: "from 180 €",
    kirjeldus: "Sacred Space, a portrait session in the studio and edited black-and-white photographs.",
  },
];

uusEn.teekond = {
  nimi: "1:1 JOURNEY",
  hind: et.teekond.hind,
  vordlus: "separately 490 €",
  kirjeldus:
    "Three steps as one journey: first clarity about who you are and what supports you, then bringing order to the wardrobe, and finally a practical experience of conscious shopping. We agree the pace of the journey according to your life.",
  sisaldab: [
    "Style clarity — your style essence and what supports you",
    "Wardrobe ordering — order, clarity and simplicity",
    "Conscious shopping — a practical and inspiring experience",
    "A written summary, visual map and direction for what comes next",
  ],
};

/* Iga nähtava haru kuju peab pärast uuendust eesti allikaga klappima. */
function kuju(vaartus) {
  if (Array.isArray(vaartus)) return vaartus.map(kuju);
  if (vaartus && typeof vaartus === "object") {
    return Object.fromEntries(Object.entries(vaartus).map(([voti, alam]) => [voti, kuju(alam)]));
  }
  return "tekst";
}

function samaKuju(a, b) {
  return JSON.stringify(kuju(a)) === JSON.stringify(kuju(b));
}

for (const voti of Object.keys(et)) {
  kontrolli(samaKuju(uusEt[voti], uusEn[voti]), `Keelepuude kuju ei klapi harus „${voti}”.`);
}

if (!kirjuta) {
  console.log("Kontroll läbitud. Midagi ei kirjutatud.");
  console.log("Kirjutamiseks lisa --kirjuta.");
  process.exit(0);
}

const ajatempel = new Date().toISOString().replace(/[:.]/g, "-");
const varukoopiad = path.join(andmed, "varukoopiad");
await mkdir(varukoopiad, { recursive: true });
await copyFile(etTee, path.join(varukoopiad, `sisu.et-${ajatempel}.json`));
await copyFile(enTee, path.join(varukoopiad, `sisu.en-${ajatempel}.json`));

async function kirjutaAtomiliselt(tee, sisu) {
  const ajutine = `${tee}.tmp`;
  await writeFile(ajutine, `${JSON.stringify(sisu, null, 2)}\n`, "utf8");
  await rename(ajutine, tee);
}

await kirjutaAtomiliselt(etTee, uusEt);
await kirjutaAtomiliselt(enTee, uusEn);
console.log("Eesti salmiseletused ja ingliskeelsed tõlked on uuendatud.");
console.log(`Varukoopiad: ${path.relative(juur, varukoopiad)}`);
