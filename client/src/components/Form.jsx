import { useEffect, useState } from "react";
import { fetchRedditData, sendComments } from "../utils/api";
import { extractComments } from "../utils/utils";
import SpotifyButton from "./SpotifyButton";
import SpotifyPlayer from "./SpotifyPlayer";
import PostInfo from "./PostInfo";

let params = undefined;
let api = 'https://reddit2spotify-api.onrender.com';
// let api = "http://localhost:3001";

const Form = () => {
  const [link, setLink] = useState("");
  const [comments, setComments] = useState(() => {
    const localComments = localStorage.getItem("comments");
    if (localComments == null) return [];
    localStorage.removeItem("comments");
    return JSON.parse(localComments);
  });
  const [songs, setSongs] = useState([]);
  const [haveRedditInf, setHaveRedditInf] = useState(false);
  const [playlistID, setPlaylistID] = useState();
  const [loadingReddit, setLoadingReddit] = useState(false);
  const [postInfo, setPostInfo] = useState(() => {
    const localArr = localStorage.getItem("postInf");
    if (localArr == null)
      return {
        subreddit: "",
        title: "",
        desc: "",
      };
    localStorage.removeItem("postInf");
    return JSON.parse(localArr);
  });

  useEffect(() => {
    params = new URLSearchParams(window.location.search).get("playlist_id");
    setPlaylistID(params);
  });

  useEffect(() => {
    localStorage.setItem("postInf", JSON.stringify(postInfo));
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [postInfo]);

  useEffect(() => {
    setLoadingReddit(false);
  }, [songs]);

  const submitLink = async (e) => {
    e.preventDefault();
    setLoadingReddit(true);
    try {
      const { postTitle, postSubreddit, postDesc, commentsData } =
        await fetchRedditData(link);

      setPostInfo({
        subreddit: postSubreddit,
        title: postTitle,
        desc: postDesc,
      });

      const commentsFlat = extractComments(commentsData);
      setComments(commentsFlat);

      const songList = await sendComments(
        commentsFlat,
        postSubreddit,
        postTitle,
        postDesc,
        link
      );

      const arr = songList.split(",");
      const songArr = arr.map((str) => str.trim());

      console.log(songArr);

      setSongs(songArr);
      localStorage.setItem("songArr", JSON.stringify(songArr));

      setHaveRedditInf(true);
      window.location.href = `${api}/spotify-login`;
    } catch (err) {
      console.error("Error", err);
    }
  };

  return (
    <div className="flex justify-center flex-col gap-10 h-full w-full">
      {playlistID && false ? (
        <SpotifyPlayer playlistID={playlistID} />
      ) : (
        <div className="flex justify-center flex-col gap-12 h-full w-full py-6">
          <a className="text-center text-3xl" href="/">
            Reddit2Spotify
          </a>
          <div className="w-full flex flex-col md:flex-row justify-center gap-5 items-center">
            <form
              onSubmit={submitLink}
              className="flex flex-col md:flex-row gap-5"
            >
              <input
                type="text"
                placeholder="reddit.com/r/future/comments/176dnvh/whats_a_future_song_that_gave_you_chills_the/"
                className="input input-bordered max-w-[60vw] hover:border-white transition-all duration-300"
                onChange={(e) => setLink(e.target.value)}
              />
              <button
                type={"submit"}
                className="btn btn-active hover:text-white hover:border-white hover:scale-105"
              >
                Search
              </button>
            </form>
            {haveRedditInf ? <SpotifyButton /> : <></>}
            {loadingReddit ? (
              <span className="loading loading-spinner text-success"></span>
            ) : (
              <></>
            )}
          </div>
          {comments.length > 0 || playlistID ? (
            <PostInfo
              postInfo={postInfo}
              comments={comments}
              playlistID={playlistID}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default Form;
