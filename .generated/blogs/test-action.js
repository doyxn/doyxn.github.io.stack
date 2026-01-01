import React from "react";
import ReactMarkdown from "react-markdown";

const markdown = "test more actions\r\n\r\nanother line here";

export default function TestAction() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
