/*
 * ============================================
 * CONFIGURATION RECOMMANDÉE
 * ============================================
 * 
 * Fichiers de configuration pour maximiser
 * les améliorations UI/UX appliquées
 */

/**
 * tailwind.config.js - Configuration Tailwind CSS optimisée
 * 
 * Ajouter cette configuration à votre projet pour des performances optimales
 */
export const tailwindConfig = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "typing": "typing 1.4s infinite",
      },
      keyframes: {
        typing: {
          "0%, 60%, 100%": {
            opacity: "0.5",
            transform: "translateY(0)",
          },
          "30%": {
            opacity: "1",
            transform: "translateY(-8px)",
          },
        },
      },
    },
  },
  plugins: [],
};

/**
 * next.config.js - Optimisations Next.js recommandées
 */
export const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: ["firebaseapp.com"],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },

  // Custom webpack config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        framer: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: "framer-motion",
          priority: 10,
          reuseExistingChunk: true,
        },
      };
    }
    return config;
  },
};

/**
 * .eslintrc.json - Linting pour qualité de code
 */
export const eslintConfig = {
  extends: [
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "warn",
  },
};

/**
 * tsconfig.json - TypeScript configuration
 */
export const tsconfigBase = {
  compilerOptions: {
    target: "ES2020",
    lib: ["ES2020", "DOM", "DOM.Iterable"],
    jsx: "react-jsx",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: "node",
    resolveJsonModule: true,
    declaration: true,
    declarationMap: true,
    sourceMap: true,
  },
};

/**
 * CSS Global Recommendations
 * 
 * Ajouter à votre layout.tsx ou _app.tsx
 */
export const globalCSSRecommendations = `
/* Importez les styles */
import '@/components/styles.css';

/* Ou manuellement dans votre CSS */

:root {
  /* Couleurs primaires */
  --color-primary-600: #2563eb;
  --color-primary-500: #3b82f6;
  
  /* Couleurs neutres */
  --color-slate-50: #f8fafc;
  --color-slate-900: #0f172a;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Smooth animations globally */
* {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Selection color */
::selection {
  background: #dbeafe;
  color: #0f172a;
}
`;

/**
 * Import dans votre Layout/App
 */
export const layoutExample = `
// app/layout.tsx ou pages/_app.tsx
import '@/components/styles.css'; // Importer les styles

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
`;

/**
 * Framer Motion Optimizations
 */
export const framerMotionOptimizations = {
  reduceMotion: {
    description: "Respecter prefers-reduced-motion",
    code: \`
import { useReducedMotion } from 'framer-motion';

export function OptimizedComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
      }}
    >
      Content
    </motion.div>
  );
}
    \`,
  },

  layoutAnimation: {
    description: "Utiliser layoutId pour animations fluides",
    code: \`
<motion.div layoutId="message-container">
  {messages.map(msg => (
    <motion.div key={msg.id} layoutId={\`msg-\${msg.id}\`}>
      {msg.text}
    </motion.div>
  ))}
</motion.div>
    \`,
  },
};

/**
 * Performance Metrics & Monitoring
 */
export const performanceMetrics = {
  recommended: {
    FCP: "< 1.5s", // First Contentful Paint
    LCP: "< 2.5s", // Largest Contentful Paint
    CLS: "< 0.1",  // Cumulative Layout Shift
    FID: "< 100ms", // First Input Delay
  },

  tracking: \`
// pages/_app.tsx
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Web Vitals
    const reportWebVitals = (metric) => {
      console.log(metric);
    };
    
    // Paint timing
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(\`\${entry.name}: \${entry.startTime}\`);
      });
    });
    
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    
    return () => observer.disconnect();
  }, []);

  return <Component {...pageProps} />;
}
  \`,
};

/**
 * Testing Recommendations
 */
export const testingRecommendations = {
  unit: {
    framework: "Jest",
    testing_library: "React Testing Library",
    focus: [
      "Message alignment (isMe prop)",
      "Animation presence",
      "User interactions",
    ],
  },

  example: \`
import { render, screen } from '@testing-library/react';
import { ChatWidget } from '@/components/ChatWidget';

describe('ChatWidget', () => {
  it('aligns messages correctly', () => {
    const { container } = render(
      <ChatWidget 
        messages={[
          { id: 1, text: 'Hello', authorId: 'user1', createdAt: new Date() },
          { id: 2, text: 'Hi', authorId: 'user2', createdAt: new Date() }
        ]}
        userId="user1"
      />
    );
    
    const messages = container.querySelectorAll('.flex');
    expect(messages[0]).toHaveClass('justify-end'); // User message
    expect(messages[1]).toHaveClass('justify-start'); // Other message
  });
});
  \`,
};

/**
 * Deployment Checklist
 */
export const deploymentChecklist = [
  "✅ Build: npm run build ou pnpm build",
  "✅ Test: npm test ou pnpm test",
  "✅ Lint: npx eslint . --fix",
  "✅ Type check: npx tsc --noEmit",
  "✅ Performance: npx lighthouse",
  "✅ Visual regression: screenshots comparison",
  "✅ Accessibility: axe DevTools scan",
  "✅ Bundle analysis: npx webpack-bundle-analyzer",
];

/**
 * Browser Support
 */
export const browserSupport = {
  minimum: "ES2020",
  tested: [
    "Chrome 90+",
    "Firefox 88+",
    "Safari 14+",
    "Edge 90+",
  ],
  notes: "Framer Motion supporte tous les navigateurs modernes",
};

export default {
  tailwindConfig,
  nextConfig,
  eslintConfig,
  tsconfigBase,
  performanceMetrics,
  testingRecommendations,
  deploymentChecklist,
  browserSupport,
};
