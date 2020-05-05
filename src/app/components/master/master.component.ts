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

@Input() table: string;
@Input() fk: number = null;

padre: any = [];
lgroup: Array<string>;
components: Array<Array<string|boolean>>;

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
    this.components = this.Tablas[this.table]['components'];
    this.listForm = this.fb.group(this.lgroup);
    // console.log(this.table, this.padre, this.lgroup);
}

load(): void {

  if (this.fk) {
    this.crudService.GetByFk(this.table, this.fk)
    .subscribe(data => {
      this.padre = data;
      // console.log('Padre: ', this.padre);
    });
  } else
  {
    this.crudService.getList(this.table)
    .subscribe(data => {
      this.padre = data;
      // console.log('Padre: ', this.padre);
    });
  }
}

// agregar

  onSubmit() {
    console.log(this.listForm.value);

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

updateTabla(msg: object = null) {
  // console.log(`msg xuxa : ${JSON.stringify(msg)}`);
  // console.log(`this.lgroup (master) ${JSON.stringify(this.lgroup)}`);

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


cerrar() { this.nuevo = false; }


}
