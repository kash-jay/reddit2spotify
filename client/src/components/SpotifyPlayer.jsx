import React from "react";

const SpotifyPlayer = ({ playlistID }) => {
  return (
    <div className="h-screen w-full flex flex-col gap-12 py-6 overflow-hidden overflow-y-hidden">
      <a href="/" className="btn btn-active duration-500 hover:text-white hover:border-white mx-4 max-w-fit">Back Home</a>
      <iframe
        className=" border-r-[0px] mx-auto h-[80%] w-[80%] max-w-[80%] max-h-[80%] rounded-2xl shadow-xl"
        src={`https://open.spotify.com/embed/playlist/${playlistID}?utm_source=generator`}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;
