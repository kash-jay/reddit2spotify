import { useEffect, useState } from "react";
import PostInfo from "./PostInfo";
import PlaylistBtn from "./PlaylistBtn";

import { extractComments } from "../utils/extractComments";
import { getSongTitles } from "../utils/getSongTitles";
import { fetchRedditData } from "../utils/fetchRedditData";
import { getTrackIDs } from "../utils/getTrackIDs";

let params = undefined;

const RedditSearch = ({ accessToken, refreshToken }) => {
  const [link, setLink] = useState("");
  const [comments, setComments] = useState(() => {
    const localComments = localStorage.getItem("comments");
    return localComments ? JSON.parse(localComments) : [];
  });
  const [gotSongs, setGotSongs] = useState(false);
  const [gotTrackIDs, setGotTrackIDs] = useState(true);
  const [postInfo, setPostInfo] = useState(() => {
    const localArr = localStorage.getItem("postInf");
    return localArr
      ? JSON.parse(localArr)
      : { subreddit: "", title: "", desc: "" };
  });
  const [songs, setSongs] = useState([]);
  const [playlistID, setPlaylistID] = useState();

  useEffect(() => {
    params = new URLSearchParams(window.location.search).get("playlist");
    if (!params) {
      console.log(params);
    }
    setPlaylistID(params);
    window.location.hash = "";
  }, []);

  useEffect(() => {
    if (postInfo.subreddit) {
      localStorage.setItem("postInf", JSON.stringify(postInfo));
    }
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [postInfo, comments]);

  const submitLink = async (e) => {
    e.preventDefault();
    setGotSongs(false);
    setGotTrackIDs(false);
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

      const songTitles = await getSongTitles(
        commentsFlat,
        postSubreddit,
        postTitle,
        postDesc
      );

      const arr = songTitles.split(",");
      const songArr = arr.map((str) => str.trim());
      let songIDArr = await getTrackIDs(accessToken, songArr);
      setGotTrackIDs(true);
      setGotSongs(true);
      setSongs(songIDArr);
      console.log(songIDArr);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("spotifyToken");
    localStorage.removeItem("refreshToken");
    window.location = "/";
  };

  return (
    <div className="flex justify-center flex-col gap-10 h-full w-full">
      <div className="flex justify-center flex-col gap-12 h-full w-full py-4">
        <div className="w-full flex justify-between px-4 items-center">
          <div onClick={handleLogout} className="btn btn-success">
            Logout
          </div>
          <a className="text-center text-3xl" href="/">
            Reddit2Spotify
          </a>
          <div></div>
        </div>
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
          {gotSongs ? (
            <PlaylistBtn
              accessToken={accessToken}
              songIDs={songs}
              link={link}
            />
          ) : (
            <></>
          )}
          {gotTrackIDs ? (
            <></>
          ) : (
            <span className="loading loading-spinner text-success"></span>
          )}
        </div>
        {(comments.length > 0 && playlistID) || songs.length > 0 ? (
          <PostInfo
            postInfo={postInfo}
            comments={comments}
            playlistID={playlistID}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default RedditSearch;
