import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from 'app/shared/services/auth.service';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Mock do AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    authServiceSpy.isAuthenticated.and.returnValue(true); // Retorna "autenticado" por padrão

    // Mock do Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configurar o módulo de teste
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy }, // Injeta o mock do AuthService
        { provide: Router, useValue: routerSpy } // Injeta o mock do Router
      ],
    });

    authGuard = TestBed.inject(AuthGuard); // Injeta o guard
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation when authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true); // Mock: usuário autenticado
    const canActivate = authGuard.canActivate();
    expect(canActivate).toBe(true); // Deve retornar true
  });

  it('should navigate to login when not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false); // Mock: usuário não autenticado
    const canActivate = authGuard.canActivate();
    expect(canActivate).toBe(false); // Deve retornar false
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']); // Deve redirecionar para /login
  });
});

