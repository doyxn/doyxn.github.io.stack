import React from "react";
import ReactMarkdown from "react-markdown";

const markdown = "test more actions\r\n";

export default function TestAction() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
