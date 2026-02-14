# BabyFoot Lottery

**BabyFoot Lottery** - Une roue de loterie pour pimenter vos matchs de babyfoot.

## Pourquoi ce projet ?

BabyFoot Lottery est une application web statique qui affiche une roue d'effets. On clique, la roue tourne, et l'effet tiré s'applique a la table. Tout est simple à heberger et à personnaliser.

## Fonctionnalites

- 🎡 Roue interactive en Canvas avec animation fluide
- 🎯 Effets pondérés (plus la valeur est basse, plus c'est rare)
- ✨ Badges de rareté selon la ponderation
- ⚡ Affichage de duree en nombre de buts pour chaque effet
- 📱 Interface responsive et utilisable sur mobile
- 🧩 Configuration facile via JSON
- 📦 PWA avec cache offline via service worker

## Demarrage rapide

1. Sous Windows, utilisez le script :

```bat
build-and-serve.bat
```

Sur macOS/Linux, vous pouvez aussi utiliser :

```bash
chmod +x build-and-serve.sh
./build-and-serve.sh
```

Ouvrez ensuite `http://localhost:8000`.

## Utilisation

- Cliquez sur la roue pour la faire tourner.
- Appuyez sur `Entree` pour lancer un spin.
- Le resultat affiche le nom de l'effet, sa description et sa duree (en nombre de buts).

## Configuration des effets

Tout se passe dans [data/effects.json](data/effects.json).

Exemple :

```json
{
  "effects": [
    {
      "id": 17,
      "name": "Votre effet",
      "description": "Description de l'effet",
      "color": "#FF5733",
      "goalsRequired": 1,
      "weight": 10
    }
  ]
}
```

Champs disponibles :

- `id` : identifiant unique (nombre)
- `name` : nom affiche dans la roue
- `description` : ce que l'effet implique
- `color` : couleur de segment (hex)
- `goalsRequired` : nombre de buts pendant lequel l'effet reste actif
- `weight` : probabilite (plus petit = plus rare)

Rareté :

- `weight` == 1 : No Wayyy
- `weight` == 2 : Légendaire
- `weight` <= 5 : Rare
- `weight` > 5 : Commun

## Structure du projet

- [index.html](index.html) : page principale
- [styles/styles.css](styles/styles.css) : styles et animations
- [scripts/app.ts](scripts/app.ts) : logique de la roue et animations (source TS)
- [data/effects.json](data/effects.json) : liste et ponderation des effets
- [data/rules.json](data/rules.json) : regles additionnelles
- [service-worker.ts](service-worker.ts) : service worker (source TS)
- [manifest.webmanifest](manifest.webmanifest) : metadonnees PWA

Architecture :

```mermaid
graph TD
  A[BabyFoot Lottery] --> B[index.html]
  A --> C[README.md]
  A --> D[service-worker.ts]
  A --> E[assets/]
  A --> F[styles/]
  F --> G[styles.css]
  A --> H[scripts/]
  H --> I[app.ts]
  A --> J[data/]
  J --> K[effects.json]
  J --> L[rules.json]
  A --> M[icons/]
  M --> N[icon.svg]
  A --> O[manifest.webmanifest]
```

## Contribuer

Toute aide est bienvenue ! Voici un flux simple :

1. Forkez le repo.
2. Creez une branche (`git checkout -b feature/ma-modif`).
3. Faites vos changements.
4. Testez en local.
5. Ouvrez une Pull Request.

Idees de contribution :

- Ajouter de nouveaux effets
- Ameliorer les animations
- Proposer des regles additionnelles
- Ameliorer l'accessibilite
- Ajouter des tests simples ou du linting

## Support

Si vous avez une idee ou un bug, ouvrez une issue :
https://github.com/EAnathos/BabyFoot-Lottery/issues

Bon match ! 🏆