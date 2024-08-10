export const fetchRedditData = async (link) => {
  const response = await fetch(`${link}.json`);
  const data = await response.json();
  const postTitle = data[0].data.children[0].data.title;
  const postSubreddit = data[0].data.children[0].data.subreddit_name_prefixed;
  const postDesc = data[0].data.children[0].data.selftext;
  const commentsData = data[1].data;
  return { postTitle, postSubreddit, postDesc, commentsData };
};
