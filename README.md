# postcss-pxtorem-media

A plugin for [PostCSS](https://github.com/ai/postcss) that generates rem units from pixel units.

## Install

```shell
$ npm install postcss postcss-pxtorem-media --save-dev
```

## Usage

Pixels are the easiest unit to use (*opinion*). The only issue with them is that they don't let browsers change the default font size of 16. This script converts every px value to a rem from the properties you choose to allow the browser to set the font size.


### Input/Output

*With the default settings, only font related properties are targeted.*

```js
const options = {
  rootValue: 192,
  replace: true,
  minPixelValue: 2,
  propList: ['*'],
  mediaQuery: false
};
```

```css
// input default rootValue 192
h1 {
  margin: 0 0 0.10417rem;
  font-size: 0.16667rem;
  line-height: 1.2;
  letter-spacing: 1px;
}
@media screen and (max-width: 750px) {
  // next comments: You can customize the rootValue: (750 / 10)
  /*! px-to-rem-define viewportWidth=750 */
  h1 {
    margin: 0 0 0.26667rem;
    font-size: 0.42667rem;
    line-height: 1.2;
    letter-spacing: 1px;
  }
}

// output rootValue: 192
h1 {
  margin: 0 0 0.10417rem;
  font-size: 0.16667rem;
  line-height: 1.2;
  letter-spacing: 1px;
}
// output rootValue: 75
@media screen and (max-width: 750px) {
  /*! px-to-rem-define viewportWidth=750 */
  h1 {
    margin: 0 0 0.26667rem;
    font-size: 0.42667rem;
    line-height: 1.2;
    letter-spacing: 1px;
  }
}

```

### Example

You can use special comments for ignore conversion of single lines:
- `/*! px-to-rem-ignore-next */` — on a separate line, prevents conversion on the next line.
- `/*! px-to-rem-ignoreAll */` — ignore all file

```js
var fs = require('fs');
var postcss = require('postcss');
var pxtorem = require('postcss-pxtorem');
var css = fs.readFileSync(process.cwd() +"/example/main.css", "utf8");
var options = {
  rootValue: 192,
  replace: true,
  minPixelValue: 2,
  propList: ['*'],
  mediaQuery: false
};
var processedCss = postcss(pxtorem(options)).process(css).css;

fs.writeFile(process.cwd() +"/example/main-rem.css", processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});
```

### options

Type: `Object | Null`  
Default:
```js
{
    rootValue: 16,
    unitPrecision: 5,
    propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
    exclude: /node_modules/i
}
```

- `rootValue` (Number | Function) Represents the root element font size or returns the root element font size based on the [`input`](https://api.postcss.org/Input.html) parameter
- `unitPrecision` (Number) The decimal numbers to allow the REM units to grow to.
- `propList` (Array) The properties that can change from px to rem.
    - Values need to be exact matches.
    - Use wildcard `*` to enable all properties. Example: `['*']`
    - Use `*` at the start or end of a word. (`['*position*']` will match `background-position-y`)
    - Use `!` to not match a property. Example: `['*', '!letter-spacing']`
    - Combine the "not" prefix with the other prefixes. Example: `['*', '!font*']`
- `selectorBlackList` (Array) The selectors to ignore and leave as px.
    - If value is string, it checks to see if selector contains the string.
        - `['body']` will match `.body-class`
    - If value is regexp, it checks to see if the selector matches the regexp.
        - `[/^body$/]` will match `body` but not `.body`
- `replace` (Boolean) Replaces rules containing rems instead of adding fallbacks.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `exclude` (String, Regexp, Function) The file path to ignore and leave as px.
    - If value is string, it checks to see if file path contains the string.
        - `'exclude'` will match `\project\postcss-pxtorem\exclude\path`
    - If value is regexp, it checks to see if file path matches the regexp.
        - `/exclude/i` will match `\project\postcss-pxtorem\exclude\path`
    - If value is function, you can use exclude function to return a true and the file will be ignored.
        - the callback will pass the file path as  a parameter, it should returns a Boolean result.
        - `function (file) { return file.indexOf('exclude') !== -1; }`

### Use with gulp-postcss and autoprefixer

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');

gulp.task('css', function () {

    var processors = [
        autoprefixer({
            browsers: 'last 1 version'
        }),
        pxtorem({
            replace: false
        })
    ];

    return gulp.src(['build/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'));
});
```

### A message about ignoring properties
Currently, the easiest way to have a single property ignored is to use a capital in the pixel unit declaration.

```css
// `px` is converted to `rem`
.convert {
    font-size: 16px; // converted to 1rem
}

.ignore {
    /*! px-to-rem-ignore-next */
    border: 1px solid;
}
```
