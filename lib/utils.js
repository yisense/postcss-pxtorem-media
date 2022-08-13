function shouldSkipCurrentDesc(decl, { result }) {
  const ignoreNextComment = "px-to-rem-ignore-next";
  const ignoreCurComment = "px-to-rem-ignore";

  const prev = decl.prev();

  if (prev && prev.type === "comment" && prev.text === ignoreNextComment) {
    prev.remove();
    return true;
  }

  const next = decl.next();

  if (next && next.type === "comment" && next.text === ignoreCurComment) {
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
  let val = /(?<=(^s+|px-to-rem-define\s+))([a-zA-Z0-9]+=\d+\s*)+/g.exec(text);

  if (val && val[0]) {
    val = val[0].split(" ").filter((item) => !!item);
  }

  const ignore = text.includes("px-to-rem-ignoreAll");

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

      if (["viewportWidth"].includes(key.trim())) {
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
  getVariableFromComment,
  shouldSkipCurrentDesc
};
