import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const inputFile = process.argv[2];
const outputDir = process.argv[3] || "src/pages";

if (!inputFile) {
  console.error("❌ Please provide a markdown file");
  process.exit(1);
}

const markdown = fs.readFileSync(inputFile, "utf-8");
const { content, data } = matter(markdown);


const html = marked.parse(content);

// Create React component name
const fileName = path.basename(inputFile, ".md");
const componentName =
  fileName.charAt(0).toUpperCase() + fileName.slice(1);

// React page template
const reactPage = `
import React from "react";

export default function ${componentName}() {
  return (
    <main className="markdown-page">
      <h1>${data.title || componentName}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: \`${html}\` }}
      />
    </main>
  );
}
`;

fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, `${componentName}.jsx`);
fs.writeFileSync(outputPath, reactPage);

console.log(`Generated ${outputPath}`);