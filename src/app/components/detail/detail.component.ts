import { Input, OnInit, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';

import { Component, ViewChild, ViewContainerRef, AfterViewInit} from '@angular/core';

import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CrudService } from '../../shared/crud.service';
import {  TABLAS } from '../../tabla';

import { MasterComponent } from '../master/master.component';

@Component({
  selector: 'app-detail',
  templateUrl: '../detail/detail.component.html',
  styleUrls: ['../detail/detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit {

  @Input() ref: string;
  @Input() padre: Array<{}>;
  @Input() table: string;

  @Output() enviar = new EventEmitter<object>();

  @ViewChild('messagecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  hijo: Array<any>;
  id = 0;

  listForm: FormGroup;
  // backForm: FormArray;

  Tablas = TABLAS;

  mostra = false; // muestra listado hijo
  nuevo = false;  // muestra treeForm
  recursivo = true;

  lgroup: Array<string>;
  compon: Array<string>;
  // campos: Array<string>;

  next: string = null;
  back: Array<string> = null;
  seleccion: object = {};

  editTable = false; // habilita/desabilita boton editar / agregar
  detalle: Array<any>;

  // campos = NAVEGA;
  tablas = TABLAS;

  componentRef: any;
  // out = {};

  constructor(private crudService: CrudService, private fb: FormBuilder, private resolver: ComponentFactoryResolver ) { }

  activa_recursivo(ref: number, next: string) {

    if (next) {
    // console.log(`recursivo : ${this.recursivo} next : ${next} ref: ${ref}`);

    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(MasterComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.table = next;
    this.componentRef.instance.fk = ref;
    this.recursivo = this.recursivo === true ? false : true;
    if (this.recursivo) { this.desactiva_recursivo(); }
    }
  }

  marcar_mostra() {
    this.mostra = this.mostra === true ? false : true;
  }

  desactiva_recursivo() {
    this.componentRef.destroy();
  }

  mensage(padre: {}) {
    this.enviar.emit(padre);
}

marcar_nuevo() {
  this.nuevo = this.nuevo === true ? false : true;
  this.editTable = false;
  console.log(`marca_nuevo() Detalle: next ${this.next} lgroup : ${JSON.stringify(this.lgroup)}`);
  this.limpiaTabla();
}

limpiaTabla(){
  const dict = {};
  // tslint:disable-next-line: forin
  for (const k in this.lgroup) {
    dict[k] = null;
  }
  this.listForm.patchValue(dict);
  // console.log(`limpiar : ${JSON.stringify(this.listForm.value)}`);
}

modifica(h: object) {

this.editTable = true;
this.nuevo = this.nuevo === true ? false : true;


Object.entries(h).forEach(
  ([key, value]) => { if (this.compon[key] === 'date') {  h[key] = value.substring(0, 10); } }
);




if (this.back) {
  Object.entries(this.back).forEach(([k, v]) => {
    console.log(`modifica Details [k, v] -> ${k} ${v}`);
    this.lgroup[k] = [h[v]];
  } );
}



this.listForm = this.fb.group(this.lgroup);


console.log(`modifica Detalle : compon -> ${JSON.stringify(this.compon)}`);
console.log(`modifica Detalle : h -> ${JSON.stringify(h)}`);

this.listForm.patchValue(h);


}

  load(id: string) {

    const fk = id.toString().split('\/');
    // console.log(`load()  Detail this.table -> ${this.table} next -> ${this.next} `);
    // console.log(`load() Detail id -> ${id} [0] -> ${fk[0]} back -> ${this.back}`);
    this.crudService.GetByFk(this.next, fk[0]).subscribe((data: Array<{}>) => {
      this.hijo = data;
      // console.log(`load() Detail: this.hijo : ${JSON.stringify(this.hijo)}`);
    });

  }



  Update(id: string) {
    console.log(`Update Details : ${JSON.stringify(this.listForm.value)} | ${id} | ${this.ref}`);
    this.crudService.Update(id, this.listForm.value, this.next)
    .subscribe(() => this.load(this.ref));
  }

  Borrar(id: string) {
      // console.log(this.id, this.table);
      this.crudService.Delete(id, this.next).subscribe(() => this.load(this.ref));
      this.nuevo = false;
  }

  cerrar() { this.nuevo = false; }

  onSubmit() {

   console.log(`this.ref : ${this.ref} ${this.table} ${this.next}`);
   console.log(`${JSON.stringify(this.listForm.value)}`);

   if (this.back) {
      Object.entries(this.back).forEach(([k, v]) => {
        // console.log();
        this.ref = this.ref + '/' + this.listForm.value[k].toString();
      });
    }

   console.log(`onSubmit() Details -> this.ref : ${this.ref}`);

   this.crudService.adds_hijo(this.table, this.next, this.ref , this.listForm.value).
    subscribe(() => {
                      this.load(this.ref);
                      this.limpiaTabla();
                    } );

  }

  ngOnInit() {

    this.next = this.Tablas[this.table].next;
    this.back = this.Tablas[this.next].back;
    this.lgroup = this.Tablas[this.next].lgroup;
    this.compon = this.Tablas[this.next].compon;

    console.log(`onInit Details next -> ${this.next} back -> ${this.back}`);

    if (this.back) {
      Object.entries(this.back).forEach(([k, v]) => {
       this.crudService.getList(k).subscribe((d) => {
        console.log(`OnInit Detalis [k,v] -> ${k} : ${v}`);
        this.seleccion[k] = d;
        });

        } );
    }

    this.load(this.ref);
    this.listForm = this.fb.group(this.lgroup);

    // console.log(`out:  ${this.out}`);

  }

  ngAfterViewInit() {

    /*
    if (this.back) {
      this.back.forEach((c) => {
        this.lgroup[c] = [1];
      } );
    }

    this.listForm = this.fb.group(this.lgroup);
    // console.log(`Inicio Detalle lgroup : ${JSON.stringify(this.lgroup)} ref ${this.ref}`);
    // console.log(`Detail afterView() : next -> ${this.next} lgroup -> ${JSON.stringify(this.lgroup)}`);
    */

  }

}
