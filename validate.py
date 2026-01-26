#!/usr/bin/env python3
"""
Validation Script - Vérifie que tous les changements ont été appliqués correctement
"""

import os
import re
from pathlib import Path

class Validator:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.issues = []
        self.success = []

    def validate_alignment_fix(self):
        """Vérifie que l'alignement des messages est correct"""
        chat_widget = self.project_root / "src" / "components" / "ChatWidget.tsx"
        
        with open(chat_widget, 'r') as f:
            content = f.read()
        
        # Vérifier la présence du code d'alignement
        if 'isMe ? "justify-end" : "justify-start"' in content:
            self.success.append("✅ Alignement des messages: CORRECT")
        else:
            self.issues.append("❌ Alignement des messages: NON TROUVÉ")

    def validate_framer_motion(self):
        """Vérifie que Framer Motion est importé"""
        chat_widget = self.project_root / "src" / "components" / "ChatWidget.tsx"
        
        with open(chat_widget, 'r') as f:
            content = f.read()
        
        if 'from "framer-motion"' in content:
            self.success.append("✅ Framer Motion: IMPORTÉ")
        else:
            self.issues.append("❌ Framer Motion: NON IMPORTÉ")

    def validate_new_components(self):
        """Vérifie que les nouveaux composants existent"""
        components = [
            "MessageBubble.tsx",
            "TypingIndicator.tsx",
            "styles.css"
        ]
        
        for comp in components:
            path = self.project_root / "src" / "components" / comp
            if path.exists():
                self.success.append(f"✅ {comp}: CRÉÉ")
            else:
                self.issues.append(f"❌ {comp}: NON TROUVÉ")

    def validate_documentation(self):
        """Vérifie que la documentation est complète"""
        docs = [
            "QUICK_START.md",
            "UI_IMPROVEMENTS.md",
            "FINAL_SUMMARY.md",
            "IMPROVEMENTS_SUMMARY.md",
            "USAGE_EXAMPLES.tsx",
            "CHANGELOG.md",
            "README_IMPROVEMENTS.md",
        ]
        
        for doc in docs:
            path = self.project_root / doc
            if path.exists():
                self.success.append(f"✅ {doc}: CRÉÉ")
            else:
                self.issues.append(f"❌ {doc}: MANQUANT")

    def validate_exports(self):
        """Vérifie que les exports sont à jour"""
        index_file = self.project_root / "src" / "index.ts"
        
        with open(index_file, 'r') as f:
            content = f.read()
        
        exports_needed = [
            "export { MessageBubble }",
            "export { TypingIndicator }",
        ]
        
        for export in exports_needed:
            if export in content:
                self.success.append(f"✅ Export: {export}")
            else:
                self.issues.append(f"❌ Export manquant: {export}")

    def validate_styles(self):
        """Vérifie que les styles CSS existent"""
        styles_file = self.project_root / "src" / "components" / "styles.css"
        
        if styles_file.exists():
            with open(styles_file, 'r') as f:
                content = f.read()
            
            if 'scrollbar' in content:
                self.success.append("✅ CSS: Scrollbar personnalisée trouvée")
            if '@keyframes' in content:
                self.success.append("✅ CSS: Animations CSS trouvées")
        else:
            self.issues.append("❌ CSS: styles.css manquant")

    def run_all_checks(self):
        """Exécute tous les contrôles"""
        print("\n🔍 VALIDATION DES AMÉLIORATIONS UI/UX\n")
        print("=" * 60)
        
        self.validate_alignment_fix()
        self.validate_framer_motion()
        self.validate_new_components()
        self.validate_documentation()
        self.validate_exports()
        self.validate_styles()
        
        # Afficher les résultats
        print("\n✅ SUCCÈS:")
        for item in self.success:
            print(f"  {item}")
        
        if self.issues:
            print("\n❌ PROBLÈMES:")
            for item in self.issues:
                print(f"  {item}")
        else:
            print("\n🎉 AUCUN PROBLÈME DÉTECTÉ!")
        
        print("\n" + "=" * 60)
        print(f"\nRésumé: {len(self.success)} succès, {len(self.issues)} problème(s)")
        
        if not self.issues:
            print("\n✅ VALIDATION COMPLÈTE: SUCCÈS!")
            print("Vous êtes prêt pour la production! 🚀\n")
            return True
        else:
            print("\n⚠️  Veuillez corriger les problèmes signalés.\n")
            return False

if __name__ == "__main__":
    validator = Validator()
    success = validator.run_all_checks()
    exit(0 if success else 1)
