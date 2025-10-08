import fs from 'fs';
import logger from './logger.js';

// import path from 'path';
// import templateConfig from '../template.config.js';

const isProduction = process.env.NODE_ENV === 'production';

export default function addSnippets() {
  if (!isProduction) {
    !fs.existsSync('.vscode') ? fs.mkdirSync('.vscode') : null;

    fs.copyFile(
      'template_modules/assets/project.code-snippets',
      '.vscode/project.code-snippets',
      err => {
        if (err) throw err;

        logger('_CODE_SNIPPETS_DONE');
      }
    );
  }
}
