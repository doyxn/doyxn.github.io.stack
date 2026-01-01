import React from "react";
import ReactMarkdown from "react-markdown";

const markdown = "\r\ntest more actions\r\nupdates again";

export default function TestAction() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
