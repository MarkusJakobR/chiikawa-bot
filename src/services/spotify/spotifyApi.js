export async function getSpotifyToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
    },
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching Spotify token: ", errorData);
    throw new Error("Failed to fetch Spotify token.");
  }
  const data = await response.json();
  return data.access_token;
}
