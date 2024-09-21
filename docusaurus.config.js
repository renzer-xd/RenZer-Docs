// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'RenZer Developer Docs',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.renzershop.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'renzer-xd', // Usually your GitHub org/user name.
  projectName: 'RenZer-Docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'th',
    locales: ['th'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          routeBasePath: '/',
          editUrl: 'https://github.com/renzer-xd/RenZer-Docs/edit/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      colorMode: {
        defaultMode: 'dark'
      },
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'RenZer Developer Docs',
        logo: {
          alt: 'RenZer Developer Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://cfg.renzershop.com',
            position: 'right',
            className: 'header-home-link',
            'aria-label': 'Home',
          },
          {
            href: 'https://discord.gg/CgzETuC44',
            position: 'right',
            className: 'header-discord-link',
            'aria-label': 'Discord',
          },
          {
            href: 'https://github.com/renzer-xd',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} By RenZer . All Rights Reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.vsDark,
        additionalLanguages: [
          'lua',
          'javascript',
          'js-extras',
          'php',
          'php-extras',
          'sql',
          'mongodb',
          'powershell',
          'bash',
          'json',
          'diff',
          'uri',
        ]
      },
    }),

};

export default config;
