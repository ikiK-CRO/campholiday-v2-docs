    NULTI task makni ribe plivalice  - bijela čista pozadina


    🗓️ Funkcionalni zahtjevi za kalendar rezervacija
    1. Osnovni koncept

        Svaka parcela (kamp mjesto) ima svoj kalendar dostupnosti.

        Rezervacija se definira s datumom dolaska i datumom odlaska.

        Pravilo: isti dan može biti rezerviran dvaput – jednom kao dan odlaska za gosta A i jednom kao dan dolaska za gosta B.
    2. Logika rezervacija

        Dan dolaska: gost može doći nakon što prethodni gost ode (npr. od 12:00 nadalje).

        Dan odlaska: gost napušta parcelu do određenog vremena (npr. do 11:00).

        Time se jedan kalendarski dan dijeli na dva vremenska bloka:

            Prijepodne → odlazak

            Poslijepodne → dolazak
    3. Pravila validacije

        Sustav mora dopustiti da se isti datum pojavi u dvije rezervacije, ali samo ako je:

            Kod jedne rezervacije označen kao datum odlaska

            Kod druge kao datum dolaska

        Sustav mora spriječiti da dvije rezervacije imaju isti datum dolaska ili isti datum odlaska na istoj parceli (jer bi to značilo preklapanje).
    4. Struktura podataka

        Parcela: ID, naziv, kapacitet.

        Rezervacija: ID, parcela_ID, datum_dolaska, datum_odlaska, gost_ID.

        Pravila dostupnosti:

            datum_dolaska može biti jednak datum_odlaska prethodne rezervacije.

            datum_dolaska < datum_odlaska (uvijek).
    5. UI/UX zahtjevi

        Kalendar mora vizualno prikazati da je dan podijeljen:

            Odlazak (jutro) → označen npr. svijetlom bojom.

            Dolazak (popodne) → označen tamnijom bojom.

        Kada korisnik odabere datume, sustav mora jasno pokazati da je dan odlaska slobodan za dolazak novog gosta.
    6. Tehnička implementacija

        Back‑end logika:

            Validacija rezervacija pri unosu.

            API endpointi za provjeru dostupnosti po parceli.

        Front‑end logika:

            Kalendar komponenta koja podržava „half‑day“ status.

            Tooltip ili oznaka koja objašnjava korisniku da je dan podijeljen.
    7. Primjer scenarija

        Gost A rezervira parcelu 1.–5. srpnja (odlazak 5. srpnja do 11:00).

        Gost B rezervira parcelu 5.–10. srpnja (dolazak 5. srpnja od 12:00). 👉 Sustav mora dopustiti obje rezervacije jer se dan 5. srpnja dijeli na odlazak i dolazak.
    📌 Developer checklist

        [ ] Implementirati model rezervacija s pravilom „half‑day overlap“.

        [ ] Validirati da se isti datum može koristiti samo u kombinaciji odlazak/dolazak.

        [ ] Dodati vizualnu oznaku u kalendaru za pola dana.

        [ ] Testirati edge case: rezervacija koja završava i počinje isti dan.

        [ ] Osigurati da se ne mogu unijeti dvije rezervacije s istim datumom dolaska na istoj parceli.



ISTO TAKO OVO JE VEĆ RASPISANO ALI EVO DETALJNIJE:



🎯 Scenarij rezervacije (User Journey)

SVAKI PRETHODNI UPIT JE UVJET DO OTVARANJA SLJEDEĆEG UPITA (nema preskakanja) time smo izbjegli nepotrebne mailove prema zaposlenicima kampa gdje može nastati greška
TOK RADNJI ILI UPITA IDE OVAKO  BOOK NOW->KALENDAR->BROJ OSOBA->DOSTUPNE PARCELE (OPCIJE)->DODATNE OPCIJE->UNOS PODATAKA->IZRAČUN PONUDE

Niže je malo detaljnije raspisano bez unosa podataka ali da razumiješ na koji način bi to bilo složeno.

    Book Now gumb  

        Korisnik klikne na Book Now.

        Otvara se kalendar gdje korisnik bira datum dolaska i datum odlaska.

    Broj osoba

        Nakon odabira datuma, korisnik unosi broj osoba (npr. 2 odrasla + 1 dijete).

        Sustav validira kapacitet smještaja prema broju osoba.

    Prikaz dostupnih opcija

        Sustav prikazuje sve slobodne smještajne jedinice za odabrani period:

            parcele za kampiranje

            šatori

            glamping kućice

        Svaka opcija ima osnovne informacije: kapacitet, cijena po noći, lokacija u kampu.

    Posebne dodatne opcije

        Nakon odabira smještaja, korisniku se nude dodatne opcije:

            🐾 boravak s ljubimcem

            🧺 korištenje veš mašine

            ⚡ dodatni priključak struje

            💧 dodatni priključak vode

        Korisnik može označiti više opcija.

    Kalkulator cijene

        Sustav zbraja:

            osnovnu cijenu smještaja (po noći × broj noći × broj osoba)

            dodatne opcije (fiksna cijena ili po danu)

        Prikazuje finalnu ponudu u realnom vremenu.

    Potvrda rezervacije

        Korisnik pregledava sažetak: datumi, broj osoba, smještaj, dodatne opcije, ukupna cijena.

        Klikne Confirm Booking → sustav generira rezervaciju i šalje potvrdu e‑mailom.

🛠️ Plan implementacije (Developer Guide)
1. Model podataka

    Smještaj (Accommodation): ID, tip (parcela/šator/glamping), kapacitet, cijena po noći.

    Rezervacija (Booking): ID, accommodation_ID, datum_dolaska, datum_odlaska, broj_osoba, dodatne_opcije[], ukupna_cijena.

    Dodatne opcije (Extras): ID, naziv, tip obračuna (po noći / fiksno), cijena.

2. Back‑end logika

    API endpointi:

        GET /availability?from=...&to=...&people=... → vraća slobodne smještaje.

        POST /booking → sprema rezervaciju.

    Validacija:

        Provjera kapaciteta smještaja.

        Pravilo da se isti dan može koristiti kao odlazak i dolazak.

3. Front‑end logika

    Kalendar komponenta → odabir datuma.

    Form za broj osoba.

    Lista dostupnih smještaja → kartice s detaljima i cijenom.

    Checkbox za dodatne opcije.

    Kalkulator cijene u realnom vremenu → prikazuje subtotal + extras + total.

4. UX detalji

    Vizualno označiti dan odlaska/dolaska u kalendaru.

    Dodati tooltip objašnjenja za dodatne opcije.

    Finalni sažetak prije potvrde rezervacije.

📌 Primjer korisničkog toka

    Korisnik klikne Book Now.

    Odabere 10.–15. srpnja.

    Unese 2 odrasla + 1 dijete.

    Sustav prikaže slobodne opcije:

        Parcela br. 12 (50 € / noć)

        Glamping kućica br. 5 (120 € / noć)

    Korisnik odabere Glamping kućicu.

    Označi dodatne opcije: ljubimac (10 € / noć) + struja (5 € / noć).

    Kalkulator izračuna:

        120 € × 5 noći = 600 €

        Ljubimac: 10 € × 5 = 50 €

        Struja: 5 € × 5 = 25 €

        Ukupno = 675 €

    Korisnik potvrdi rezervaciju → dobiva e‑mail potvrdu.



DRUGA OPCIJA  PREGLEDA KADA ŽELI SAMO VIDJETI KOJA PARCELA JE DOSTUPNA NA KOJI DATUM

    🗓️ Scenarij – pregled slobodnih kapaciteta po parceli

        Odabir opcije "Pregled slobodnih kapaciteta"

            Korisnik klikne na Check Availability.

            Umjesto da bira datume, prvo odabire konkretnu parcelu (npr. Parcela #12).

        Prikaz kalendara dostupnosti

            Sustav prikazuje kalendar s označenim slobodnim i zauzetim danima za tu parcelu.

            Slobodni dani označeni zeleno, zauzeti crveno, a dani dolaska/odlaska polovično (npr. pola dana zeleno, pola crveno).

        Detalji dostupnosti

            Klikom na određeni dan korisnik vidi:

                Je li dan slobodan za dolazak, odlazak ili cijeli boravak.

                Ako je dan podijeljen (dolazak/odlazak), sustav jasno označava tu mogućnost.

        Rezervacija iz kalendara

            Korisnik može odmah kliknuti na slobodan period i pokrenuti rezervaciju.

            Nakon odabira datuma, sustav ga vodi kroz isti proces kao u prvoj opciji (broj osoba → dodatne opcije → kalkulator cijene → potvrda).
    🛠️ Plan implementacije (Developer Guide)
    1. Model podataka

        Parcela: ID, naziv, kapacitet.

        Rezervacija: datum_dolaska, datum_odlaska.

        Sustav mora generirati mapu zauzetosti po danima za svaku parcelu.
    2. Back‑end logika

        Endpoint: GET /availability/{parcel_ID} → vraća listu zauzetih/slobodnih datuma.

        Logika:

            Ako je datum označen kao odlazak → slobodan za dolazak istog dana.

            Ako je datum označen kao dolazak → zauzet od tog dana nadalje.
    3. Front‑end logika

        Kalendar prikazuje boje/status po danu:

            🟩 slobodan

            🟥 zauzet

            🟨 polovično slobodan (dolazak/odlazak)

        Tooltip s detaljima (npr. "Slobodno za dolazak od 12h").
    4. UX detalji

        Korisnik odmah vidi vizualnu dostupnost za odabranu parcelu.

        Može kliknuti na slobodan period i nastaviti rezervaciju bez dodatnog pretraživanja.
    📌 Primjer korisničkog toka

        Korisnik zna da želi Parcelu #12.

        Klikne Check Availability.

        Prikaže se kalendar:

            10.–15. srpnja zauzeto (Gost A).

                srpnja označeno polovično (odlazak ujutro, slobodno za dolazak popodne).

            16.–20. srpnja slobodno.

        Korisnik klikne na 15.–20. srpnja → sustav ga vodi kroz rezervaciju (broj osoba, dodatne opcije, kalkulator cijene).