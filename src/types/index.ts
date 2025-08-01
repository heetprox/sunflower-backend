import { Document } from "mongoose";
import type { Socket } from "socket.io";
import mongoose from "mongoose";

export interface CustomSocket extends Socket {
  userInfo?: {
    id: string;
    role: "admin" | "listener" | string;
  }; // Optional property
  roomInfo?: { roomId: string; _id: string; progress: number }; // Optional property
}




export interface IUser extends Document {
    _id: string;
    spotifyId: string;
    username?: string;
    displayName: string;
    firstName: string;
    lastName?: string;
    profilePicture: string;
    bio: string;
    age: number;
    gender: 'male' | 'female' | 'non-binary' | 'other';
    intrestedIn: ('male' | 'female' | 'non-binary' | 'other')[];
    spotifyFollowers: number;
    
    location: {
        city: string;
        country: string;
        coordinates: {
            lat: number;
            lng: number;
        };
      };
    
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
    dailyRolls: {
        date: Date;
        count: number;
    };

    musicProfile: IMusicProfile | mongoose.Types.ObjectId | string;
    friends: {
      id: string[];
    }
  friendRequests: {
  incoming: { id: string[] },
  outgoing: { id: string[] }
}
    privacySettings: {
        showAge: boolean;
        showLocation: boolean;
        showLastSeen: boolean;
    };
    notifications: {
        newMessages: boolean;
        newLikes: boolean;
        newMatches: boolean;
        newFriendRequests: boolean;
    };

    hasCompletedOnboarding: boolean;
    isPremium: boolean;
    isVerified: boolean;
    isBanned: boolean; 
    banReason?: string;
    banExpiresAt?: Date;
    isAdmin?: boolean; 
}


export interface IMusicProfile {
    spotifyConnected: boolean;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    spotifyTokenExpiresAt?: Date;

    currentlyPlaying?: ICurrentTrack;
    recentTracks: ITrack[];
    recentlyPlayed: IRecentlyPlayedTrack[];  

    topArtists: {
        short_term: IArtist[];
        medium_term: IArtist[];
        long_term: IArtist[];
    }

    topTracks: {
        short_term: ITrack[];
        medium_term: ITrack[];
        long_term: ITrack[];
    };

    topGenres: IGenre[];
    audioFeatures: IAudioFeatures;

    playlists: IPlaylist[];

    compatibilityScore: Map<string, number>;

    lastSyncAt: Date;
}

export interface ITrack {
    spotifyId: string;
    name: string;
    artists: IArtist[];
    album: IAlbum;
    duration: number;   
    popularity: number;
    explicit: boolean;
    previewUrl?: string;
    externalUrl: {
        spotify: string;
    };
    audioFeatures?: IAudioFeatures;

    // features that i forget to add

    href: string;    

}


export interface IArtist {
    spotifyId: string;
    name: string;
    genres: string[];
    popularity: number;
    images: ISpotifyImage[];
    externalUrl: {
        spotify: string;
    };
}

export interface IAlbum {
    spotifyId: string;
    albumType: 'album' | 'single' | 'compilation';
    genres: string[];
    name: string;
    artists: IArtist[];
    images: ISpotifyImage[];
    releaseDate: Date;
    totalTracks: number;
    externalUrl: {
        spotify: string;
    };
}

export interface IPlaylist {
    spotifyId: string;  
    public: boolean;
    name: string;
    description?: string;
    collaborative: boolean;
    owner: {
        spotifyId: string;
        displayName: string;
    };
    // tracks: ITrack[];
    images: ISpotifyImage[];
    // followerCount: number;
    externalUrl: {
        spotify: string;
    };
}


export interface IAudioFeatures {
    danceability: number;
    energy: number;
    key: number;
    mode: number;
    speechiness: number;
    loudness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number
    duration: number;
    tempo: number;
    timeSignature: number;
}

export interface IRecentlyPlayedTrack {
    track: ITrack;
    playedAt: string;              
    context?: {
        type: 'album' | 'artist' | 'playlist' | 'show';
        href: string;
        externalUrls: { spotify: string };
        uri: string;
    };
}

export interface IGenre {
    name: string;
    weight: number;
}

export interface ICurrentTrack extends ITrack {
    isPlaying: boolean;
    progressMs: number;
    timestamp: Date;
}

export interface ISpotifyImage {
    url: string;
    height?: number;
    width?: number;
}

export interface IMatch {
    _id: string;
    user1Id: string;
    user2Id: string;

    matchScore: number;
    musicCompatibility: IMatchCompatibility;
    

    status: 'pending' | 'accepted' | 'rejected';
    initiatedBy: string;

    createdAt: Date;
    expiresAt: Date;
}

export interface IMatchCompatibility {
    overallScore: number;
    artistMatch: number;
    genreMatch: number;
    audioFeaturesMatch: number;
    playlistSimilarity: number;

    sharedArtists: IArtist[];
    sharedGenres: string[];
    sharedTracks: ITrack[];

    reasons: string[];
}


export interface IConversation {
    _id: string;
    matchId: string;
    participants: string[];

    lastMessage?: IMessage;
    lastActivity: Date;

    messageCount: {
        [userId: string]: number;
    };
    isActive: boolean;


    sharedTracks: ISharedTrack[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessage {
    _id: string;
    receiverId: string;
    senderId: string;
    text?: string;
    image?: string;

    sharedContent?: {
        type: 'track' | 'playlist';
        spotifyId: string;
        data: ITrack | IPlaylist;
    };

    isRead?: boolean;
    readAt?: Date;
    isDelivered?: boolean;
    deliveredAt?: Date;
    deletedAt?: Date;
    isDeleted?: boolean;
    
}

export interface ISharedTrack {
    _id: string;
    userId: string;
    tragetedUserId: string;

    action: 'liked' | 'pass' | 'super_like';


    context: {
        musicScore: number;
        sharedArtists: string[];
        sharedGenres: string[];
    }

    createdAt: Date;
}


export interface IDailyRolls {
    _id: string;
    userId: string;
    date: Date;
    rollsUsed: number;
    maxRolls: number;

    usersShown: string[];
    createdAt: Date;
}

export interface INotification {
    _id: string;
    userId: string;

    type: 'new_match' | 'new_message' | 'new_like' | 'music_update';
    title: string;
    message: string;

    relatedId?: string;
    relatedType?: 'match' | 'conversation' | 'user';

    isRead: boolean;
    readAt?: Date;

    createdAt: Date;
}


export interface IReport{
    _id: string;
    reporterId: string;
    reportedUserId: string;

    reason: 'inappropriate_content' | 'spam' | 'fake_profile' | 'harassment' | 'other';
    description?: string;
    

    screenshot?: string[];
    conversationId?: string;
    messageIds?: string[];

    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    resolution?: string;
    resolvedBy?: string;
    resolvedAt?: Date;

    createdAt: Date;
}

export interface IAdmin {
    _id: string;
    userId: string;
    role: 'admin' | 'moderator';
    permissions: string[];
    isActive: boolean;
    createdAt: Date;
}

export interface IAnalytics {
    _id: string;
    date: Date;
    
    dailyActiveUsers: number;
    newRegistrations: number;
    totalUsers: number;
    
    totalMatches: number;
    mutualMatches: number;
    averageMatchScore: number;
    
    totalTracksShared: number;
    uniqueArtistsDiscovered: number;
    playlistsCreated: number;
    
    averageSessionDuration: number;
    messagesExchanged: number;
    averageMessagesPerConversation: number;
    
    createdAt: Date;
  }


  export interface IErrorLog {
    _id: string;
    userId?: string;
    
    error: {
      message: string;
      stack: string;
      code?: string;
    };
    
    request: {
      method: string;
      url: string;
      headers: Record<string, string>;
      body?: any;
      userAgent: string;
      ip: string;
    };
    
    timestamp: Date;
    environment: 'development' | 'staging' | 'production';
    severity: 'low' | 'medium' | 'high' | 'critical';
    
    resolved: boolean;
    resolvedAt?: Date;
  }

  export interface IRateLimit {
    _id: string;
    identifier: string; 
    endpoint: string;
    
    requests: {
      timestamp: Date;
      method: string;
      userAgent?: string;
    }[];
    
    windowStart: Date;
    count: number;
    
    isBlocked: boolean;
    blockedUntil?: Date;
    blockReason?: string;
    
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ICacheEntry {
    key: string;
    value: any;
    expiresAt?: Date;
    tags?: string[];
    createdAt: Date;
    accessCount: number;
    lastAccessedAt: Date;
  }

  export interface IAppConfig {
    _id: string;
    key: string;
    value: any;
    description: string;
    
    version: number;
    isActive: boolean;
    
    updatedBy: string; 
    createdAt: Date;
    updatedAt: Date;
  }
  

  export interface ISession {
    _id: string;
    userId: string;
    sessionToken: string;
    
    deviceInfo: {
      userAgent: string;
      ip: string;
      platform?: string;
      browser?: string;
    };
    
    location?: {
      city: string;
      country: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    
    isActive: boolean;
    lastActivity: Date;
    expiresAt: Date;
    
    createdAt: Date;
  }

// Add WebSocket related types

export interface TypingUser {
  userId: string;
  displayName: string;
  timestamp: number;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface WebSocketEvent<T = any> {
  type: string;
  payload: T;
}

export interface MessagePayload {
  conversationId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'spotify_track';
  spotifyData?: SpotifyData;
}

export interface SpotifyData {
  type: 'track' | 'playlist' | 'album';
  id: string;
  name: string;
  artist?: string;
  image?: string;
  previewUrl?: string;
}

export interface MessageReadPayload {
  messageId: string;
  conversationId: string;
}

export interface TypingPayload {
  conversationId: string;
}

export interface ConversationCreatePayload {
  participantIds: string[];
}

export interface WebSocketData {
  token: string;
  userData?: any;
  conversations?: string[];
} 