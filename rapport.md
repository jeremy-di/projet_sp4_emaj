## Choix de l'architecture et de la stack 

## Gestion utilisateur

#### Mise en place

Nous avons créer une gestion complète des utilisateurs comportant : 

- Une fonctionnalité de connexion
- Un CRUD

Nous avons également mis en place un système d'authentification à multiple facteurs.

Un utilisateur connecté peut avoir accès à son profil affichant des informations. de la il peut modifier son login ou son email ou son mot de passe. Il à également accès à l'options d'activation de l'authentification à multiple facteurs

#### Sécurité

Nous avons choisi de sécuriser l'accès à notre site par le biais d'un mot de passe respectant les standards de NIST et OWASP en vigueur en 2026.

Cette sécurité se trouve dans la validation des champs de formulaire gérée par la dépendance "JOI" qui permet de mettre en place des règles de validation puissantes.

```bash
/back/validations/user.validation.js
```

Les utilisateurs de la plateforme ont la possibilité d'activer l'authentification à multiple facteurs afin d'avoir à rentré un code à 6 chiffres venant d'une application dédiée (Microsoft Authenticator ou Google authenticator) pour pouvoir finaliser sa connexion au site.