# Design-brief: RiikkaSivut v2

> Lähde: Riikan materiaalit 28.2.2026 (WeTransfer)
> Kaikki sisältö: `v2/docs/content/*.md`
> Kuvat: `v2/src/assets/images/`

---

## 1. Yleisilme ja tunnelma

| Ominaisuus | Arvo |
|---|---|
| **Tyyli** | Wellness-henkinen, rauhallinen, väljä |
| **Värit** | Murretut sävyt: vihreä, oranssi, beige, viininpunainen |
| **Fontti** | Moderni ja tyylikäs (valitaan Figmassa) |
| **Tunnelma** | Lämmin, kutsuva, hengittävä — EI synkkää |
| **Layout** | Hero-banner + yläpalkki + teksti + 2 pikkukuvaa per sivu |
| **Logo** | Lilith-logo vasempaan ylänurkkaan kaikille sivuille |

### Sloganit

- **FI:** "Äänesi rinnallakulkija" / "Löydä äänesi. Lempeästi."
- **EN:** "Walking alongside your voice" / "Find your voice. Gently."

---

## 2. Sivukartta (6 sivua + 5 alapolkua)

| # | Sivu | Päivitettävä? | Banner-kuva | Pikkukuvat |
|---|---|---|---|---|
| 1 | **Etusivu** | Kyllä (intro) | `37hero.jpg` | `eila-estradilla.jpg`, `toivo-ja-kalle.jpeg` |
| 2 | **Riikka** | — | `kallionsylissa.jpeg` | `sarkynyt-sydan.jpg`, `mansikkasanko.jpeg` |
| 3 | **Sinulle?** *(dropdown)* | — | `ester-pyykosjarvi.jpeg` | `hannu-lavalla.jpeg`, `kalle-elaytyy.jpeg` |
| 4 | **Palautteita** | Ehkä | `kolme-laulavaa-naista.jpg` | `sauli.jpeg`, `kukkakimara.jpeg` |
| 5 | **Hinnat ja yhteys** | Kyllä | `riikka-vintilla.jpeg` | Google Maps (Ketokatu 8) |
| 6 | **Blogi** | Kyllä | — | — |

### "Sinulle?" -alasvetovalikon polut

1. Varmuutta lauluun ja puheeseen
2. Laulutaidoton?
3. Karaokea vai klassista?
4. Hyvinvointia äänestä
5. Leiki äänelläsi! (= ääni-impro)

---

## 3. Kuvat (16 kpl, normalisoidut nimet)

| Tiedosto | Käyttö |
|---|---|
| `37hero.jpg` | Etusivun hero-banner |
| `eila-estradilla.jpg` | Etusivu pikkukuva |
| `toivo-ja-kalle.jpeg` | Etusivu pikkukuva |
| `kallionsylissa.jpeg` | Riikka-sivun hero-banner |
| `sarkynyt-sydan.jpg` | Riikka pikkukuva |
| `mansikkasanko.jpeg` | Riikka pikkukuva |
| `ester-pyykosjarvi.jpeg` | Sinulle-sivun hero-banner |
| `hannu-lavalla.jpeg` | Sinulle pikkukuva |
| `kalle-elaytyy.jpeg` | Sinulle pikkukuva |
| `kolme-laulavaa-naista.jpg` | Palautteita hero-banner |
| `sauli.jpeg` | Palautteita pikkukuva |
| `kukkakimara.jpeg` | Palautteita pikkukuva |
| `riikka-vintilla.jpeg` | Hinnat ja yhteys hero-banner |
| `riikka-potretti.jpeg` | Profiili / about |
| `vaaleanpunaa.jpeg` | Vapaasti käytettävissä |
| `lilith-logo.jpg` | Lilith-logo (ylänurkka) |

---

## 4. Stitch-brief (Vaihe 3)

### Prompt

> "A bilingual (Finnish/English) personal website for a singing teacher.
> Wellness aesthetic: warm, calm, spacious. Muted color palette with
> soft green, warm orange, beige, and wine red tones. NO dark theme.
>
> Layout per page: full-width hero banner with text overlay (light
> filter if needed for readability), top navigation bar, body text
> with two small images beside it. Lilith cooperative logo top-left.
>
> Pages: Home (intro + 2 testimonials), About Riikka, For You?
> (dropdown with 5 paths: confidence, beginners, genre, wellbeing,
> voice impro), Testimonials, Pricing & Contact, Blog.
>
> Typography: modern, elegant. Generous whitespace. Friendly and
> inviting feel — think yoga studio or holistic wellness center.
>
> Hero banner image on home page shows a singing student on stage."

**Stitch:** https://stitch.withgoogle.com

### Tuloksen käsittely

1. Kuvakaappaus → `v2/docs/stitch/`
2. Dokumentoi: mikä toimi, mikä ei

---

## 5. Figma-brief (Vaihe 4)

### Suunniteltavat komponentit

1. **Frame:** Desktop 1440px, Mobile 390px
2. **Väripaletti:** Riikan ohje — murretut sävyt (kokeilut Figmassa):
   - Beige/lämmin pohja
   - Murrettu vihreä aksentti
   - Oranssi/terrakotta korosteet
   - Viininpunainen tehoste
3. **Fonttipari:** Valitaan Figmassa (moderni + tyylikäs)
4. **Layout-komponentit:**
   - Nav (yläpalkki + Lilith-logo + "Sinulle?" dropdown)
   - Hero-banner (kuva + teksti-overlay + vaalea suodin)
   - Tekstiosio + 2 pikkukuvaa sivussa
   - Sitaattikortti (palautteita)
   - Hinnastotaulukko
   - Footer (yhteystiedot)
5. **Etusivu riittää** aloitukseen

---

## 6. Sisältödokumentit (Markdown)

| Tiedosto | Sisältö |
|---|---|
| `rakenne.md` | Sivukartta, layout-ohjeet, kuvakartta |
| `etusivu-ja-lahestymistavat.md` | Etusivun teksti + kehollinen/hermostollinen näkökulma |
| `palvelut-hinnat-yhteys.md` | Hinnasto, opetuspaikka, yhteystiedot |
| `aani-impro.md` | Ääni-improryhmä kuvaus + palautteet (FI) |
| `avainsanat-sloganit.md` | SEO-avainsanat + sloganit FI/EN |
| `sinulle-en.md` | "For You?" polkujen sisällöt (EN) |
| `services-en.md` | Palvelut ja hinnat (EN) |
| `voice-impro-en.md` | Voice Impro kuvaus + palautteet (EN) |

---

## 7. Seuraava askel

1. **Stitch** → kopioi prompt kohdasta 4 → generoi → kuvakaappaus
2. **Figma** → tee etusivun layout murretuilla sävyillä
3. **Tule takaisin** → AI koodaa Astro-version
