const esbuild = require("esbuild");
const fs = require("fs/promises");
const path = require("path");

void (async () => {
  await esbuild.build({
    bundle: true,
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
    minifySyntax: true,
    treeShaking: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
    },
    entryPoints: ["src/app.tsx"],
    outfile: "build/main.js",
    platform: "browser"
  });
  await Promise.all(["index.html", "style.css"].map(name => fs.copyFile(name, path.join("build", name))));
})();
