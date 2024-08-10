import React, { useState } from "react";

const PlaylistBtn = ({ accessToken, songIDs, link }) => {
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  const createPlaylist = async (access_token, songIDs) => {
    setCreatingPlaylist(true);
    var userID = "";
    let playlistID = "";

    var params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const me = await fetch("https://api.spotify.com/v1/me", params)
      .then((res) => res.json())
      .then((data) => (userID = data.id));

    var body = JSON.stringify({
      name: "Reddit Playlist",
      description: link,
      public: true,
    });

    params = {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(
      `https://api.spotify.com/v1/users/${userID}/playlists`,
      params
    )
      .then((res) => res.json())
      .then((data) => (playlistID = data.id));
    console.log("created playlist: " + playlistID);

    const chunkSize = 100;
    const chunks = chunkArray(songIDs, chunkSize);

    for (let chunk of chunks) {
      console.log(chunk);
      body = JSON.stringify({
        uris: chunk,
        position: 0,
      });

      params = {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const addSongs = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
        params
      )
      .then((res) => res.json())
      .then(data => console.log(data));
    }

    console.log("added songs to playlist");

    setCreatingPlaylist(false);
    window.location = `/?playlist=${playlistID}`;
  };

  return (
    <>
      {creatingPlaylist ? (
        <span className="loading loading-spinner text-success"></span>
      ) : (
        <div
          className="btn btn-active text-white/80 hover:text-white hover:border-white btn-success hover:text-green hover:border-green hover:scale-105 text-lg"
          onClick={async () => await createPlaylist(accessToken, songIDs)}
        >
          Create Spotify Playlist
        </div>
      )}
    </>
  );
};

export default PlaylistBtn;
