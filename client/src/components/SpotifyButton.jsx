import React, { useState } from "react";

// let api = 'https://reddit2spotify-api.onrender.com';
let api = 'http://localhost:3001';

const SpotifyButton = () => {
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const createPlaylist = async () => {
    setCreatingPlaylist(true);
    window.location.href = `${api}/create-playlist`;
  };

  return (
    <>
      {creatingPlaylist ? (
        <span className="loading loading-spinner text-success"></span>
      ) : (
        <div
          className="btn btn-active text-white/80 hover:text-white hover:border-white btn-success hover:text-green hover:border-green hover:scale-105 text-lg"
          onClick={async () => await createPlaylist()}
        >
          Create Spotify Playlist
        </div>
      )}
    </>
  );
};

export default SpotifyButton;
