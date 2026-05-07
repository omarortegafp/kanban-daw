# Tauler Kanban - DAW06

Aquest repositori conté una aplicació web de tipus Kanban desenvolupada com a pràctica per a la unitat DAW06 (Desplegament d'Aplicacions Web).

**Fitxer d'entrada:** [kanban-daw/index.html](kanban-daw/index.html) — obre aquest fitxer al navegador per executar l'aplicació.

## Resum

L'aplicació permet crear, editar, eliminar i organitzar tasques en tres columnes d'estat: `perFer`, `enCurs` i `fet`. Les dades es persisteixen al navegador amb `localStorage` sota la clau `tasquesKanban`.

## Enllaços (emplenar abans de lliurar)

- Repositori GitHub: `https://github.com/omarortegafp`
- GitHub Pages (aplicació): `https://github.com/omarortegafp/kanban-daw`

## Fitxers i estructura clau

```
kanban-daw/
├── index.html        # Pàgina principal (entrada de l'app)
├── css/estils.css    # Estils addicionals
├── js/script.js     # Únic script que implementa CRUD, filtres i persistència
├── img/              # Captures i recursos gràfics
└── README.md         # Aquest fitxer
```

## Execució local

1. Obre `kanban-daw/index.html` amb un navegador modern (doble clic o "Open File").
2. L'aplicació carregarà les tasques des de `localStorage` (clau `tasquesKanban`). Si no hi ha dades, s'inseriran dades d'exemple.

## Com funciona (resum tècnic)

- Clau `localStorage`: `tasquesKanban` (serialització JSON d'un array d'objectes).
- Fitxer JavaScript: `kanban-daw/js/script.js` — gestiona la càrrega, guardat, CRUD, renderitzat, filtres i estadístiques.
- Estats: `perFer`, `enCurs`, `fet`.
- Prioritats: `baixa`, `mitjana`, `alta`.

## Guia ràpida d'ús

- **Crear:** Omple el formulari i prem "Afegir".
- **Editar:** Prem "Editar" a la targeta, modifica i prem guardar.
- **Eliminar:** Prem "Eliminar" i confirma.
- **Canviar estat:** Utilitza el selector d'estat dins de cada targeta (o arrossega la targeta si està implementat).
- **Filtres/Cerca:** Usa els controls de filtre per estat/prioritat i el camp de cerca per text.
