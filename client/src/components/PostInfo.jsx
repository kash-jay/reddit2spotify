import React, { useEffect } from "react";
import Comment from "./Comment";
import SpotifyPlayer from "./SpotifyPlayer";

const PostInfo = ({ postInfo, comments, playlistID }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-8 h-full w-full py-6 md:py-12 overflow-x-hidden">
      <div className=" flex flex-col-reverse items-center gap-12 md:flex-row md:justify-evenly w-[100vw] h-full md:items-start">
        <div className="mx-6 max-w-[40%] flex flex-col items-center gap-3 w-full">
          <div className="bg-base-200 collapse w-[80vw] md:w-full">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-2xl text-neutral-content peer-checked:bg-base-300 peer-checked:text-white">
              Subreddit
            </div>
            <div className="collapse-content text-lg bg-base-300 text-neutral peer-checked:bg-base-300 peer-checked:text-base-content">
              <p>{postInfo.subreddit}</p>
            </div>
          </div>

          <div className="bg-base-200 collapse w-[80vw] md:w-full">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-2xl text-neutral-content peer-checked:bg-base-300 peer-checked:text-white">
              Post Title
            </div>
            <div className="collapse-content text-lg bg-base-300 text-neutral peer-checked:bg-base-300 peer-checked:text-base-content">
              <p>{postInfo.title}</p>
            </div>
          </div>

          <div className="bg-base-200 collapse w-[80vw] md:w-full">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-2xl text-neutral-content peer-checked:bg-base-300 peer-checked:text-white">
              Post Description
            </div>
            <div className="collapse-content text-lg bg-base-300 text-neutral peer-checked:bg-base-300 peer-checked:text-base-content">
              {postInfo === "" ? (
                <p>{postInfo.desc}</p>
              ) : (
                <p className=" opacity-50">No description</p>
              )}
            </div>
          </div>

          <div className="bg-base-200 collapse w-[80vw] md:w-full">
            <input type="checkbox" className="peer w-full" />
            <div className="collapse-title text-2xl text-neutral-content peer-checked:bg-base-300 peer-checked:text-white">
              Comments
            </div>
            <div className="collapse-content w-full bg-base-300 text-neutral peer-checked:bg-base-300 peer-checked:text-base-content">
              {comments.map((comment) => {
                if (comment.body.length > 0) {
                  return (
                    <Comment key={comment.id} comment={comment} level={0} />
                  );
                }
              })}
            </div>
          </div>
        </div>
        {playlistID ? (
          <SpotifyPlayer playlistID={playlistID}/>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PostInfo;
