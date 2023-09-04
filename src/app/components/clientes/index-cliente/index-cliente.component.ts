import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ExcelService } from 'src/app/services/excel.service';

declare var iziToast: any;
declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes : Array<any> =[];
  public cliente : any ={};

  public page = 1;
  public pageSize = 10;
  public token: any;
  public load_data=true;
  public has_data=true;
  public filtro:any = {
    nombre: "",
    apellido: "",
    correo: "",
  };
  public arrExcel: Array<any> = [];

  constructor(
    private _clienteService : ClienteService,
    private _authService : AuthService,
    private _excelService : ExcelService
  ) {
    this.token = this._authService.getToken();
   }

  ngOnInit(): void {
    this.metFiltro();
  }

  filtrar(){
    this.metFiltro();
  }

  limpiarFiltro(){
    this.filtro.nombre = '';
    this.filtro.apellido = '';
    this.filtro.correo = '';
    this.metFiltro();
  }

  metFiltro(){
    this.load_data = true;
    this._clienteService.listar_clientes_filtro_admin(this.filtro, this.token).subscribe(
      response => {
        this.clientes = response.data;
        this.arrExcel = [];

        this.clientes.forEach(element=>{
          this.arrExcel.push({
            nombreCompleto:element.nombres + " " + element.apellidos,
            email:element.email,
            pais:element.pais,
            telefono:element.telefono,
            genero:element.genero,
            fechaNacimiento:element.f_nacimiento,
            dni:element.dni,
          })
        })
        this.has_data = this.clientes.length > 0;
        this.load_data = false;
      },
      error=>{
        console.log(error);
      }
    )
  }

  obtenerCliente(id:any){
    this._clienteService.obtener_cliente_admin(id,this.token).subscribe(
      response =>{
        if(response.data == undefined){
          this.cliente = undefined;
        }else{
          this.cliente = response.data;
        }
      },
      error =>{

      }
    )
  }

  baja(id:any){
    this.obtenerCliente(id);
    this._clienteService.baja_cliente_admin(id, this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'CLIENTE DADO DE BAJA',
          titleColor:'#FFF',
          backgroundColor:'#83DF4E',
          class:'text-danger',
          position: 'topRight',
          message: 'El cliente fue dado de baja correctamente',
          messageColor:'#FFF'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.metFiltro();
      },
      error=>{
        iziToast.show({
          title: 'ERROR',
          titleColor:'#F4EDED',
          backgroundColor:'#F54646',
          class:'text-danger',
          position: 'topRight',
          message: 'No se pudo dar de baja el cliente',
          messageColor:'#F4EDED'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
      }
    )
  }

  descargarExcel(){
    this._excelService.descargar_excel(this.arrExcel, "Reporte de clientes", "CLIENTES");
  }
  
}
