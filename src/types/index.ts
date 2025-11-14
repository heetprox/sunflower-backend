export interface IUser {
  username: string;
  displayName: string;
  notifications: INotification[];
  follows: IArtist[];
   createdAt: {
        type: Date;
    };
    updatedAt: {
        type: Date;
    };
}

export interface INotification {
    context: string;
    album: IAlbum["externalUrl"];
}

export interface IArtist {
    spotifyId: string;
    name: string;
    genres: string[];
    albums: IAlbum[];
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

export interface ISpotifyImage {
    url: string;
    height?: number;
    width?: number;
}