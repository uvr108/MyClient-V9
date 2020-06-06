import { TABLAS } from './../../tabla';
import { Component, OnInit, Input , AfterViewInit} from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './master.component.html',
  providers: [CrudService],
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit, AfterViewInit {

@Input() table: string = null;
@Input() fk = 0;

padre = [];
lgroup: Array<string>;
compon: Array<string>;

// table: string;
Tablas = TABLAS;
// navega: Array<Array<string>> = NAVEGA;

nuevo = false;
editTabla = true;

listForm: FormGroup;

flag = true; // flag para cabecera
cabecera = [];

constructor( private crudService: CrudService, private route: ActivatedRoute, private fb: FormBuilder) { }

/*
ms_tabla() {
  console.log(`ms_tabla() Master : table -> ${this.table} fk -> ${this.fk}`);
}
*/

ngOnInit() {

    if (this.table) {  } else {
            this.route.data.subscribe(v => { this.table = v.table; });
    }

    this.load();
    this.lgroup = this.Tablas[this.table].lgroup;
    this.compon = this.Tablas[this.table].compon;
    this.listForm = this.fb.group(this.lgroup);

    // console.log(`onInit Master table/fk:  ${this.table}/${this.fk}`);
    // console.log(`onInit Master listForm :  ${JSON.stringify(this.listForm.value)}`);
    // console.log(`onInit Master lgroup : ${JSON.stringify(this.lgroup)}`);
    // console.log(`onInit Master compon : ${JSON.stringify(this.compon)}`);
}

load(): void {

    // console.log(`load() Master : table ${this.table} fk : ${this.fk}`);

    this.crudService.GetData(this.table, this.fk.toString())
    .subscribe(data => {

      this.padre = [];
      data.forEach((f) => {
        const subresult = [];

        for (const [key, value] of Object.entries(f)) {
          if (this.flag) {this.cabecera.push(key); }
          subresult.push(value);
      }
        this.padre.push(subresult);
        this.flag = false;
  });

      // console.log(`load() Master padre ${JSON.stringify(this.padre)}`);
    });
}
/*
marca_table(table: string) {
  console.log(`marca_table() Masters : table -> ${table} fk -> ${this.fk}`);

}
*/

// agregar

  onSubmit() {

    // console.log(`onSubmit() Master : lform ${JSON.stringify(this.listForm.value)} table ${this.table} fk ${this.fk}`);

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

      // this.cerrar();
}

  ngAfterViewInit() {
}

enviar(msg: object) {

  if (!this.nuevo) { this.marcar_nuevo(); }

  // console.log(`enviar() Master : msg -> ${JSON.stringify(msg)} nuevo -> ${this.nuevo}`);

  // console.log(`msg : ${JSON.stringify(msg)}`);
  this.updateTabla(msg);
  this.editTabla = true;

}

marcar_nuevo() {
  this.updateTabla();
  this.nuevo = this.nuevo === true ? false : true;
  this.editTabla = false;
}

limpiar() {
  const dict = {};
  // tslint:disable-next-line: forin
  for (const k in this.lgroup) {
    dict[k] = null;
  }
  this.listForm.patchValue(dict);
}

updateTabla(msg: object = null) {
  const js = this.lgroup;
  let cont = 0;
  if (msg === null) { this.limpiar(); } else {
    for (const [key, value] of Object.entries(this.lgroup)) {
        js[key] = msg[cont];
        // console.log(`updateTable() master : key -> ${JSON.stringify(key)} msg[cont] -> ${msg[cont]}`);
        cont += 1;
    }
    // console.log(`updateTable() master : js -> ${JSON.stringify(js)}`);
    this.listForm.patchValue(js);
  }
}

// cerrar() { this.nuevo = false; }

}
