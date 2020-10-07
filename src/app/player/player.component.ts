import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { STATES } from '../bracket.service';

@Component({
  selector: 'app-player',
  template: `
    <button *ngIf="player" class="player" [ngClass]="{active: state === STATE.RUNNING && player, selected: player && player === winner, loser: player && winner && player !== winner}" (click)="selectWinner(player)">
      <span>{{player}}</span>
    </button>
    <div *ngIf="!player" class="player">
      <span class="faded">{{placeholder}}</span>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {
  STATE = STATES;
  @Input() player: string;
  @Input() state: STATES;
  @Input() winner: string;
  @Input() placeholder: string;
  @Output() emitWinner = new EventEmitter<string>();

  constructor() { }

  public selectWinner(name: string): void {
    this.emitWinner.emit(name);
  }
}
