import baseConfig from '../../.lintstagedrc.js';

export default {
  ...baseConfig,
  '*.{html,css}': 'prettier --write',
  '*.{js,ts,html,css}': ['prettier --write', 'eslint --fix'],
};
