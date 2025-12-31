import React from "react";
import ReactMarkdown from "react-markdown";

const markdown = "# doyxn.github.io.stack\r\nblog markdown files of doyxn.github.io/#/writing\r\n";

export default function README() {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
