export const getSongTitles = async (
  comments,
  postSubreddit,
  postTitle,
  postDesc,
) => {
  var prompt = `
Subreddit: ${postSubreddit}
Post Title: ${postTitle ? postTitle : ""}
Post Description: ${postDesc ? postDesc : ""}
Comments:
  `;
  comments.forEach((comment) => {
    prompt += `- ${comment.body}\n`;
  });

  const body = JSON.stringify({
    prompt: prompt,
  });

  const response = await fetch("http://localhost:3001/get-songs", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.text();
  return data;
};
