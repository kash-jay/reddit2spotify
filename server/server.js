const express = require("express");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const dotenv = require("dotenv");
const axios = require("axios");

const { extractSongTitles } = require("./openai");

dotenv.config({
  path: "./.env",
});

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const scopes = ["playlist-modify-public", "playlist-modify-private"];

const spotifyApi = new SpotifyWebApi({
  redirectUri: `https://reddit2spotify-api.onrender.com/callback`,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});

let songArr = [];
let link = undefined;
let songIDset = new Set();
let songIDarr = [];
let playlistId = undefined;

let addSongsPromiseResolve;
const addSongsPromise = new Promise((resolve) => {
  addSongsPromiseResolve = resolve;
});

app.post("/get-songs", async (req, res) => {
  songArr = [];
  link = undefined;
  songIDset = new Set();
  songIDarr = [];
  playlistId = undefined;

  const { subreddit, title, description, comments } = req.body;
  link = req.body.link;
  const songList = await extractSongTitles(subreddit, title, description, comments);
  // const songList = "slave master, Psycho, baptiize, slave master";
  const arr = songList.split(",");
  songArr = arr.map((str) => str.trim());

  res.send(songList);
});


app.get("/spotify-login", (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get("/callback", async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  await spotifyApi
    .authorizationCodeGrant(code)
    .then(async (data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body["access_token"];
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);

      console.log("got tokens");
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.send(`Error getting Tokens: ${error}`);
    });

  let i = 0;
  songIDset = new Set();
  console.log("adding songs to set");
  const addSongsToSet = async () => {
    while (i < songArr.length) {
      try {
        const data = await spotifyApi.searchTracks(songArr[i]);
        const songID = data.body.tracks.items[0].id;
        console.log("added: " + data.body.tracks.items[0].name);
        songIDset.add(songID);
        i++;
      } catch (error) {
        console.log(error);
        if (error.statusCode === 429) {
          const retryAfter = parseInt(error.headers["retry-after"], 10) * 1000;
          console.log(`Rate limited. Retrying after ${retryAfter}ms`);
          await new Promise((resolve) => setTimeout(resolve, retryAfter));
          await addSongsToSet();
        }
      }
    }
    addSongsPromiseResolve();
  };

  await addSongsToSet();
  console.log("added songs to set");
  res.send('added songs to set');
});

app.get("/create-playlist", async (req, res) => {
  console.log("create-playlist pressed");
  await addSongsPromise;
  console.log("create-playlist starting");
  let j = 0;
  songIDarr = Array.from(songIDset).map((song) => `spotify:track:${song}`);
  console.log(songIDarr);
  await spotifyApi
    .createPlaylist("Reddit Playlist", {
      description: link,
      public: true,
    })
    .then(
      function (data) {
        playlistId = data.body.id;
      },
      function (err) {
        console.log("Error creating playlist: ", err);
      }
    );

  const addSongsToPlaylist = async () => {
    let batchNum = 1;
    while (j < songIDarr.length) {
      let tempSongArr = [];
      try {
        while (j < batchNum * 99 && j < songIDarr.length) {
          tempSongArr.push(songIDarr[j]);
          j++;
        }
        batchNum++;
        await spotifyApi.addTracksToPlaylist(playlistId, tempSongArr);
      } catch (error) {
        console.log(error);
        if (error.statusCode === 429) {
          const retryAfter = parseInt(error.headers["retry-after"], 10) * 1000;
          console.log(`Rate limited. Retrying after ${retryAfter}ms`);
          await new Promise((resolve) => setTimeout(resolve, retryAfter));
          await addSongsToSet();
        }
      }
    }
    console.log("added all");
  };

  songIDset = new Set();
  await addSongsToPlaylist();
  console.log("added each song to playlist");
  res.redirect(`http://localhost:5173/?playlist_id=${playlistId}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
