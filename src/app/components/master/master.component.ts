import { TABLAS } from './../../tabla';
import { Component, OnInit, Input , AfterViewInit} from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { ActivatedRoute } from '@angular/router';
// import { NAVEGA } from '../../tabla';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './master.component.html',
  providers: [CrudService],
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit, AfterViewInit {

@Input() table: string = null;
@Input() fk: number = null;

padre: any = [];
lgroup: Array<string>;
compon: Array<string>;

// table: string;
Tablas = TABLAS;
// navega: Array<Array<string>> = NAVEGA;

nuevo = false;
editTabla = true;

listForm: FormGroup;

constructor( private crudService: CrudService, private route: ActivatedRoute, private fb: FormBuilder) { }

ngOnInit() {

    if (this.table) {  } else {
            // tslint:disable-next-line: no-string-literal
            this.route.data.subscribe(v => this.table = v['table']);
    }

    this.load();
    this.lgroup = this.Tablas[this.table]['lgroup'];
    this.compon = this.Tablas[this.table]['compon'];
    this.listForm = this.fb.group(this.lgroup);

    // console.log(`onInit Master table/fk:  ${this.table}/${this.fk}`);
    // console.log(`onInit Master listForm :  ${JSON.stringify(this.listForm.value)}`);
    // console.log(`onInit Master lgroup : ${JSON.stringify(this.lgroup)}`);
    // console.log(`onInit Master compon : ${JSON.stringify(this.compon)}`);
}

load(): void {
  // console.log(`load() Master : table ${this.table} fk : ${this.fk}`);
  if (this.fk) {

    this.crudService.GetByFk(this.table, this.fk.toString())
    .subscribe(data => {
      this.padre = data;
      // console.log(`load() Master padre ${JSON.stringify(this.padre)}`);
    });
  } else
  {
    this.crudService.getList(this.table)
    .subscribe(data => {
      this.padre = data;
      // console.log(`load() Master padre ${JSON.stringify(this.padre)}`);
    });
  }
}

marca_table(table: string) {
  console.log(`marca_table() Masters : table -> ${table}`);
}

// agregar

  onSubmit() {

    console.log(`onSubmit() Master : lform ${JSON.stringify(this.listForm.value)} table ${this.table} fk ${this.fk}`);

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

  if (msg === null) { this.limpiar(); } else {
    this.listForm.patchValue(msg);
  }
}

cerrar() { this.nuevo = false; }

}
