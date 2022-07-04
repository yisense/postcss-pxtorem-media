"use strict";

const fs = require("fs");
const postcss = require("postcss");
const pxtorem = require("..");

const css = fs.readFileSync(process.cwd() +"/example/main.css", "utf8");
const options = {
  rootValue: 192,
  replace: true,
  minPixelValue: 2,
  propList: ['*'],
  mediaQuery: false
};
const processedCss = postcss(pxtorem(options)).process(css).css;
fs.writeFile(process.cwd() +"/example/main-rem.css", processedCss, function(err) {
  if (err) {
    throw err;
  }
  console.log("Rem file written.");
});
