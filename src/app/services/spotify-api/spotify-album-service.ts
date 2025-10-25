import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SpotifyAlbumTracksResponse } from '../../interfaces/spotify-api/spotify-album-tracks-response';
import { SpotifyAlbumResponse } from '../../interfaces/spotify-api/spotify-album-response';
@Injectable({
  providedIn: 'root'
})
export class SpotifyAlbumService {
  private url= environment.URL_API;
  constructor(private http: HttpClient){}

  getAlbumDetails(albumId:string):Observable<SpotifyAlbumResponse>{
    const url_b = `${this.url}/albums/${albumId}`;
    return this.http.get<SpotifyAlbumResponse>(url_b);
  }

  getAlbumTracks(albumId: string):Observable<SpotifyAlbumTracksResponse>{
    const url_b =`${this.url}/albums/${albumId}/tracks`;
    return this.http.get<SpotifyAlbumTracksResponse>(url_b);
  }
}
