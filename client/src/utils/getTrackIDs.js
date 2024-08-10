const searchTrack = async (track, accessToken) => {
  let trackID = "";
  var params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${track}&type=track`,
    params
  )
    .then((res) => res.json())
    .then((data) => (trackID = data.tracks.items[0].id));
  return trackID;
};

export const getTrackIDs = async (accessToken, songTitleArr) => {
  //   console.log(accessToken);
  var songIDset = new Set();
  console.log("adding songs to set");
  for (let i = 0; i < songTitleArr.length; i++) {
    var song = songTitleArr[i];
    var songID = await searchTrack(song, accessToken);
    songIDset.add(songID);
  }
  return Array.from(songIDset).map((id) => `spotify:track:${id}`);
};
