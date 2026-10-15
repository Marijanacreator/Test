# Upit za proizvod — prototip

Statička stranica sa centralizovanom formom za upit, zavisnim izborom kategorije, vrste i proizvoda, pretragom i Web3Forms slanjem.

## Postavljanje na GitHub

1. Napravite novi repozitorijum.
2. Raspakujte ZIP na računaru.
3. Dodajte **sadržaj foldera** u koren repozitorijuma. `index.html` treba da bude u korenu, a ne unutar dodatnog foldera.
4. Sačuvajte fajlove kroz commit.

## GitHub Pages

U repozitorijumu otvorite **Settings → Pages**. Za izvor odaberite **Deploy from a branch**, zatim granu `main` i folder `/ (root)`, pa sačuvajte. Kada objavljivanje bude završeno, Pages prikazuje adresu sajta.

Nema build komande, paketa za instaliranje ni backend-a. Ako stranica nije odmah vidljiva, proverite status objavljivanja u repozitorijumu.

## Fajlovi

- `index.html` — stranica i postojeći stilovi.
- `inquiry-form.js` — zavisni izbor, pretraga, validacija i slanje upita.
- `inquiry-products.test.js` — odvojeni privremeni podaci za testiranje.
- `.nojekyll` — statičko objavljivanje bez Jekyll obrade.

## Test podaci

60 izmišljenih proizvoda: 4 kategorije, svaka sa 3 vrste i 15 proizvoda. Sve šifre počinju sa `TEST-`. Nazivi i dimenzije su primeri za UX testiranje; nisu potvrđeni proizvodi, šifre ili specifikacije Rekord Erdeša.

Podaci imaju kolekcije `categories`, `types` i `products`, povezane preko `categoryId` i `typeId`. Stvarni katalog kasnije može zameniti podatke uz očuvanje ove strukture. Tada izmenite i oznake test kataloga u stranici i email sadržaju.

## Forma i email

Sačuvani su postojeći Web3Forms endpoint i dostavljeni pristupni ključ u skrivenom polju `access_key` u `index.html`. Ovaj ključ je deo klijentskog HTML-a i vidljiv je posetiocima stranice.

Podržan je jedan proizvod po upitu, ili opšti upit uz obaveznu poruku. Naziv i šifra uzimaju se iz istog zapisa proizvoda. Email sadrži podatke kupca, kategoriju, vrstu, naziv, šifru i poruku.

Provereni su resetovanje izbora, filtriranje, pretraga, podaci za slanje, uspešan odgovor i greška uz simulirano slanje. Stvarni prijem emaila nije testiran. Nakon objavljivanja pošaljite sopstveni probni upit i proverite povezani inbox i spam folder.

## Napomene

Ovo je postojeći TermoDom prototip; izvorni sajt Rekord Erdeša nije bio dostavljen. Fotografije su ilustrativne i učitavaju se sa `images.unsplash.com`. Nije uveden novi katalog sa karticama.
