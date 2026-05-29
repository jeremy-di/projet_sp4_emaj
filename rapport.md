## Choix de l'architecture et de la stack

Nous avons fait le choix d'une application séparée : 

- React pour le frontend
- Node.js pour le backend

Nous avons choisi React pour son architecture asynchrone qui nous permet  de créer des interfaces dynamiques, ce choix nous à paru cohérent pour une plateforme collaborative.
En effet notre plateforme demande de nombreuses mises à jour de l'inyterface en temps réel.

Le serveur backend repose sur Express qui permet d'avoir une API REST simple à maintenir, modulaire et facilement extensible.

Le choix de la base de données s'est porté sur MongoDB qui nous permet un structure flexible adaptée à nos documents collaboratifs. De plus son fonctionnement orienté document nous permet de faire évoluer le projet le cas échéant.

Nous avons également choisi Socket.IO qui nous à permis de gérer les échanges en temps réel importants pour la collaboration sur les documents et le chat.

---
## Gestion utilisateur

#### Mise en place

Nous avons créé une gestion complète des utilisateurs comportant :

- Une fonctionnalité de connexion
- Un CRUD
- Une gestion des rôles

Nous avons également mis en place un système d'authentification à multiple facteurs.

Un utilisateur connecté peut avoir accès à son profil affichant des informations. de la il peut modifier son login ou son email ou son mot de passe. Il à également accès à l'options d'activation de l'authentification à multiple facteurs

#### Sécurité

Nous avons choisi Bcrypt qui nous permet de ne pas persisté un mot de passe en clair. Nous avons aussi choisi de sécuriser l'accès à notre site par le biais d'un mot de passe respectant les standards de NIST et OWASP en vigueur en 2026.

Cette sécurité se trouve dans la validation des champs de formulaire gérée par la dépendance "JOI" qui permet de mettre en place des règles de validation puissantes pour chaque champ de formulaire.

```bash
/back/validations/user.validation.js
```

Les utilisateurs de la plateforme ont la possibilité d'activer l'authentification à multiple facteurs afin d'avoir à rentré un code à 6 chiffres venant d'une application dédiée (Microsoft Authenticator ou Google authenticator) pour pouvoir finaliser sa connexion au site.

#### WebRTC

Nous avons utilisé WebRTC pour gérer les appels entre deux collaborateurs. Lorsque 2 personnes (au minimum) sont connectés sur un document en même temps, l'un peut envoyer un appel à un autre. La personne appelée pourra répondre à l'appel (ou refuser) et communiquer avec l'autre utilisateur. Les deux collaborateurs ont la possibilité de mettre fin à l'appel.

On a choisi cet outil car il nous a été recommandé au début du projet et parce que c'est un outil JS opensource. Il est également supporté sur tous les navigateurs.
