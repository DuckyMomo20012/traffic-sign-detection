import baseConfig from '../../.lintstagedrc.js';

export default {
  ...baseConfig,
  '*.py': ['poetry run black .', 'poetry run isort .'],
};
