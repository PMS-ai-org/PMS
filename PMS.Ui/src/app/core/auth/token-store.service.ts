import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenStoreService implements OnDestroy {
  private token$ = new BehaviorSubject<string | null>(null);
  private logoutTimerSub?: Subscription;

  readonly tokenChanges$ = this.token$.asObservable();

  set(token: string | null, expiresUtc?: string | Date) {
    this.token$.next(token);
    this.logoutTimerSub?.unsubscribe();
    this.logoutTimerSub = undefined;

    if (token && expiresUtc) {
      const exp = new Date(expiresUtc).getTime();
      const ms = Math.max(0, exp - Date.now());
      this.logoutTimerSub = timer(ms).subscribe(() => this.clear());
    }
  }

  get(): string | null { return this.token$.value; }

  clear() {
    this.token$.next(null);
    this.logoutTimerSub?.unsubscribe();
    this.logoutTimerSub = undefined;
  }

  ngOnDestroy() { this.logoutTimerSub?.unsubscribe(); }
}