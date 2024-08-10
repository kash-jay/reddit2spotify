import { useEffect, useState } from "react";
import RedditSearch from "./components/RedditSearch";

const api = 'https://reddit2spotify-api.onrender.com';

const getTokensFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

function App() {
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem("spotifyToken") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");
  const [loggedIn, setLoggedIn] = useState(!!spotifyToken);

  useEffect(() => {
    const tokens = getTokensFromUrl();
    const access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token;
    window.location.hash = "";

    if (access_token) {
      setSpotifyToken(access_token);
      setRefreshToken(refresh_token);
      setLoggedIn(true);

      localStorage.setItem("spotifyToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
    }
  }, []);

  useEffect(() => {
    if (!spotifyToken && refreshToken) {
      fetch(`${api}/refresh_token?refresh_token=${refreshToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            setSpotifyToken(data.access_token);
            setLoggedIn(true);
            localStorage.setItem("spotifyToken", data.access_token);
            if (data.refresh_token) {
              setRefreshToken(data.refresh_token);
              localStorage.setItem("refreshToken", data.refresh_token);
            }
          }
        });
    }
  }, [spotifyToken, refreshToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshToken) {
        fetch(`${api}/refresh_token?refresh_token=${refreshToken}`)
          .then(res => res.json())
          .then(data => {
            if (data.access_token) {
              setSpotifyToken(data.access_token);
              localStorage.setItem("spotifyToken", data.access_token);
              if (data.refresh_token) {
                setRefreshToken(data.refresh_token);
                localStorage.setItem("refreshToken", data.refresh_token);
              }
            }
          });
      }
    }, 3000 * 1000);
  
    return () => clearInterval(interval);
  }, [refreshToken]);
  

  return (
    <div>
      {loggedIn ? (
        <RedditSearch accessToken={spotifyToken} refreshToken={refreshToken} />
      ) : (
        <div className="w-full h-[100vh] flex justify-center items-center">
          <a href={`${api}/login`} className="btn btn-success">
            Log in to spotify
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
