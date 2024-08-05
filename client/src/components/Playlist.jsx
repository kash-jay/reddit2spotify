
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "fe14615644b14eb5a76e58c78d8e6b98",
});

const searchSong = async (accessToken, searchQuery) => {
  spotifyApi.setAccessToken(accessToken);
  console.log(searchQuery);
  try {
    const res = await spotifyApi.searchTracks(searchQuery);
    return res.body.tracks.items;
  } catch (error) {
    console.error("Error searching song: ", error);
    return [];
  }
};

const createPlaylist = async (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
  try {
    await spotifyApi.createPlaylist("My playlist", {
      description: "My description",
      public: "false",
    });
    console.log("Created playlist!");
  } catch (error) {
    console.error("Error creating playlist: ", error);
  }
};

const Playlist = ({ accessToken, songList }) => {
  const [playlistCreated, setPlaylistCreated] = useState(false);

  useEffect(() => {
    if (!accessToken || !songList.length) return;

    if (!playlistCreated) {
      createPlaylist(accessToken).then(() => setPlaylistCreated(true));
    }

    const searchResult = searchSong(accessToken, songList[0]);
    console.log(searchResult);
  }, [accessToken, songList, playlistCreated]);

  if (!accessToken || !songList.length) return <div>Loading...</div>;
  return <div>Playlist</div>;
};

export default Playlist;
