import prisma from "@/lib/prisma";
import axios from "axios";
import { getSpotifyToken } from "./getSpotifyToken";

export const getFollowedArtistsAlbums = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.following || user.following.length === 0) {
      return {
        success: true,
        data: []
      };
    }

    const token = await getSpotifyToken();

    const allAlbums = [];

    for (const spotifyArtistId of user.following) {
      try {
        const artistUrl = `https://api.spotify.com/v1/artists/${spotifyArtistId}`;
        const artistResponse = await axios.get(artistUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const artistName = artistResponse.data.name;

        const albumsUrl = `https://api.spotify.com/v1/artists/${spotifyArtistId}/albums`;
        const albumsResponse = await axios.get(albumsUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            include_groups: 'album,single', // Get albums and singles
            limit: 50 // Max albums per artist
          }
        });

        // Extract only the needed fields
        const albums = albumsResponse.data.items.map((album: any) => ({
          albumName: album.name,
          albumImages: album.images,
          artistName: artistName,
          releaseDate: album.release_date
        }));

        allAlbums.push(...albums);
      } catch (error: any) {
        console.error(`Error fetching albums for artist ${spotifyArtistId}:`, error.response?.data || error);
        // Continue with other artists even if one fails
      }
    }

    // Sort by release date (most recent first)
    allAlbums.sort((a, b) => {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });

    return {
      success: true,
      data: allAlbums
    };
  } catch (error) {
    console.error("Error fetching followed artists albums:", error);
    throw error;
  }
};