import type { Artist } from '@/generated/prisma/client';
import { prisma } from '../lib/prisma';

export class ArtistService {
  static async createArtist(data: {
    spotifyId: string;
    name: string;
    genres: string[];
    popularity?: number;
    images: any;
    externalUrl: any;
  }): Promise<Artist> {
    return await prisma.artist.create({
      data,
    });
  }

  static async getArtistById(id: string): Promise<Artist | null> {
    return await prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
        followers: true,
      },
    });
  }

  static async getArtistBySpotifyId(spotifyId: string): Promise<Artist | null> {
    return await prisma.artist.findUnique({
      where: { spotifyId },
      include: {
        albums: true,
        followers: true,
      },
    });
  }

  static async updateArtist(id: string, data: Partial<{
    name: string;
    genres: string[];
    popularity: number;
    images: any;
    externalUrl: any;
  }>): Promise<Artist> {
    return await prisma.artist.update({
      where: { id },
      data,
    });
  }

  static async getArtistsByGenre(genre: string): Promise<Artist[]> {
    return await prisma.artist.findMany({
      where: {
        genres: {
          has: genre,
        },
      },
      include: {
        albums: true,
        followers: true,
      },
    });
  }

  static async searchArtists(query: string): Promise<Artist[]> {
    return await prisma.artist.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        albums: true,
        followers: true,
      },
    });
  }

  static async followArtist(userId: string, artistId: string): Promise<void> {
    await prisma.artist.update({
      where: { id: artistId },
      data: {
        followers: {
          connect: { id: userId },
        },
      },
    });
  }

  static async unfollowArtist(userId: string, artistId: string): Promise<void> {
    await prisma.artist.update({
      where: { id: artistId },
      data: {
        followers: {
          disconnect: { id: userId },
        },
      },
    });
  }
}