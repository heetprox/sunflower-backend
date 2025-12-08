import type { Request, Response } from 'express';
import axios from "axios";
import { getSpotifyToken } from "./getSpotifyToken";


export const searchArtists = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const token = await getSpotifyToken();
    const url = "https://api.spotify.com/v1/search";

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: q,
        type: "artist",
        limit: 10,
      },
    });

    const artists = response.data.artists.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      images: artist.images || [],
      popularity: artist.popularity,
      followers: artist.followers.total
    }));

    return res.status(200).json({
      success: true,
      data: artists
    });
  } catch (error: any) {
    console.error("Spotify Search Error:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Failed to search artists on Spotify"
    });
  }
};
