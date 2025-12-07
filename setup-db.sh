#!/bin/bash

echo "🚀 Configuration de la base de données Portfolio..."
echo ""

# 1. Nettoyer les conteneurs existants
echo "📦 Nettoyage des conteneurs existants..."
docker-compose down -v
echo "✅ Nettoyage terminé"
echo ""

# 2. Démarrer la base de données
echo "🐘 Démarrage de PostgreSQL..."
docker-compose up -d
echo "✅ PostgreSQL démarré"
echo ""

# 3. Attendre que la DB soit prête
echo "⏳ Attente que la base de données soit prête..."
sleep 5

# Boucle pour vérifier que la DB est prête
MAX_TRIES=30
TRIES=0
until docker exec portfolio_db_dev pg_isready -U postgres -d portfolio > /dev/null 2>&1; do
  TRIES=$((TRIES+1))
  if [ $TRIES -ge $MAX_TRIES ]; then
    echo "❌ Erreur: La base de données n'a pas démarré après ${MAX_TRIES} tentatives"
    echo "Vérifiez les logs avec: docker logs portfolio_db_dev"
    exit 1
  fi
  echo "En attente de la base de données... (tentative $TRIES/$MAX_TRIES)"
  sleep 2
done

echo "✅ Base de données prête!"
echo ""

# 4. Vérifier que l'utilisateur portfolio_user a été créé
echo "🔍 Vérification de l'utilisateur portfolio_user..."
sleep 2
USER_EXISTS=$(docker exec portfolio_db_dev psql -U postgres -d portfolio -tAc "SELECT 1 FROM pg_roles WHERE rolname='portfolio_user'" 2>/dev/null)

if [ "$USER_EXISTS" == "1" ]; then
    echo "✅ L'utilisateur portfolio_user existe"
else
    echo "⚠️  L'utilisateur portfolio_user n'existe pas encore"
    echo "Le script init-db.sh va être exécuté au prochain redémarrage"
fi
echo ""

# 5. Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
    echo "✅ Dépendances installées"
    echo ""
fi

# 6. Générer le client Prisma
echo "🔨 Génération du client Prisma..."
npm run prisma:generate
echo "✅ Client Prisma généré"
echo ""

# 7. Créer et appliquer les migrations
echo "📊 Application des migrations..."
echo "⚠️  Prisma va vous demander un nom pour la migration (par exemple: 'init')"
echo ""
npm run prisma:migrate

echo ""
echo "🎉 Configuration terminée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Vérifiez vos données avec: npm run prisma:studio"
echo "  2. Lancez votre application: npm run dev"
echo ""
echo "📚 Commandes utiles:"
echo "  - Voir les tables: docker exec -it portfolio_db_dev psql -U portfolio_user -d portfolio -c '\dt'"
echo "  - Voir les logs: docker logs -f portfolio_db_dev"
echo "  - Interface Prisma: npm run prisma:studio"
echo ""