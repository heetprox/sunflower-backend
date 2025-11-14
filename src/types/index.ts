export interface IUser {
  username: string;
  Name: string;
  notifications: INotification[];
  follows: IArtist[];
}

export interface INotification {

}

export interface IArtist {

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