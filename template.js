// Very lightly adapted from https://github.com/johnatspreadstreet/gatsby-md-vs-mdx/blob/master/md.tpl.js
const faker = require(`faker`);
const matter = require(`gray-matter`);

const defaultTemplate = (link) => `[${link}](/generated-docs/${link})`;
const templatedLink = {
  elastic: (link) => `<DocLink id="${link}" />`,
  gastby: defaultTemplate,
  next: defaultTemplate,
  eleventy: defaultTemplate,
};

module.exports = (
  build,
  numPages,
  numLines,
  maxLinks,
  maxSections,
  withPartials,
  index
) => {
  const frontMatter = {
    id: index,
    slug: `/generated-docs/${index}`,
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

  const shouldHaveRandomPartial = withPartials
    ? faker.random.arrayElement([true, false])
    : false;
  const maybeRandomPartial = shouldHaveRandomPartial
    ? `import Partial from '../assets/partials/partial-${faker.random.number(
        2
      )}.mdx'`
    : "";

  const randomPages = [...Array(faker.random.number(maxLinks))].map(() =>
    faker.random.number(numPages)
  );
  const linkTemplate = templatedLink[build] || defaultTemplate;
  const randomLinks = randomPages.map(
    (page) => `Reference ${linkTemplate(page)}`
  );

  const randomApi = [...Array(faker.random.number(numLines))].map(() =>
    `
|${faker.lorem.word()}|${faker.lorem.sentence()}|${faker.random.boolean()}|
`.trim()
  );

  const shouldHaveRandomPhoto = faker.random.arrayElement([true, false]);
  const maybeRandomPhoto = shouldHaveRandomPhoto
    ? `![](/assets/cats-${faker.random.number(4)}.jpg)`
    : ``;

  const randomSections = [...Array(faker.random.number(maxSections))].map(
    (_num, index) => {
      const fakeParagraphs = [...Array(faker.random.number(5))].map(() =>
        faker.lorem.paragraphs()
      );
      return `### Section ${index}
${fakeParagraphs.join("\n")}`;
    }
  );

  return `${frontMatterString}
${maybeRandomPartial}

## Page #${index} : ${faker.random.words(4)}
### API

${randomApi.join("\n")}

${randomLinks.join("\n")}
${maybeRandomPhoto}

${shouldHaveRandomPartial ? "<Partial />\n" : ""}

${randomSections.join("\n")}
`;
};
