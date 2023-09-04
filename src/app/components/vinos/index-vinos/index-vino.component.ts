import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';

import { ExcelService } from 'src/app/services/excel.service';
import { AuthService } from 'src/app/services/auth.service';
import { VinoService } from 'src/app/services/vino.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateVinoComponent } from '../create-vino/create-vino.component';

declare var iziToast: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-index-vino',
  templateUrl: './index-vino.component.html',
  styleUrls: ['./index-vino.component.css']
})
export class IndexVinoComponent implements OnInit {

  public vinos: Array<any> = [];
  public vino: any = {};
  public arrExcel: Array<any> = [];

  public load_btn = false;

  public nombreImagen: any = undefined;
  public file: any = undefined;
  public fileNombre = "";

  public load_data = true;
  public has_data = true;
  public token: any;
  public id: any;
  public page = 1;
  public pageSize = 10;
  public url: any;
  public config: any = {};

  public filtro: any = {
  };

  constructor(
    private _vinoService: VinoService,
    private _authService: AuthService,
    private _excelService: ExcelService,
    private dialog: MatDialog
  ) {
    this.token = this._authService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit(): void {
    this.metFiltro();
  }

  filtrar() {
    this.metFiltro();
  }

  limpiarFiltro() {
    this.metFiltro();
  }

  abrirDialogNuevoVino() {
    const dialogRef = this.dialog.open(CreateVinoComponent, {
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Realiza acciones después de cerrar el diálogo si es necesario
      // Por ejemplo, puedes recargar la lista de vinos
      this.metFiltro();
    });
  }
  

  metFiltro() {
    this.load_data = true;
    this._vinoService.listar_vinos_filtro_admin(this.filtro).subscribe(
      response => {
        this.vinos = response.data;
        //Acá hago el array para el excel
        this.arrExcel = [];
        this.vinos.forEach(element => {
          this.arrExcel.push({
            code: element.code,
            name: element.name,
          })
        })
        this.has_data = this.vinos.length > 0;
        this.load_data = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  // obtenerVino(id: any) {
  //   this._vinoService.obtener_vino_admin(id).subscribe(
  //     response => {
  //       if (response.data == undefined) {
  //         this.filtro = undefined;
  //       } else {
  //         this.filtro = response.data;
  //       }
  //     },
  //     error => {

  //     }
  //   )
  // }

  baja(id: any) {
    this._vinoService.baja_vino_admin(id).subscribe(
      response => {
        iziToast.show({
          title: 'PRODUCTO DADO DE BAJA',
          titleColor: '#FFF',
          backgroundColor: '#83DF4E',
          class: 'text-danger',
          position: 'topRight',
          message: 'El producto fue dado de baja correctamente',
          messageColor: '#FFF'
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.metFiltro();
      },
      error => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#F4EDED',
          backgroundColor: '#F54646',
          class: 'text-danger',
          position: 'topRight',
          message: 'No se pudo dar de baja el producto',
          messageColor: '#F4EDED'
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
      }
    )
  }

  descargarExcel() {
    this._excelService.descargar_excel(this.arrExcel, "Reporte de inventario", "INVENTARIO");
  }

  fileChangeEvent(event: any): void {
    var file: any;

    //Verifico si estamos recibiendo una imagen y valido tipo y tamaño
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#F4EDED',
        backgroundColor: '#F54646',
        class: 'text-danger',
        position: 'topRight',
        message: 'No se cargo correctamente la imagén.',
        messageColor: '#F4EDED'
      })
    }

    //Verifico que el tamaño de la imagen no sea superior a 4 mb.
    if (file.size <= 4000000) {
      //
      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#F4EDED',
          backgroundColor: '#F54646',
          class: 'text-danger',
          position: 'topRight',
          message: 'El arcivho debe ser una imagen',
          messageColor: '#F4EDED'
        });
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#F4EDED',
        backgroundColor: '#F54646',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagén no puede superar los 4MB',
        messageColor: '#F4EDED'
      });
      this.file = undefined;
    }

  }

}
