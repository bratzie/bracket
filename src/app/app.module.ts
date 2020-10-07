import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { FormsModule } from '@angular/forms';
import { PlayerComponent } from './player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
