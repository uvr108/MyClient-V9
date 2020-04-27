import { Component, OnInit, Input , AfterViewInit} from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { ActivatedRoute } from '@angular/router';
import { NAVEGA } from '../../tabla';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { isObject } from 'util';


@Component({
  selector: 'app-list',
  templateUrl: './master.component.html',
  providers: [CrudService],
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit, AfterViewInit {

@Input() table: string;
@Input() fk: number = null;

padre: any = [];
hijo: any = [];

// table: string;
Tabla: Array<string>;
navega: Array<Array<string>> = NAVEGA;

index: number;
lgroup: object;
nuevo = false;
editTabla = true;
components: Array<Array<string|boolean>>;

listForm: FormGroup;

constructor( private crudService: CrudService, private route: ActivatedRoute, private fb: FormBuilder) { }

ngOnInit() {

    if (this.table) {  } else {
            // tslint:disable-next-line: no-string-literal
            this.route.data.subscribe(v => this.table = v['table']);
    }

    // this.route.data.subscribe(v => this.table = 'items');
    this.carga_index();
    this.load();

}


carga_index(): void {


  if (this.table === 'Presupuesto') {
    this.index = 0;
    this.lgroup = {
      id: [''],
      nombre: ['', Validators.required]
    };
    this.components = [['hidden', 'id', ''], ['text', 'nombre', 'yes']];
  } else if (this.table === 'Item') {
    this.index = 1;
    this.lgroup = {
      id: [''],
      nombre: ['', Validators.required]
    };
    this.components = [['hidden', 'id', ''], ['text', 'nombre', 'yes']];
  } else if (this.table === 'SubItem') {
    this.index = 2;
    this.lgroup = {
        id: [''],
        nombre: ['', Validators.required],
        monto: ['', Validators.required]
    };
    this.components = [['hidden', 'id', ''], ['text', 'nombre', 'yes'], ['text', 'monto', 'yes']];
  } else if (this.table === 'Solicitud') {
    this.index = 3;
    this.lgroup = {
      id: [''],
      nombre: ['', Validators.required],
      solicitante: [''],
      fecha: [''],
      numero_registro: [''],
    };
    this.components = [['hidden', 'id', ''], ['text', 'nombre', 'yes']];
} else if (this.table === 'OrdenCompra') {
  this.index = 4;
  this.lgroup = {
    id: [''],
    fecha_emision: [''],
    numero_oc: [''],
    observaciones: [''],
  };
  this.components = [['hidden', 'id', ''], ['text', 'fecha_emisiom', ''],
  ['text', 'numero_oc', 'yes'],  ['text', 'observaciones', '']];
  } else if (this.table === 'Factura') {
    this.index = 5;
    this.lgroup = {
      id: [''],
      numero_registro: [''],
      numero_cuotas: [''],
      monto: [''],
      fecha_recepcion: [''],
      observacion: ['']
    };
    this.components = [['hidden', 'id', ''], ['text', 'numero_registro', ''],
    ['text', 'numero_cuotas', 'yes'], ['text', 'monto', ''], ['text', 'fecha_recepcion', ''], ['text' , 'observacion', '']];
  }
  console.log('table -> index : ' , this.table, this.index);

  this.Tabla = this.navega[this.index];
  this.listForm = this.fb.group(this.lgroup);
}

load(): void {
  console.log('fk: ', this.fk);
  if (this.fk) {
    this.crudService.GetByFk(this.table, this.fk)
    .subscribe(data => {
      this.padre = data;
      console.log('Padre: ', this.padre);
    });
  } else
  {
    this.crudService.getList(this.table)
    .subscribe(data => {
      this.padre = data;
      console.log('Padre: ', this.padre);
    });
  }
}

marcar_nuevo() {
  this.updateTabla();
  this.nuevo = this.nuevo === true ? false : true;
  this.editTabla = false;
}

updateTabla(msg: object = null) {
  // console.log(`msg xuxa : ${JSON.stringify(msg)}`);
  // console.log(`this.lgroup . ${JSON.stringify(this.lgroup)}`);

  if (msg === null) {
      msg = {};
    // tslint:disable-next-line: forin
      for (const key in this.lgroup) {
      if (this.lgroup[key].length > 1) {
          // console.log(`key . ${key} value :  ${this.lgroup[key]}`);
          msg[key] = '';
      }
    }
  }
  this.listForm.patchValue(msg);

}

// agregar

  onSubmit() {

  this.crudService
    .agregar(this.listForm.value, this.table, this.fk)
    .subscribe(() => {
      this.load();
      this.updateTabla();
    } );

}
// editar

  editar() {
      const list = this.listForm.value;
      // tslint:disable-next-line: no-string-literal
      const id = list['id'];

      this.crudService.
      Update(id, this.listForm.value, this.table).
      subscribe(() => this.load());
}


// borrar

borrar() {
      const list = this.listForm.value;
      // tslint:disable-next-line: no-string-literal
      const id = list['id'];

      this.crudService.Delete(id, this.table).subscribe(() => this.load());

      this.cerrar();
}

  ngAfterViewInit() {
}

enviar(msg: object) {

  if (!this.nuevo) { this.marcar_nuevo(); }

  // console.log(`msg : ${JSON.stringify(msg)}`);
  this.updateTabla(msg);
  this.editTabla = true;

}


cerrar() { this.nuevo = false; }


}
