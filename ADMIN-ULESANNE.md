# Ülesanne — admin-lehe kindlustamine

Koostatud 12. august 2026. Puudutab ainult `/admin` haru. Avalikku kujundust
ega tekste EI muudeta.

## Miks

Admin kaotab aeg-ajalt muudatusi ja põhjus ei ole selge. Põhjus on nüüd teada:
**salvestamine kirjutab iga kord kogu saidi sisu üle, ilma et keegi kontrolliks,
kas fail on vahepeal muutunud.**

`src/components/AdminToimeti.js:1047` laeb terve sisupuu lehe avamisel Reacti
olekusse ja `salvesta()` saadab terve puu tagasi. Server kirjutab
`data/sisu.<keel>.json` tervikuna üle. Versioonikontrolli ei ole.

Tagajärg: iga admini vahekaart hoiab hetktõmmist **lehe avamise hetkest**.
Vajutus „Salvesta" vanas vahekaardis veeretab kogu saidi sisu sinna hetke
tagasi. Kõik vahepealne kaob vaikselt, koos rohelise teatega „Salvestatud."
Sama viga on ka kalendril (`data/kalender.json`) ja kujundusel
(`data/kujundus.json`) — nemad salvestavad samamoodi terve seisu.

See seletab, miks kadu on juhuslik: ta ei ole seotud ühegi toiminguga, vaid
vahekaardi vanusega.

## P0 — Blokeerija: lõpeta kakskeelsuse refaktor

**Enne kõike muud.** `src/sisu/lae.js` (12.08 17:42) sai keeleteadliku API,
aga kutsujad on vanad ja admin ei salvesta praegu üldse.

Uus API:
```
vaikimisiSisu(keel)          — funktsioon, mitte objekt
laeSisu(keel)                — vaikekeel kui argumenti pole
salvestaSisu(keel, uusSisu)  — keel on ESIMENE argument
```

Katkised kutsujad:
- `src/app/admin/tegevused.js:79` — `puhasta(vaikimisiSisu, uusSisu)` annab
  funktsiooni sinna, kus oodatakse puud
- `src/app/admin/tegevused.js:85` — `salvestaSisu(puhastatud)` paneb puu
  keele kohale; `uusSisu` jääb `undefined` ja destruktureerimine viskab vea
- `src/app/admin/tegevused.js:107,112,114` — `Object.hasOwn(vaikimisiSisu, tee)`
  funktsiooni peal on alati `false`, seega „Lähtesta" ei leia ühtegi sektsiooni
- `src/app/admin/page.js:22` — `laeSisu()` ilma keeleta

Vaja on ka **keelevalikut admini liideses** (et/en), mis käib läbi
serveritegevuste. Admini enda sildid jäävad eestikeelseks sõltumata sellest,
kumba keelt toimetatakse.

**HOIATUS:** need failid olid 12.08 kell 17:47 muutmisel ja on commit'imata.
Kontrolli `git status` ja küsi omanikult, kas keegi teine seda parasjagu teeb,
enne kui puutud.

## P1 — Kadumise lõpetamine

### 1a. Optimistlik lukk

Uus abifail, nt `src/sisu/lukk.js`:

- `tunnusFailist(tee)` — tagastab faili tunnuse (sha256 sisust või
  `stat().mtimeMs`). Puuduv fail annab `null`, mitte vea.
- Iga laadimine annab sisu **kõrvale** tunnuse.
- Iga salvestus võtab tunnuse kaasa. Server loeb faili uuesti, arvutab tunnuse
  ja **keeldub**, kui see erineb:
  `{ ok: false, konflikt: true, viga: "Sisu on vahepeal muutunud. Laadi leht uuesti." }`
- Õnnestumisel tagastab uue tunnuse, klient uuendab oma oma.

Rakendada **kõigile neljale salvestusteele**:
`salvestaTegevus`, `lahtestaTegevus`, `salvestaKalendriTegevus`,
`salvestaKujundusTegevus`.

Konflikti korral **ei tohi** kasutaja teksti vaikselt minema visata. Näita
selget teadet ja jäta väljad puutumata, et sisu saaks kopeerida enne
uuesti laadimist.

Esimene salvestus, kui faili veel ei ole: tunnus `null` — luba läbi.

### 1b. Ajalugu: git kausta `data/` sees

Eesmärk ei ole ainult taastamine, vaid ka **vastus küsimusele „mis muutus"** —
just selle puudumine tegi algsest kaost uurimisprojekti.

- `git init` kausta `data/` (eraldi repo; välimine repo ignoreerib `/data`
  niikuinii, vt `.gitignore`).
- Iga salvestuse järel commit, sõnumis keel ja sektsioon.
- **Commit on best-effort.** Kui git ebaõnnestub (puuduv `user.email`,
  õigused, ükskõik mis), peab salvestus ise sellest hoolimata õnnestuma ja
  kasutaja nägema tavalist „Salvestatud". Ajalugu ei tohi kunagi saada
  blokeerijaks.
- Serveris tuleb korra seada `git config user.email` ja `user.name`.

Uus leht `/admin/varukoopiad`:
- loend commit'idest (`git log`) kuupäeva ja sektsiooni järgi
- iga kirje juures „Vaata muudatust" (`git diff`) ja „Taasta"
  (`git show <sha>:sisu.<keel>.json`), kinnitusdialoogiga
- **taastamine on ise samuti tavaline salvestus** — seega tekib commit ja
  taastamise-eelne seis jääb ajalukku alles
- taastatav sisu käib läbi `puhasta()` — vigane vana versioon ei tohi lehte
  maha võtta
- lisa link admini menüüsse (`src/app/admin/layout.js`)

Kui shell-kutsed on soovimatud, on varuvariant sama, mis enne: ajatempliga
koopiad `data/varukoopiad/`-i (sama nimekuju, mis skriptis
`npm run sisu:varunda`), viimased 20 alles. Toimib, aga diff'i ei anna.

### 1c. Salvestuslogi

Rida `data/logi.jsonl`-i iga salvestuse kohta: aeg, keel, sektsioon, baitide
arv, tunnus, kas tuli konflikt. Paar rida koodi, aga muudab järgmise imeliku
juhtumi vastatavaks küsimuseks ilma koodi lugemata.

## P2 — Kahju piiramine ja koodimuudatuste jõustamine

### 2a. Sektsioonipõhine salvestus — ESIALGU TEGEMATA

**Otsus: ära tee seda praegu.** Kui P1a lukk on paigas, on vana vahekaart juba
peatatud. Sektsioonipõhine salvestus vähendab pärast seda ainult
**valekonflikte** — olukorda, kus kaks inimest toimetavad eri sektsioone
korraga. Toimetajaid on üks, seega see lahendab probleemi, mida praegu ei ole,
ja toob kaasa tekstikujude liitmise nüansi, mille saab vaikselt valesti teha.

Tee see siis, kui teine toimetaja päriselt lisandub. Kirjeldus on siin alles,
et seda ei peaks uuesti välja mõtlema.

`AdminToimeti.js:139` `SEKTSIOONID` seob juba iga sektsiooni ülemise taseme
võtmetega (`teed`). Kasuta seda:

`salvestaTegevus(keel, teed, osa, tunnus)` — server laeb praeguse puu,
asendab **ainult loetletud ülemise taseme harud**, valideerib ja kirjutab.

Nii saab vana vahekaart rikkuda ainult selle sektsiooni, mis tal lahti on.

**Lõks:** tekstikujud (`TEKSTIKUJUDE_VOTI`) on lame kaart tee → kuju ning
sektsioonide ja keelte ülene. Sektsiooni salvestamisel **ei tohi** kaarti
tervikuna asendada — muidu kaovad teiste sektsioonide kujud. Liida võtmete
kaupa: asenda ainult need võtmed, mille tee algab salvestatava sektsiooni
harudega.

### 2b. Koodis tehtud tekstimuudatuse jõustamine

Praegu: kui `data/sisu.et.json` on olemas, siis `src/sisu/vaikimisi.js`
tekstid **ei jõua kunagi prodi** — salvestatu võidab alati
(`lae.js` `puhasta()`, lehe haru). Massiividega on hullem: salvestatud massiiv
asendab vaikimisi massiivi tervenisti, seega **koodis lisatud uus teenus,
hinnakirjarida või blogipostitus ei ilmu kunagi**.

Lisa skript, nt `npm run sisu:sunni <keel> <tee>`, mis kirjutab ühe haru
vaikimisi väärtuse salvestatud faili peale (teeb enne varukoopia). Nii saab
koodis tehtud tekstiparanduse teadlikult jõustada, ilma et peaks admini käsitsi
läbi klõpsima.

Dokumenteeri `README.md`-s selgelt: **tekste muudetakse admini kaudu, koodis
ainult siis, kui lisandub uus väli või struktuur.**

## P3 — Viimistlus

- Näita admini päises „viimati salvestatud <aeg>".
- Iga sektsiooni juurde link „Vaata lehel", mis avab vastava avaliku lehe.
- Broneeringute loend kasvab piirideta — lisa arhiveerimine või lehekülgede
  kaupa kuvamine, kui kirjeid koguneb.
- `README.md`: kirjelda lukku, varukoopiaid ja taastamist.
- Sessioonipiiraja (`src/admin/turve.js`) on protsessipõhine ja nulldub
  taaskäivitusel. See on teadlik valik — jäta nii, aga maini README-s.

## Mida MITTE teha

- **Ära vaheta admini CMS-i vastu.** Viga ei tule failisalvestusest, vaid
  salvestuse ulatusest ja luku puudumisest. Payload lahendaks P1 (dokumendilukk
  + kirjepõhine salvestus), aga tooks Postgresi, migratsioonid ja kaotaks
  käsitsi tehtud eestikeelse toimeti, mis on Marta jaoks parem kui geneeriline
  liides. Vahetus tasuks end ära alles siis, kui toimetajaid tuleb mitu või
  vaja läheb mustandeid.
- **Ära kirjuta rekursiivset toimetit ümber.** Selle väärtus on, et uus võti
  ilmub admini iseenesest — see omadus peab jääma.
- **Ära puutu avalikku kujundust.** „Püha Ruum" reeglid on `SEIS.md`-s;
  loendid ja registrid ei kasuta horisontaalseid jooni ega kriipse.
- **Ära commit'i `data/` kausta.**

## Vastuvõtukriteeriumid

Iga punkt peab olema päriselt läbi mängitud, mitte ainult koodis olemas.

1. **Kaks vahekaarti.** Ava admin kahes vahekaardis. Muuda ja salvesta
   vahekaardis A. Salvesta vahekaardis B → B keeldub konfliktiteatega ja
   **A muudatused on alles**.
2. **Varukoopia.** Salvesta kaks korda → `data/varukoopiad/` on kaks faili.
   Taasta vanem → sisu tuleb tagasi ja taastamise-eelsest seisust on samuti
   varukoopia.
3. **Sektsiooni eraldatus.** Ava vahekaart sektsiooniga „Avaleht". Muuda teises
   vahekaardis „Hinnakirja" ja salvesta. Salvesta nüüd „Avaleht" →
   hinnakirja muudatused on alles.
4. **Tekstikujud.** Sama nagu 3, aga sea „Hinnakirjas" mõnele tekstile kuju →
   kuju on pärast „Avalehe" salvestust alles.
5. **Kaks keelt.** Muuda eesti sisu, vaheta keelt, muuda inglise sisu,
   salvesta → `sisu.et.json` ja `sisu.en.json` on mõlemad õiged ning
   `tekstikujud.json` on üks ühine fail.
6. **Vigane fail.** Pane `data/sisu.et.json`-i prügi → avalik leht jääb
   vaikimisi sisu peale püsti, admin ei jookse kokku.
7. **Ilma JavaScriptita** töötavad endiselt väljalogimine ja broneeringu
   loetuks märkimine.
8. `npm run build` läbib, `npm run lint` puhas.

## Lõksud, mida teadma

- `data/` on gitist väljas ja elab **serveris**. Lokaalses arenduses on oma
  koopia. `npm run sisu:too` kirjutab lokaalse prodi omaga üle — ära jookse
  seda, kui lokaalselt on salvestamata tööd.
- `MALLID` on **kahes kohas**: `src/sisu/lae.js` ja
  `src/components/AdminToimeti.js`. Need peavad jääma sünkroonis.
- Võtme ümbernimetamine `vaikimisi.js`-is **kustutab vaikselt** Marta
  salvestatud teksti selle välja pealt (`puhasta()` käib vaikimisi puu võtmete
  peale, tundmatud kukuvad välja). Struktuurimuudatus vajab kas andmete
  ümbertõstmist või vähemalt hoiatust.
- Serveritegevus on **eraldi HTTP otspunkt**. Iga uus tegevus peab ise kutsuma
  `noudaSessiooni()` — layout'i kaitsest ei piisa.
- `src/app/admin/layout.js` ei tee `redirect()`-i meelega (tekiks silmus, sest
  layout katab ka `/admin/login` ega näe pathname'i). Ära „paranda" seda.
- Palett on kahes kohas sünkroonis: `globals.css @theme` ↔
  `src/kujundus/vaikimisi.js` (vt `SEIS.md`).
- **Deploy tagasikeeramise oht.** `lae.js` loeb `sisu.<keel>.json` ja kukub
  puudumisel tagasi vanale ühele failile `sisu.json`. Kui kakskeelsuse deploy
  kunagi tagasi keeratakse, hakkavad salvestused minema jälle `sisu.json`-i,
  aga uuesti ette liikudes eelistab lugemine `sisu.et.json`-i — vahepealsed
  muudatused muutuvad nähtamatuks. Sama sümptom, uus põhjus. Kui vana fail on
  serveris veel alles, kustuta või nimeta ümber kohe, kui `sisu.et.json` on
  esimest korda kirjutatud.

## Enne parandamist: kinnita diagnoos serveris

Diagnoos on tuletatud koodist, mitte serveris nähtust. Mehhanism on üheselt
selge, aga kinnitus maksab vähe:

- vaata, mis on `data/`-s tegelikult olemas (`sisu.json`, `sisu.et.json`,
  varukoopiad) ja mis on nende ajatemplid
- kui `data/varukoopiad/` sisaldab midagi, võrdle kahte järjestikust koopiat —
  kui üks neist on tervikuna vanem seis, on vana vahekaardi ülekirjutus
  otseselt tõestatud

## Järjekord

P0 → P1a → P1b → P1c → P2b → P3. (P2a jääb tegemata, vt sealt.)

P1a ja P1b üksi lahendavad kadumise ära. Kui aeg on piiratud, tee need kaks ja
jäta ülejäänu.
