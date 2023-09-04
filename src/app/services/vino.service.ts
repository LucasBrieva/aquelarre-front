import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class VinoService {

    public url: any;

    private token: string;
    public validation = {
        isValid: true,
        mensaje: "",
        tituloMensaje: ""
    }

    constructor(
        private _http: HttpClient,
        private _authService: AuthService,
    ) {
        this.url = GLOBAL.url;
        this.token = this._authService.getToken();
    }

    //#region GET

    obtener_vino_admin(id: any): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });
        return this._http.get(this.url + 'obtener_vino_admin/' + id, { headers: headers });
    }

    listar_inventario_vino_admin(id: any): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });
        return this._http.get(this.url + 'listar_inventario_vino_admin/' + id, { headers: headers });
    }

    //#endregion

    //#region POST

    registro_vino_admin(data: any, file: any): Observable<any> {
        let headers = new HttpHeaders({ 'Authorization': this.token });

        //Se lo envío así ya que tengo la imagen y necesito mandarla con un nuevo obj
        const fd = new FormData();
        fd.append('nombre', data.nombre);
        fd.append('codigo', data.codigo);
        fd.append('descripcion', data.descripcion);
        fd.append('regionOrigen', data.regionOrigen);
        fd.append('portada', file);

        return this._http.post(this.url + 'registro_vino_admin/', fd, { headers: headers });
    }

    listar_vinos_filtro_admin(filtro: any): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });
        return this._http.post(this.url + 'listar_vinos_filtro_admin/', filtro, { headers: headers });
    }

    //#endregion

    //#region PUT

    actualizar_vino_admin(data: any, id: any): Observable<any> {
        debugger;
        if (data.portada) {
            let headers = new HttpHeaders({ 'Authorization': this.token });

            //Se lo envío así ya que tengo la imagen y necesito mandarla con un nuevo obj
            const fd = new FormData();
            fd.append('name', data.name);
            fd.append('code', data.code);
            fd.append('descripcion', data.descripcion);
            fd.append('contenido', data.contenido);
            fd.append('regionOrigen', data.regionOrigen);
            fd.append('anoCosecha', data.anoCosecha == undefined ? 0 : data.anoCosecha);
            fd.append('portada', data.portada);

            return this._http.put(this.url + 'actualizar_vino_admin/' + id, fd, { headers: headers });
        } else {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });
            return this._http.put(this.url + 'actualizar_vino_admin/' + id, data, { headers: headers });
        }
    }

    baja_vino_admin(id: any): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });
        return this._http.put(this.url + 'baja_vino_admin/' + id, null, { headers: headers });
    }

    //#endregion


}
