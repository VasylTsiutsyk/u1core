import templateConfig from '../template.config.js';
import logger from './logger.js';

import { globSync } from 'glob';
import fs from 'node:fs';
import path from 'node:path';

// Конвертація шрифтів
import Fontmin from 'fontmin';
// Локальне підключення віддалених шрифтів
import webfontDownload from 'vite-plugin-webfont-dl';
// Створення шрифту з SVG іконок
import viteSvgToWebfont from 'vite-svg-2-webfont';
// Оптимізація SVG іконок
import { svgOptimaze } from './svgoptimaze.js';

const isProduction = process.env.NODE_ENV === 'production';
const isWp = process.argv.includes('--wp');

// Шляхи до файлів
const fontsHTMLFile = 'src/html/layout/head/fonts-preload.html';
const fontsCSSFile = 'src/styles/fonts/fonts.css';
const iconsCSSFile = 'src/styles/fonts/iconfont.css';
const iconsPreviewFiles = globSync('src/assets/svgicons/preview/*.*');
const iconsFiles = globSync('src/assets/svgicons/*.svg');

// ===== Helpers for Variable fonts =====
const VAR_DEFAULTS = {
  weight: '100 1000',
  stretch: '75% 125%',
};

function rangesForFamily(baseName) {
  const n = baseName.toLowerCase().replace(/\s+/g, '');
  return VAR_DEFAULTS;
}

function isVariableFontFilename(name) {
  const n = name.toLowerCase();
  return /(variable|vf)\.woff2$/.test(n) || /variable/.test(n) || /-vf/.test(n);
}

// Обробка шрифтів
function fontWork() {
  const fontsFiles = globSync('src/assets/fonts/*.{otf,ttf}', { posix: true });

  // Конвертація шрифтів
  if (fontsFiles.length) {
    logger('_FONTS_START');

    const fontConverter = new Fontmin()
      .src('src/assets/fonts/*.{otf,ttf}')
      .dest('src/assets/fonts')
      .use(Fontmin.otf2ttf())
      .use(Fontmin.ttf2woff2());

    fontConverter.run(function (err, files, stream) {
      if (err) {
        throw err;
      }
      fontHtmlCss();
    });
  } else {
    fontHtmlCss();
  }
}

// Створення HTML,CSS файлів та підключення шрифтів
const fontHtmlCss = () => {
  const fontsFiles = globSync('src/assets/fonts/*.woff2', { posix: true });

  if (fontsFiles.length) {
    // Змінні
    const emittedFiles = new Set();
    let linksToFonts = ``;
    let fontsStyles = ``;
    let counter = { all: 0 };

    fontsFiles.forEach(fontsFile => {
      // Ім'я файлу без розширення
      const fontFileName = fontsFile
        .replace(new RegExp(' ', 'g'), '-')
        .split('/')
        .pop()
        .split('.')
        .slice(0, -1)
        .join('.');

      if (emittedFiles.has(fontFileName)) {
        counter.all++;
        return;
      }

      const lowerName = fontFileName.toLowerCase();
      const isVariable = isVariableFontFilename(`${fontFileName}.woff2`);

      // Визначаємо стиль (italic/normal) по імені
      const isItalic = /italic/.test(lowerName);
      const fontStyle = isVariable
        ? isItalic
          ? 'italic'
          : 'normal'
        : /italic/.test(lowerName)
          ? 'italic'
          : 'normal';

      // Побудова базової назви шрифту (font-family)
      // Прибираємо хвости типу 'Italic', вагу та 'Variable'/'VF'
      const weightKeys = [
        'extralight',
        'ultralight',
        'semibold',
        'demibold',
        'extrabold',
        'ultrabold',
        'extrablack',
        'ultrablack',
        'hairline',
        'regular',
        'normal',
        'medium',
        'bold',
        'black',
        'heavy',
        'thin',
        'light',
        'semi',
        'demi',
      ].sort((a, b) => b.length - a.length);

      let baseName = fontFileName;
      baseName = baseName.replace(/italic$/i, '');
      baseName = baseName.replace(/(variable|vf)$/i, '');
      for (const key of weightKeys) {
        baseName = baseName.replace(new RegExp(key + '$', 'i'), '');
      }
      baseName = baseName.replace(/[-_]+$/, '');

      // Формування посилань на шрифт (preload)
      linksToFonts += `<link rel="preload" href="@fonts/${fontFileName}.woff2" as="font" type="font/woff2" crossorigin="anonymous">\n`;

      if (isVariable) {
        // === Variable font ===
        const { weight, stretch } = rangesForFamily(baseName);
        fontsStyles += `@font-face {\n  font-family: '${baseName}';\n  src: url("@fonts/${fontFileName}.woff2") format("woff2-variations");\n  font-weight: ${weight};\n  font-stretch: ${stretch};\n  font-style: ${fontStyle};\n  font-display: swap;\n}\n`;
      } else {
        // === Static font ===
        // Мапа для перетворення назв ваги в числові значення
        const fontWeightMap = {
          thin: 100,
          hairline: 100,
          extralight: 200,
          ultralight: 200,
          light: 300,
          regular: 400,
          normal: 400,
          medium: 500,
          semibold: 600,
          semi: 600,
          demibold: 600,
          demi: 600,
          bold: 700,
          extrabold: 800,
          ultrabold: 800,
          black: 900,
          heavy: 900,
          extrablack: 950,
          ultrablack: 950,
        };

        let fontWeight = 400;
        const wKeys = Object.keys(fontWeightMap).sort(
          (a, b) => b.length - a.length
        );
        for (const key of wKeys) {
          if (lowerName.includes(key)) {
            fontWeight = fontWeightMap[key];
            break;
          }
        }

        fontsStyles += `@font-face {\n  font-family: ${baseName};\n  src: url("@fonts/${fontFileName}.woff2") format("woff2");\n  font-weight: ${fontWeight};\n  font-style: ${fontStyle};\n  font-display: swap;\n}\n`;
      }

      emittedFiles.add(fontFileName);
      counter.all++;
    });

    fs.writeFile(fontsHTMLFile, linksToFonts, cb);
    fs.writeFile(fontsCSSFile, fontsStyles, cb);

    // Видаляємо похідні файли
    const fontsSrcFiles = globSync('src/assets/fonts/*.*', { posix: true });
    for (const file of fontsSrcFiles) {
      if (file.endsWith('.otf') || file.endsWith('.ttf')) {
        fs.unlink(file, err => {
          if (err) throw err;
        });
      } else {
        file.includes(' ')
          ? fs.rename(file, file.replace(' ', '-'), () => {})
          : null;
      }
    }

    logger(`_FONTS_DONE`, [counter.all]);
  } else {
    // Якщо шрифтів немає
    fs.writeFile(fontsHTMLFile, '', cb);
    fs.writeFile(fontsCSSFile, '', cb);
  }
};

// Додавання іконкового шрифту
function addIconFonts() {
  if (iconsFiles.length && templateConfig.fonts.iconsfont) {
    !isProduction ? logger('_FONTS_ICONS_ADD_DONE') : null;
  } else {
    fs.rm(
      'src/assets/svgicons/preview',
      {
        recursive: true,
        force: true,
      },
      err => {
        if (err) {
          throw err;
        }
      }
    );

    fs.writeFile(iconsCSSFile, '', cb);
  }
}

// Додавання шрифту для WP
async function addWpFonts() {
  const styles = [];
  styles.push(`import '@styles/fonts/fonts.css'`);
  iconsFiles.length && templateConfig.fonts.iconsfont
    ? styles.push(`import '@styles/fonts/iconfont.css'`)
    : null;
  fs.writeFile(
    'src/components/wordpress/fls-wp-fonts.js',
    styles.join('\n'),
    () => {}
  );
}
// Плагіни
export const fontPlugins = [
  // Обробка шрифтів
  fontWork(),
  // Створення шрифту з SVG іконок
  iconsFiles.length &&
  templateConfig.fonts.iconsfont &&
  !iconsPreviewFiles.length
    ? await {
        order: 'pre',
        ...svgOptimaze(iconsFiles).then(() => {
          logger('_FONTS_ICONS_DONE');
        }),
      }
    : [],
  iconsFiles.length &&
  templateConfig.fonts.iconsfont &&
  !iconsPreviewFiles.length
    ? {
        order: 'post',
        ...viteSvgToWebfont({
          classPrefix: 'icon-',
          cssDest: path.resolve(iconsCSSFile),
          cssFontsUrl: path.resolve('src/assets/svgicons/preview'),
          types: ['woff2'],
          dest: 'src/assets/svgicons/preview',
          cssTemplate: path.resolve('template_modules/iconfont/css.hbs'),
          htmlTemplate: path.resolve('template_modules/iconfont/html.hbs'),
          context: path.resolve('src/assets/svgicons'),
          normalize: true,
          inline: true,
          generateFiles: !iconsPreviewFiles.length,
        }),
      }
    : [],
  {
    order: 'post',
    ...addIconFonts(),
  },
  // Локальне підключення віддалених шрифтів
  ...(templateConfig.fonts.download
    ? [
        webfontDownload([], {
          cache: true,
          embedFonts: false,
          injectAsStyleTag: false,
        }),
      ]
    : []),
  ...(isWp ? [addWpFonts()] : []),
  ...(isWp && !isProduction
    ? [
        {
          name: 'wp-iconfont-path',
          order: 'pre',
          transform(html, file) {
            if (file.endsWith('fonts.css')) {
              const reg = /\/assets\/fonts\//g;
              return html.replace(
                reg,
                `http://${templateConfig.server.hostname}:${templateConfig.server.port}/assets/fonts/`
              );
            } else if (file.endsWith('iconfont.css')) {
              const reg = /\/assets\/svgicons\/preview\//g;
              return html.replace(
                reg,
                `http://${templateConfig.server.hostname}:${templateConfig.server.port}/assets/svgicons/preview/`
              );
            }
          },
        },
      ]
    : []),
];

// Функція
function cb(err) {
  if (err) {
    throw err;
  }
}
