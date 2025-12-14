import { Router, type Request, type Response } from "express";
import { getArtistById } from "../functions/spotify/getArtistById";
import { searchArtists } from "../functions/spotify/searchArtist";
import { getAlbumById } from "../functions/spotify/getAlbumById";
import { followArtist } from "@/functions/spotify/followArtist";
import { unfollowArtist } from "@/functions/spotify/unfollowArtist";
import { getFollowedArtists } from "@/functions/spotify/getFollowedArtists";
import { getAllAlbum } from "@/functions/spotify/getAllAlbum";

const router = Router();

router.get("/api/getartist/:id", async (req: Request, res: Response) => {
  try {
    const artistId = req.params.id;

    if (!artistId) {
      return res.status(400).json({
        success: false,
        message: "Artist ID is required",
        data: null
      });
    }

    const artist = await getArtistById(artistId);
    
    return res.status(200).json({
      success: true,
      message: "Artist fetched successfully",
      data: artist
    });
  } catch (error) {
    console.error("Get artist API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
});
router.get("/api/search", searchArtists);
router.get("/api/getalbum/:id", getAlbumById);
router.get("/api/getallalbum/:id", async (req: Request, res: Response) => {
  try {
    const artistId = req.params.id;

    if (!artistId) {
      return res.status(400).json({
        success: false,
        message: "Artist ID is required",
        data: []
      });
    }

    const albums = await getAllAlbum(artistId);
    
    return res.status(200).json({
      success: true,
      message: "Albums fetched successfully",
      data: albums.items || [] 
    });
  } catch (error) {
    console.error("Get albums API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: []
    });
  }
});

router.get("/api/followartist", async (req: Request, res: Response) => {
  try {
    const userId = req.query.id as string;
    const artistId = req.query.artistId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: null
      });
    }

    if (!artistId) {
      return res.status(400).json({
        success: false,
        message: "Artist ID is required",
        data: null
      });
    }

    const result = await followArtist({ userId, artistId });
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Follow artist API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
});

router.get("/api/unfollowartist", async (req: Request, res: Response) => {
  try {
    const userId = req.query.id as string;
    const artistId = req.query.artistId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: null
      });
    }

    if (!artistId) {
      return res.status(400).json({
        success: false,
        message: "Artist ID is required",
        data: null
      });
    }

    const result = await unfollowArtist({ userId, artistId });
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Unfollow artist API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
});

router.get("/api/getfollowed", async (req: Request, res: Response) => {
  try {
    const userId = req.query.id as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: []
      });
    }

    const result = await getFollowedArtists({ userId });
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Get followed artists API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: []
    });
  }
});

export default router;