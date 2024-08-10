import React from "react";

const SpotifyPlayer = ({ playlistID }) => {
  return (
    <div
      id="iframe-parent"
      className=" w-[80vw] md:w-full h-[60vh] max-h-xl overflow-hidden overflow-y-hidden mx-6"
    >
      <iframe
        className=" border-r-[0px] rounded-2xl shadow-xl"
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
