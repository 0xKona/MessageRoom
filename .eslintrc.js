module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  rules: {
    'quotes': ['error', 'single'],
    // we want to force semicolons
    'semi': ['error', 'always'],
    // we use 2 spaces to indent our code
    'indent': ['error', 2],
    // we want to avoid extraneous spaces
    'no-multi-spaces': ['error'],
    'react/jsx-first-prop-new-line': ['error', 'multiline'], // or "always"
  },
};
