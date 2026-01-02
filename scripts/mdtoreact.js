
import fs from "fs";
import path from "path";
import matter from "gray-matter";


const CONTENT_DIR = path.resolve("./blogs");
const FALLBACK_DIR = path.resolve("."); // project root
const OUTPUT_DIR = path.resolve(".generated/blogs");

/**
 * Convert a filename to PascalCase for React components
 * example: "my-first-post.md" → "MyFirstPost"
 */
function toComponentName(filename) {
  return filename
    .replace(/\.md$/, "")
    .split(/[-_]/g)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}


function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".md"));
}

function convertMarkdownFiles() {
  ensureDir(OUTPUT_DIR);

  let files = getMarkdownFiles(CONTENT_DIR);
  let inputDir = CONTENT_DIR;

  // Fallback: if no files in blogs, look in project root
  if (files.length === 0) {
    files = getMarkdownFiles(FALLBACK_DIR);
    inputDir = FALLBACK_DIR;
    if (files.length === 0) {
      console.warn("No markdown files found in blogs or project root.");
      return;
    }
  }

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      OUTPUT_DIR,
      file.replace(/\.md$/, ".js")
    );

    const componentName = toComponentName(file);
    const raw = fs.readFileSync(inputPath, "utf8");
    const { content: markdown } = matter(raw);

    const jsFile = `import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";


const markdown = ${JSON.stringify(markdown)};

export default function ${componentName}() {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
`;

    fs.writeFileSync(outputPath, jsFile);
    console.log(`✓ Generated ${outputPath}`);
  }
}

convertMarkdownFiles();


function createIndexFile() {
  ensureDir(OUTPUT_DIR);

  let files = getMarkdownFiles(CONTENT_DIR);
  let inputDir = CONTENT_DIR;

  // Fallback: if no files in blogs, look in project root
  if (files.length === 0) {
    files = getMarkdownFiles(FALLBACK_DIR);
    inputDir = FALLBACK_DIR;
    if (files.length === 0) {
      console.warn("No markdown files found in blogs or project root.");
      return;
    }
  }
  // Normalize slugs (filenames without .md)
  const slugs = files.map(f => f.replace(/\.md$/, "")).sort();

  // Build import lines and blog entries
  const imports = slugs
    .map(slug => {
      const comp = toComponentName(slug + ".md");
      return `import ${comp} from "./${slug}";`;
    })
    .join("\n");

  const entries = slugs
    .map(slug => {
      const comp = toComponentName(slug + ".md");
      const inputPath = path.join(inputDir, slug + ".md");
      const raw = fs.readFileSync(inputPath, "utf8");
      const { data } = matter(raw);
      const title = data.title || slug.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      const description = data.description || "";
      const tags = Array.isArray(data.tags) ? data.tags : (typeof data.tags === "string" ? [data.tags] : []);
      return `  "${slug}": {\n    title: ${JSON.stringify(title)},\n    description: ${JSON.stringify(description)},\n    tags: ${JSON.stringify(tags)},\n    component: ${comp},\n  },`;
    })
    .join("\n\n");

  const indexJs = `${imports}\n\nexport const blogs = {\n${entries}\n};\n`;

  const outPath = path.join(OUTPUT_DIR, "index.js");
  fs.writeFileSync(outPath, indexJs);
  console.log(`✓ Generated ${outPath}`);
  
}
createIndexFile();