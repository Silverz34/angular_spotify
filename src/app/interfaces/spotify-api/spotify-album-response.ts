import { SpotifyArtistResponse } from "./spotify-artist-response.i";
import { SpotifyImageResponse } from "./spotify-image-response";
import { SpotifyAlbumTracksResponse } from "./spotify-album-tracks-response";
export interface SpotifyAlbumResponse {
    id: string;
    album_type: 'album'|'single'|'copilation';
    name: string;
    release_date: string;
    total_tracks: number;
    artists: SpotifyArtistResponse[];
    images: SpotifyImageResponse[];
    tracks?: SpotifyAlbumTracksResponse;
}
