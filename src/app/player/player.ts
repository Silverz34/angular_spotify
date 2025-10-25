// src/app/player/player.ts (SIMPLIFICADO Y MODULARIZADO)

import { Component, OnInit } from '@angular/core';
import { PlayerData } from '../services/player-data';
import { Observable } from 'rxjs';
import { Song } from '../interfaces/song';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit { 

  // Observables que el HTML puede usar con el pipe 'async' (¡CÓDIGO MUY LIMPIO!)
  public currentSong$!: Observable<Song>;
  public playlist$!: Observable<Song[]>;
  
  // Inyectamos el nuevo servicio orquestador
  constructor(
    private _playerData: PlayerData
  ){
    console.log("COMPONENTE PLAYER CREADO");
  }

  ngOnInit(): void {
    // 1. Conectar las propiedades del componente a los Observables del servicio
    this.currentSong$ = this._playerData.currentSong$;
    this.playlist$ = this._playerData.playlist$;

    // 2. Llamar a la función de carga de datos inicial.
    this._playerData.loadInitialData();
  }
}