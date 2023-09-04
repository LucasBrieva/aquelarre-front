import { state, style, transition, trigger, animate } from '@angular/animations';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { VinoService } from 'src/app/services/vino.service';
import { VinoType } from 'src/app/types/vino.type';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-create-vino',
  templateUrl: './create-vino.component.html',
  styleUrls: ['./create-vino.component.css'],
})
export class CreateVinoComponent implements OnInit {

  public vino: VinoType = {};
  public load_btn = false;
  public imgSelect: any | ArrayBuffer = 'assets/img/default-product.png';
  public file: any = undefined;
  public url: any;
  public imgText: string = "Selecciona una portada";

  constructor(
    private _vinoService: VinoService,
    public dialogRef: MatDialogRef<CreateVinoComponent>,
    private _helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.url = GLOBAL.url;
    if (data) {
      this.vino = data;
      this.imgText = this.vino.portadaNombre
      this.imgSelect = this.url + "obtener_portada/" + this.vino.portada;
    }
  }

  ngOnInit(): void {
  }

  guardar(createForm) {
    if (createForm.valid) {
      if (this.file) {
        this._helperService.iziToast('Debe subir una portada para registrar', 'ERROR', false);
      }
      else {
        this.load_btn = true;
        this._vinoService.registro_vino_admin(this.vino, this.file).subscribe(
          response => {
            this._helperService.iziToast('Vino, ' + this.vino.nombre + ', fue creado correctamente', 'Vino creado', true);
            this.vino = {};
            this.load_btn = false;
            this.dialogRef.close();
          },
          error => {
            debugger;
            this._helperService.iziToast(error.error.message, 'ERROR', false);
            this.load_btn = false;
          }
        );
      }
      this.load_btn = false;
    } else {
      this._helperService.iziToast('Los datos del formulario no son validos', 'ERROR', false);

      this.load_btn = false;
      this.imgSelect = 'assets/img/default-product.png'
      $("#portadaText").text('Seleccionar imagen');
      this.file = undefined;
      this.dialogRef.close();
    }
  }

  actualizar(updateForm) {
    if (updateForm.valid) {
      this.load_btn = true;
      debugger;
      const data: VinoType = {
        ...this.vino,
        portada: null
      }
      if (this.file) {
        data.portada = this.file
      }

      this._vinoService.actualizar_vino_admin(data, data._id).subscribe(
        response => {
          this._helperService.iziToast(this.vino.nombre + ', fue actualizado correctamente', 'Vino actualizado', true);
          this.load_btn = false;
          this.dialogRef.close();
        },
        error => {
          this._helperService.iziToast('No se pudo actualizar el vino', 'ERROR', false);
          this.load_btn = false;
        }
      )
    }
    else {
      this._helperService.iziToast('No se pudo actualizar el vino', 'ERROR', false);
      this.load_btn = false;
    }

  }

  cancelar() {
    // Cierra el diálogo sin guardar cambios
    this.dialogRef.close();
  }

  fileChangeEvent(event: any): void {
    var file: any;

    //Verifico si estamos recibiendo una imagen y valido tipo y tamaño
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
    } else {
      this._helperService.iziToast('No se cargo correctamente la imagén', 'ERROR', false);
    }

    //Verifico que el tamaño de la imagen no sea superior a 4 mb.
    if (file.size <= 4000000) {
      //
      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {

        const reader = new FileReader();
        //Obtengo la imagen en base 64,cadena extensa que genera imagen
        reader.onload = e => this.imgSelect = reader.result;
        //
        reader.readAsDataURL(file);

        $("#portadaText").text(file.name);
        this.file = file;

      } else {
        this._helperService.iziToast('El arcivho debe ser una imagen', 'ERROR', false);

        this.imgSelect = 'assets/img/default-product.png'
        $("#portadaText").text('Seleccionar imagen');
        this.file = undefined;
      }
    } else {
      this._helperService.iziToast('La imagén no puede superar los 4MB', 'ERROR', false);
      this.imgSelect = 'assets/img/default-product.png';
      $("#portadaText").text('Seleccionar imagen');
      this.file = undefined;
    }
  }
}
