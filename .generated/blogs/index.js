import README from "./README";
import TestAction from "./test-action";
import TestBlog from "./test-blog";

export const blogs = {
  "README": {
    title: "README",
    description: "",
    tags: [],
    component: README,
  },

  "test-action": {
    title: "My First Post",
    description: "This is a short summary of my first post.",
    tags: ["react","hooks","tutorial"],
    component: TestAction,
  },

  "test-blog": {
    title: "Test Blog",
    description: "",
    tags: [],
    component: TestBlog,
  },
};
