import templateConfig from '../template.config.js';
import logger from './logger.js';

import { globSync } from 'glob';
import { normalizePath } from 'vite';
import fs from 'node:fs';

const isProduction = process.env.NODE_ENV === 'production';

export function navPanel() {
  const htmlFiles = globSync('src/*.html');
  const isIconFont = fs.existsSync('src/assets/svgicons/preview/iconfont.html');
  const hasSitemap = htmlFiles.includes('src/_sitemap.html');

  if (htmlFiles.length > 1 || isIconFont || templateConfig.projectpage.enable) {
    let menu = `<ol id="sitemap-panel">`;

    htmlFiles.forEach(htmlFile => {
      htmlFile = normalizePath(htmlFile);
      const href = htmlFile.replace('src/', '');
      const name = href.replace('.html', '');

      if (name === '_sitemap') return;

      menu += `<li><a href="${href}">${name}</a></li>`;
    });

    // Додаткове посилання на іконки
    if (!isProduction && isIconFont) {
      menu += `<li><a target="_blank" href="/assets/svgicons/preview/iconfont.html">Icons</a></li>`;
    }

    menu += `</ol>`;

    // Додаємо sitemap після списку, якщо він не був у <ol>
    if (templateConfig.projectpage.enable && !hasSitemap) {
      const sitemapHref = templateConfig.projectpage.template.replace(
        'src/',
        ''
      );
      menu += `<div style="margin: 1rem 0 0;"><a href="${sitemapHref}" target="_blank">Sitemap</a></div>`;
    }

    menu += `<style>
     #sitemap-panel {
       list-style: numeric outside;
       position: fixed;
       z-index: 9999;
       ${templateConfig.navpanel.position === 'left' ? 'left: 10px;' : 'right: 10px;'}
       ${templateConfig.navpanel.position === 'left' ? 'padding: 15px 25px 15px 15px;' : 'padding: 15px 15px 15px 25px;'}
       ${templateConfig.navpanel.position === 'left' ? 'border-radius: 0 8px 8px 0;' : 'border-radius: 8px 0 0 8px;'}
       top: 10%;
       max-height: 80svh;
       margin: 0;
       padding: 1rem;
       padding-left: 1.5rem;
       font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
       font-size: 1rem;
       font-weight: 500;
       line-height: 1.2;
       background-color: ${templateConfig.navpanel.background};
       color: ${templateConfig.navpanel.color};
       transform: translate(${templateConfig.navpanel.position === 'left' ? '-100%' : '100%'}, 0px);
       overflow-y: auto;
       transition: all ${templateConfig.navpanel.transition}ms;
     }

     #sitemap-panel:hover {
       ${templateConfig.navpanel.position === 'left' ? 'left: 0px;' : 'right: 0px;'}
       transform: translate(0, 0);
     }

     #sitemap-panel li:not(:last-child) {
       margin-bottom: 0.5rem;
     }

     #sitemap-panel a:hover {
       text-decoration: underline;
     }
   </style>`;

    return `<script>window.addEventListener('DOMContentLoaded',()=>{document.body.insertAdjacentHTML('beforeend',\`${menu}\`)});</script>`;
  } else {
    return '';
  }
}
