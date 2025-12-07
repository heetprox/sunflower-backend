import axios from "axios";
import { getSpotifyToken } from "./getSpotifyToken";

export const searchArtists = async (query: string) => {
  try {
    const token = await getSpotifyToken();

    const url = "https://api.spotify.com/v1/search";

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: "artist",
        limit: 10,
      },
    });

    return response.data.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || null,
      popularity: artist.popularity,
      followers: artist.followers.total
    }));
  } catch (error: any) {
    console.error("Spotify Search Error:", error.response?.data || error);
    throw new Error("Failed to search artists on Spotify");
  }
};
