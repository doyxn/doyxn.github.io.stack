import React from "react";
import ReactMarkdown from "react-markdown";

const markdown = "\r\ntest more actions\r\n\r\nanother line here";

export default function TestAction() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
