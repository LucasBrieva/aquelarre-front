import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { VinoService } from 'src/app/services/vino.service';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';

declare var iziToast: any;
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-create-vino',
  templateUrl: './create-vino.component.html',
  styleUrls: ['./create-vino.component.css']
})
export class CreateVinoComponent implements OnInit {

  public vino: any = {
    categoria: '',
  };
  public file: any = undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/default-product.png';
  public config_text: any = {};
  public token: any;
  public load_btn = false;
  private validation = {
    isValid: true,
    mensaje: "",
    tituloMensaje: ""
  };

  constructor(
    private _vinoService: VinoService,
    private _adminService: AdminService,
    private _router: Router,
    private _helperService: HelperService,
    private _authService: AuthService
  ) {
    this.token = this._authService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      if (this.file == undefined) {
        this._helperService.iziToast('Debe subir una portada para registrar', 'ERROR', false);
      }
      else {
        this.load_btn = true;
        this.validation = this._vinoService.validar_datos_vino(this.vino);
        if (this.validation.isValid) {
          this._vinoService.registro_vino(this.vino, this.file, this.token).subscribe(
            response => {
              this._helperService.iziToast('Vino, ' + this.vino.name + ', fue creado correctamente', 'Vino creado', true);
              this.vino = {
                name: '',
                code: '',
                descripcion: '',
                contenido: '',
                regionOrigen: '',
                anoCosecha: '',
                proveedor: '',
                maridajeDeComida: '',
              };
              this.load_btn = false;
              this._router.navigate(['/panel/vinos']);
            },
            error => {
              this._helperService.iziToast('No se pudo crear el vino', 'ERROR', false);
              this.load_btn = false;
            }
          );
        }
        else {
          this._helperService.iziToast(this.validation.mensaje, this.validation.tituloMensaje, this.validation.isValid);
        }
      }
      this.load_btn = false;
    } else {
      this._helperService.iziToast('Los datos del formulario no son validos', 'ERROR', false);

      this.load_btn = false;
      this.imgSelect = 'assets/img/default-product.png'
      $("#portadaText").text('Seleccionar imagen');
      this.file = undefined;
    }
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
      if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg') {

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
