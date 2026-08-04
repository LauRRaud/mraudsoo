/*
  VAIKIMISI SISU — kogu kodulehe tekst ühes puus.

  See fail on lähtepunkt: siin olev sisu kuvatakse siis, kui midagi ei ole veel
  admin-lehelt muudetud. Admin-lehelt salvestatud muudatused kirjutatakse faili
  data/sisu.json ja need kirjutavad siinsed väärtused üle (vt src/sisu/lae.js).

  Seepärast: siia kirjutatakse ainult vaikimisi tekstid, mitte kasutaja muudatused.
  Puu kuju (võtmete nimed) määratakse siin — data/sisu.json tundmatud võtmed
  jäetakse tähelepanuta, nii ei lähe leht katki, kui vaikimisi sisu hiljem täieneb.

  SÕNASTUSE REEGEL: Marta tekstid on siin sõna-sõnalt nii, nagu need on tema
  piltidel (`koduleht pildid` → `TEKSTID-KOIK.md`). Kirjavahemärke, reavahetusi
  ega kolmpunkte ei ühtlustata „ilusamaks” — tema kirjaviis on osa tema häälest.
  Kolmpunkt on tema piltidel üks märk „…”, mitte kolm punkti. Reavahetus tekstis
  (\n) tähendab, et pildil olid need read eraldi — leht hoiab need eraldi.
  Vt `TEKSTIKONTROLL.md` juurkaustas.
*/

export const vaikimisiSisu = {
  meta: {
    saidiNimi: "Marta Raudsoo",
    tunnuslause: "Püha Ruum, kohalolu ja selgus",
    kirjeldus:
      "Kohalolu, selgus ja stiil — et inimene võiks elada rohkem kooskõlas sellega, kelleks Jumal on ta loonud. Püha Ruum, stiiliselgus, garderoobi korrastus, teadlik ostlemine ja fotograafia.",
  },

  kontakt: {
    email: "martaraudsoo@gmail.com",
    instagram: "https://www.instagram.com/martaraudsoo/",
    instagramNimi: "@martaraudsoo",
    facebook: "https://www.facebook.com/marta.raudsoo",
    substack: "https://substack.com/@martaraudsoo",
  },

  navi: [
    { nimi: "Avaleht", tee: "/" },
    { nimi: "Minust", tee: "/minust" },
    { nimi: "Teenused", tee: "/teenused" },
    { nimi: "Hinnakiri", tee: "/hinnakiri" },
    { nimi: "Blogi", tee: "/blogi" },
    { nimi: "Broneerimine", tee: "/broneerimine" },
  ],

  avaleht: {
    hero: {
      silt: "Püha Kohalolu Kristuses",
      pealkiri: "Püha Ruum",
      alapealkiri: "Inimese terviklik korrastumine",
      tekst:
        "Usun, et Jumal on loonud iga inimese ainulaadseks. Minu kutsumus on aidata inimesel taas märgata oma väärtust, tuua ellu selgust ja luua kooskõla sisemise olemuse ning välise väljenduse vahel.",
      nuppEsmane: "Broneeri aeg",
      nuppTeine: "Vaata teenuseid",
    },

    kutsumus: {
      silt: "Kutsumus",
      tsitaat:
        "„Usun, et Jumal on kutsunud mind looma ruumi, kus inimene võib peatuda, olla kuuldud ning kogeda selgust.”",
      loigud: [
        "Mõnikord sünnib see vestluses ja palves. Mõnikord garderoobi korrastades, teadlikke valikuid tehes või fotosessioonil. Välised sammud saavad sageli peegeldada seda, mida Jumal teeb inimese südames.",
        "Minu teenused ei ole eraldi maailmad. Need on kõik ühe ja sama kutsumuse erinevad väljendusviisid. Väline ja sisemine ei ole lahus — riided, kodu, välimus ja valikud kannavad sageli inimese sisemist seisundit.",
      ],
      /* Loend failist „Lehe iseloomustus” — kuidas kutsumus praktikas väljendub */
      valjendusSissejuhatus:
        "Minu töö ühendab kohalolu ja praktilise korrastamise. See võib väljenduda läbi:",
      valjendus: [
        "sügava kuulamise ja peegeldamise",
        "eluetappide ja valikute selguse loomise",
        "isikliku stiili avastamise",
        "garderoobi korrastamise",
        "teadliku ja eesmärgipärase ostlemise",
      ],
    },

    /*
      Liikumine. Pealkiri on Marta enda lause („Lehe iseloomustus”, kus see on
      eraldi välja toodud kui tema oma sõnad) — varem seisis siin minu kirjutatud
      lause, mida allikates ei olnud.
    */
    liikumine: {
      silt: "Liikumine",
      pealkiri:
        "„Mis loovad samuti ellu selgust, kergust, tasakaalu, rahu, rõõmu ja vabadust.”",
      read: [
        { millest: "Kaosest", milleks: "selgusesse" },
        { millest: "Raskusest", milleks: "kergusesse" },
        { millest: "Killustatusest", milleks: "tasakaalu" },
        { millest: "Rahutusest", milleks: "rahusse" },
        { millest: "Lõksust", milleks: "vabadusse" },
      ],
    },

    /* Marta enda sõnad Instagramist — sinu unikaalne essents */
    essents: {
      silt: "Essents",
      pealkiri: "Sinu unikaalne essents — kelleks JUMAL on sind loonud …",
      loigud: [
        "Sinu essents … ei ole lihtsalt stiil. See ei ole ainult riided, värvid või vormid. See on sinu kohalolu. Sinu ehe viis olla. Sinu sisemine ilu. Sinu kordumatu väljendus. Sinu Jumala näo järgi loodud unikaalsus.",
        "Aga lisaks sellele usun … et iga inimene kannab endas midagi ainulaadset. Midagi, mida Jumal on just temasse pannud. Iga inimese elul on tähendus, suund ja kutsumus — ning tema olemuses on midagi, mis ei ole kellegi teisega asendatav.",
        "Ja riietus võib olla üks viis, kuidas see nähtavale tuleb. Mitte selleks, et tõestada oma väärtust, ega olla keegi teine. Ka mitte selleks, et sobituda maailma mõõdupuusse. Vaid selleks, et tulla rohkem kooskõlla sellega, kes sa päriselt oled.",
      ],
      /* Marta lause failist „Lehe iseloomustus” — seni lehel kasutamata */
      tsitaat:
        "„Jumal ei loo inimesi juhuslikult. Iga inimese sees on väärtus, isikupära ja ilu, mida saab õppida märkama ja austama.”",
    },

    /*
      Kirjakoht avalehele — seni ei olnud avalehel ühtegi salmi, kuigi leht
      algab usulise alusega. Tuli minust-lehe salmiridast, kus neid oli kuus.
    */
    kirjakoht: {
      viide: "Johannese 10:10",
      tekst: "„Mina olen tulnud, et neil oleks elu ja seda ülirohkesti.”",
      selgitus: "",
    },

    teenusedPlokk: {
      silt: "Teenused",
      /* Arv käib teenuste massiivi pikkusega kaasas */
      pealkiri: "Kuus viisi, kuidas sama kutsumus praktikas väljendub",
      linkTekst: "Kõik teenused",
    },

    minustPlokk: {
      silt: "Minust",
      pealkiri: "Kõik, mis minus on head, on Jumala kingitus",
      loigud: [
        "Pakun inimestele ruumi, kus on võimalik peatuda, olla kuuldud ja märgata uuesti seda, mis on elus oluline.",
        "Minu soov ei ole juhtida inimesi enda juurde, vaid aidata neil kasvada oma suhtes Jumalaga.",
      ],
      linkTekst: "Loe minust",
    },

    /* Lehe lõpetus on Marta enda slaid (IG 90), mitte minu kutselause */
    kutse: {
      silt: "Järgmine samm kuulub sinule",
      pealkiri: "Ja võib-olla on aeg näha ennast nii, nagu Jumal sind on loonud. 🤍",
      nuppEsmane: "Broneeri aeg",
      nuppTeine: "Vaata hinnakirja",
    },
  },

  minust: {
    hero: {
      silt: "Minust",
      pealkiri: "Pakun ruumi, kus on võimalik peatuda",
      tekst:
        "Pakun inimestele ruumi, kus on võimalik peatuda, olla kuuldud ja märgata uuesti seda, mis on elus oluline.",
    },

    /* Marta enda lugu Instagramist — kutsumuse sünd */
    lugu: {
      silt: "Minu lugu",
      pealkiri: "Igatsus kohtuda iseenda unikaalsusega",
      loigud: [
        "Nii kaua kui ma ennast mäletan, olen ma igatsenud kohtuda iseenda unikaalsusega. Mitte lihtsalt oma stiili, välimuse või rollide kaudu, vaid selle tõelise minaga — inimesega, kelleks JUMAL on mind loonud.",
        "Olen alateadlikult tundnud kutset ja tõmmet mõista: milline on see kordumatu „mina”, kelle Jumal on loonud?",
        "Ma mäletan ennast juba noorena … inimesi vaatlemas.",
        "Mitte lihtsalt nende riideid või välimust, vaid midagi enamat. Mind on alati paelunud, miks inimene riietub nii, nagu ta riietub …",
        "… ja miks ta on valinud just selle töö, selle viisi olla, selle väljenduse. Miks mõni inimene justkui peidab end. Miks mõni mõjub kohe kohalolevalt. Miks mõne inimese puhul on tunne, et tema väline pilt ja sisemine olemus ei ole omavahel kooskõlas.",
        "Ma tundsin sageli, nagu näeksin või tajuksin inimese juures midagi, mida ma ei osanud seletada. Vahel tundus see isegi kummaline.",
        "Aga täna ma mõistan, et see ei olnud juhuslik.",
        "See oli kutse. See oli sisemine suund. See oli and, mis vajas minus juurdumist ja küpsemist. Ma usun, et Jumal on pannud meie sisse annid.",
        "Mõnikord tunneme neid kaua enne, kui oskame neile nime anda. Mõnikord vajavad need aega, kogemusi ja kasvamist, enne kui me julgeme neid päriselt kuulata.",
        "Täna mõistan, et minu südames on olnud alati igatsus aidata inimesel kohtuda iseendaga — mitte selle versiooniga, kelleks ta on püüdnud saada, vaid selle inimesega, kelleks Jumal on ta loonud.",
      ],
    },

    kirjakoht: {
      viide: "1. Moosese 1:27",
      tekst: "„Ja Jumal lõi inimese oma näo järgi…”",
      selgitus:
        "Minu jaoks tähendab see, et ükski inimene ei ole juhuslik. Me ei ole loodud koopiatena. Meis kõigis on midagi Jumalast peegelduvat — ilu, loovust, tugevust, õrnust, sügavust, valgust ja kohalolu.",
    },

    /*
      Marta usu- ja pöördumislugu — Instagramist, tema enda sõnadega.
      Lõikude kaar: äratundmine (süda igatseb tõde) → vale alus → pöördepunkt
      → mida see andis → kutsumus. Kirjakohad käivad loo juurde ja järgivad
      sama kuju mis minust.kirjakoht.

      Reavahetused (\n) on pildilt: „Kui töö = turvalisus” oli kolm eraldi rida.
    */
    pooordumine: {
      silt: "Süda igatseb tõde",
      pealkiri: "Täna ma näen selgemalt kui iial varem",
      loigud: [
        "Inimese sees on kaks reaalsust korraga.",
        "Igatsus elada õigesti, soov olla aus, vajadus rahu ja lihtsuse järele - süda tunneb ära, mis on õige …",
        "Aga samal ajal… meie inimlik pool on väsinud, kardab, hoiab kinni harjumustest, läheb tagasi vanadesse mustritesse ja nii tekib vastuolu sa tead, mis on õige… aga ei ela seda.",
        "Sinu süda teab tõde aga Jumala vägi aitab sul seda elada 🤍",
        "Täna ma soovin küsida … millele me tegelikult oma elu ehitame?",
        "… kui elu on ehitatud sõltuvustele, siis oleme ehitanud liivale. Ja kui see kõik kõigub ja laguneb - kukub ka inimene.",
        "Kui töö = turvalisus\nraha = väärtus\nroll = identiteet",
        "See ei ole tõeline alus …",
        "… Aga ma elasin aastaid nii. Fookus oli arvete maksmine, ellujäämine, süsteemis püsimine. Ja kuigi väliselt tundus justkui „korras”… siis enda sees olin ma katki.",
        "Täna ma saan ausalt tunnistada - ma teenisin süsteemi, mitte Jumalat. Ja kui puudub suhe Jumalaga, hakkame alati teenima midagi muud … seni kuni ei ole kohtunud tõega.",
        "Jumala sõna kuulekus … loob stabiilse vundamendi (kalju), mis peab vastu eluraskustele, samas kui sõnade eiramine viib vaimse huku ja kokkuvarisemiseni.",
        "Minu jaoks algas muutus siis…",
        "… kui ma hakkasin päriselt lahti laskma valest. See ei olnud lihtne, see oli valus, ebakindel ja murdis mu vanad alused. Aga samal ajal hakkas sündima midagi uut …",
        "Ja kui ma andsin oma elu …",
        "… oma töö, oma kutsumise, oma tuleviku. Jumala kätte - siis on hakanud muutuma …",
        "… Mu süda, mu meel, mu suhe eluga.",
        "Ristimine oli minu jaoks pöördepunkt.",
        "Me ei kaota midagi, vastupidi - kohtume tõe, tee ja eluga.",
        "Sest Jumala tee lammutab selle, mis ei ole tõde ja ehitab selle, mis jääb.",
        "Ei ole enam lihtsalt töö vaid KUTSUMUS, ei ole enam pingutus, vaid TEENIMINE ARMASTUSEST, ei juhi enam hirm vaid RAHU.",
      ],
      /* Sama kuju mis minust.kirjakoht. Selgitus on tühi seal, kus pildil seda ei olnud. */
      kirjakohad: [
        {
          viide: "Markuse 14:38",
          tekst:
            "„Valvake ja palvetage, et te ei satuks kiusatusse! Vaim on küll valmis, aga liha on nõder.”",
          selgitus:
            "See piiblisalm rõhutab vajadust olla vaimselt ärkvel ja palvemeelne, et vältida kiusatusi, tunnistades inimese tahtejõu ja füüsilise nõrkuse vahelist konflikti. See on Jeesuse hoiatus jüngritele märkides, et kuigi sisemine soov (vaim) on järgida Jumalat, on inimloomus (liha) nõrk ja vajab palvetoe kaudu jõudu.",
        },
        {
          viide: "Roomlastele 7:19",
          tekst: "„Ma ei tee head, mida ma tahan, vaid kurja, mida ma ei taha.”",
          selgitus:
            "Inimene ei ole loodud elama ainult oma jõust … me vajame Jumalat.",
        },
        {
          viide: "Matteuse 7:24-27",
          tekst:
            "„Kes kuuleb mu sõnu ja teeb nende järgi… on nagu mees, kes ehitas oma maja kaljule… Aga kes ei tee… on nagu see, kes ehitas liivale.”",
          selgitus: "",
        },
        {
          viide: "Matteuse 6:24",
          tekst:
            "„Keegi ei saa teenida kahte Issandat, sest ta kas vihkab ühte ja armastab teist või hoidub ühe poole ega hooli teisest. Te ei saa teenida Jumalat ja mammonat.”",
          selgitus:
            "Jumal ei kutsu meid elama kurnatuses. Ta kutsub meid elama Tões.",
        },
        {
          viide: "Matteuse 16:24",
          tekst:
            "„Kui keegi tahab käia minu järel, siis ta salgagu iseennast… ja järgnegu mulle.”",
          selgitus:
            "Enam ei ole minu tee, vaid Tema tee. Kui ma lasen lahti oma teest, avaneb tee, mida ma ise ei oleks kunagi näinud. Ma ei ela enam ainult oma soovide, plaanide ja arusaamise järgi… vaid usaldan Jumala juhtimist oma elus.",
        },
      ],
    },

    /* Annid — Marta enda sõnastus, 1. Korintlastele 12 põhjal */
    annid: {
      silt: "Annid",
      pealkiri: "Annid, mida olen oma teekonnal ära tundnud",
      sissejuhatus:
        "Korintlastele 12 õpetab, et Püha Vaim annab oma ande ühiseks kasuks. Oma teekonnal olen kõige enam märganud, et Jumal kasutab minu kaudu eelkõige:",
      loend: [
        {
          nimi: "tarkuse jagamist",
          kirjeldus: "aidata näha olukordi laiemalt ja mõista järgmisi samme",
        },
        {
          nimi: "tunnetust",
          kirjeldus: "märgata seda, mis vajab tähelepanu või korrastumist",
        },
        {
          nimi: "usu julgustamist",
          kirjeldus: "tuletada meelde lootust ja usaldust Jumala vastu",
        },
        {
          nimi: "kuulamist ja kohalolu",
          kirjeldus:
            "luua turvaline ruum, kus inimene võib olla aus ning kogeda selgust",
        },
      ],
    },

    tsitaat: {
      tekst:
        "„Need ei ole minu saavutused. Need on Jumala armu kingitused, mida soovin kasutada ustavalt teiste teenimiseks.”",
    },

    terviklikkus: {
      silt: "Terviklikkus",
      pealkiri: "Jumal hoolib terviklikust inimesest",
      loigud: [
        /* Sõna-sõnalt pildilt (IG 226): koma, punkti ega mõttekriipsu seal ei ole */
        "Selles teekonnas hakkab korrastuma - vaimne emotsionaalne, füüsiline maailm\nMitte eraldi vaid koos.",
        "Seepärast kohtuvad minu töös sisemine ja väline — kuulamine ja praktilised sammud, kohalolu ja korrastumine.",
        "Kui südames sünnib selgus, saab see hakata peegelduma ka igapäevases elus: valikutes, garderoobis, kodus, eneseväljenduses ja suhetes.",
      ],
    },

    lopp: {
      tsitaat:
        "„Kõik, mis minus on head, on Jumala kingitus. Minu soov ei ole juhtida inimesi enda juurde, vaid aidata neil kasvada oma suhtes Jumalaga.”",
      nuppTekst: "Võta ühendust",
    },
  },

  teenusedLeht: {
    hero: {
      silt: "Teenused",
      pealkiri: "Ühe kutsumuse erinevad väljendusviisid",
      tekst:
        "Minu teenused ei ole eraldi maailmad. Püha Ruum ei ole üks teenus ning stiiliselgus, garderoobi korrastus, teadlik ostlemine ja fotograafia teised. Need on kõik ühe ja sama kutsumuse erinevad väljendusviisid.",
    },
    loeLahemalt: "Loe lähemalt",
    /* Marta sõnad (IG 241) — kehtivad kõigi teenuste kohta, mitte ainult Püha Ruumi */
    tsitaat:
      "Minu tee ei ole ainult minu oma — see on teenimine läbi kohalolu, kuulamise ja sügava empaatia.",
    tsitaadiSilt: "Kohalolu",
    lopp: {
      pealkiri: "Ei tea, kust alustada?",
      tekst:
        "Kirjuta lihtsalt, mis sind praegu kõige rohkem puudutab. Leiame koos õige koha, kust alustada.",
      nuppEsmane: "Võta ühendust",
      nuppTeine: "Hinnakiri",
    },
  },

  teenused: [
    {
      slug: "puha-ruum",
      nimi: "Püha Ruum",
      alapealkiri: "Püha Kohalolu Kristuses",
      luhike:
        "Turvaline ruum kuulamiseks, peegelduseks, palveks ja selguse leidmiseks.",
      sissejuhatus:
        "Pakun inimestele ruumi, kus on võimalik peatuda, olla kuuldud ja märgata uuesti seda, mis on elus oluline.",
      loigud: [
        "Usun, et Jumal kasutab erinevaid inimesi erineval viisil. Minu südames on saanud oluliseks luua keskkond, kus võivad sündida:",
        "Kõik see sünnib usus, palves ja sooviga anda kogu au Jumalale.",
      ],
      plokid: [
        {
          pealkiri: "Psalm 62:1",
          loigud: [
            "„Üksnes Jumala juures on mu hing vait, temalt tuleb mu pääste.”",
            "Vaikus = koht, kus hing leiab rahu, tõe ja selguse …",
          ],
        },
        {
          pealkiri: "Luuka 21:34",
          loigud: [
            "„Pidage aga endid silmas, et teie süda ei oleks koormatud…”",
            "Kui süda on täis… siis ei ole enam ruumi kuulda.",
            "Me kuulame, aga ei jõua mõista. Me kogeme, aga ei jõua integreerida. Me oleme kohal, aga ei jõua päriselt kohale.",
          ],
        },
        {
          pealkiri: "Jumal kutsub meid tagasi lihtsusesse",
          loigud: [
            "Ja võib-olla just sellepärast… Jumal kutsub meid tagasi lihtsusesse aga sügavale … vaikusesse, rahusse häälestumisesse.",
            "Vaikus ei loo identiteeti, vaid paljastab tõe …",
          ],
        },
        {
          pealkiri: "Jesaja 30:15",
          loigud: [
            "„Pöördudes ja vaikseks jäädes te pääseksite, rahus ja lootuses oleks teie jõud, kuid teie pole seda tahtnud.”",
          ],
        },
        {
          pealkiri: "Luuka 5:16",
          loigud: [
            "„Temal oli aga viisiks minna tühja paika ja seal palvetada.”",
            "Jeesus ise eemaldus regulaarselt mürast.",
          ],
        },
        {
          pealkiri: "Luuka 10:41–42",
          loigud: [
            "Marta ning Maarja loos ütleb Jeesus manitsedes Martat leebelt: „Sa muretsed ja vaevad ennast paljude asjadega, kuid tarvis on vaid üht. Maarja on ju valinud hea osa, mida ei võeta temalt ära.”",
            "Me ei vaja mitte rohkem tegemist - müra, vaid kohalolu.",
          ],
        },
        {
          pealkiri: "Piibelik vagusus",
          loigud: [
            "Piibelik vagusus on sisemine vaikus, kus inimene lõpetab rabelemise ja hakkab kuulama Jumalat.",
          ],
        },
        {
          pealkiri: "Häälestunud kohalolu",
          loigud: [
            "Ma nimetaks seda häälestunud kohaloluks … See on koht, kus müra vaibub, tempo aeglustub ja süda saab taas ruumi.",
            "Just vaikuses saab inimene tagasi ühendusse Jumalaga.",
            "Häälestunud kohalolu on sisemine rahu keset elu, kus ei pea enam kõike kontrollima, tõestama ega kiirustama.",
            "Häälestunud kohalolus saab vaikselt ilmsiks TÕDE, meie tõeline identiteet …",
          ],
        },
        {
          pealkiri: "Kuhu me tegelikult teel oleme",
          loigud: [
            "Ja võib-olla see ongi see, kuhu me tegelikult teel oleme… mitte rohkem tegemise, mitte rohkem kogemise, mitte rohkem teadmise poole - vaid tagasi …",
            "… tagasi sellesse, kes me oleme Jumalas. Sest vaikuses ei kao midagi ära. Vaikuses hakkab ilmnema tõde. Ja samm-sammult… me liigume lähemale sellele, kes me oleme olnud kogu aeg.",
          ],
        },
        {
          pealkiri: "Ma aitan sul aeglustuda",
          loigud: [
            "Ma aitan sul aeglustuda, korrastada vaimset, emotsionaalset ja füüsilist maailma …",
            "… ja kohtuda tõega - sellest kohast sünnivad õiged valikud.",
          ],
        },
      ],
      nimekirjaPealkiri: "Selles ruumis võib sündida",
      nimekiri: [
        "kuulamine",
        "selgus",
        "korrastumine",
        "julgustus",
        "järgmiste sammude eristamine",
      ],
      toon: "sygav",
    },
    {
      slug: "uks-uhele-teekond",
      nimi: "1:1 teekond",
      alapealkiri: "Minuga teekond ei ole kiirendus. See on korrastumine.",
      luhike:
        "Kuupikkune teekond, kus vaimne, emotsionaalne ja füüsiline maailm hakkavad korrastuma koos.",
      sissejuhatus:
        "Mõnikord ei vaja me rohkem teadmisi… vaid ruumi, kus kõik saab vaikselt selgineda.",
      loigud: [
        "Kohtume ühe kuu jooksul kord nädalas. Kindlal päeval. Kindlas rütmis. Mitte selleks, et „rohkem teha”… vaid et hakata päriselt nägema.",
        "Me vaatame üle sinu elu päriselt. Mis sind toetab… ja mis mitte. Kus sinu energia liigub… ja kuhu see vaikselt kaob.",
        "Me ei kiirusta muutust. Aga me ei väldi ka tõde.",
      ],
      plokid: [
        {
          pealkiri: "Füüsiline korrastus",
          loigud: [
            "Füüsiline korrastus on selle teekonna osa. Sinu ruum. Sinu garderoob. Sinu igapäevane keskkond - sest see, mis on nähtav, peegeldab seda, mis toimub su sees …",
          ],
        },
        {
          pealkiri: "Suhted ja tegevused",
          loigud: [
            "Me puudutame ka suhteid. Ja tegevusi. Õpime märkama, kuhu sa annad oma energiat ja kas see kannab sind.",
          ],
        },
        {
          pealkiri: "Ja tasapisi",
          loigud: [
            "Ja tasapisi… hakkab tekkima selgus ja läbipaistvus. Mitte läbi pingutuse - vaid vaimse, emotsionaalse ja füüsilise maailma korrastumise.",
          ],
        },
      ],
      tsitaat: {
        tekst: "See ei ole lihtsalt muutus. See on tagasi tulemine iseenda juurde.",
        selgitus:
          "Kui tunned, et oled selleks valmis… siis see teekond on sinu jaoks 🤍",
      },
      nimekirjaPealkiri: "Vaatame koos, mis vajab sinu elus korrastust",
      nimekiri: [
        "telefoni/arvuti korrastus",
        "sotsiaameedia korrastus",
        "füüsilise ruumi korrastus",
        "organiseerimine, süstematiseerimine - kodu, garderoob",
      ],
      toon: "sygav",
    },
    {
      slug: "stiiliselgus",
      nimi: "Stiiliselgus",
      alapealkiri: "Nähtavaks saanud olemus",
      luhike:
        "Aitan luua selguse, mis väljendab inimese olemust, väärtusi ja eluhooaega.",
      sissejuhatus:
        "Esimene samm sinu isikliku stiili essentsi, garderoobi inventuuri ja teadlikumate valikute suunas.",
      loigud: [
        "Stiil ei ole ainult välimus. See on viis, kuidas inimene väljendab seda, kes ta on.",
      ],
      plokid: [
        {
          pealkiri: "3 küsimustikku + personaalne peegeldus + visuaalne stiilisuund",
          loigud: [
            "See on esimene ja kõige olulisem samm.",
            "Stiiliselgus ei ole lihtsalt küsimustike täitmine ega vastuste ülevaade.",
          ],
        },
        {
          pealkiri: "Personaalne visuaalne stiilisuund",
          loigud: [
            "Lisaks loon sulle personaalse visuaalse stiilisuuna — sinu stiiliessentsi ja kohalolu visuaalse kaardi.",
            "See aitab näha, millised toonid, vormid, kangad, detailid ja tervikpilt toetavad sinu olemust ning annavad su stiilile selgema suuna.",
          ],
        },
        {
          pealkiri: "Stiiliessents ja energeetiline kohalolu",
          loigud: [
            "Stiiliessents = milline stiil sind toetab.",
            "Energeetiline kohalolu = kuidas sina mõjud.",
            "Stiiliessents räägib sinu stiilikeelest.",
            "Energeetiline kohalolu räägib sinu olemuse mõjust.",
          ],
        },
      ],
      tsitaat: {
        tekst:
          "See on personaalne peegeldus sellest, kuidas sinu olemus, stiil, keha ja kohalolu omavahel kohtuvad.",
        selgitus: "",
      },
      nimekirjaPealkiri: "Saad selgust …",
      nimekiri: [
        "milline on sinu põhiline stiiliessents / millised lisaessentsid annavad sinu stiilile sügavust",
        "milline on sinu energeetiline kohalolu",
        "millised toonid, lõiked, materjalid ja detailid sind toetavad",
        "millises riietuses tunned end päriselt nähtuna",
        "milline stiilisuund aitab sul liikuda lähemale iseendale",
      ],
      toon: "soe",
    },
    {
      slug: "garderoobi-korrastus",
      nimi: "Garderoobi korrastus",
      alapealkiri: "Kergus · Rahu · Tasakaal · Rõõm",
      luhike:
        "Loome koos korra ja lihtsuse, et igapäevased valikud toetaksid sinu elu.",
      sissejuhatus:
        "Kui stiiliselgus on loodud, on järgmine loomulik samm garderoobi INVENTUUR.",
      loigud: [
        "Mis toetab, mis ei kaunista enam?",
        "Garderoobi korrastades ei korrasta me ainult riideid — vaid aitame märgata: kes sa oled, mis sulle päriselt sobib, millest on aeg lahti lasta ja kuidas väljendada oma olemust ausamalt.",
      ],
      plokid: [],
      tsitaat: {
        tekst:
          "Tulemuseks on garderoob, mis loob rohkem kergust, selgust ja rahu — ning on kooskõlas sinu elu, keha ja olemusega.",
        selgitus: "",
      },
      nimekirjaPealkiri: "Vaatame koos",
      nimekiri: [
        "mis sind toetab",
        "mis varjab",
        "mis ei tundu enam sinu moodi",
        "mida saab uutmoodi kombineerida",
        "millest võib rahulikult lahti lasta",
        "mida tasub taaskasutusse viia",
        "mis on garderoobist puudu",
      ],
      toon: "soe",
    },
    {
      slug: "teadlik-ostlemine",
      nimi: "Teadlik ostlemine",
      alapealkiri: "Valikud, mis lähtuvad vajadusest",
      luhike:
        "Kogemus teha läbimõeldud valikuid, mis lähtuvad vajadusest, mitte survest või emotsioonist.",
      sissejuhatus:
        "Kui garderoob on üle vaadatud, saab ostlemine muutuda palju teadlikumaks.",
      loigud: [],
      plokid: [],
      tsitaat: {
        tekst:
          "… kuidas liikuda vanast mina-pildist lähemale sellele versioonile sinust, kes on oodanud, et teda märgataks.",
        selgitus: "",
      },
      nimekirjaPealkiri: "Nüüd tead …",
      nimekiri: [
        "mida sinu garderoob päriselt vajab",
        "millised toonid, lõiked ja materjalid sind toetavad",
        "millised riided on kooskõlas sinu elu, keha ja olemusega",
        "kuidas teha valikuid teadlikumalt, mitte enam hetke emotsioonist",
        "millised riided aitavad sul tunda end enesekindlamalt, vabamalt ja rohkem iseendana",
      ],
      toon: "soe",
    },
    {
      /*
        FOTOGRAAFIA — ainus teenus, mille kohta Martalt teksti ei ole.
        Allikas annab ainult „Must valge” ja ühe lause. Siinsed laused on
        ajutised — küsi Martalt 2–3 lauset ja „Mida see annab” loend.
      */
      slug: "fotograafia",
      nimi: "Fotograafia",
      alapealkiri: "Must-valge",
      luhike:
        "Loomulikud ja ehedad hetked, mis jäädvustavad inimese sellisena, nagu ta on.",
      sissejuhatus: "Portreed, mis ei püüa kedagi kellekski teiseks teha.",
      loigud: [
        "Must-valge jätab alles selle, mis on oluline: valguse, kohalolu ja inimese enda.",
      ],
      plokid: [],
      nimekirjaPealkiri: "Mida see annab",
      nimekiri: [],
      toon: "sygav",
    },
  ],

  teenuseLeht: {
    nimekirjaSilt: "Mida see annab",
    kutseSilt: "Alustame",
    kutsePealkiri: "Kas see kõnetas sind?",
    kutseTekst:
      "Kirjuta julgelt. Vastan ise ja leiame koos sobiva aja ning viisi.",
    nuppEsmane: "Broneeri aeg",
    nuppTeine: "Hinnakiri",
    jargmineSilt: "Järgmine teenus",
    loeLahemalt: "Loe lähemalt",
  },

  hinnakiriLeht: {
    hero: {
      silt: "Hinnakiri",
      pealkiri: "Selge kokkulepe juba enne alustamist",
      tekst:
        "Iga teekond on erinev. Kui sa ei tea, milline teenus sind kõige rohkem aitaks, kirjuta lihtsalt — mõtleme koos.",
    },
    uksikudSilt: "Üksikteenused",
    teekondSilt: "Kolm sammu koos",
    sisaldabSilt: "Sisaldab",
    /* Marta lause failist „Lehe iseloomustus” — seni lehel kasutamata */
    tsitaat: "Väärtus on inimesel juba Jumalalt. Mina aitan seda märgata ja väljendada.",
    tsitaadiSilt: "Väärtus",
    lopp: {
      pealkiri: "Kui hind on takistuseks, räägi sellest.",
      tekst:
        "Leiame lahenduse. Mulle on olulisem, et sa saaksid abi, kui see, et kõik käiks ühtemoodi.",
      nuppTekst: "Võta ühendust",
    },
  },

  /*
    HINNAKIRI — ETTEPANEK, vajab Marta kinnitust.
    Üksikteenused kokku 490 €, Stiiliteekonnana koos 450 € (sääst 40 €).
  */
  hinnakiri: [
    {
      nimi: "Püha Ruum | Püha Kohalolu",
      kestus: "1 tund",
      hind: "60 €",
      kirjeldus:
        "Vestlus, kuulamine, peegeldus ja palve. Kohtume kas kohapeal või veebis.",
    },
    /*
      1:1 teekond — HIND ON ETTEPANEK, vajab Marta kinnitust.
      Kestus tuleb Marta enda tekstist: üks kuu, kohtumine kord nädalas ehk
      neli kohtumist. Võrdluseks: Stiiliteekond (kolm kohtumist) 450 €.
      1:1 kuu on mahult suurem ja katab lisaks vaimse, emotsionaalse ja
      füüsilise maailma korrastuse — seepärast 480 €.
    */
    {
      nimi: "1:1 teekond",
      kestus: "Üks kuu, kord nädalas",
      hind: "480 €",
      kirjeldus:
        "Neli kohtumist kindlal päeval ja kindlas rütmis. Vaatame koos üle elu, ruumi, garderoobi, suhted ja tegevused — vaimne, emotsionaalne ja füüsiline maailm korrastuvad koos.",
    },
    {
      nimi: "Stiiliselgus",
      kestus: "2–3 tundi",
      hind: "150 €",
      kirjeldus:
        "Sinu stiiliessentsi kaardistamine: toonid, lõiked, materjalid ja see, mis sind päriselt toetab.",
    },
    {
      nimi: "Garderoobi korrastus",
      kestus: "3–4 tundi",
      hind: "180 €",
      kirjeldus:
        "Käime garderoobi koos läbi. Jääb kord, selgus ja arusaam sellest, mis on olemas ja mis puudu.",
    },
    {
      nimi: "Teadlik ostlemine",
      kestus: "3 tundi",
      hind: "160 €",
      kirjeldus:
        "Koos poes või veebis. Praktiline kogemus, mis jääb sind edaspidi teenima.",
    },
    {
      nimi: "Fotograafia",
      kestus: "1–2 tundi",
      hind: "180 €",
      kirjeldus: "Must-valge portreesessioon ja töödeldud pildid.",
    },
  ],

  /* Stiiliteekond — kolm stiiliteenust ühe teekonnana */
  teekond: {
    nimi: "Stiiliteekond",
    hind: "450 €",
    vordlus: "eraldi 490 €",
    kirjeldus:
      "Kolm sammu ühe teekonnana: esmalt selgus selles, kes sa oled ja mis sind toetab, seejärel garderoobi korrastus ning lõpuks praktiline kogemus teadlikust ostlemisest. Teekonna tempo lepime kokku sinu elu järgi.",
    sisaldab: [
      "Stiiliselgus — sinu stiiliessents ja see, mis sind toetab",
      "Garderoobi korrastus — kord, selgus ja lihtsus",
      "Teadlik ostlemine — praktiline kogemus koos",
      "kirjalik kokkuvõte ja suund edasiseks",
    ],
  },

  blogiLeht: {
    hero: {
      silt: "Blogi",
      pealkiri: "Mõtteid teelt",
      tekst:
        "Mõtteid kohalolust, selgusest ja sellest, kuidas sisemine ja väline korrastumine käivad käsikäes.",
    },
    tyhiPealkiri: "Esimesed postitused on siia tulekul.",
    tyhiTekst:
      "Seniks kirjutan Substackis. Sealt leiad pikemad mõtted ja saad soovi korral tellida, et uus kirjutis sinuni jõuaks.",
    substackTekst: "Loe Substackis",
  },

  /*
    BLOGI — postitused lisatakse admin-lehelt.
    Iga postitus: { slug, pealkiri, kuupaev (ISO), sissejuhatus, loigud: [] }
    Praegu tühi: Marta kirjutab hetkel Substackis, esimesed postitused tulevad siia hiljem.
  */
  postitused: [],

  /*
    OMALOODUD LEHED.

    Marta lisab neid admin-lehelt. Iga leht saab aadressi /<slug> ja koosneb
    plokkidest. Menüüsse lisamiseks tuleb lisada rida ka navi alla, tee kujul
    "/minu-leht" — nii jaab kontroll selle ule, mis menuus nahtaval on.
  */
  lehed: [],

  broneerimine: {
    hero: {
      silt: "Broneerimine",
      pealkiri: "Alustame vestlusest",
      tekst:
        "Sa ei pea enne teadma, mida täpselt vajad. Kirjuta lihtsalt, mis sind praegu kõige rohkem puudutab — leiame koos õige koha, kust alustada.",
    },
    vormSilt: "Saada soov",
    kontaktSilt: "Või kirjuta otse",
    markus:
      "Vastan ise ja võimalikult kiiresti. Kui sul on küsimus, mille kohta sa pole kindel, kas see üldse sobib — küsi ikkagi.",
    /* Kirjakoht Marta piltidelt (IG 128) — kutse peatuda enne, kui kirjutad */
    kirjakoht: {
      viide: "Psalm 46:10",
      tekst: "„Olge vagusi ja teadke, et mina olen Jumal.”",
      selgitus: "See on kutse peatuda ja häälestuda …",
    },
  },

  jalus: {
    tutvustus:
      "Kohalolu, selgus ja stiil — et inimene võiks elada rohkem kooskõlas sellega, kelleks Jumal on ta loonud.",
  },

  eiLeitud: {
    silt: "404",
    pealkiri: "Seda lehte ei õnnestunud leida",
    tekst: "Võib-olla on aadress muutunud. Alusta avalehelt või vaata teenuseid.",
    nuppEsmane: "Avalehele",
    nuppTeine: "Teenused",
  },
};
