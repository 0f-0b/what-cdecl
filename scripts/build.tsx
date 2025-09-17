#!/usr/bin/env -S deno run -A

/* @jsxRuntime automatic */
/* @jsxImportSource hastscript */

import { denoPlugin } from "@deno/esbuild-plugin";
import { emptyDir } from "@std/fs/empty-dir";
import { relative } from "@std/path/relative";
import { build, stop } from "esbuild";
import { toHtml } from "hast-util-to-html";

let dev = false;
for (const arg of Deno.args) {
  if (arg === "--dev") {
    dev = true;
    continue;
  }
  console.error(`Unexpected argument '${arg}'.`);
  Deno.exit(2);
}
Deno.chdir(new URL("..", import.meta.url));
await emptyDir("dist");
const [js, css] = await (async () => {
  const outDir = "dist";
  const inputs = ["static/main.tsx", "static/style.css"];
  try {
    const { metafile } = await build({
      bundle: true,
      splitting: true,
      metafile: true,
      outdir: outDir,
      entryNames: "[dir]/[name]-[hash]",
      entryPoints: inputs,
      plugins: [denoPlugin({ configPath: "static/deno.json" })],
      absWorkingDir: Deno.cwd(),
      sourcemap: "linked",
      format: "esm",
      target: "es2024",
      minify: !dev,
      charset: "utf8",
    });
    const outputs = new Map<string, string>();
    for (const [output, { entryPoint }] of Object.entries(metafile.outputs)) {
      if (entryPoint !== undefined) {
        outputs.set(entryPoint, relative(outDir, output));
      }
    }
    return inputs.map((path) => outputs.get(path)!);
  } catch {
    throw "Build failed";
  } finally {
    await stop();
  }
})();
const html = toHtml(
  // @ts-expect-error workaround
  <>
    {{ type: "doctype" }}
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta name="description" content="Can you read C declarations?" />
        <title>What cdecl?</title>
        <link rel="stylesheet" href={css} />
        <script src={js} type="module" />
      </head>
      <body>
        <div id="root" />
      </body>
    </html>
  </>,
  {
    omitOptionalTags: true,
    preferUnquoted: true,
    quoteSmart: true,
    tightCommaSeparatedLists: true,
    upperDoctype: true,
  },
);
await Deno.writeTextFile("dist/index.html", html);
