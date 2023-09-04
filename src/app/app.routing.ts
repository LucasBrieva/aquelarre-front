import { Routes, RouterModule } from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";

import { AdminGuard } from "./guards/admin.guard"

import { IndexClienteComponent } from "./components/clientes/index-cliente/index-cliente.component";
import { CreateClienteComponent } from "./components/clientes/create-cliente/create-cliente.component";
import { EditClienteComponent } from "./components/clientes/edit-cliente/edit-cliente.component";

import { CreateProductoComponent } from "./components/productos/create-producto/create-producto.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { EditProductoComponent } from "./components/productos/edit-producto/edit-producto.component";
import { InventarioProductoComponent } from "./components/productos/inventario-producto/inventario-producto.component";

import { CreateCuponComponent } from "./components/cupones/create-cupon/create-cupon.component";
import { IndexCuponComponent } from "./components/cupones/index-cupon/index-cupon.component";
import { EditCuponComponent } from "./components/cupones/edit-cupon/edit-cupon.component";
import { VariedadProductoComponent } from "./components/productos/variedad-producto/variedad-producto.component";

const appRoute : Routes =[
    {path: '', redirectTo: 'inicio', pathMatch:'full'},

    {path: 'inicio', component: InicioComponent, canActivate: [AdminGuard]},

    {path: 'panel', children:[
        {path:'clientes', component:IndexClienteComponent, canActivate:[AdminGuard]},
        {path:'clientes/registro', component:CreateClienteComponent, canActivate:[AdminGuard]},
        {path:'clientes/:id', component:EditClienteComponent, canActivate:[AdminGuard]},

        {path:'productos/registro', component:CreateProductoComponent, canActivate:[AdminGuard]},
        {path:'productos/:id', component:EditProductoComponent, canActivate:[AdminGuard]},
        {path:'productos/inventario/:id', component:InventarioProductoComponent, canActivate:[AdminGuard]},
        {path:'productos/variedades/:id', component:VariedadProductoComponent, canActivate:[AdminGuard]},
        {path:'productos', component:IndexProductoComponent, canActivate:[AdminGuard]},

        {path:'cupones/registro', component:CreateCuponComponent, canActivate:[AdminGuard]},
        {path:'cupones', component:IndexCuponComponent, canActivate:[AdminGuard]},
        {path:'cupones/:id', component:EditCuponComponent, canActivate:[AdminGuard]},


    ]},

    {path:'login', component: LoginComponent}
]

export const appRoutingProviders : any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);