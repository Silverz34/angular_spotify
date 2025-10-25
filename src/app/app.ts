import { Component, OnInit, signal } from '@angular/core';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('EXAMPLE_APP');

  constructor(
    private _spotifyLoginService: SpotifyLoginService,
  ) {}


  ngOnInit(): void {
    this._spotifyLoginService.getToken().subscribe();
    console.log("ESTE ES UN LOG DE CONTROL")
  }

}
