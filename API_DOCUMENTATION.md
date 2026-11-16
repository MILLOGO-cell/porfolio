# MISE EN PLACE DES API - PORTFOLIO

## Fichiers Créés

```
src/
├── lib/
│   ├── validations.ts        Schemas Zod pour validation
│   └── api-response.ts       Helpers pour réponses API
│
└── app/api/
    ├── projects/
    │   ├── route.ts          GET/POST /api/projects
    │   └── [id]/
    │       └── route.ts      GET/PUT/DELETE /api/projects/:id
    │
    └── contact/
        └── route.ts          POST /api/contact
```

---

## 1. INSTALLER LES DÉPENDANCES

```powershell
npm install zod
```

---

## 2. CONFIGURER LES VARIABLES D'ENVIRONNEMENT

Ajoutez dans `.env` :

```env
# Email pour le formulaire de contact
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASS="votre-mot-de-passe-application"
EMAIL_TO="destination@example.com"
```

**Note Gmail :**

- Utilisez un "Mot de passe d'application" (pas votre mot de passe normal)
- Activez l'authentification 2FA
- Générez un mot de passe d'app dans : <https://myaccount.google.com/apppasswords>

---

## 3. TESTER LES API

### Démarrer le serveur

```powershell
npm run dev
```

### Tester avec PowerShell

```powershell
# GET - Liste des projets
Invoke-WebRequest -Uri "http://localhost:3000/api/projects" -Method GET

# POST - Créer un projet
$body = @{
    title = "Mon Premier Projet"
    description = "Description test"
    tags = @("React", "Next.js")
    featured = $true
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/projects" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# GET - Un projet spécifique (remplacez ID)
Invoke-WebRequest -Uri "http://localhost:3000/api/projects/VOTRE_ID" -Method GET
```

### Ou avec cURL (Git Bash)

```bash
# Créer un projet
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Description",
    "tags": ["React"],
    "featured": false
  }'

# Lister les projets
curl http://localhost:3000/api/projects

# Tester le contact
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Message de test"
  }'
```

---

## 4. VÉRIFIER DANS LA BASE DE DONNÉES

```powershell
# Voir les projets créés
npm run prisma:studio
```

Ouvrez <http://localhost:5555> et vérifiez la table `projects`.

---

## 5. DOCUMENTATION COMPLÈTE

Consultez `API_DOCUMENTATION.md` pour :

- Tous les endpoints disponibles
- Exemples de requêtes/réponses
- Codes d'erreur
- Structure des données

---

## CHECKLIST

- [ ] Dependencies installées (`npm install zod`)
- [ ] Variables d'environnement configurées (`.env`)
- [ ] Serveur démarré (`npm run dev`)
- [ ] API Projects testée (GET/POST)
- [ ] API Contact testée (POST)
- [ ] Données visibles dans Prisma Studio

---

## PROCHAINES ÉTAPES

1. **Authentification** : NextAuth pour protéger les routes admin
2. **Frontend** : Pages pour consommer ces API
3. **Upload d'images** : Cloudinary ou uploadthing
4. **Validation côté client** : React Hook Form + Zod

---

## PROBLÈMES COURANTS

### Erreur : "Module not found: Can't resolve '@/lib/...'"

**Solution :** Vérifiez `tsconfig.json` :

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Erreur : "Prisma Client did not initialize yet"

**Solution :**

```powershell
npm run prisma:generate
```

### Email ne s'envoie pas

**Solution :**

- Vérifiez les credentials dans `.env`
- Utilisez un mot de passe d'application Gmail
- Testez avec un autre service SMTP (Mailtrap, SendGrid)

---

** Vos API sont prêtes et professionnelles !**
