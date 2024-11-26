# Keycloak

Keycloak est la technologie utilisée dans ecoSecrets pour **gérer les droits et les utilisateurs**. Vous pouvez retrouver plus d'informations sur cette technologie [ici](https://www.keycloak.org/guides#getting-started).

L'interface administrateur permet à aux utlilisateurs administrateurs de gérer l'ensemble des aspects relatifs à Keycloak. Elle est accessible sur : `/auth/admin/ecosecrets/console/`. La connexion se fait avec les mêmes identifiants que ceux de l'application.

Pour le moment, seule la gestion de l'authentification est implémentée dans l'application. Il n'est donc pas encore possible de donner des droits différents aux utilisateurs d'une instance. Cela signifie que tous les utilisateurs auront accès aux mêmes pages et pourront effectuer les mêmes opérations sur l'application.

## Configuration du serveur mail

Certaines fonctionnalités nécessitent l'**envoi de mails par l'application**. Il est donc nécessaire de configurer un serveur mail.
Cela peut être fait au sein de l'interface administrateur de Keycloak dans les _"Realm settings"_ dans l'onglet _"Email"_ (accessible sur `/auth/admin/ecosecrets/console/#/ecosecrets/realm-settings/email`).

Le champ _"from"_ dans la catégorie _Template_ et l'ensemble de la catégorie _Connection & Authentification_ doivent à minima être renseignés.

## Gestion des utilisateurs

Voir le guide utilisateur > rubrique _Administrateur - Keycloak_
