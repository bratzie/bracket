import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { BracketService, STATES } from '../bracket.service';
import { Match } from '../match';

@Component({
  selector: 'app-match',
  template: `
    <div *ngIf="!leaf; else leafy" class="match" [ngClass]="'depth-' + depth">
      <div class="sub-bracket top">
        <app-player class="winner" [player]="top.winner" [state]="bs.state" [winner]="roundWinner" [placeholder]="'TBD'" (emitWinner)="selectWinner($event)"></app-player>
        <app-match [top]="top.top" [bottom]="top.bottom" [depth]="depth + 1" (winner)="setWinner($event, top)"></app-match>
      </div>
      <div class="sub-bracket bottom" *ngIf="bottom">
        <app-player class="winner" [player]="bottom.winner" [state]="bs.state" [winner]="roundWinner" [placeholder]="'TBD'" (emitWinner)="selectWinner($event)"></app-player>
        <app-match [top]="bottom.top" [bottom]="bottom.bottom" [depth]="depth + 1" (winner)="setWinner($event, bottom)"></app-match>
      </div>
    </div>

    <ng-template #leafy>
      <div class="match leaves" [ngClass]="'depth-' + depth">
        <app-player [player]="top" [state]="bs.state" [winner]="roundWinner" [placeholder]="'Forfeit'" (emitWinner)="selectWinner($event)"></app-player>
        <app-player [player]="bottom" [state]="bs.state" [winner]="roundWinner" [placeholder]="'Forfeit'" (emitWinner)="selectWinner($event)"></app-player>
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
  public STATE = STATES;
  public leaf = false;

  constructor(
    public bs: BracketService
  ) {}

  ngOnChanges(): void {
    if (typeof this.top === 'string') {
      this.leaf = true;
    }
  }

  public selectWinner(name: string): void {
    if (this.bs.state === this.STATE.RUNNING && name) {
      this.winner.emit(name);
      this.roundWinner = name;
    }
  }

  public setWinner(name, position): void {
    position.winner = name;
  }
}
