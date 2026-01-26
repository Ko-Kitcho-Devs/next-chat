import { defineConfig } from "tsup";

export default defineConfig({
  // On regroupe les entrées pour éviter de lancer deux processus séparés
  entry: {
    index: "src/index.ts",
    server: "src/server.ts",
  },
  format: ["esm", "cjs"],
  // L'option dts peut être un objet pour mieux contrôler la génération
  dts: true, 
  clean: true,
  treeshake: true,
  minify: true,
  // IMPORTANT: On ne bundle PAS les libs externes dans un package Next.js
  external: [
    "react", 
    "react-dom", 
    "next", 
    "firebase", 
    "framer-motion",
    "fs",
    "path"
  ],
  // Aide à résoudre les problèmes de binaires sur Windows
  splitting: false,
  sourcemap: true,
});