module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'max-len': ['error', { code: 120 }],
    'object-curly-newline': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
  },
};


