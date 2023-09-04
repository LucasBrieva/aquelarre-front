import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

declare var jquery: any;
declare var $: any;
declare var iziToast: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any = '';
  public mostrarFormularioInicioSesion = true;
  public mostrarContrasena = false;
  public load_btn = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _adminService: AdminService,
    private _authService: AuthService,
    private _router: Router,
    private _helperService: HelperService
  ) {
    this.token = this._authService.getToken();
  }

  ngOnInit(): void {
    if (this.token) {
      this._router.navigate(['']);
    }
    else {

    }
  }

  login(loginForm: any) {
    if (loginForm.valid) {

      let data = {
        email: this.user.email,
        password: this.user.password
      }
      this._adminService.login_admin(data).pipe(takeUntil(this.unsubscribe$)).subscribe(
        response => {
          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#F4EDED',
              backgroundColor: '#F54646',
              class: 'text-danger',
              position: 'topRight',
              message: response.message,
              messageColor: '#F4EDED'
            })
          } else {
            iziToast.show({
              title: 'BIENVENIDO',
              titleColor: '#FFF',
              backgroundColor: '#83DF4E',
              class: 'text-danger',
              position: 'topRight',
              message: 'Hola ' + response.data.nombres.toUpperCase() + ', bienvenido/a',
              messageColor: '#FFF'
            })
            this.usuario = response.data;
            this._authService.setInformationAccess(response.token, response.data._id);
            setTimeout(() => {
              this._router.navigate(['/']);
            }, 2000);
          }

        },
        error => {
          console.log(error);
        }
      )
    } else {
      this._helperService.iziToast('Debe subir una portada para registrar', 'ERROR', false);
    }
  }

  cambiarFormulario() {
    this.mostrarFormularioInicioSesion = !this.mostrarFormularioInicioSesion;
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  addUser(createForm: any) {
    if(createForm.valid){
      this.load_btn = true;

      let data = {
        email: this.user.email,
        password: this.user.password,
        nombres: this.user.nombres,
        apellidos: this.user.apellidos,
        telefono: this.user.telefono,
        dni: this.user.dni,
        rol: "Admin"
      }

      this._adminService.registro_admin(data).subscribe(
        response => {
          if (response.data) {
            this._helperService.iziToast('Hola, ' + response.data.nombres.toUpperCase() + ', bienvenido/a', 'Usuario creado', true);

            this.usuario = response.data;
            this._authService.setInformationAccess(response.token, response.data._id);
            setTimeout(() => {
              this._router.navigate(['/']);
            }, 2000);
          } else {
            this._helperService.iziToast(response.message, 'ERROR', true);
          }

        },
        error => {
          console.error('Error en el registro:', error);
        }
      )
    }
    else{
      this._helperService.iziToast('Formulario inválido', 'ERROR', false);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
}
