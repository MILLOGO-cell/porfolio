#!/bin/bash

# Script de Test de Configuration - Portfolio Database
# Ce script vérifie que tous les éléments sont en place pour une migration réussie

echo "======================================"
echo "🔍 Test de Configuration Portfolio DB"
echo "======================================"
echo ""

# Compteur de tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction de test
test_check() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    TEST_NAME=$1
    TEST_COMMAND=$2
    
    echo -n "Test $TOTAL_TESTS: $TEST_NAME ... "
    
    if eval "$TEST_COMMAND" > /dev/null 2>&1; then
        echo "✅ PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo "❌ FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "📁 VÉRIFICATION DES FICHIERS"
echo "──────────────────────────────────────"

# Test 1: Fichier docker-compose.yml existe
test_check "docker-compose.yml existe" "test -f docker-compose.yml"

# Test 2: Fichier package.json existe
test_check "package.json existe" "test -f package.json"

# Test 3: Fichier .env existe
test_check ".env existe" "test -f .env"

# Test 4: Fichier prisma/schema.prisma existe
test_check "prisma/schema.prisma existe" "test -f prisma/schema.prisma"

# Test 5: Fichier docker/init-db.sh existe
test_check "docker/init-db.sh existe" "test -f docker/init-db.sh"

echo ""
echo "🔧 VÉRIFICATION DU CONTENU"
echo "──────────────────────────────────────"

# Test 6: docker-compose.yml contient init-db.sh (pas .sql)
test_check "docker-compose.yml utilise init-db.sh" "grep -q 'init-db.sh' docker-compose.yml"

# Test 7: package.json contient prisma:generate
test_check "Script prisma:generate présent" "grep -q 'prisma:generate' package.json"

# Test 8: package.json contient prisma:migrate
test_check "Script prisma:migrate présent" "grep -q 'prisma:migrate' package.json"

# Test 9: .env contient DATABASE_URL
test_check "DATABASE_URL défini dans .env" "grep -q 'DATABASE_URL' .env"

echo ""
echo "🐋 VÉRIFICATION DOCKER"
echo "──────────────────────────────────────"

# Test 10: Docker est installé
test_check "Docker est installé" "command -v docker"

# Test 11: Docker est lancé
test_check "Docker daemon est actif" "docker ps"

# Test 12: Conteneur portfolio_db_dev existe (peut être arrêté)
if docker ps -a | grep -q portfolio_db_dev; then
    echo -n "Test $((TOTAL_TESTS + 1)): Conteneur portfolio_db_dev existe ... ✅ PASS"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # Test 13: Conteneur est en cours d'exécution
    if docker ps | grep -q portfolio_db_dev; then
        echo -n "Test $((TOTAL_TESTS + 1)): Conteneur est actif ... ✅ PASS"
        echo ""
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        PASSED_TESTS=$((PASSED_TESTS + 1))
        
        # Test 14: PostgreSQL est prêt
        if docker exec portfolio_db_dev pg_isready -U postgres -d portfolio > /dev/null 2>&1; then
            echo -n "Test $((TOTAL_TESTS + 1)): PostgreSQL est prêt ... ✅ PASS"
            echo ""
            TOTAL_TESTS=$((TOTAL_TESTS + 1))
            PASSED_TESTS=$((PASSED_TESTS + 1))
            
            # Test 15: Utilisateur portfolio_user existe
            if docker exec portfolio_db_dev psql -U postgres -d portfolio -tAc "SELECT 1 FROM pg_roles WHERE rolname='portfolio_user'" 2>/dev/null | grep -q 1; then
                echo -n "Test $((TOTAL_TESTS + 1)): Utilisateur portfolio_user existe ... ✅ PASS"
                echo ""
                TOTAL_TESTS=$((TOTAL_TESTS + 1))
                PASSED_TESTS=$((PASSED_TESTS + 1))
            else
                echo -n "Test $((TOTAL_TESTS + 1)): Utilisateur portfolio_user existe ... ❌ FAIL"
                echo ""
                TOTAL_TESTS=$((TOTAL_TESTS + 1))
                FAILED_TESTS=$((FAILED_TESTS + 1))
            fi
        else
            echo -n "Test $((TOTAL_TESTS + 1)): PostgreSQL est prêt ... ❌ FAIL"
            echo ""
            TOTAL_TESTS=$((TOTAL_TESTS + 1))
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    else
        echo -n "Test $((TOTAL_TESTS + 1)): Conteneur est actif ... ⚠️  SKIP (conteneur arrêté)"
        echo ""
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    fi
else
    echo -n "Test $((TOTAL_TESTS + 1)): Conteneur portfolio_db_dev existe ... ⚠️  SKIP (pas encore créé)"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

echo ""
echo "📦 VÉRIFICATION NODE/NPM"
echo "──────────────────────────────────────"

# Test: Node est installé
test_check "Node.js est installé" "command -v node"

# Test: npm est installé
test_check "npm est installé" "command -v npm"

# Test: node_modules existe
if test -d node_modules; then
    echo -n "Test $((TOTAL_TESTS + 1)): Dependencies installées ... ✅ PASS"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # Test: @prisma/client installé
    if test -d node_modules/@prisma/client; then
        echo -n "Test $((TOTAL_TESTS + 1)): @prisma/client installé ... ✅ PASS"
        echo ""
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -n "Test $((TOTAL_TESTS + 1)): @prisma/client installé ... ❌ FAIL"
        echo ""
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test: prisma CLI installé
    if test -d node_modules/prisma; then
        echo -n "Test $((TOTAL_TESTS + 1)): Prisma CLI installé ... ✅ PASS"
        echo ""
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -n "Test $((TOTAL_TESTS + 1)): Prisma CLI installé ... ❌ FAIL"
        echo ""
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
else
    echo -n "Test $((TOTAL_TESTS + 1)): Dependencies installées ... ❌ FAIL"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

echo ""
echo "🎨 VÉRIFICATION PRISMA"
echo "──────────────────────────────────────"

# Test: Client Prisma généré
if test -d node_modules/.prisma/client || test -d node_modules/@prisma/client; then
    echo -n "Test $((TOTAL_TESTS + 1)): Client Prisma généré ... ✅ PASS"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -n "Test $((TOTAL_TESTS + 1)): Client Prisma généré ... ❌ FAIL"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# Test: Migrations existent
if test -d prisma/migrations; then
    echo -n "Test $((TOTAL_TESTS + 1)): Dossier migrations existe ... ✅ PASS"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # Compter les migrations
    MIGRATION_COUNT=$(find prisma/migrations -mindepth 1 -maxdepth 1 -type d | wc -l)
    if [ $MIGRATION_COUNT -gt 0 ]; then
        echo "   → $MIGRATION_COUNT migration(s) trouvée(s)"
    fi
else
    echo -n "Test $((TOTAL_TESTS + 1)): Dossier migrations existe ... ⚠️  SKIP (migrations pas encore créées)"
    echo ""
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

echo ""
echo "======================================"
echo "📊 RÉSULTATS"
echo "======================================"
echo ""
echo "Total de tests: $TOTAL_TESTS"
echo "Tests réussis:  $PASSED_TESTS ✅"
echo "Tests échoués:  $FAILED_TESTS ❌"
echo ""

# Calcul du pourcentage
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$(( PASSED_TESTS * 100 / TOTAL_TESTS ))
    echo "Taux de réussite: $PERCENTAGE%"
fi

echo ""
echo "======================================"
echo "💡 RECOMMANDATIONS"
echo "======================================"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 Excellent ! Tous les tests sont passés."
    echo ""
    echo "Vous pouvez maintenant :"
    echo "  1. Lancer la migration : npm run prisma:migrate"
    echo "  2. Voir vos données : npm run prisma:studio"
    echo "  3. Démarrer l'app : npm run dev"
else
    echo "⚠️  Certains tests ont échoué. Voici ce qu'il faut faire :"
    echo ""
    
    if ! grep -q 'init-db.sh' docker-compose.yml 2>/dev/null; then
        echo "❌ docker-compose.yml"
        echo "   → Modifier ligne 12 : init-db.sql → init-db.sh"
        echo ""
    fi
    
    if ! grep -q 'prisma:generate' package.json 2>/dev/null; then
        echo "❌ package.json"
        echo "   → Ajouter les scripts Prisma (voir package-CORRIGE.json)"
        echo ""
    fi
    
    if ! test -d node_modules; then
        echo "❌ Dependencies"
        echo "   → Exécuter : npm install"
        echo ""
    fi
    
    if ! docker ps | grep -q portfolio_db_dev 2>/dev/null; then
        echo "❌ Docker"
        echo "   → Démarrer : docker-compose up -d"
        echo ""
    fi
    
    if docker ps | grep -q portfolio_db_dev 2>/dev/null; then
        if ! docker exec portfolio_db_dev psql -U postgres -d portfolio -tAc "SELECT 1 FROM pg_roles WHERE rolname='portfolio_user'" 2>/dev/null | grep -q 1; then
            echo "❌ Utilisateur portfolio_user"
            echo "   → Recréer le conteneur : docker-compose down -v && docker-compose up -d"
            echo ""
        fi
    fi
    
    if ! test -d node_modules/.prisma/client && ! test -d node_modules/@prisma/client; then
        echo "❌ Client Prisma"
        echo "   → Générer : npm run prisma:generate"
        echo ""
    fi
fi

echo ""
echo "======================================"
echo "🔗 FICHIERS DE RÉFÉRENCE"
echo "======================================"
echo ""
echo "Consultez ces fichiers pour plus d'aide :"
echo "  • README.md - Guide général"
echo "  • GUIDE_RESOLUTION_MIGRATION.md - Guide détaillé"
echo "  • COMMANDES_UTILES.md - Référence des commandes"
echo "  • AVANT_APRES.md - Comparaison des fichiers"
echo ""

# Code de sortie
if [ $FAILED_TESTS -eq 0 ]; then
    exit 0
else
    exit 1
fi