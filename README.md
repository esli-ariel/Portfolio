# Portfolio — Esli Kadio

Site statique (HTML, CSS, JavaScript) : aucune installation n'est nécessaire.

## Lancer le site sur votre ordinateur

**Option 1 — la plus simple (Mac)** : double-cliquez sur `lancer.command`.
Le site s'ouvre dans votre navigateur. Fermez la fenêtre du terminal pour l'arrêter.

> Si macOS bloque le fichier la première fois : clic droit sur `lancer.command` → Ouvrir.

**Option 2 — dans le terminal** :

```bash
cd Portfolio
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>.

**Option 3 — sans serveur** : double-cliquez sur `index.html`. Tout fonctionne, y compris sans serveur.

Une connexion internet est utile pour charger les polices et les icônes.

## Structure

- `index.html` : contenu des sections (accueil, à propos, compétences, projets, parcours, expériences, assistant, contact)
- `style.css` : styles, thème sombre par défaut et thème clair
- `script.js` : animations et interactions
- `img/` : images
