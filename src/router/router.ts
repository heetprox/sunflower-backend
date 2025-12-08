import { Router } from "express";
import { getArtistById } from "../functions/spotify/getArtistById";
import { searchArtists } from "../functions/spotify/searchArtist";
import { getAlbumById } from "../functions/spotify/getAlbumById";

const router = Router();


// spotify
router.get("/api/getartist/:id", getArtistById);
router.get("/api/search", searchArtists);
router.get("/api/getalbum/:id", getAlbumById);


export default router;