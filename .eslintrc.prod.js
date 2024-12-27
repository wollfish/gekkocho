module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:import/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['import', '@typescript-eslint', '@stylistic/eslint-plugin', 'eslint-plugin-react-hooks'],
    root: true,
    rules: {
        '@stylistic/arrow-parens': ['warn', 'always'],
        '@stylistic/indent': ['error', 4],
        '@stylistic/jsx-indent': [2, 4],
        '@stylistic/jsx-indent-props': [2, 4],
        '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
        '@stylistic/member-delimiter-style': 'off',
        '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
        '@stylistic/quotes': ['error', 'single'],
        '@stylistic/semi': ['error', 'always'],
        '@stylistic/comma-dangle': ['warn', {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'always-multiline',
            'exports': 'never',
            'functions': 'never',
        }],

        // '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'error',

        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',

        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

        'import/order': [
            'error',
            {
                'groups': ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], ['object', 'type']],
                'pathGroupsExcludedImportTypes': ['builtin'],
                'pathGroups': [
                    { pattern: '@capacitor/**', group: 'external', position: 'after' },
                    { pattern: '@ionic/**', group: 'external', position: 'after' },
                    { pattern: 'ionicons/**', group: 'external', position: 'after' },
                ],
                'newlines-between': 'always-and-inside-groups',
                'alphabetize': { order: 'asc', caseInsensitive: true },
            },
        ],
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
};
