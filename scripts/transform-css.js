const fs = require("fs");
const postcss = require("postcss");
const { transform, browserslistToTargets, Features } = require("lightningcss");

const inputPath = "css/style.css";
const originalCss = fs.readFileSync(inputPath);

const transformed = transform({
  filename: inputPath,
  code: originalCss,
  targets: browserslistToTargets([
    "chrome >= 80",
    "edge >= 80",
    "firefox >= 78",
    "safari >= 13",
  ]),
  include: Features.Nesting | Features.MediaQueries | Features.LogicalProperties,
  minify: false,
});

const root = postcss.parse(transformed.code.toString(), { from: inputPath });

const layerRules = [];
root.walkAtRules("layer", (rule) => {
  layerRules.push(rule);
});

for (const rule of layerRules) {
  if (rule.nodes && rule.nodes.length > 0) {
    rule.replaceWith(...rule.nodes);
  } else {
    rule.remove();
  }
}

fs.writeFileSync(inputPath, root.toString());
