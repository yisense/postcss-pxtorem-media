function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

function createPxReplace(opts, viewportUnit, viewportSize) {
  return function (m, $1) {
    if (!$1) {
      return m;
    }

    const pixels = parseFloat($1);
    if (pixels <= opts.minPixelValue) {
      return m;
    }

    const parsedVal = toFixed(
      (pixels / viewportSize) * 100,
      opts.unitPrecision
    );
    return parsedVal === 0 ? "0" : parsedVal + viewportUnit;
  };
}
function shouldSkipCurrentDesc(decl, { result }) {
  const ignoreNextComment = "px-to-viewport-ignore-next";
  const ignoreCurComment = "px-to-viewport-ignore";

  const prev = decl.prev();

  if (prev && prev.type === "comment" && prev.text === ignoreNextComment) {
    prev.remove();
    return true;
  }

  const next = decl.next();

  if (next && next.type === "comment" && next.text === ignoreCurComment) {
    console.log('rewrere', next.raws.before)
    if (/\n/.test(next.raws.before)) {
      result.warn(
        "Unexpected comment /* " +
          ignoreCurComment +
          " */ must be after declaration at same line.",
        { node: next }
      );
      return false;
    } else {
      next.remove();
      return true;
    }
  }

  return false;
}
function getVariableFromComment(text) {
  let val = /(?<=(^px-to-viewport-define\s+))([a-zA-Z0-9]+=\d+\s*)+/g.exec(text);

  if (val && val[0]) {
    val = val[0].split(" ").filter((item) => !!item);
  }

  const ignore = text.includes("px-to-viewport-ignoreAll");

  const ret = {};

  ret.ignore = ignore;

  if (val) {
    const match = val;
    for (let item of match) {
      if (!item) {
        continue;
      }
      let [key, value] = item.split("=");
      key = key.trim();
      value = Number(value.trim());

      if (["landscapeWidth", "viewportWidth"].includes(key.trim())) {
        ret[key] = value;
      }
    }

    if (ignore) {
      ret.ignore = true;
    }
  }
  return ret;
}
module.exports = {
  createPxReplace,
  getVariableFromComment,
  shouldSkipCurrentDesc
};
