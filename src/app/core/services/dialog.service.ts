import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor() {}

  private get screenWidth(): number {
    return window.screen.width;
  }

  public get dialogSize(): string {
    if (this.screenWidth > 800) return '50%';
    return '95%';
  }
}
