import baseConfig from '../../.lintstagedrc.js';

export default {
  ...baseConfig,
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
};
