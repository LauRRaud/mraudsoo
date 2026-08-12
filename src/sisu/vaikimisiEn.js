/*
  VAIKIMISI SISU — INGLISE KEEL.

  Sama puu, mis src/sisu/vaikimisi.js, ainult teises keeles. KUJU PEAB JÄÄMA
  SAMAKS: võtmete nimed, massiivide pikkused ja teenuste slugid on mõlemas
  keeles ühesugused, sest ühe keele puu valideerib ainult iseennast, aga
  lehed, lingid ja tekstikujude register (src/sisu/tekstikujud.js) käivad
  mõlema keele peale ühe ja sama teega.

  MIS SIIT KOPEERIMISEL EI TOHI MUUTUDA:
  - `slug` — /teenused/puha-ruum on sama aadress mõlemas keeles;
  - `navi[].tee` — sama marsruut, ainult nimi on tõlgitud (prefiksi /en
    lisab tee() failist src/sisu/keeled.js);
  - `toon` — kujunduse variant, mitte tekst;
  - hinnad ja kontaktid.

  PIIBLIKOHAD tulevad World English Bible'ist (WEB) — see on avalik omand,
  seega tohib teda siin tsiteerida. NEED EI OLE eesti teksti tagasitõlked.
  Kus Marta on salmi lühendanud kolmpunktiga, on lühendatud sama kohast.

  SÕNASTUSE REEGEL on sama mis eesti pool: Marta kirjaviis on osa tema
  häälest. Kus temal on kolmpunkt „…”, on ta ka siin; kus tal on reavahetus
  (\n), on ta ka siin; kus tal on kirjavahemärk puudu, ei ole teda siia
  juurde pandud. Jutumärgid on inglise omad (“ ”).
*/

export const vaikimisiSisuEn = {
  meta: {
    saidiNimi: "Marta Raudsoo",
    tunnuslause: "Sacred Space, presence and clarity",
    kirjeldus:
      "Presence, clarity and style — so that a person might live more in harmony with who God has created them to be. Sacred Space, style clarity, wardrobe ordering, conscious shopping and photography.",
  },

  kontakt: {
    email: "martaraudsoo@gmail.com",
    instagram: "https://www.instagram.com/martaraudsoo/",
    instagramNimi: "@martaraudsoo",
    facebook: "https://www.facebook.com/marta.raudsoo",
    substack: "https://substack.com/@martaraudsoo",
  },

  /* Aadressid on samad mis eesti pool — /en lisab tee() (src/sisu/keeled.js) */
  navi: [
    { nimi: "Home", tee: "/" },
    { nimi: "About me", tee: "/minust" },
    { nimi: "Services", tee: "/teenused" },
    { nimi: "Prices", tee: "/hinnakiri" },
    { nimi: "Blog", tee: "/blogi" },
    { nimi: "Booking", tee: "/broneerimine" },
  ],

  avaleht: {
    hero: {
      silt: "Sacred Presence in Christ",
      pealkiri: "Sacred Space",
      alapealkiri: "The whole person coming into order",
      tekst:
        "I believe that God has created every person unique. My calling is to help a person notice their worth again, to bring clarity into life and to create harmony between the inner being and its outward expression.",
      nuppEsmane: "Book a time",
      nuppTeine: "See the services",
    },

    /*
      TÕLGITUD MARTA PRAEGUSEST TEKSTIST, mitte selle kõrval seisvast eesti
      vaikeväärtusest. Eesti pool on admin-lehelt üle kirjutatud ja käib
      ammu oma teed: seal on kuus rida, siin oli viis, ning puudu oli terve
      mõte („Jumalast antud identiteedi… märkamises”). Kes seda hiljem
      parandab, võtku allikaks see, mis lehel PÄRISELT seisab (data/sisu.et
      .json → avaleht.kutsumus), mitte src/sisu/vaikimisi.js.

      Loendis ei ole „•” märke, kuigi eesti pool need praegu käsitsi sisse
      kirjutatuna kannab: kujundus on litaania ilma täppideta (vt avalehe
      kommentaar) ja täpid on Marta enda hilisem lisandus. Kui ta neid ka
      inglise pool tahab, on nende koht admin-leht, mitte see fail.
    */
    kutsumus: {
      silt: "Calling",
      tsitaat:
        "“God has called me to create a space where a person can slow down, be heard, and find clarity and peace in the light of God's presence and His Word.”",
      loigud: [
        "This can happen in conversation and in prayer, but also while putting a home or a wardrobe in order, or through self-expression. My services are different expressions of one calling, because I believe that God cares for the whole person, and that the inner and the outer belong together.",
      ],
      valjendusSissejuhatus:
        "My work brings together presence, listening and practical ordering. It may take the form of:",
      valjendus: [
        "deep listening and reflection, to find clarity within yourself, in your choices and in your next steps",
        "making sense of life stages, values and direction",
        "noticing the identity, worth and gifts given by God",
        "making more conscious choices in life and in style",
        "putting life / home / wardrobe in order",
        "purposeful choices and shopping that support a person's needs, values and whole life.",
      ],
    },

    /*
      Rida peab mahtuma ühele reale ka kitsal telefonil (vt avalehe kommentaar
      liikumise juures). Inglise sõnad on pikemad — kui midagi murdub, lühenda
      just siit, mitte CSS-ist.
    */
    liikumine: {
      silt: "Movement",
      pealkiri:
        "“Which also bring into life clarity, lightness, balance, peace, joy and freedom.”",
      read: [
        { millest: "From chaos", milleks: "into clarity" },
        { millest: "From heaviness", milleks: "into lightness" },
        { millest: "From scattering", milleks: "into balance" },
        { millest: "From restlessness", milleks: "into peace" },
        { millest: "From the trap", milleks: "into freedom" },
      ],
    },

    essents: {
      silt: "Essence",
      pealkiri: "Your unique essence",
      alapealkiri: "Who GOD has created you to be …",
      loigud: [
        "Your essence … is not simply style. It is not only clothes, colours or forms. It is your presence. Your genuine way of being. Your inner beauty. Your unrepeatable expression. Your uniqueness, created in the image of God.",
        "But beyond this I believe … that every person carries something singular within. Something that God has placed in them alone. Every person's life has meaning, direction and calling — and in their being there is something that cannot be replaced by anyone else.",
        "And clothing can be one way in which this becomes visible. Not in order to prove your worth, nor to be someone else. Nor to fit the measure of the world. But to come more into harmony with who you truly are.",
      ],
      tsitaat:
        "“God does not create people by chance. Within every person there is worth, distinctness and beauty that can be learned to notice and to honour.”",
    },

    /* John 10:10 (WEB) */
    kirjakoht: {
      viide: "John 10:10",
      tekst: "“I came that they may have life, and may have it abundantly.”",
      selgitus: "",
    },

    teenusedPlokk: {
      silt: "Services",
      pealkiri: "Six ways in which one and the same calling is expressed in practice",
      linkTekst: "All services",
    },

    minustPlokk: {
      tsitaat:
        "“Everything good in me is a gift from God. My wish is not to lead people to myself, but to help them grow in their relationship with God.”",
      loigud: [
        "I offer people a space where it is possible to pause, to be heard and to notice again what matters in life.",
      ],
      linkTekst: "Read about me",
    },

    kutse: {
      silt: "The next step belongs to you",
      pealkiri: "“And perhaps it is time to see yourself as God has created you.”",
      nuppEsmane: "Book a time",
      nuppTeine: "See the prices",
    },
  },

  minust: {
    hero: {
      silt: "About me",
      pealkiri: "I offer a space where it is possible to pause",
      tekst:
        "I offer people a space where it is possible to pause, to be heard and to notice again what matters in life.",
    },

    lugu: {
      silt: "My story",
      pealkiri: "My story",
      loigud: [
        "For as long as I can remember, I have longed to meet my own uniqueness. Not simply through my style, my appearance or my roles, but that true self — the person GOD has created me to be.",
        "Without knowing it, I have felt a call and a pull to understand: what is that unrepeatable “me” whom God has created?",
        "I remember myself when I was young … watching people.",
        "Not simply their clothes or their appearance, but something more. I have always been drawn to why a person dresses the way they dress …",
        "… and why they have chosen just that work, that way of being, that expression. Why some people seem to hide themselves. Why some are present the moment they enter. Why with some people you sense that their outward picture and their inner being are not in harmony with one another.",
        "I often felt as though I saw or sensed something in a person that I could not explain. At times it even seemed strange.",
        "But today I understand that it was not by chance.",
        "It was a call. It was an inner direction. It was a gift that needed to take root and ripen in me. I believe that God has placed gifts within us.",
        "Sometimes we feel them long before we can give them a name. Sometimes they need time, experience and growth before we dare truly to listen to them.",
        "Today I understand that in my heart there has always been a longing to help a person meet themselves — not the version they have tried to become, but the person God has created them to be.",
      ],
    },

    tolgendus: {
      ava: "Read the interpretation",
      peida: "Hide the interpretation",
    },

    /* Genesis 1:27 (WEB), lühendatud samast kohast kui eesti pool */
    kirjakoht: {
      viide: "Genesis 1:27",
      tekst: "“And God created man in his own image…”",
      selgitus:
        "For me this means that no person is accidental. We are not created as copies. In all of us there is something that reflects God — beauty, creativity, strength, tenderness, depth, light and presence.",
    },

    pooordumine: {
      silt: "The heart longs for the truth",
      pealkiri: "Today I see more clearly than ever before …",
      loigud: [
        "Within a person there are two realities at once.",
        "The longing to live rightly, the wish to be honest, the need for peace and simplicity - the heart recognises what is right …",
        "But at the same time… our human side is tired, is afraid, holds on to habits, goes back into old patterns and so a contradiction arises you know what is right… but you do not live it.",
        "Your heart knows the truth but God's power helps you to live it",
        "Today I want to ask … what are we actually building our life upon?",
        "… if life is built on dependencies, then we have built on sand. And when it all sways and falls apart - the person falls too.",
        "If work = security\nmoney = worth\nrole = identity",
        "This is not a true foundation …",
        "… But I lived that way for years. The focus was paying the bills, surviving, staying inside the system. And although outwardly it seemed as if everything were “in order”… inside I was broken.",
        "Today I can honestly confess - I served the system, not God. And when there is no relationship with God, we always begin to serve something else … until we have met the truth.",
        "Obedience to God's word … creates a stable foundation (a rock) that holds against the hardships of life, while disregarding his words leads to spiritual ruin and collapse.",
        "For me the change began then…",
        "… when I truly began to let go of what was false. It was not easy, it was painful, uncertain and it broke my old foundations. But at the same time something new began to be born …",
        "And when I gave my life …",
        "… my work, my calling, my future. Into God's hands - then things have begun to change …",
        "… My heart, my mind, my relationship with life.",
        "Baptism was the turning point for me.",
        "We lose nothing, on the contrary - we meet the truth, the way and the life.",
        "For God's way tears down what is not the truth and builds what remains.",
      ],
      tsitaat:
        "“It is no longer simply work but a CALLING, it is no longer striving, but SERVING OUT OF LOVE, it is no longer fear that leads but PEACE.”",
      kirjakohad: [
        {
          viide: "Mark 14:38",
          tekst:
            "“Watch and pray, that you may not enter into temptation. The spirit indeed is willing, but the flesh is weak.”",
          selgitus:
            "This verse underlines the need to be spiritually awake and prayerful in order not to fall into temptation, acknowledging the conflict between a person's will and their physical weakness. It is Jesus' warning to the disciples, noting that although the inner desire (the spirit) is to follow God, human nature (the flesh) is weak and needs strength through the support of prayer.",
        },
        {
          viide: "Romans 7:19",
          tekst:
            "“For the good which I desire, I don't do; but the evil which I don't desire, that I practice.”",
          selgitus:
            "A person is not created to live from their own strength alone … we need God.",
        },
        {
          viide: "Matthew 7:24-27",
          tekst:
            "“Everyone therefore who hears these words of mine and does them… is like a wise man who built his house on a rock… And everyone who hears these words of mine and doesn't do them… is like a foolish man who built his house on the sand.”",
          selgitus: "",
        },
        {
          viide: "Matthew 6:24",
          tekst:
            "“No one can serve two masters, for either he will hate the one and love the other, or else he will be devoted to one and despise the other. You can't serve both God and Mammon.”",
          selgitus:
            "God does not call us to live in exhaustion. He calls us to live in the Truth.",
        },
        {
          viide: "Matthew 16:24",
          tekst:
            "“If anyone desires to come after me, let him deny himself… and follow me.”",
          selgitus:
            "It is no longer my way, but His way. When I let go of my own way, a way opens that I would never have seen myself. I no longer live only by my own wishes, plans and understanding… but trust God's leading in my life.",
        },
      ],
    },

    annid: {
      silt: "Gifts",
      pealkiri: "Gifts I have recognised on my journey",
      sissejuhatus:
        "1 Corinthians 12 teaches that the Holy Spirit gives his gifts for the common good. On my own journey I have noticed most of all that God uses through me above all:",
      loend: [
        {
          nimi: "the sharing of wisdom",
          kirjeldus:
            "to help see situations more widely and understand the next steps",
        },
        {
          nimi: "discernment",
          kirjeldus: "to notice what needs attention or ordering",
        },
        {
          nimi: "the encouragement of faith",
          kirjeldus: "to call to mind hope and trust in God",
        },
        {
          nimi: "listening and presence",
          kirjeldus:
            "to create a safe space where a person may be honest and experience clarity",
        },
      ],
    },

    tsitaat: {
      tekst:
        "“These are not my achievements. They are gifts of God's grace, which I wish to use faithfully in serving others.”",
    },

    terviklikkus: {
      silt: "Wholeness",
      pealkiri: "God cares about the whole person",
      /* Sõna-sõnalt pildilt: koma, punkti ega mõttekriipsu seal ei ole */
      loigud: [
        "In this journey there begins to come into order - the spiritual emotional, physical world\nNot separately but together.",
        "That is why in my work the inner and the outer meet — listening and practical steps, presence and coming into order.",
        "When clarity is born in the heart, it can begin to be reflected in everyday life too: in choices, in the wardrobe, at home, in self-expression and in relationships.",
      ],
    },

    lopp: {
      tsitaat:
        "“Everything good in me is a gift from God. My wish is not to lead people to myself, but to help them grow in their relationship with God.”",
      nuppTekst: "Get in touch",
    },
  },

  teenusedLeht: {
    hero: {
      silt: "Services",
      pealkiri: "Different expressions of one calling",
      tekst:
        "My services are not separate worlds. Sacred Space is not one service and style clarity, wardrobe ordering, conscious shopping and photography others. They are all different expressions of one and the same calling.",
    },
    loeLahemalt: "Read more",
    tsitaat:
      "“My way is not only my own — it is service through presence, listening and deep empathy.”",
    tsitaadiSilt: "Presence",
    lopp: {
      pealkiri: "Not sure where to begin?",
      tekst:
        "Simply write about what touches you most right now. Together we will find the right place to start.",
      nuppEsmane: "Get in touch",
      nuppTeine: "Prices",
    },
  },

  /*
    TEENUSED. Slugid on samad mis eesti pool — /teenused/puha-ruum peab
    mõlemas keeles vastama. Plokkide pealkirjad, mis on piibliviited, peavad
    jääma viite kujule („Psalm 62:1”, „Luke 5:16”), sest teenuse alamleht
    tunneb kirjakohaploki just selle järgi ära (VIITE_MUSTER).
  */
  teenused: [
    {
      slug: "puha-ruum",
      nimi: "Sacred Space",
      alapealkiri: "Sacred Presence in Christ",
      luhike:
        "A safe space for listening, reflection, prayer and finding clarity.",
      sissejuhatus:
        "I offer people a space where it is possible to pause, to be heard and to notice again what matters in life.",
      loigud: [
        "I believe that God uses different people in different ways. In my heart it has become important to create an environment where these may be born:",
        "All of this happens in faith, in prayer and with the wish to give all glory to God.",
      ],
      plokid: [
        {
          pealkiri: "Psalm 62:1",
          loigud: [
            "“My soul rests in God alone. My salvation is from him.”",
            "Silence = the place where the soul finds peace, truth and clarity …",
          ],
        },
        {
          pealkiri: "Luke 21:34",
          loigud: [
            "“So be careful, or your hearts will be loaded down…”",
            "When the heart is full… there is no longer room to hear.",
            "We listen, but do not manage to understand. We experience, but do not manage to integrate. We are present, but never truly arrive.",
          ],
        },
        {
          pealkiri: "God calls us back into simplicity",
          loigud: [
            "And perhaps that is precisely why… God calls us back into simplicity but deep … into silence, into peace, into attunement.",
            "Silence does not create identity, it reveals the truth …",
          ],
        },
        {
          pealkiri: "Isaiah 30:15",
          loigud: [
            "“You will be saved in returning and rest. Your strength will be in quietness and in confidence; and you refused.”",
          ],
        },
        {
          pealkiri: "Luke 5:16",
          loigud: [
            "“But he withdrew himself into the desert and prayed.”",
            "Jesus himself withdrew regularly from the noise.",
          ],
        },
        {
          pealkiri: "Luke 10:41–42",
          loigud: [
            "In the story of Martha and Mary, Jesus gently admonishes Martha: “You are anxious and troubled about many things, but one thing is needed. Mary has chosen the good part, which will not be taken away from her.”",
            "What we need is not more doing - more noise, but presence.",
          ],
        },
        {
          pealkiri: "Biblical stillness",
          loigud: [
            "Biblical stillness is an inner silence in which a person stops struggling and begins to listen to God.",
          ],
        },
        {
          pealkiri: "Attuned presence",
          loigud: [
            "I would call it attuned presence … It is the place where the noise dies down, the pace slows and the heart is given room again.",
            "It is precisely in silence that a person comes back into connection with God.",
            "Attuned presence is an inner peace in the midst of life, where you no longer have to control, prove or hurry.",
            "In attuned presence the TRUTH is quietly revealed, our true identity …",
          ],
        },
        {
          pealkiri: "Where we are actually going",
          loigud: [
            "And perhaps this is where we are actually going… not towards more doing, not more experiencing, not more knowing - but back …",
            "… back into who we are in God. For in silence nothing is lost. In silence the truth begins to appear. And step by step… we move closer to who we have been all along.",
          ],
        },
        {
          pealkiri: "I help you to slow down",
          loigud: [
            "I help you to slow down, to put your spiritual, emotional and physical world in order …",
            "… and to meet the truth - from that place right choices are born.",
          ],
        },
      ],
      nimekirjaPealkiri: "In this space there may be born",
      nimekiri: [
        "listening",
        "clarity",
        "coming into order",
        "encouragement",
        "discerning the next steps",
      ],
      toon: "sygav",
    },
    {
      slug: "uks-uhele-teekond",
      nimi: "1:1 journey",
      alapealkiri: "A journey with me is not acceleration. It is coming into order.",
      luhike:
        "A month-long journey in which the spiritual, emotional and physical world begin to come into order together.",
      sissejuhatus:
        "Sometimes we do not need more knowledge… but a space where everything can quietly become clear.",
      loigud: [
        "We meet once a week over the course of one month. On a fixed day. In a fixed rhythm. Not in order to “do more”… but to begin truly to see.",
        "We look at your life as it really is. What supports you… and what does not. Where your energy moves… and where it quietly disappears.",
        "We do not hurry change. But neither do we avoid the truth.",
      ],
      plokid: [
        {
          pealkiri: "Physical ordering",
          loigud: [
            "Physical ordering is part of this journey. Your space. Your wardrobe. Your everyday surroundings - because what is visible reflects what is happening within you …",
          ],
        },
        {
          pealkiri: "Relationships and activities",
          loigud: [
            "We also touch relationships. And activities. We learn to notice where you give your energy and whether it carries you.",
          ],
        },
        {
          pealkiri: "And little by little",
          loigud: [
            "And little by little… clarity and transparency begin to arise. Not through striving - but through the ordering of the spiritual, emotional and physical world.",
          ],
        },
      ],
      tsitaat: {
        tekst: "“This is not simply change. It is a coming back to yourself.”",
        selgitus:
          "If you feel that you are ready for this… then this journey is for you",
      },
      nimekirjaPealkiri: "Together we look at what needs ordering in your life",
      nimekiri: [
        "phone/computer ordering",
        "social media ordering",
        "ordering of physical space",
        "organising, systematising - home, wardrobe",
      ],
      toon: "sygav",
    },
    {
      slug: "stiiliselgus",
      nimi: "Style clarity",
      alapealkiri: "The being made visible",
      luhike:
        "I help create the clarity that expresses a person's being, values and season of life.",
      sissejuhatus:
        "The first step towards your personal style essence, a wardrobe inventory and more conscious choices.",
      loigud: [
        "Style is not only appearance. It is the way a person expresses who they are.",
      ],
      plokid: [
        {
          pealkiri: "3 questionnaires + personal reflection + visual style direction",
          loigud: [
            "This is the first and most important step.",
            "Style clarity is not simply filling in questionnaires or an overview of the answers.",
          ],
        },
        {
          pealkiri: "A personal visual style direction",
          loigud: [
            "In addition I create for you a personal visual style direction — a visual map of your style essence and presence.",
            "It helps you see which tones, forms, fabrics, details and overall picture support your being and give your style a clearer direction.",
          ],
        },
        {
          pealkiri: "Style essence and energetic presence",
          loigud: [
            "Style essence = which style supports you.",
            "Energetic presence = how you come across.",
            "Style essence speaks of your language of style.",
            "Energetic presence speaks of the effect of your being.",
          ],
        },
      ],
      tsitaat: {
        tekst:
          "“This is a personal reflection on how your being, your style, your body and your presence meet one another.”",
        selgitus: "",
      },
      nimekirjaPealkiri: "You gain clarity …",
      nimekiri: [
        "what your main style essence is / which additional essences give your style depth",
        "what your energetic presence is",
        "which tones, cuts, materials and details support you",
        "in what clothing you feel truly seen",
        "which style direction helps you move closer to yourself",
      ],
      toon: "soe",
    },
    {
      slug: "garderoobi-korrastus",
      nimi: "Wardrobe ordering",
      alapealkiri: "Lightness · Peace · Balance · Joy",
      luhike:
        "Together we create order and simplicity, so that everyday choices support your life.",
      sissejuhatus:
        "Once style clarity has been created, the next natural step is a wardrobe INVENTORY.",
      loigud: [
        "What supports, what no longer adorns?",
        "In ordering the wardrobe we do not order only clothes — we help you notice: who you are, what truly suits you, what it is time to let go of and how to express your being more honestly.",
      ],
      plokid: [],
      tsitaat: {
        tekst:
          "“The result is a wardrobe that creates more lightness, clarity and peace — and is in harmony with your life, your body and your being.”",
        selgitus: "",
      },
      nimekirjaPealkiri: "Together we look at",
      nimekiri: [
        "what supports you",
        "what conceals",
        "what no longer feels like you",
        "what can be combined in a new way",
        "what you may calmly let go of",
        "what is worth passing on for reuse",
        "what is missing from the wardrobe",
      ],
      toon: "soe",
    },
    {
      slug: "teadlik-ostlemine",
      nimi: "Conscious shopping",
      alapealkiri: "Choices that come from need",
      luhike:
        "An experience of making considered choices that come from need, not from pressure or emotion.",
      sissejuhatus:
        "Once the wardrobe has been reviewed, shopping can become far more conscious.",
      loigud: [],
      plokid: [],
      tsitaat: {
        tekst:
          "“… how to move from an old self-image closer to that version of you which has been waiting to be noticed.”",
        selgitus: "",
      },
      nimekirjaPealkiri: "Now you know …",
      nimekiri: [
        "what your wardrobe truly needs",
        "which tones, cuts and materials support you",
        "which clothes are in harmony with your life, your body and your being",
        "how to make choices more consciously, no longer from the emotion of the moment",
        "which clothes help you feel more confident, freer and more yourself",
      ],
      toon: "soe",
    },
    {
      /*
        FOTOGRAAFIA — ainus teenus, mille kohta Martalt teksti ei ole.
        Sama lünk mis eesti pool: kui ta annab laused, tuleb neid muuta
        MÕLEMAS keeles (või admin-lehelt kummaski keeles eraldi).
      */
      slug: "fotograafia",
      nimi: "Photography",
      alapealkiri: "Black and white",
      luhike:
        "Natural and genuine moments that capture a person as they are.",
      sissejuhatus: "Portraits that do not try to make anyone into someone else.",
      loigud: [
        "Black and white leaves what matters: the light, the presence and the person themselves.",
      ],
      plokid: [],
      nimekirjaPealkiri: "What this gives",
      nimekiri: [],
      toon: "sygav",
    },
  ],

  teenuseLeht: {
    nimekirjaSilt: "What this gives",
    kutseSilt: "Let us begin",
    kutsePealkiri: "Did this speak to you?",
    kutseTekst:
      "Write freely. I answer myself and together we will find a suitable time and way.",
    nuppEsmane: "Book a time",
    nuppTeine: "Prices",
    jargmineSilt: "Next service",
    loeLahemalt: "Read more",
  },

  hinnakiriLeht: {
    hero: {
      silt: "Prices",
      pealkiri: "A clear agreement before we begin",
      tekst:
        "Every journey is different. If you do not know which service would help you most, simply write — we will think it through together.",
    },
    uksikudSilt: "Individual services",
    teekondSilt: "Three steps together",
    sisaldabSilt: "Includes",
    tsitaat:
      "“A person's worth already comes from God. I help to notice it and to express it.”",
    tsitaadiSilt: "Worth",
    lopp: {
      pealkiri: "If the price is an obstacle, say so.",
      tekst:
        "We will find a solution. It matters more to me that you receive help than that everything goes the same way for everyone.",
      nuppTekst: "Get in touch",
    },
  },

  /* Hinnad on samad mis eesti pool — need on üks ja sama hinnakiri */
  hinnakiri: [
    {
      nimi: "Sacred Space | Sacred Presence",
      kestus: "1 hour",
      hind: "60 €",
      kirjeldus:
        "Conversation, listening, reflection and prayer. We meet either in person or online.",
    },
    {
      nimi: "1:1 journey",
      kestus: "One month, once a week",
      hind: "480 €",
      kirjeldus:
        "Four meetings on a fixed day and in a fixed rhythm. Together we look at life, space, wardrobe, relationships and activities — the spiritual, emotional and physical world come into order together.",
    },
    {
      nimi: "Style clarity",
      kestus: "2–3 hours",
      hind: "150 €",
      kirjeldus:
        "Mapping your style essence: tones, cuts, materials and what truly supports you.",
    },
    {
      nimi: "Wardrobe ordering",
      kestus: "3–4 hours",
      hind: "180 €",
      kirjeldus:
        "We go through the wardrobe together. What remains is order, clarity and an understanding of what is there and what is missing.",
    },
    {
      nimi: "Conscious shopping",
      kestus: "3 hours",
      hind: "160 €",
      kirjeldus:
        "Together in the shops or online. A practical experience that will go on serving you.",
    },
    {
      nimi: "Photography",
      kestus: "1–2 hours",
      hind: "180 €",
      kirjeldus: "A black-and-white portrait session and edited photographs.",
    },
  ],

  teekond: {
    nimi: "Style journey",
    hind: "450 €",
    vordlus: "separately 490 €",
    kirjeldus:
      "Three steps as one journey: first clarity about who you are and what supports you, then the ordering of the wardrobe and finally a practical experience of conscious shopping. We agree the pace of the journey according to your life.",
    sisaldab: [
      "Style clarity — your style essence and what supports you",
      "Wardrobe ordering — order, clarity and simplicity",
      "Conscious shopping — a practical experience together",
      "a written summary and a direction for what comes next",
    ],
  },

  blogiLeht: {
    hero: {
      silt: "Blog",
      pealkiri: "Thoughts from the way",
      tekst:
        "Thoughts on presence, clarity and on how inner and outer ordering go hand in hand.",
    },
    tyhiPealkiri: "The first posts are on their way here.",
    tyhiTekst:
      "For now I write on Substack. There you will find the longer thoughts and can subscribe, if you wish, so that each new piece reaches you.",
    substackTekst: "Read on Substack",
  },

  postitused: [],

  lehed: [],

  broneerimine: {
    hero: {
      silt: "Booking",
      pealkiri: "Let us begin with a conversation",
      tekst:
        "You do not have to know beforehand what exactly you need. Simply write about what touches you most right now — together we will find the right place to start.",
    },
    vormSilt: "Send your request",
    kontaktSilt: "Or write directly",
    markus:
      "I answer myself and as quickly as I can. If you have a question and are not sure whether it even fits — ask anyway.",
    /* Psalm 46:10 (WEB) */
    kirjakoht: {
      viide: "Psalm 46:10",
      tekst: "“Be still, and know that I am God.”",
      selgitus: "This is an invitation to pause and to attune …",
    },
  },

  jalus: {
    tutvustus:
      "Presence, clarity and style — so that a person might live more in harmony with who God has created them to be.",
  },

  eiLeitud: {
    silt: "404",
    pealkiri: "This page could not be found",
    tekst:
      "Perhaps the address has changed. Start from the home page or take a look at the services.",
    nuppEsmane: "To the home page",
    nuppTeine: "Services",
  },

  /*
    Tekstikujud on keelte peale ÜHISED ja elavad failis data/tekstikujud.json
    (vt src/sisu/lae.js). Võti on siin ainult selleks, et puu kuju oleks
    mõlemas keeles sama — laadija kirjutab ta alati ühisest failist üle.
  */
  tekstiKujud: {},
};
