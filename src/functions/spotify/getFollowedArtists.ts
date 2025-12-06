import prisma from "@/lib/prisma";

export const getFollowedArtists = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const artists = await prisma.artist.findMany({
      where: {
        id: {
          in: user.following 
        }
      },
    });

    return {
      success: true,
      data: artists
    };
  } catch (error) {
    throw error;
  }
};

