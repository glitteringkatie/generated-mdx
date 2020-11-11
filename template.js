// Very lightly adapted from https://github.com/johnatspreadstreet/gatsby-md-vs-mdx/blob/master/md.tpl.js
const faker = require(`faker`);
const matter = require(`gray-matter`);

module.exports = (numPages, numLines, maxLinks, maxSections, index) => {
  const frontMatter = {
    id: index,
    slug: `/${index}`,
    title: faker.lorem.sentence(),
    summary: faker.lorem.sentence(),
    date: faker.date.recent(1000).toISOString().slice(0, 10),
    tags: `[${faker.random
      .words(3)
      .split(` `)
      .map((w) => `"${w}"`)
      .join(`, `)}]`,
  };
  const frontMatterString = matter.stringify(``, frontMatter).trim();
  const randomPages = [...Array(faker.random.number(maxLinks))].map(() =>
    faker.random.number(numPages)
  );
  const randomLinks = randomPages.map(
    (page) => `Reference [page ${page}](/${page})`
  );

  const randomApi = [...Array(faker.random.number(numLines))].map(() =>
    `
|${faker.lorem.word()}|${faker.lorem.sentence()}|${faker.random.boolean()}|
`.trim()
  );

  const randomSections = [...Array(faker.random.number(maxSections))].map(
    (num) => {
      const fakeParagraphs = [...Array(faker.random.number(5))].map(() =>
        faker.lorem.paragraphs()
      );
      return `### Section ${num}
${fakeParagraphs.join("\n")}`;
    }
  );

  return `${frontMatterString}

## Page #${index} : ${faker.random.words(4)}
### API

${randomApi.join("\n")}

${randomLinks.join("\n")}

${randomSections.join("\n")}
`;
};
