import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const AUTH_DATA = 'DI@(#@)#@R_SDKFJ:L(*$';

export interface AuthData {
  id: string;
  key: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private $isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  public isLogin(): boolean {
    if (!!localStorage.getItem(AUTH_DATA)) this.$isLogin.next(true);
    return this.$isLogin.value;
  }

  public setIsLogin(authData: AuthData | null): void {
    let isLogin: boolean = false;
    if (!!authData) {
      isLogin = true;
      localStorage.setItem(AUTH_DATA, JSON.stringify(authData));
    } else {
      localStorage.removeItem(AUTH_DATA);
    }
    this.$isLogin.next(isLogin);
  }

  public isCodeEmployee(): any {
    const userData = localStorage.getItem(AUTH_DATA);
    if (userData)
      return {
        id: JSON.parse(userData).id,
        key: JSON.parse(userData).key,
      };
    else return null;
  }

  public isRole(): string {
    const role = localStorage.getItem(AUTH_DATA);
    if (role) return JSON.parse(role).role;
    else return '';
    // return JSON.stringify(localStorage.getItem(AUTH_DATA)).role;
  }
}
