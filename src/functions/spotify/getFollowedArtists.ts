// getFollowedArtists.ts
import { prisma } from "@/lib/prisma";

export const getFollowedArtists = async ({ userId }: { userId: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true }
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: []
      };
    }

    return {
      success: true,
      message: "Followed artists fetched successfully",
      data: user.following || []
    };
  } catch (error) {
    console.error("Get followed artists error:", error);
    return {
      success: false,
      message: "Failed to get followed artists",
      data: []
    };
  }
};