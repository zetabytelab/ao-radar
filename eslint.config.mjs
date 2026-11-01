import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
export default defineConfig([...nextVitals, ...nextTs, globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.test-build/**']), { files: ['tests/*.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } }, { files: ['app/page.tsx'], rules: { '@next/next/no-img-element': 'off' } }]);
