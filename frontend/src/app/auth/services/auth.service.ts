import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export enum UserRole {
  CONSUMER = 'CONSUMER',
  SUPPLIER = 'SUPPLIER'
}

export interface ConsumerRegisterPayload {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  confirmPassword: string;
}

export interface SupplierRegisterPayload {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  errorCode: string;
  errorDesc: string;
  token?: string;
  consumer?: any;
  supplier?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private userRoleSubject = new BehaviorSubject<UserRole | null>(null);
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('userRole') as UserRole;
    
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
    if (storedRole) {
      this.userRoleSubject.next(storedRole);
    }
  }

  // Register a new Consumer
  registerConsumer(payload: ConsumerRegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/consumers/register`, payload).pipe(
      tap(response => this.handleAuthResponse(response, UserRole.CONSUMER))
    );
  }

  // Login Consumer
  loginConsumer(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/consumers/login`, payload).pipe(
      tap(response => this.handleAuthResponse(response, UserRole.CONSUMER))
    );
  }

  // Register a new Supplier
  registerSupplier(payload: SupplierRegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/suppliers/register`, payload).pipe(
      tap(response => this.handleAuthResponse(response, UserRole.SUPPLIER))
    );
  }

  // Login Supplier
  loginSupplier(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/suppliers/login`, payload).pipe(
      tap(response => this.handleAuthResponse(response, UserRole.SUPPLIER))
    );
  }

  private handleAuthResponse(response: AuthResponse, role: UserRole): void {
    if (response.token) {
      const user = role === UserRole.CONSUMER ? response.consumer : response.supplier;
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      
      this.currentUserSubject.next(user);
      this.userRoleSubject.next(role);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
    this.userRoleSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUserRole(): UserRole | null {
    return this.userRoleSubject.value;
  }
}
