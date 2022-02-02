module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'tsconfigRootDir': __dirname,
    'project': [
      './tsconfig.json',
    ],
  },
  'plugins': [
    'react',
    '@typescript-eslint',
    'no-null',
    'no-loops',
  ],
  'rules': {
    'no-irregular-whitespace': 'error',
    'no-whitespace-before-property': 'error',
    'no-trailing-spaces': 'error',
    'brace-style': 'error',
    'no-null/no-null': 2,
    'no-loops/no-loops': 2,
    'arrow-parens': 'error',
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-unused-expressions': 'error',
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'no-unused-vars': 'off',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-param-reassign': ['error', { 'props': false }],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        'allowSingleExtends': true,
      },
    ],
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        'allowString': false,
        'allowNumber': false,
        'allowNullableObject': false,
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { enums: false, typedefs: false, functions: false }],
    '@typescript-eslint/ban-types': [
      'error',
      {
        'types': {
          'null': 'Use \'undefined\' instead of \'null\'',
        },
      },
    ],
    '@typescript-eslint/no-inferrable-types': ['error'],
  },
}