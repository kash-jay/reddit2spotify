export const fetchRedditData = async (link) => {
  const response = await fetch(`${link}.json`);
  const data = await response.json();
  const postTitle = data[0].data.children[0].data.title;
  const postSubreddit = data[0].data.children[0].data.subreddit_name_prefixed;
  const postDesc = data[0].data.children[0].data.selftext;
  const commentsData = data[1].data;
  return { postTitle, postSubreddit, postDesc, commentsData };
};

export const sendComments = async (
  comments,
  postSubreddit,
  postTitle,
  postDesc,
  link
) => {
  let api = "https://reddit2spotify-api.onrender.com";
  // let api = "http://localhost:3001";

  const body = JSON.stringify({
    subreddit: postSubreddit,
    title: postTitle,
    desc: postDesc,
    comments: comments,
    link: link,
  });
  const response = await fetch(`${api}/get-songs`, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.text();
  return data;
};
