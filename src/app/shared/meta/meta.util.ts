export const metaWith = (title: string, description: string) => [
  {
    name: 'description',
    content: description,
  },
  {
    name: 'author',
    content: 'DevWedeloper',
  },
  {
    property: 'og:title',
    content: title,
  },
  {
    property: 'og:site_name',
    content: 'Angular Form Builder',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:url',
    content: 'https://angular-form-builder.vercel.app/',
  },
  {
    property: 'og:description',
    content: description,
  },
  {
    property: 'og:image',
    content: 'https://angular-form-builder.vercel.app/assets/favicon.ico',
  },

  {
    property: 'twitter:card',
    content: 'summary_large_image',
  },
  {
    property: 'twitter:title',
    content: title,
  },
  {
    property: 'twitter:description',
    content: description,
  },
  {
    property: 'twitter:image',
    content: 'https://angular-form-builder.vercel.app/assets/favicon.ico',
  },
];
