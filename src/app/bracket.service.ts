import { Injectable } from '@angular/core';
import { Match } from './match';
import { PlayedMatch } from './played-match';

export enum STATES {
  SETUP,
  RUNNING,
  FINISHED
}

@Injectable({
  providedIn: 'root'
})
export class BracketService {
  private STATE = STATES;
  public state = this.STATE.SETUP;
  public name = 'Your Favorite Bracket';
  public players: string[] = [
    'Jocke', 'Rickard', 'Rasmus', 'Bratt',
    'Nikbac', 'Robel', 'Philip', 'Lilk'
  ];
  private supportedSizes: number[] = [];
  private maxDepth = 10;
  public gameNameList = [
    'Finals', 'Semis', 'Quarters', 'BO16', 'BO32', 'BO64', 'BO128', 'BO256'
  ]
  public bracket: Match;
  public playedMatches: PlayedMatch[] = [];

  constructor() {
    for (let i = 1; i <= this.maxDepth; i++) {
      this.supportedSizes.push(Math.pow(2, i));
    }
    
    if (this.state === this.STATE.RUNNING) {
      this.generateBracketFromCurrentPlayers();
    }
  }

  public setBracketState(state: STATES) {
    this.state = state;
    if (this.state === this.STATE.RUNNING) {
      this.generateBracketFromCurrentPlayers();
    }
  }

  public addPlayer(name: string): void {
    this.players = [...this.players, name];
  }

  public removePlayer(id: number): string[] {
    return this.players.splice(id, 1);
  }

  private generateBracketFromCurrentPlayers(): void {
    const maxDepth = this.getBracketDepth(this.players.length);
    this.bracket = this.generateSubtree(this.players, maxDepth);
  }

  private divideRemainingPlayers(players: string[], depth: number): any {
    const cutoff = this.supportedSizes[depth];
    return [players.slice(0, cutoff/2), players.slice(cutoff/2, cutoff)];
  }

  private generateSubtree(players, depth): any {
    if (players.length < 3) {
      return {
        winner: players[1] ? '' : players[0],
        top: players[0],
        bottom: players[1]
      }
    } else {
      const dividedPlayers = this.divideRemainingPlayers(players, depth);
      const nextDepth = depth - 1;
      return {
        winner: '',
        top: this.generateSubtree(dividedPlayers[0], nextDepth),
        bottom: dividedPlayers[1].length ? this.generateSubtree(dividedPlayers[1], nextDepth) : null
      }
    }

  }

  private getBracketDepth(playerCount: number): number {
    let requiredDepth = 0;
    this.supportedSizes.forEach(size => {
      if (playerCount > size) {
        requiredDepth++;
      }
    })
    return requiredDepth;
  }

  public addMatchToHistory(type: string, winner: string, loser: string): void {
    this.playedMatches = [...this.playedMatches, {type, winner, loser}];
    console.log(this.playedMatches);
  }
}
