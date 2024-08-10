let nextId = 0;

export function extractComments(data) {
  const result = [];
  const traverse = (item) => {
    if (item.kind === "t1" || item.kind === "t3") {
      let { body } = item.data;
      body = body.replace(/[^\w\s-]/g, "");

      const comment = {
        id: nextId++,
        body: body || "",
      };
      result.push(comment);
    }
  };
  if (data && data.children) {
    data.children.forEach(traverse);
  }
  return result;
}
