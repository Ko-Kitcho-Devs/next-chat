#!/bin/bash
# ============================================
# COMMANDES UTILES POUR LE PROJET AMÉLIORÉ
# ============================================
#
# Exécutez ces commandes pour gérer votre projet

# ================
# DÉVELOPPEMENT
# ================

# Démarrer le mode développement avec watch
pnpm dev

# Build le package
pnpm build

# Vérifier les types TypeScript
pnpm tsc --noEmit

# Linting (si configuré)
pnpm lint

# Formater le code (si prettier configuré)
pnpm format

# ================
# TESTING
# ================

# Exécuter les tests
pnpm test

# Tests en mode watch
pnpm test:watch

# Coverage
pnpm test:coverage

# ================
# ANALYSE
# ================

# Vérifier les performances
lighthouse https://votre-site.com

# Analyser la bundle size
npm run build
npm ls

# Vérifier l'accessibilité
axe https://votre-site.com

# ================
# GIT & VERSIONING
# ================

# Voir les changements
git status

# Ajouter les fichiers modifiés
git add src/components/
git add CHANGELOG.md
git add UI_IMPROVEMENTS.md

# Commit
git commit -m "feat: 🎨 Complete UI/UX redesign with message alignment fix

- Fixed message alignment (user messages right, others left)
- Added Framer Motion animations (300ms smooth transitions)
- Implemented professional color palette (#3b82f6, #0f172a)
- Created new components: MessageBubble, TypingIndicator
- Enhanced responsive design for all devices
- Improved accessibility with focus rings and contrast
- Added comprehensive documentation
- Zero breaking changes to existing API"

# Push les changements
git push origin main

# Tags & Versioning
git tag v1.1.0
git push origin v1.1.0

# ================
# DOCUMENTATION
# ================

# Générer la documentation
npm run docs

# Servir la documentation localement
python -m http.server 8000

# ================
# NETTOYAGE
# ================

# Nettoyer les dépendances
pnpm install

# Nettoyer les caches
pnpm install --frozen-lockfile

# Supprimer node_modules et réinstaller
rm -rf node_modules pnpm-lock.yaml
pnpm install

# ================
# DÉPLOIEMENT
# ================

# Build pour production
pnpm build

# Vérifier la build
ls -la dist/

# Publier sur npm (si package public)
npm publish --access public

# ================
# UTILITAIRES
# ================

# Voir la version du projet
cat package.json | grep version

# Lister les scripts disponibles
cat package.json | grep -A 20 '"scripts"'

# Vérifier l'espace disque utilisé
du -sh node_modules/
du -sh dist/

# ================
# DÉPANNAGE
# ================

# Erreurs TypeScript
pnpm tsc --noEmit

# Erreurs dans les dépendances
pnpm audit

# Dépendances obsolètes
pnpm outdated

# ================
# PERFORMANCE
# ================

# Profiler les builds
time pnpm build

# Analyser les performances
npm run build -- --profile

# ================
# DOCKER (optionnel)
# ================

# Builder l'image Docker
docker build -t next-chat:1.1.0 .

# Lancer le container
docker run -p 3000:3000 next-chat:1.1.0

# ========================================
# SCRIPTS RECOMMANDÉS À AJOUTER À package.json
# ========================================

# {
#   "scripts": {
#     "dev": "tsup --watch",
#     "build": "tsup",
#     "type-check": "tsc --noEmit",
#     "lint": "eslint . --ext .ts,.tsx",
#     "format": "prettier --write .",
#     "test": "jest",
#     "test:watch": "jest --watch",
#     "test:coverage": "jest --coverage",
#     "analyze": "npm ls",
#     "clean": "rm -rf dist node_modules pnpm-lock.yaml",
#     "precommit": "pnpm lint && pnpm type-check",
#     "release": "pnpm build && npm publish"
#   }
# }

# ========================================
# QUICK START POUR DÉVELOPPEURS
# ========================================

# 1. Cloner le repo
git clone https://github.com/your-org/next-chat-package.git
cd next-chat-package

# 2. Installer les dépendances
pnpm install

# 3. Vérifier les types
pnpm type-check

# 4. Lancer le dev
pnpm dev

# 5. Ouvrir la documentation
cat UI_IMPROVEMENTS.md

# 6. Voir les exemples
cat USAGE_EXAMPLES.tsx

# ========================================
# COMMITS RECOMMANDÉS
# ========================================

# Feature commit
git commit -m "feat: Add message bubble component with animations"

# Fix commit
git commit -m "fix: Correct message alignment (left/right)"

# Docs commit
git commit -m "docs: Update UI improvements documentation"

# Style commit
git commit -m "style: Improve typography and spacing"

# Refactor commit
git commit -m "refactor: Extract TypingIndicator to reusable component"

# ========================================
# RESSOURCES UTILES
# ========================================

# Framer Motion Docs
# https://www.framer.com/motion/

# Tailwind CSS Docs
# https://tailwindcss.com/docs/

# Next.js Docs
# https://nextjs.org/docs/

# Firebase Docs
# https://firebase.google.com/docs/

# Web Vitals
# https://web.dev/vitals/

# Accessibility Guidelines
# https://www.a11y-101.com/

echo "✅ Toutes les commandes disponibles!"
echo "📚 Pour plus d'infos, consultez la documentation:"
echo "   - UI_IMPROVEMENTS.md"
echo "   - USAGE_EXAMPLES.tsx"
echo "   - CONFIGURATION.ts"
