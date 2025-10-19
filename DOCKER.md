# Déploiement Docker - OpenHomepage

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
ADMIN_PASSWORD=votre_mot_de_passe_secure
```

## Déploiement

### Option 1 : Utiliser Docker Compose (Recommandé)

```bash
# Build et démarrer le conteneur
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter le conteneur
docker-compose down
```

### Option 2 : Utiliser Docker directement

```bash
# Build l'image
docker build -t openhomepage .

# Démarrer le conteneur
docker run -d \
  --name openhomepage \
  -p 3000:3000 \
  -e ADMIN_PASSWORD=votre_mot_de_passe \
  -v $(pwd)/server/db:/app/server/db \
  openhomepage

# Voir les logs
docker logs -f openhomepage

# Arrêter le conteneur
docker stop openhomepage
docker rm openhomepage
```

## Accéder à l'application

Une fois déployée, l'application est accessible sur :
- **URL** : http://localhost:3000
- **Page admin** : http://localhost:3000/admin
- **Mot de passe** : Celui défini dans `.env` (par défaut: `admin`)

## Persistence des données

Les données sont stockées dans `server/db/data.json`. Avec Docker Compose, ce fichier est monté en volume, donc vos données persistent même après redémarrage du conteneur.

## Mise à jour

```bash
# Arrêter le conteneur
docker-compose down

# Récupérer les dernières modifications
git pull

# Rebuild et redémarrer
docker-compose up -d --build
```

## Ports

- **3000** : Port de l'application web

## Dépannage

### Le conteneur ne démarre pas
```bash
# Vérifier les logs
docker-compose logs

# Vérifier que le port 3000 n'est pas déjà utilisé
netstat -tuln | grep 3000
```

### Réinitialiser les données
```bash
# Sauvegarder d'abord
cp server/db/data.json server/db/data.json.backup

# Supprimer les données
rm server/db/data.json

# Redémarrer le conteneur
docker-compose restart
```

## Production

Pour un déploiement en production, pensez à :

1. Changer le mot de passe admin
2. Utiliser HTTPS (avec un reverse proxy comme Nginx ou Caddy)
3. Configurer des backups automatiques de `server/db/data.json`
4. Utiliser un réseau Docker personnalisé
5. Limiter les ressources du conteneur si nécessaire

### Exemple avec Caddy

```caddyfile
homepage.example.com {
    reverse_proxy openhomepage:3000
}
```
