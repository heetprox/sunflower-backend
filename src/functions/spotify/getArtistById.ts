import axios from "axios";
import { getSpotifyToken } from "./getSpotifyToken";

export const getArtistById = async (artistId: string) => {
    try {
        // Await the token
        const token = await getSpotifyToken();

        const url = `https://api.spotify.com/v1/artists/${artistId}`;

        const response = await axios.get(url, {  
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        console.error("Spotify Artist Fetch Error:", error.response?.data || error);
        console.error("Artist ID:", artistId);
        throw new Error("Failed to fetch artist from Spotify");
    }
}