import baseConfig from '../../.lintstagedrc.js';

export default {
  ...baseConfig,
  '*.{js,mjs,cjs,ts,mts,cts}': ['prettier --write', 'eslint --fix'],
};
