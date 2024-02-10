/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  docs: [
    'intro',
    'setup_token',
    {
      type: 'category',
      label: 'Scripts',
      link: {
        type: 'generated-index',
        title: 'Scripts',
        description: 'เอกสารประกอบการใช้งานสำหรับ FiveM Scripts ที่ถูกพัฒนาโดย RenZer Developer',
        keywords: ['scripts'],
      },
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Oncoming',
          href: '#',
        },
      ]
    }
    // Normal syntax:
    /* {
      type: 'doc',
      id: 'head-intro', // document ID
      label: 'Introduction', // sidebar label
    },
    {
      type: 'doc',
      id: 'setup_token', // document ID
      label: 'Setup Token', // sidebar label
    },
    {
      type: 'category',
      // id: 'setup_token', // document ID
      label: 'Setup Token', // sidebar label
    }, */
  ],
  /*  tutorialSidebar: [
     'intro',
     'hello',
     {
       type: 'category',
       label: 'Tutorial',
       items: ['tutorial-basics/create-a-document'],
     },
   ], */

};

export default sidebars;
