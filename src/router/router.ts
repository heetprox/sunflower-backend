import { getAlbumById } from "@/functions/spotify/getAlbumById";
import { getArtistById } from "@/functions/spotify/getArtistById";
import { searchArtists } from "@/functions/spotify/searchArtist";
import { auth } from "@/lib/auth";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const router = Router();


// spotify
router.get("/api/getartist/:id", getArtistById);
router.get("/api/search/:query", searchArtists);
router.get("/api/getalbum/:id", getAlbumById);

export default router;