import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  public token:any; 

  public cupon : any = {
    tipo:'true'
  };
  public load_btn = false;

  constructor(
    private _cuponService : CuponService,
    private _router: Router,
    private _authService:AuthService
  ) {
    this.token = this._authService.getToken();
   }

  ngOnInit(): void {
  }

  registro(registroForm:any){
    if(registroForm.valid){
      this.load_btn = true;
      this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'Cupón creado',
            titleColor:'#FFF',
            backgroundColor:'#83DF4E',
            class:'text-danger',
            position: 'topRight',
            message: 'Cupón, '+ this.cupon.codigo +', fue creado correctamente',
            messageColor:'#FFF'
          });
          this.cupon={
            codigo: '',
            valor: '',
            limite: '',
            tipo:'',
          }
          this.load_btn = false;
          this._router.navigate(['/panel/cupones']);
          
        },
        error=>{
          console.log(error);
          this.load_btn = false;
        }
      )
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor:'#F4EDED',
        backgroundColor:'#F54646',
        class:'text-danger',
        position: 'topRight',
        message: 'Faltan datos para crear el cupón.',
        messageColor:'#F4EDED'
      });
      this.load_btn = false;
    }
  }
  
}
