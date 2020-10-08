import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { BracketService, STATES } from '../bracket.service';
import { Match } from '../match';

@Component({
  selector: 'app-match',
  template: `
    <div *ngIf="!leaf; else leafy" class="match" [ngClass]="'depth-' + depth">
      <div class="sub-bracket top">
        <app-player class="winner" [player]="top.winner" [state]="bs.state" [winner]="roundWinner" [placeholder]="'TBD'" (emitWinner)="selectWinner($event, bottom.winner)"></app-player>
        <app-match [top]="top.top" [bottom]="top.bottom" [depth]="depth + 1" (winner)="setWinner($event, top)"></app-match>
      </div>
      <div class="sub-bracket bottom" *ngIf="bottom">
        <app-player class="winner" [player]="bottom.winner" [state]="bs.state" [winner]="roundWinner" [placeholder]="'TBD'" (emitWinner)="selectWinner($event, top.winner)"></app-player>
        <app-match [top]="bottom.top" [bottom]="bottom.bottom" [depth]="depth + 1" (winner)="setWinner($event, bottom)"></app-match>
      </div>
    </div>

    <ng-template #leafy>
      <div class="match leaves" [ngClass]="'depth-' + depth">
        <app-player [player]="top" [state]="bs.state" [winner]="roundWinner" [placeholder]="'Forfeit'" (emitWinner)="selectWinner($event, bottom)"></app-player>
        <app-player [player]="bottom" [state]="bs.state" [winner]="roundWinner" [placeholder]="'Forfeit'" (emitWinner)="selectWinner($event, top)"></app-player>
      </div>
    </ng-template>
  `,
  styles: [`
    .top {
      align-items: flex-end;
    }

    .bottom {
      align-items: flex-start;
    }

    .sub-bracket {
      display: flex;
      margin: 0.2em
    }
  `]
})
export class MatchComponent implements OnChanges {
  @Input() top: Match | string;
  @Input() bottom: Match | string;
  @Input() depth: number;
  @Output() winner = new EventEmitter<string>();
  public roundWinner = '';
  public matchType = '';
  public STATE = STATES;
  public leaf = false;

  constructor(
    public bs: BracketService
  ) {}

  ngOnChanges(): void {
    if (typeof this.top === 'string') {
      this.leaf = true;
    }
    this.matchType = this.bs.gameNameList[this.depth];
  }

  public selectWinner(winner: string, loser: string): void {
    if (this.bs.state === this.STATE.RUNNING && winner) {
      console.log('Played game', this.matchType, 'winner was', winner, 'loser was', loser);
      this.winner.emit(winner);
      this.roundWinner = winner;
      this.bs.addMatchToHistory(this.matchType, winner, loser);
    }
  }

  public setWinner(name, position): void {
    position.winner = name;
  }
}
