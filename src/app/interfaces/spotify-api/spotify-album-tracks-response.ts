import { SpotifyTrackResponse } from "./spotify-track-response";

export interface SpotifyAlbumTracksResponse {
    href: string;
    items:SpotifyTrackResponse[]; 
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}
