// Very lightly adapted from https://github.com/johnatspreadstreet/gatsby-md-vs-mdx/blob/master/md.generate.js
const fs = require(`fs`);
const path = require(`path`);

const template = require(`./template.js`);

const root = `generated-docs`;

const MAX_LINES = parseInt(process.env.MAX_LINES || 25, 10);
if (
  typeof MAX_LINES !== `number` ||
  !Number.isInteger(MAX_LINES) ||
  MAX_LINES <= 0
) {
  throw new Error(`Error: the value for MAX_LINES is invalid: `);
}

const NUM_PAGES = parseInt(process.env.NUM_PAGES || 1000, 10);
if (
  typeof NUM_PAGES !== `number` ||
  !Number.isInteger(NUM_PAGES) ||
  NUM_PAGES <= 0
) {
  throw new Error(
    `Error: the value for NUM_PAGES is invalid: \`` +
      process.env.NUM_PAGES +
      `\``
  );
}

const MAX_LINKS = parseInt(process.env.MAX_LINKS || 5, 10);
if (
  typeof MAX_LINKS !== `number` ||
  !Number.isInteger(MAX_LINKS) ||
  MAX_LINKS <= 0
) {
  throw new Error(
    `Error: the value for MAX_LINKS is invalid: \`` +
      process.env.MAX_LINKS +
      `\``
  );
}

const MAX_SECTIONS = parseInt(process.env.MAX_LINKS || 12, 10);
if (
  typeof MAX_SECTIONS !== `number` ||
  !Number.isInteger(MAX_LINKS) ||
  MAX_SECTIONS <= 0
) {
  throw new Error(
    `Error: the value for MAX_SECTIONS is invalid: \`` +
      process.env.MAX_SECTIONS +
      `\``
  );
}

const WITH_PARTIALS = (process.env.WITH_PARTIALS || "false").toLowerCase();
if (
  typeof WITH_PARTIALS !== `string` ||
  !["y", "n", "yes", "no", "true", "false"].includes(WITH_PARTIALS)
) {
  throw new Error(
    `Error: the value for WITH_PARTIALS is invalid: \`` +
      process.env.WITH_PARTIALS +
      `\``
  );
}
const withPartials = ["y", "yes", "true"].includes(WITH_PARTIALS);

const BUILD = process.env.BUILD.toLowerCase() || "gatsby";
if (
  typeof BUILD !== `string` ||
  !["gatsby", "next", "eleventy", "elastic"].includes(BUILD)
) {
  throw new Error(
    `Error: the value for BUILD is invalid: \`` + process.env.BUILD + `\``
  );
}

const templateClojure = (index) =>
  template(
    BUILD,
    NUM_PAGES,
    MAX_LINES,
    MAX_LINKS,
    MAX_SECTIONS,
    withPartials,
    index
  );

console.log(
  `Generating`,
  NUM_PAGES,
  `pseudo random mdx files in`,
  path.resolve(root)
);
if (withPartials) console.log("with partials");
if (!process.env.NUM_PAGES || process.env.NUM_PAGES === `2000`) {
  console.log(` Set \`NUM_PAGES=200\` to change the volume`);
}

if (!fs.existsSync(root)) {
  fs.mkdirSync(root, { recursive: true });
}

console.time(`Generated in`);
// Create markdown nodes
let p10 = Math.round(NUM_PAGES / 10);
for (let step = 0; step < NUM_PAGES; step++) {
  if (step > 0 && step % p10 === 0)
    console.log(`--> ` + (step / p10) * 10 + `%`);
  let page = templateClojure(step);
  let where = path.join(root, step + `.mdx`);
  fs.writeFileSync(where, page);
}
console.log(`--> 100%`);
console.timeEnd(`Generated in`);

console.log(`Should be written to`, path.resolve(root));
