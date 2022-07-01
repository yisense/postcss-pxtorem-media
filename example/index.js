"use strict";

const fs = require("fs");
const postcss = require("postcss");
const pxtorem = require("..");

const css = fs.readFileSync(process.cwd() +"/example/main.css", "utf8");
const options = {
  rootValue: 75,
  replace: true,
  minPixelValue: 2,
  propList: ['*']
};
const processedCss = postcss(pxtorem(options)).process(css).css;

console.log(processedCss)
fs.writeFile(process.cwd() +"/example/main-rem.css", processedCss, function(err) {
  if (err) {
    throw err;
  }
  console.log("Rem file written.");
});
