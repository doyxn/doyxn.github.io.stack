#!/usr/bin/env node

import fs from "fs";
import path from "path";


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
    const markdown = fs.readFileSync(inputPath, "utf8");

    const jsFile = `import React from "react";
import ReactMarkdown from "react-markdown";

const markdown = ${JSON.stringify(markdown)};

export default function ${componentName}() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
`;

    fs.writeFileSync(outputPath, jsFile);
    console.log(`✓ Generated ${outputPath}`);
  }
}

convertMarkdownFiles();
