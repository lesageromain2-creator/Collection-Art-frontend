# Modèle 3D de la statue

Placez ici le fichier **hermes.glb**, qui sera la statue affichée sur la page d'accueil.

- Vous pouvez exporter le modèle Sketchfab ("Lovers - Cycladic art inspired statue") en `.glb`,
  puis le renommer en `hermes.glb` et le copier dans ce dossier.
- Le chemin utilisé par l'app est : `/models/hermes.glb`

L'animation de rotation est gérée dans `HermesScene.tsx` : la statue est visible dès le départ
et tourne sur elle-même en fonction du scroll.
