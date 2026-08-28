## Admin ja paigaldus

Kogu kodulehe tekst elab sisupuus. Vaikimisi tekstid on koodis
(`src/sisu/vaikimisi.js` eesti, `src/sisu/vaikimisiEn.js` inglise keeles),
admin-lehelt salvestatud muudatused failides `data/sisu.et.json` ja
`data/sisu.en.json`. Kaust `data/` on gitist välja jäetud — see elab serveris.

**Tekste muudetakse admin-lehelt.** Koodis olevaid vaikeväärtusi puutu ainult
siis, kui lisandub uus väli või struktuur — juba salvestatud välja peal ei muuda
koodimuudatus mitte midagi (salvestatu võidab alati). Kui koodis tehtud parandus
on vaja siiski jõustada, vt „Koodimuudatuse jõustamine” allpool.

### Kaks keelt

- Eesti pool seisab ilma prefiksita (`/minust`), inglise pool prefiksiga
  (`/en/minust`). `src/proxy.js` kirjutab prefiksita aadressi seesmiselt
  `/et/…` peale ümber, seega kõik senised lingid kehtivad edasi.
- `/et/…` suunatakse 308-ga puhtale aadressile, et sama sisu ei vastaks kahe
  aadressi peal.
- Keelevahetus on päises (töölaual „EST · ENG”, mobiilis menüüpaneeli ülaservas).
- Adminis vahetab keelt `/admin` ↔ `/admin?keel=en`.
- **Tekstide kuju** (värv, suurus, font, joondus) on keelte peale **ühine** ja
  elab failis `data/tekstikujud.json`. Kujunda korra, muutub mõlemal pool.
- Teenuste `slug` peab jääma mõlemas keeles samaks, muidu lagunevad lingid.

### Salvestuse lukk, varukoopiad ja logi

Admin laeb lehe avamisel terve sisupuu ja salvestab terve puu tagasi. Ilma
lukuta veeretas vana vahekaardi „Salvesta” kogu saidi sisu selle vahekaardi
avamise hetke tagasi — vaikselt, koos rohelise teatega „Salvestatud”.

- **Lukk.** Iga laadimine annab kaasa failide tunnuse (sisu räsi,
  `src/sisu/lukk.js`). Salvestus saadab tunnuse tagasi ja server keeldub, kui
  fail on vahepeal muutunud. Toimeti näitab siis selget teadet ja **jätab
  väljad puutumata**, et tekst saaks enne uuesti laadimist kopeerida.
  Lukk katab kõik neli salvestusteed: sisu, lähtestamine, kalender, kujundus.
- **Varukoopiad.** Enne igat ülekirjutamist tehakse koopia EELMISEST seisust
  kausta `data/varukoopiad/` (viimased 20 iga faili kohta). Admin-lehel
  `/admin/varukoopiad` on loend ja „Taasta”. Taastamine on ise samuti tavaline
  salvestus, seega taastamise-eelne seis jääb ka ajalukku — vale klõpsu saab
  kohe tagasi keerata.
- **Logi.** `data/logi.jsonl` — rida iga salvestuse kohta: aeg, liik, keel,
  sektsioon, baitide arv, tunnus ja kas tuli konflikt. Koopiad ja logi on
  mõlemad *best-effort*: kui nad ebaõnnestuvad, salvestus ise siiski õnnestub.

### Koodimuudatuse jõustamine

Salvestatud väärtus võidab alati, ja massiividega on hullem: salvestatud massiiv
asendab vaikimisi massiivi tervenisti, seega **koodis lisatud uus teenus,
hinnakirjarida või blogipostitus ei ilmu iseenesest kunagi**. Ühe haru saab
teadlikult koodi vaikeväärtusele tagasi sundida:

```bash
npm run sisu:sunni             # näitab, mis keeled ja harud on olemas
npm run sisu:sunni -- et avaleht
npm run sisu:sunni -- en teenused
```

Skript teeb enne kirjutamist varukoopia, seega vale käsu saab admini
„Varukoopiad” lehelt tagasi võtta.

### Admin-leht

- Aadress: `/admin` (sisselogimise otsetee: `/admin/login`)
- Sisse logitakse ühe parooliga, mis tuleb keskkonnamuutujast `ADMIN_PAROOL`.
- Kui `ADMIN_PAROOL` on määramata, on admin **lukus**: sisse logida ei saa ja
  leht ütleb, mida serveris teha tuleb.
- Sessioon on `httpOnly` küpsis `mr_sessioon`, kehtivus 30 päeva. Parooli
  vahetamine serveris tühistab automaatselt kõik vanad sessioonid.
- Ebaõnnestunud katseid lubatakse 8 tükki 15 minuti jooksul. Piiraja on
  **protsessipõhine** ja nullub rakenduse taaskäivitusel — see on teadlik
  valik: eesmärk on aeglustada automaatset paroolinuhkimist, mitte pidada
  auditilogi.

### ADMIN_PAROOL serveris

Parool antakse rakendusele keskkonnamuutujana. pm2-ga (protsess `mraudsoo`):

```
ssh sotsiaalai
cd /home/ubuntu/apps/mraudsoo
printf 'ADMIN_PAROOL=<pikk-juhuslik-parool>\n' >> .env.local
chmod 600 .env.local
pm2 restart mraudsoo --update-env
```

`.env.local` on gitist välja jäetud. Parooli ei tohi panna koodi ega repo sisse.

### Kaustaõigused

Admin kirjutab kausta `data/` (aatomiliselt: `.tmp` + `rename`), kaust luuakse
vajadusel ise. Failid: `sisu.et.json`, `sisu.en.json`, `tekstikujud.json`,
`kujundus.json`, `kalender.json`, `broneeringud.json`, `logi.jsonl` ja
alamkaust `varukoopiad/`. Kaust `data/` peab jääma deploy'de vahel alles —
`git pull` seda ei puuduta.

**Vana fail.** Enne kakskeelsust oli üksainus `data/sisu.json`. Laadija loeb
teda vaikekeele varuteena senikaua, kuni `data/sisu.et.json` puudub. Kui
`sisu.et.json` on serveris esimest korda kirjutatud, **nimeta vana fail ümber
või kustuta** — muidu tekib võimalus, et tagasikeeramise järel hakkavad
salvestused minema jälle vanasse faili, aga lugemine eelistab uut, ja
vahepealsed muudatused muutuvad nähtamatuks.

### Kohalik arendus

```
ADMIN_PAROOL=proovi npm run dev
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## E-posti seadistus (broneerimisvorm)

Broneerimissoov **salvestatakse alati** faili `data/broneeringud.json` ja on
nähtav admin-lehel `/admin/broneeringud`. E-kiri on lisaks — kui allolevad
muutujad puuduvad, jääb saatmine lihtsalt vahele ja midagi ei lähe kaotsi.

Majutuspaketis e-posti ei ole. Soovituslik saatja on eraldi SMTP-teenus, et
veebiserver ei vajaks ligipääsu Marta Gmaili kontole. Resendi kasutamisel tuleb
kinnitada domeen `martaraudsoo.com` ja luua piiratud õigustega API-võti.

Serveris `/home/ubuntu/apps/mraudsoo/.env.local`:

```bash
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_KASUTAJA=resend
SMTP_PAROOL=<Resendi API-võti>
SMTP_SAATJA=broneeringud@martaraudsoo.com
SMTP_SAAJA=martaraudsoo@gmail.com
```

Seejärel:

```bash
pm2 restart mraudsoo --update-env
```

`SMTP_SAAJA` on valikuline — vaikimisi saadetakse kiri sisu all olevale
kontaktaadressile. `SMTP_SAATJA` on nähtav saatja; see võib puududa ainult siis,
kui SMTP kasutajanimi ise on saatmiseks sobiv e-posti aadress. Kirja
vastamisaadressiks pannakse külastaja e-post, nii saab Marta lihtsalt „Vasta”
vajutada.
