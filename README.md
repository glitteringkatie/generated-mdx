# generated-mdx

This repo is essentially a gutted and more customized version of [johnatspreadstreet/gatsby-md-vs-mdx](https://github.com/johnatspreadstreet/gatsby-md-vs-mdx).

We have script to randomly generate mdx files, with links between them, to test build performance across multiple systems.

```
yarn
rm -rf generated-docs
NUM_PAGES=10 node generate.js
```
