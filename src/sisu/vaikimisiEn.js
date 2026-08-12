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

      TÄPID „•” ON TEKSTI SEES, mitte CSS-ist. Kujundus renderdab need read
      täppideta litaaniana; eesti pool kannab täppe käsitsi sisse kirjutatuna
      ja nii peab ka inglise pool, muidu seisavad kaks keelt kõrvuti eri
      kujul. Kui täpid kunagi kujundusse kolivad, tuleb nad SIIT ära võtta —
      muidu tekib kaks täppi rea ees.
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
        "• deep listening and reflection, to find clarity within yourself, in your choices and in your next steps",
        "• making sense of life stages, values and direction",
        "• noticing the identity, worth and gifts given by God",
        "• making more conscious choices in life and in style",
        "• putting life / home / wardrobe in order",
        "• purposeful choices and shopping that support a person's needs, values and whole life.",
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
      /* Üks lõik kahe reavahega sees, nagu eesti pool — mitte kolm lõiku */
      loigud: [
        "Your essence is more than style. It is your genuine presence, your inner beauty, the gifts you have received from God and your unrepeatable way of expressing yourself.\n\nYour story, your being and your gifts are not accidental — they are part of God's good plan. Clothing too can make this visible: not in order to prove your worth, but to express more truly who God has created you to be.",
      ],
      tsitaat:
        "“God does not create people by chance. Within every person there is worth, distinctness and beauty that can be learned to notice and to honour.”",
    },

    /*
      John 10:10 (WEB). VÄLJAD ON RISTI, nagu eesti pool: salm seisab `viide`
      all ja viide `tekst` all. Marta on need admin-lehel meelega vahetanud,
      sest kujundus annab `viide` väljale kuldse suurtähekirja ja `tekst`
      väljale kuvakirja — tema tahab salmi kuldselt, viidet kuvakirjas.
      Kui siin väljad „õigesti” seista, näeks inglise leht teistmoodi välja.
    */
    kirjakoht: {
      viide: "“I came that they may have life, and may have it abundantly.”",
      tekst: "John 10:10",
      selgitus: "",
    },

    teenusedPlokk: {
      silt: "Services",
      pealkiri: "Six ways in which one and the same calling is expressed in practice",
      linkTekst: "All services",
    },

    minustPlokk: {
      tsitaat:
        "“Everything good in me is a gift from God. My wish is to help a person grow in their relationship with God and to see themselves through His eyes — as valuable, loved and unique.”",
      /* Tühi, nagu eesti pool: tsitaat seisab siin üksi ja lõiku ei ole */
      loigud: [],
      linkTekst: "Read about me",
    },

    /* Silt ja pealkiri on risti, nagu eesti pool: tsitaat on kuldne silt */
    kutse: {
      silt: "“And perhaps it is time to see yourself as God has created you.”",
      pealkiri: "Your next step  …",
      nuppEsmane: "Book a time",
      nuppTeine: "See the prices",
    },
  },

  minust: {
    /* Silt on tühi ja pealkiri jätkub tekstis — kolmpunktid on Marta oma */
    hero: {
      silt: "",
      pealkiri: "A space to pause ...",
      tekst: "... to notice again what matters in life.",
    },

    lugu: {
      silt: "My story",
      pealkiri:
        "For as long as I can remember, there has been a longing in me ...",
      loigud: [
        "... to understand life and the human being more deeply - who God has created us to be, and what shapes the way we live our lives?",
        "Already as a young person, my own experiences made me ask why we are born into just these circumstances, into just these situations, and what a person finally builds their life upon?",
        "Perhaps that is why I have always looked at a person as a whole - their choices, relationships, home, work, way of living and self-expression.",
        "Today I understand that part of my calling was already in that: to help a person notice what shapes their life, what needs ordering, and how to grow ever more into harmony with who God has created them to be.",
        "I believe that the gifts God gives need time to ripen in us into conscious service.",
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
      /* Pealkirja ei ole — lugu algab kohe esimesest lõigust, nagu eesti pool */
      pealkiri: "",
      loigud: [
        "Today I see more clearly than before how often we live in inner contradiction. The heart recognises what is right, but fear, tiredness, habits and old patterns hold us back.",
        "We may know the truth, but we need God's power to live in it.",
        "— I have had to ask myself as well: what am I really building my life upon?",
        "For years my security was work, money, roles and staying inside the system. Outwardly everything may have seemed in order, but inwardly my life was not built on the right foundation.",
        "The change began when I truly gave my life, my work, my calling and my future into God's hands. Baptism became for me a sign of leaving the old life behind and of new life in Christ.",
        "— In Christ we do not lose who God has created us to be. He cleanses, renews and builds our life upon the truth.",
        " “It is no longer I who live, but Christ lives in me.”\nGalatians 2:20",
      ],
      tsitaat:
        "— No longer simply work, but a CALLING. Not striving, but SERVING OUT OF LOVE.\nNot fear, but PEACE.",
      kirjakohad: [
        {
          viide: "Mark 14:38",
          tekst:
            "“Watch and pray, that you may not enter into temptation. The spirit indeed is willing, but the flesh is weak.”",
          selgitus:
            "This verse underlines the need to be spiritually awake and prayerful in order to avoid temptation, acknowledging the conflict between a person's willpower and their physical weakness. It is Jesus' warning to the disciples, noting that although the inner desire (the spirit) is to follow God, human nature (the flesh) is weak and needs strength through the support of prayer.",
        },
        {
          viide: "Romans 7:19",
          tekst:
            "“For the good which I desire, I don't do; but the evil which I don't desire, that I practice.”",
          selgitus:
            "We are not created to carry life by our own strength alone. We may know what is right and still experience how limited our own will and strength are. We need God — His grace, His truth and His leading.",
        },
        {
          /* Lühendatud samast kohast kui eesti pool — ainult kaljule ehitaja */
          viide: "Matthew 7:24-27",
          tekst:
            "“Everyone therefore who hears these words of mine and does them will be likened to a wise man who built his house on a rock ...”",
          selgitus:
            "The question is not only what we know, but what we build our life upon. A strong foundation is born when our life begins to rest on God's word.",
        },
        {
          viide: "Matthew 6:24",
          tekst:
            "“No one can serve two masters, for either he will hate the one and love the other, or else he will be devoted to one and despise the other. You can't serve both God and Mammon.”",
          selgitus:
            "Our heart needs clarity about whom we belong to and what guides our choices. God does not call us to live in endless striving, trying to serve different expectations and values at once. He calls us to live in His truth.",
        },
        {
          viide: "Matthew 16:24",
          tekst:
            "“If anyone desires to come after me, let him deny himself and follow me.”",
          selgitus:
            " — In following Christ we learn to let go of the need to steer and control everything ourselves, to entrust our life into God's hands and to grow ever more into the life to which He calls us.",
        },
        {
          /* Kuues kirje ei ole salm, vaid Marta oma lause — viide on tühi */
          viide: "",
          tekst:
            "It is no longer only my way, my plan and my will — but His way, His truth and His leading. (John 14:6)",
          selgitus: "",
        },
      ],
    },

    annid: {
      silt: "Gifts",
      pealkiri: "... that I have recognised on my journey",
      sissejuhatus:
        "1 Corinthians 12 teaches that the Holy Spirit gives his gifts for the common good. On my journey I have noticed most of all that God uses through me above all:",
      loend: [
        {
          nimi: "A word of wisdom",
          kirjeldus:
            "To see situations more widely and to help bring clarity where a person may not yet see the whole picture.",
        },
        {
          nimi: "A word of knowledge",
          kirjeldus:
            "To notice and to put into words what God draws attention to.",
        },
        {
          nimi: "Faith",
          kirjeldus:
            "To call to mind trust in God even where the solution or the next step is not yet in sight, and to encourage hope in God.",
        },
        {
          nimi: "Listening and presence",
          kirjeldus:
            "Making room for God — where a person can be honest in God's presence and experience peace and clarity.",
        },
      ],
    },

    tsitaat: {
      tekst:
        "“These are not my achievements. They are gifts of God's grace, which I wish to use faithfully in serving others.”",
    },

    terviklikkus: {
      silt: "Wholeness",
      pealkiri: "God cares about the whole person.",
      loigud: [
        "Wholeness begins with what we build our life upon. On this journey we look at the spiritual, emotional and physical life not separately but as one whole — what carries us, what needs ordering and what needs a new direction.",
        "That is why in my work the inner and the outer world meet: listening and practical steps, presence and coming into order.",
        "When clarity is born in the heart and life is built on a firmer foundation, it begins to be reflected in everyday life too — in our choices, relationships, home, wardrobe and self-expression.",
        "— Inner change becomes visible in the way we live.",
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
        "My services are not separate worlds. Sacred Space is not one service.\n\n— Style clarity, home and wardrobe ordering, conscious shopping and photography are all different expressions of one and the same calling.",
    },
    loeLahemalt: "Read more",
    /*
      Efeslastele 2:10 (WEB). Viide seisab pika tühikureana tsitaadi all,
      täpselt nagu eesti pool — see on Marta oma taane, mitte kujundus.
    */
    tsitaat:
      '"For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them."\n\n                                                                  Ephesians 2:10',
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
        "A safe space to slow down, listen, reflect and pray — to find clarity, peace and direction in God's presence.",
      sissejuhatus:
        "I believe that God touches and leads people through different encounters, experiences and seasons of life. It has become important in my heart to be alongside a person in a way that helps them slow down, listen and notice again what truly matters.",
      loigud: [
        "All of this happens in faith and prayer, and all glory belongs to God, from whom true change comes.",
      ],
      plokid: [
        {
          pealkiri: "Psalm 62:1",
          loigud: [
            "“In God alone my soul finds rest; from him comes my salvation.”",
            "Silence is not an end in itself, but a place where the soul can be still before God. When the outer and inner noise subsides, we can experience His presence more clearly, listen for His guidance and receive the peace, truth and clarity that come from Him.",
            "— In silence we meet God.",
          ],
        },
        {
          pealkiri: "Luke 21:34",
          loigud: [
            "“So be careful, or your hearts will be loaded down…”",
            "We listen, yet do not understand.\nWe experience, yet cannot make what we have experienced whole within ourselves.\nWe are present, yet never truly arrive before ourselves or before God.",
          ],
        },
        {
          pealkiri: "— Back into God's presence",
          loigud: [
            "And perhaps this is precisely why God calls us back into simplicity — into deeper silence, peace and His presence. To a place where the noise subsides, the heart turns to God and His voice again has room in our lives.",
            "Silence reveals the truth …",
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
            "In the story of Martha and Mary, Jesus gently says to Martha:\n\n“You are worried and troubled about many things, but one thing is needed. Mary has chosen the good part, which will not be taken away from her.”",
            "We do not always need more doing, more striving or more noise. Sometimes we need to pause and be present before we act.",
          ],
        },
        {
          pealkiri: "Biblical stillness …",
          loigud: [
            "… is an inner silence in which a person stops striving and begins to listen to God.",
            "In silence we turn more consciously to God and learn to rest in His presence.",
          ],
        },
        {
          pealkiri: "Where we are truly heading",
          loigud: [
            "And perhaps this is the deeper direction of our journey — not toward ever more doing, experiencing or knowing, but back into God's presence.",
            "In silence a new identity is not created. When the noise subsides and we remain in God's presence, the truth about our life, worth and calling begins to appear more clearly.\n\nIn this way, step by step, we move closer to God and grow ever more into the person He has created us to be.",
          ],
        },
        {
          pealkiri: "I help you slow down",
          loigud: [
            "I help you slow down and bring order to your spiritual, emotional and practical life.",
            "When the noise subsides, the truth becomes visible. From this clarity, choices are born that are in harmony with who God has created you to be.",
          ],
        },
      ],
      nimekirjaPealkiri: "What this space makes possible …",
      nimekiri: [
        "Clarity",
        "Inner peace",
        "A sense of order",
        "Encouragement",
        "Sometimes a single honest meeting is enough for something to begin to move into place.",
      ],
      toon: "sygav",
      tsitaat: {
        tekst: "",
        selgitus: "",
      },
    },
    {
      slug: "uks-uhele-teekond",
      nimi: "1:1 journey",
      alapealkiri: "A journey with me is not acceleration. It is coming into order.",
      luhike:
        "A month-long journey in which the spiritual, emotional and physical world begin to come into order together.",
      sissejuhatus:
        "Sometimes we do not need more knowledge but a space where everything can quietly become clear.",
      loigud: [
        "We meet once a week over the course of one month. On a fixed day. In a fixed rhythm. Not in order to “do more”… but to begin truly to see.",
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
        {
          pealkiri: "— This journey …",
          loigud: [
            "… is a return to God and an encounter with the person God has created you to be.",
          ],
        },
      ],
      tsitaat: {
        tekst: "— This is not simply change. It is a coming back to yourself.",
        selgitus:
          "If you feel that you are ready for this - then this journey is for you",
      },
      nimekirjaPealkiri: "Together we look at what needs ordering in your life",
      nimekiri: [],
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
      luhike: "Natural and genuine moments …",
      sissejuhatus: "Portrait",
      loigud: [
        "Black and white leaves what matters: the light, the presence and the person themselves.",
      ],
      plokid: [],
      nimekirjaPealkiri: "What this gives",
      nimekiri: [],
      toon: "sygav",
      tsitaat: {
        tekst: "",
        selgitus: "",
      },
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
      pealkiri: "Thoughts ...",
      /* Tühi, nagu eesti pool — pealkiri seisab üksi */
      tekst: "",
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
      viide: "Matthew 11:28",
      tekst:
        "“Come to me, all you who labor and are heavily burdened, and I will give you rest.”",
      selgitus:
        "This is an invitation to come just as you are — to pause and to breathe in God's presence.",
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
