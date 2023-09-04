import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL"
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VinoService {

  public url: any;

  public validation = {
    isValid: true,
    mensaje: "",
    tituloMensaje: ""
  }

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

//#region GET

obtener_vino_admin(id: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.get(this.url + 'obtener_vino_admin/' + id, { headers: headers });
}

listar_inventario_vino_admin(id: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.get(this.url + 'listar_inventario_vino_admin/' + id, { headers: headers });
}

//#endregion

//#region POST

registro_vino_admin(data: any, file: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Authorization': token });

  //Se lo envío así ya que tengo la imagen y necesito mandarla con un nuevo obj
  const fd = new FormData();
  fd.append('name', data.titulo);
  fd.append('code', data.codigo);
  fd.append('descripcion', data.descripcion);
  fd.append('contenido', data.contenido);
  fd.append('contenido', data.contenido);
  fd.append('regionOrigen', data.regionOrigen);
  fd.append('anoCosecha', data.anoCosecha == undefined ? 0 : data.anoCosecha);
  fd.append('gnc', data.gnc);
  fd.append('portada', file);

  return this._http.post(this.url + 'registro_producto_admin/', fd, { headers: headers });
}

listar_productos_filtro_admin(filtro: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.post(this.url + 'listar_productos_filtro_admin/', filtro, { headers: headers });
}

registro_inventario_producto_admin(data: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.post(this.url + 'registro_inventario_producto_admin/', data, { headers: headers });
}

//#endregion

//#region PUT

actualizar_producto_admin(data: any, id: any, token: any): Observable<any> {
  if (data.portada) {
    let headers = new HttpHeaders({ 'Authorization': token });

    //Se lo envío así ya que tengo la imagen y necesito mandarla con un nuevo obj
    const fd = new FormData();
    fd.append('titulo', data.titulo);
    fd.append('codigo', data.codigo);
    fd.append('stock', data.stock);
    fd.append('precio', data.precio);
    fd.append('descripcion', data.descripcion);
    fd.append('contenido', data.contenido);
    fd.append('categoria', data.categoria);
    fd.append('portada', data.portada);
    fd.append('alerta_stock', data.alerta_stock == undefined ? 0 : data.alerta_stock);

    return this._http.put(this.url + 'actualizar_producto_admin/' + id, fd, { headers: headers });
  } else {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_producto_admin/' + id, data, { headers: headers });
  }
}

baja_producto_admin(id: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.put(this.url + 'baja_producto_admin/' + id, null, { headers: headers });
}

actualizar_producto_variedades_admin(data: any, id: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.put(this.url + 'actualizar_producto_variedades_admin/' + id, data, { headers: headers });
}

agregar_imagen_galeria_admin(id: any, data: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Authorization': token });

  //Se lo envío así ya que tengo la imagen y necesito mandarla con un nuevo obj
  const fd = new FormData();
  fd.append('_id', data._id);
  fd.append('imagen', data.imagen);
  fd.append('nombre', data.nombre);

  return this._http.put(this.url + 'agregar_imagen_galeria_admin/' + id, fd, { headers: headers });
}

eliminar_imagen_galeria_admin(id: any, data: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.put(this.url + 'eliminar_imagen_galeria_admin/' + id, data, { headers: headers });
}

//#endregion

//#region VALIDACIÓN

validar_datos_producto(producto: any) {
  if (producto.tipo == 'vehiculo') {
    if (producto.ano == undefined) {
      this.validation.isValid = false;
      this.validation.mensaje = "Debe agregar el año del vehiculo";
      this.validation.tituloMensaje = "ERROR";
      return this.validation;
    }
    if (producto.kilometros == undefined) {
      this.validation.isValid = false;
      this.validation.mensaje = "Debe agregar el kilometraje del vehiculo";
      this.validation.tituloMensaje = "ERROR";
      return this.validation;
    }
    if (producto.vto_vtv == undefined) {
      this.validation.isValid = false;
      this.validation.mensaje = "Debe agregar el vencimiento de la VTV del vehiculo";
      this.validation.tituloMensaje = "ERROR";
      return this.validation;
    }
  }
  if(producto.tipo == 'producto'){
    if (producto.stock == undefined) {
      this.validation.isValid = false;
      this.validation.mensaje = "Debe agregar el stock del vehiculo";
      this.validation.tituloMensaje = "ERROR";
      return this.validation;
    }
  }
  return this.validation;
}

//#endregion
  
}
