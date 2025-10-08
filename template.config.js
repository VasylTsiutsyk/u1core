import path from 'path';
const projectName = path.basename(path.resolve()).toLowerCase();

export default {
  lang: 'ua',
  vscode: {
    settings: true,
    snippets: false,
  },
  navpanel: {
    dev: true,
    build: false,
    position: 'left',
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.75)',
    transition: '300',
  },
  server: {
    path: './',
    copyfiles: true,
    version: true,
    hostname: 'localhost',
    port: '8888',
  },
  html: {
    beautify: {
      enable: true,
      indent: 'tab',
    },
  },
  styles: {
    tailwindcss: false,
    pxtorem: true,
    critical: false,
    codesplit: false,
    devfiles: true,
    groupCssMedia: false,
  },
  fonts: {
    iconsfont: true,
    download: false,
  },
  images: {
    svgsprite: false,
    optimize: {
      enable: true,
      edithtml: true,
      sizes: [768, 1280],
      dpi: [],
      attrignore: 'data-img-ignore',
      modernformat: {
        enable: true,
        type: 'webp', // webp/avif
        only: true,
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
    },
  },
  js: {
    hotmodules: true,
    devfiles: true,
    bundle: {
      // Збирає в один JS та один CSS файли
      // незалежно від налаштування
      // styles -> codesplit,
      enable: false,
    },
    react: false,
    vue: false,
  },
  php: {
    enable: false,
    base: './src/php/',
    hostname: 'localhost',
    port: '1110',
    binary: 'C:\\php\\php.exe',
    ini: 'template_modules/assets/php.ini',
  },
  ftp: {
    host: '127.0.0.1',
    port: 21,
    remoteDir: `/www/.../${projectName}`,
    user: 'root',
    password: '123456',
  },
  logger: {
    // Логи роботи збірки в терміналі
    terminal: true,
    // Логи роботи модулів в консолі
    console: {
      enable: true,
      removeonbuild: true,
    },
  },
  projectpage: {
    enable: false,
    projectname: '',
    template: 'src/components/templates/projectpage/projectpage.html',
    outfilename: 'sitemap',
  },
  aliases: {
    // HTML
    '@html': 'src/html',
    '@components': 'src/html/components',
    '@cards': 'src/html/components/cards',
    '@sections': 'src/html/components/sections',
    // Scripts
    '@js': 'src/js',
    // Styles
    '@styles': 'src/styles',
    // Media & files
    '@fonts': 'src/assets/fonts',
    '@img': 'src/assets/img',
    '@video': 'src/assets/video',
    '@files': 'src/files',
  },
  coffee: {
    enable: true,
    text: `(!!) Досить працювати, зроби перерву ☕️`,
    interval: 45,
  },
};
