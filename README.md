# openingsuren api

## api

### endpoints

####opvragen van kanalen
GET /openingsuren.vlaanderen.be/api/v1/openingsuren/org
geeft kanalen terug voor deze organisatie

####Opvragen van de openingsuren van een kanaal
GET /openingsuren.vlaanderen.be/api/v1/openingsuren/org/kanaal
geeft openingsuren set teug voor ORG organisatie en KANAAL kanaal.

####opvragen of kanalen geopend zijn
GET /openingsuren.vlaanderen.be/api/v1/geopend/org
geeft terug welke kanalen geopend zijn van deze organisatie
####opvragen of een kanaal geopend is
GET /openingsuren.vlaanderen.be/api/v1/geopend/org/kanaal
geeft terug of dit kanaal voor deze organisatie geopend is.


## redactie

### organisaties
op de overzichtpagnia organisaties kan je de verschillende contactpunten ingeven.
Bijvoorbeeld "informatie vlaanderen" of "stad leuven"
Je geeft hier ook de referentie in naar de authentieke bron indien bestaand.
Elke organisatie heeft een aantal kanalen:

### kanalen
Een kanaal is bijvoorbeeld "chat" of "mail" of "telefoonnummer" of "bel me terug"
op de overzichtpagina kanalen kan je deze kanalen beheren.
Elke organisatie kan zo zijn eigen blend van copeningsuren samenstellen.


## overzichtpagina

op de overzichtpagina kan je
- springen naar de openingsuren van een ander kanaal van een andere organisatie
- springen naar de openingsuren van eenzelfde kanaal/organisatie in een andere week
- openingsuren (schema) kopieren naar datum X(bijvoorbeeld tot het einde van het jaar)
- tijdslots van openingsuren ingeven per weekdag  (hier is geen limiet van 9 tot 9:45, van 10 tot 10:45 van 11 tot 11:45 enz).
- tijdslots deleten


## datastructuur

### organisatie

- ID
- name
- link naar authentieke bron

### kanaal

- ID
- name

### openingsuren

- ID
- organisatie_id
- kanaal_id
- dag (2017-12-31)
- start (09:00)
- eind (09:45)
