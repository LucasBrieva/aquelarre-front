import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url: any;

  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
  ) {
    this.url = GLOBAL.url;
  }

  login_admin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_admin', data, { headers: headers });
  }

  registro_admin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'registro_admin', data, { headers: headers });
  }

  public isAuthenticated(allowRoles: string[]): boolean {
    const token: any = this._authService.getToken();

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      if(helper.isTokenExpired(token)){
        this._authService.clearDataAccess();
        return false;
      }
      if (!decodedToken) {
        this._authService.clearDataAccess();
        return false;
      }
    } catch (Exception) {
      this._authService.clearDataAccess();
      return false;
    }

    return allowRoles.includes(decodedToken['role']);
  }

  obtener_config_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_config_admin/', { headers: headers });
  }

  actualizar_config_admin(id: any, data: any, token: any): Observable<any> {
    if (data.logo) {
      let headers = new HttpHeaders({ 'Authorization': token });

      //Se lo envío así ya que tengo la imagen y necesito mandarla con un nuevo obj
      const fd = new FormData();
      fd.append('razonSocial', data.razonSocial);
      fd.append('nSerie', data.nSerie);
      fd.append('correlativo', data.correlativo);
      fd.append('categorias', JSON.stringify(data.categorias));
      fd.append('logo', data.logo);

      return this._http.put(this.url + 'actualizar_config_admin/' + id, fd, { headers: headers });
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_config_admin/' + id, data, { headers: headers });
  }

  obtener_config_public(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'obtener_config_public/', { headers: headers });
  }
  
}
