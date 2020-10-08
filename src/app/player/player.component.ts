import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BracketService, STATES } from '../bracket.service';

@Component({
  selector: 'app-player',
  template: `
    <ng-container *ngIf="player">
      <button class="player" [ngClass]="{active: state === STATE.RUNNING && player, selected: player && player === winner, loser: player && winner && player !== winner}" (click)="selectWinner(player)">
        <span>{{bs.playerMap[player]}}</span>
      </button>
      <div class="editing-section" *ngIf="leaf">
        <button class="button transparent" (click)="isRenaming = !isRenaming">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zM16.045 4.401l1.587 1.585-1.59 1.584-1.586-1.585L16.045 4.401zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zM4 20H20V22H4z"></path></svg>
        </button>
        <ng-container *ngIf="isRenaming">
          <input class="input" type="text" [(ngModel)]="newName" placeholder="Give player a new name">
          <button class="button transparent" (click)="renamePlayer(player)">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path></svg>
          </button>
        </ng-container>
      </div>
    </ng-container>
    <div *ngIf="!player" class="player">
      <span class="faded">{{placeholder}}</span>
    </div>
  `,
  styles: [`
    .editing-section {
      display: inline-flex;
    }
  `],
})
export class PlayerComponent {
  STATE = STATES;
  @Input() player: string;
  @Input() state: STATES;
  @Input() winner: string;
  @Input() placeholder: string;
  @Input() leaf: boolean;
  @Output() emitWinner = new EventEmitter<string>();

  isRenaming = false;
  newName = '';

  constructor(
    public bs: BracketService
  ) { }

  public selectWinner(id: string): void {
    this.emitWinner.emit(id);
  }

  public renamePlayer(id: string): void {
    if (this.newName) {
      this.bs.playerMap[id] = this.newName;
      this.isRenaming = false;
    } else {
      console.warn('It\'s nicer if you name the player something')
    }
  }
}
