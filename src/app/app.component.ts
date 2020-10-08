import { Component } from '@angular/core';
import { BracketService, STATES } from './bracket.service';


@Component({
  selector: 'app-root',
  template: `
    <header class="ribbon">
      <h1 class="title">
        <span>{{bs.name}}</span>
        <span class="tiny" *ngIf="bs.state === STATE.FINISHED"> Concluded</span>
      </h1>
      <section class="preferences">
        <section class="states" *ngIf="bs.state !== STATE.FINISHED">
          <button class="button" (click)="bs.setBracketState(STATE.SETUP)" [class.selected]="bs.state === STATE.SETUP">Setup</button>
          <button class="button" (click)="bs.setBracketState(STATE.RUNNING)" [class.selected]="bs.state === STATE.RUNNING" [disabled]="!bs.players.length">Start</button>
        </section>
      </section>
    </header>
    <section class="finalists" *ngIf="bs.state === STATE.FINISHED">
      <div class="panel first-place" *ngIf="bs.bracket?.winner">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11.219,3.375L8,7.399L4.781,3.375C4.515,3.043,4.068,2.916,3.669,3.056C3.269,3.197,3,3.575,3,4v15c0,1.103,0.897,2,2,2 h14c1.103,0,2-0.897,2-2V4c0-0.425-0.269-0.803-0.669-0.944c-0.4-0.138-0.846-0.012-1.112,0.319L16,7.399l-3.219-4.024 C12.4,2.901,11.6,2.901,11.219,3.375z M5,19v-2h14.001v2H5z M15.219,9.625c0.381,0.475,1.182,0.475,1.563,0L19,6.851L19.001,15H5 V6.851l2.219,2.774c0.381,0.475,1.182,0.475,1.563,0L12,5.601L15.219,9.625z"></path></svg>
        <h2 class="name tiny">Winner</h2>
        <h2 class="name">{{bs.playerMap[bs.bracket?.winner]}}</h2>
      </div>
      <div class="panel runner-up" *ngIf="bs.bracket?.loser">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8.111,21.889c1.602,0,3.108-0.624,4.242-1.757l7.778-7.778c2.339-2.34,2.339-6.146,0-8.485 c-1.134-1.133-2.641-1.757-4.243-1.757c-1.602,0-3.108,0.624-4.242,1.757l-7.778,7.778c-2.339,2.34-2.339,6.146,0,8.485 C5.002,21.265,6.509,21.889,8.111,21.889z M5.282,13.061l7.778-7.778c0.756-0.755,1.76-1.171,2.828-1.171 c1.069,0,2.073,0.416,2.829,1.171c1.559,1.56,1.559,4.098,0,5.657l-7.778,7.778c-0.756,0.755-1.76,1.171-2.828,1.171 c-1.069,0-2.073-0.416-2.829-1.171C3.724,17.158,3.724,14.62,5.282,13.061z"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="12" cy="15" r="1"></circle><circle cx="12" cy="9" r="1"></circle></svg>
        <h3 class="name tiny">Runner up</h3>
        <h3 class="name">{{bs.playerMap[bs.bracket?.loser]}}</h3>
      </div>
    </section>
    <div class="container">
      <section class="setup" *ngIf="bs.state === STATE.SETUP">
        <div class="general-setup">
          <div class="setup-group">
            <label for="bracket-name" class="label tiny">Name your bracket</label>
            <input id="bracket-name" class="input" type="text" placeholder="Bracket name" [(ngModel)]="bs.name">
          </div>
          <div class="setup-group">
            <label for="bracket-add-players" class="label tiny">Add players</label>
            <input id="bracket-add-players" class="input" type="text" placeholder="Type a name and press enter" [(ngModel)]="addPlayerValue" (keydown.enter)="addPlayer()">
          </div>
        </div>
        <div class="active-players" *ngIf="bs.players.length">
          <span for="bracket-add-players" class="label tiny">Current players ({{bs.players.length}}) <span class="tiny">click to remove</span></span>
          <div class="player-list">
            <button class="player-button button" *ngFor="let player of bs.players; let i = index" (click)="removePlayer(player, i)">
              <span class="text">{{bs.playerMap[player]}}</span>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
            </button>
          </div>
        </div>
      </section>
      <section class="start" *ngIf="bs.state !== STATE.SETUP">
        <div class="history-wrapper">
          <div class="history">
            <span class="tiny" *ngIf="bs.playedMatches.length">Latest matches</span>
            <div class="played-match" *ngFor="let match of bs.playedMatches">
              <span class="title">{{match.type}}</span>
              <span class="winner" *ngIf="match.winner">
                <span class="key tiny">Winner </span>
                <span class="value">{{bs.playerMap[match.winner]}}</span>
              </span>
              <span class="loser" *ngIf="match.loser">
                <span class="key tiny">Loser </span>
                <span class="value">{{bs.playerMap[match.loser]}}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="bracket">
          <app-match class="final" [top]="bs.bracket.top" [bottom]="bs.bracket.bottom" [depth]="0" (winner)="setWinner($event)"></app-match>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .setup {
      display: flex;
      flex-direction: column;
      min-width: min(65ch, 100%);
    }
    .general-setup {
      display: flex;
    }
    .setup-group {
      display: flex;
      flex: 1 0 200px;
      flex-direction: column;
      max-width: 300px;
    }
    .setup-group:not(:last-child) {
      margin-right: 0.5em;
    }
    .setup-group:last-child {
      margin-left: 0.5em;
    }

    .active-players {
      margin-top: 2em;
    }
    .player-list {
      display: flex;
      flex-wrap: wrap;
    }
    .player-button {
      display: flex;
      align-items: center;
      opacity: 0;
      animation: fade-in 1000ms ease-in-out forwards 1;
    }
    .player-button .text {
      margin-right: 0.2em;
    }

    .finalists {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 2em;
      opacity: 0;
      animation: fade-in 1000ms ease-in-out forwards 1;
    }

    .panel {
      display: inline-block;
      padding: 1em;
      margin-right: 1em;
      background-color: var(--text-color);
      color: var(--background-color);
      border-radius: 0.2em;
      text-align: center;
      opacity: 0;
      animation: fade-in 1000ms ease-in-out forwards 1;
    }

    .start {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .history-wrapper {
      width: 100%;
      overflow: hidden;
      height: 120px;
    }

    .history {
      height: 120px;
      overflow: scroll;
      position: relative;
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      align-items: center;
    }
    .history > .tiny {
      position: absolute;
      top: 0.2em;
      left: 0.5em;
    }
    .played-match {
      display: flex;
      flex-direction: column;
      padding: 1em;
      border-radius: 0.2em;
      background-color: var(--background-color);
      margin-right: 0.5em;
      opacity: 0;
      animation: fade-in 1000ms ease-in-out forwards 1;
    }
    .played-match .title {
      margin: 0;
    }
    .played-match > .winner:after {
      display: none;
    }
    .played-match > .winner, .played-match > .loser {
      white-space: nowrap;
    }

    .panel .name {
      margin: 0;
    }

    .first-place {
      font-size: 2em;
    }

    .first-place svg {
      font-size: 8em;
    }

    .runner-up {
      font-size: 1.5em;
    }

    .runner-up svg {
      font-size: 5em;
    }
  `]
})
export class AppComponent {
  STATE = STATES;
  addPlayerValue = '';

  constructor(
    public bs: BracketService
  ) {}

  public addPlayer(): void {
    const UUID = this.bs.getUUID();
    this.bs.addPlayer(UUID, this.addPlayerValue);
    this.addPlayerValue = '';
  }

  public removePlayer(UUID: string, index: number): string[] {
    return this.bs.removePlayer(UUID, index);
  }

  public setWinner(name: string): void {
    this.bs.state = this.STATE.FINISHED;
    this.bs.bracket.winner = name;
    if (typeof this.bs.bracket.top === 'string') {
      this.bs.bracket.loser = this.bs.bracket.top === name ? this.bs.bracket.bottom.toString() : this.bs.bracket.top.toString();
    } else {
      this.bs.bracket.loser = this.bs.bracket.top['winner'] === name ? this.bs.bracket.bottom['winner'] : this.bs.bracket.top['winner'];
    }
  }
}
