import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import react from 'eslint-plugin-react';
import js from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  {
    languageOptions: { globals: globals.browser },
    plugins: { react: react },
    rules: {
      'react/react-in-jsx-scope': 'off',
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/jsx-no-target-blank': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 0,
    },
  },

  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
