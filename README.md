## Admin ja paigaldus

Kogu kodulehe tekst elab sisupuus. Vaikimisi tekstid on failis
`src/sisu/vaikimisi.js`, admin-lehelt salvestatud muudatused failis
`data/sisu.json`. Fail `data/` on gitist välja jäetud — see elab serveris.

### Admin-leht

- Aadress: `/admin` (sisselogimise otsetee: `/admin/login`)
- Sisse logitakse ühe parooliga, mis tuleb keskkonnamuutujast `ADMIN_PAROOL`.
- Kui `ADMIN_PAROOL` on määramata, on admin **lukus**: sisse logida ei saa ja
  leht ütleb, mida serveris teha tuleb.
- Sessioon on `httpOnly` küpsis `mr_sessioon`, kehtivus 30 päeva. Parooli
  vahetamine serveris tühistab automaatselt kõik vanad sessioonid.
- Ebaõnnestunud katseid lubatakse 8 tükki 15 minuti jooksul.

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

Admin kirjutab faili `data/sisu.json` (aatomiliselt: `.tmp` + `rename`), kaust
luuakse vajadusel ise. Kaust `data/` peab jääma deploy'de vahel alles — `git
pull` seda ei puuduta.

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

Majutuspaketis e-posti ei ole, seega kasutame Marta Gmaili.
Selleks on vaja **rakenduse parooli** (mitte tavalist Google'i parooli).
Selle saab luua Google'i konto turvaseadetes, kui kaheastmeline kinnitamine on
sisse lülitatud: Google'i konto → Turvalisus → Rakenduste paroolid.

Serveris `/home/ubuntu/apps/mraudsoo/.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_KASUTAJA=martaraudsoo@gmail.com
SMTP_PAROOL=<16-kohaline rakenduse parool>
```

Seejärel:

```bash
pm2 restart mraudsoo --update-env
```

`SMTP_SAAJA` on valikuline — vaikimisi saadetakse kiri sisu all olevale
kontaktaadressile. Kirja vastamisaadressiks pannakse külastaja e-post, nii saab
Marta lihtsalt „Vasta” vajutada.
