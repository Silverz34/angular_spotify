import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, catchError, switchMap, tap } from 'rxjs';
import { Song } from '../interfaces/song';
import { SpotifySearch } from './spotify-search';
import { SpotifyAlbumService } from './spotify-api/spotify-album-service';
import { SpotifyTrackResponse } from '../interfaces/spotify-api/spotify-track-response';
import { SpotifyAlbumResponse } from '../interfaces/spotify-api/spotify-album-response';

@Injectable({
  providedIn: 'root'
})
export class PlayerData {
  private _currentSongSource = new BehaviorSubject<Song>({ cover: "", name: "Cargando...", artist: "" });
  private _playlistSource = new BehaviorSubject<Song[]>([]);
  private _errorSource = new BehaviorSubject<string | null>(null);
  public currentSong$: Observable<Song> = this._currentSongSource.asObservable();
  public playlist$: Observable<Song[]> = this._playlistSource.asObservable();
  constructor(
    private _searchService: SpotifySearch,
    private _albumService: SpotifyAlbumService
  ) {}

  public loadInitialData(): void {
    this._errorSource.next(null);
    this._searchService.search('rock', ['album']) 
      .pipe(
        // 2. Seleccionar un álbum al azar y obtener su ID
        switchMap(response => {
          const albums = response.albums?.items;
          if (!albums || albums.length === 0) {
            console.error("No se encontraron álbumes para cargar.");
            // Devuelve un observable vacío para detener la cadena
            return of(null as unknown as SpotifyAlbumResponse); 
          }
          const randomIndex = Math.floor(Math.random() * albums.length);
          const randomAlbum = albums[randomIndex];

          // Guardamos la URL de la portada del álbum para usarla en las canciones
          const albumCover = randomAlbum.images?.[0]?.url || "placeholder.png";

          // 3. Pasar la URL de la portada y el ID al siguiente operador
          return this.loadTracks(randomAlbum.id, albumCover);
        }),
        catchError(err => {
          console.error('Error en el flujo de carga inicial:', err);
          return of(null);
        })
      )
      .subscribe(); // Iniciar la cadena de Observables
  }

  private loadTracks(albumId: string, albumCover: string): Observable<any> {
    return this._albumService.getAlbumTracks(albumId)
      .pipe(
        tap(tracksResponse => {
          if (!tracksResponse.items || tracksResponse.items.length === 0) {
            console.warn("El álbum seleccionado no tiene canciones.");
            return;
          }
          
          // Mapear todas las pistas a tu modelo local 'Song'
          const allSongs = tracksResponse.items.map(track => 
            this.mapTrackToSong(track, albumCover)
          );

          // 4. Emitir la primera canción al observable de la canción actual
          this._currentSongSource.next(allSongs[0]);

          // 5. Emitir el resto de las canciones al observable de la cola
          this._playlistSource.next(allSongs.slice(1));
        })
      );
  }
  
  private mapTrackToSong(track: SpotifyTrackResponse, coverUrl: string): Song {
    const artistName = track.artists && track.artists.length > 0 
                       ? track.artists[0].name 
                       : 'Artista Desconocido';
    
    return {
      cover: coverUrl, // ¡Usamos la URL real del álbum!
      name: track.name,
      artist: artistName
    } as Song;
  }

}
