# Rekord Erdeš — katalog proizvoda

Statički prototip kataloga sa četiri zasebne stranice i centralnom formom za upit.

## Stranice

- `index.html` — početna i ulaz u kategorije.
- `klimatizacija.html` — Daikin Sensira zidne unutrašnje jedinice.
- `izolacija.html` — Austrotherm EPS i XPS proizvodi.
- `grejanje.html` — Danfoss termostati i regulacija.
- `toplotne-pumpe.html` — Vaillant aroTHERM spoljašnje jedinice.
- `upit.html` — centralizovana forma za jedan proizvod ili opšti upit.
- `izvori.html` — izvori podataka za svaki proizvod.

Ukupno 16 referentnih proizvoda, po 4 u svakoj kategoriji. Uklonjene su ranije sekcije o uslugama.

## Postavljanje

Dodajte sve fajlove i ceo `assets` folder u koren GitHub repozitorijuma ili javni direktorijum hostinga. Za GitHub Pages odaberite objavljivanje iz grane `main`, folder `/ (root)`, u Settings → Pages.

Nije potreban build, instalacija paketa, Node.js niti backend. Ne menjajte međusobni položaj HTML, CSS, JS fajlova i foldera `assets`. Paket sadrži lokalne fotografije, tako da njihov prikaz ne zavisi od hotlinkovanja.

## Proizvodi i izvori

`catalog-data.js` je zajednički izvor za stranice kategorija i formu. Sadrži povezane `categories`, `types` i `products` kolekcije. Svaki proizvod ima jedinstveni identifikator, naziv, oznaku, kategoriju, vrstu, fotografiju, opis, osnovne podatke i link ka proizvođaču.

Ovo su stvarni referentni proizvodi iz javnih kataloga Daikin, Danfoss, Vaillant i Austrotherm, provereni 15. oktobra 2026. To nije potvrđen asortiman ni lager firme Rekord Erdeš.

Polje `codeKind` razlikuje šifru proizvođača, EAN broj, oznaku modela i oznaku serije. Nisu izmišljene interne šifre. Austrotherm EPS EAN oznake odgovaraju varijantama iz rumunskog kataloga proizvođača. XPS TOP 30 i TOP P predstavljaju serije; debljina se precizira u poruci.

Fotografije su preuzete sa izvora proizvođača i lokalno smeštene u `assets/products`. Originalne adrese su u `assets/products/sources.json`. Fotografije serija mogu predstavljati više varijanti, što je označeno u detaljima.

Stari TEST podaci nisu uključeni u ovaj paket.

## Interakcije

`catalog.js` upravlja pretragom, filtriranjem po vrsti i dijalogom detalja. Kartice nemaju pojedinačna dugmad za slanje upita; centralna forma ostaje na `upit.html`.

`inquiry-form.js` upravlja zavisnim izborom kategorije → vrste → proizvoda, pretragom, validacijom i slanjem. Naziv i šifra dolaze iz istog izabranog zapisa. Postojeći Web3Forms endpoint i dostavljeni pristupni ključ su sačuvani. Ključ se nalazi u HTML-u forme.

## Provera

Provereni su lokalni linkovi, postojanje fotografija i jedinstvenost oznaka. U pregledaču su provereni prikaz kategorija i fotografija, pretraga po šifri, detalji i izbor stvarnog proizvoda u formi. Proveren je prikaz na 1440 px i 390 px bez horizontalnog prelivanja stranice. Testovi sa simuliranim mrežnim odgovorom proveravaju reset izbora, pretragu, opšti upit, mapiranje naziva/šifre, uspešan odgovor i grešku.

Stvarno slanje i prijem emaila nisu izvršeni tokom ovih provera. Nakon objavljivanja pošaljite sopstveni probni upit.
