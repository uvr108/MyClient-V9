import { Input, OnInit, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';

import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from '../../shared/crud.service';
import {  TABLAS } from '../../tabla';

import { MasterComponent } from '../master/master.component';

@Component({
  selector: 'app-detail',
  templateUrl: '../detail/detail.component.html',
  styleUrls: ['../detail/detail.component.css']
})
export class DetailComponent implements OnInit {

  @Input() ref: string;
  @Input() padre: Array<{}>;
  @Input() table: string;

  @Output() enviar = new EventEmitter<object>();

  @ViewChild('messagecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  hijo = [];
  id = 0;

  listForm: FormGroup;
  // backForm: FormArray;

  Tablas = TABLAS;

  mostra = false; // muestra listado hijo
  nuevo = false;  // muestra treeForm
  recursivo = true;
  // result = [];

  lgroup: Array<string>;
  compon: Array<string>;
  // campos: Array<string>;

  next: string = null;
  back: Array<string> = null;
  seleccion: object = {};

  editTable = true; // habilita/desabilita boton editar / agregar
  detalle: Array<any>;

  tablas = TABLAS;

  componentRef: any;

  flag = true; // flag para cabecera
  cabecera = [];

  constructor(private crudService: CrudService, private fb: FormBuilder, private resolver: ComponentFactoryResolver ) { }

  /*
  marca_next() {
    console.log(`marca_next() Details : next ->  ${this.next} table -> ${this.table} ref -> ${this.ref}`);
  }
  */

  activa_recursivo(ref: number, next: string) {

    if (next) {
    console.log(`recursivo() Details : recursivo -> ${this.recursivo} next -> ${next} ref-> ${ref}`);

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
    console.log(`mensage() Detail : padre -> ${JSON.stringify(padre)}`);
    this.enviar.emit(padre);
}

marcar_nuevo() {

  // alert('Marca Nuevo');

  if (this.back) {
    this.agrega_back();
    // console.log(`marca_nuevo() Details : back -> ${JSON.stringify(this.back)}
    // lgroup -> ${JSON.stringify(this.lgroup)}`);
  }
  this.listForm = this.fb.group(this.lgroup);

  this.nuevo = this.nuevo === true ? false : true;
  this.editTable = false;
  // console.log(`marca_nuevo() Detalle: next ${this.next} lgroup : ${JSON.stringify(this.lgroup)}`);
  // console.log(`marca_nuevo() Detalle: lgroup -> ${JSON.stringify(this.lgroup)}`);
  this.limpiaTabla();
}

limpiaTabla(){
  const dict = {};

  // tslint:disable-next-line: forin
  for (const k in this.lgroup) {
    dict[k] = null;
  }
  this.listForm.patchValue(dict);
  // console.log(`limpiar() Details : listForm -> ${JSON.stringify(this.listForm.value)}`);
}

modifica(h: object) {

alert('modifica');

this.editTable = true;
this.nuevo = this.nuevo === true ? false : true;

const js = this.lgroup;
let cont = 0;

Object.entries(h).forEach(
  ([key, value]) => { if (this.compon[key] === 'date') {  h[key] = value.substring(0, 10); } }
);

if (this.back) {
  this.agrega_back(h);
}

this.listForm = this.fb.group(this.lgroup);

console.log(`modifica() Details : compon -> ${JSON.stringify(this.compon)}`);
console.log(`modifica() Details : h -> ${JSON.stringify(h)}`);

for (const [key, value] of Object.entries(this.lgroup)) {
  js[key] = h[cont];
  console.log(`modifica() Details : key -> ${JSON.stringify(key)} msg[cont] -> ${h[cont]}`);
  cont += 1;
}
console.log(`modifica() Details patchValue(js): js -> ${JSON.stringify(js)}`);
this.listForm.patchValue(js);

}

agrega_back(h: any = null) {
  Object.entries(this.back).forEach(([k, v]) => {
    // console.log(`modifica() Details : [k, v] -> ${k} ${v}`);
    if (h == null) {
        this.lgroup[k] = [''];
        }
        else {
          this.lgroup[k] = [h[v]];
        }

  } );

}

  load(id: string) {
    this.hijo = [];

    const fk = id.toString().split('\/');
    // console.log(`load() Detail : table -> ${this.table} next -> ${this.next} `);
    // console.log(`load() Detail : id -> ${id} [0] -> ${fk[0]} back -> ${JSON.stringify(this.back)}`);
    this.crudService.GetData(this.next, fk[0]).subscribe((data: Array<{}>) => {
      // this.hijo = data;

      data.forEach((f) => {
        const subresult = [];
        for (const [key, value] of Object.entries(f)) {
          if (this.flag) {this.cabecera.push(key); }
          subresult.push(value);
      }
        this.hijo.push(subresult);
        this.flag = false;
  });
      // console.log(`load() Detail : hijo : ${JSON.stringify(this.hijo)}`);
    });

  }



  Update() {

    const id = this.listForm.value.id;
    // this.ref = id;   OJO !!!!!!

    console.log(`Update() Details : listForm ->
    ${JSON.stringify(this.listForm.value)} id-> ${id} ref-> ${this.ref}`);

    this.crudService.Update(id, this.listForm.value, this.next)
    .subscribe(() => this.load(this.ref));
  }

  Borrar() {
      const id = this.listForm.value.id;
      this.crudService.Delete(id, this.next).subscribe(() => this.load(this.ref));
      this.nuevo = false;
  }

  cerrar() { this.nuevo = false; }

  onSubmit() {

   if (this.back) {
    Object.entries(this.back).forEach(([k, v]) => {
      this.ref = this.ref + '/' + this.listForm.value[k].toString();
    });
    }
   console.log(`onSubmit() : Details -> ref : ${this.ref} table -> ${this.table} next -> ${this.next}`);
   console.log(`onSubmit() : Details -> listForm -> ${JSON.stringify(this.listForm.value)}`);

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

    // console.log(`onInit() Details : next -> ${this.next} back -> ${this.back}`);

    if (this.back) {
      Object.entries(this.back).forEach(([k, v]) => {
       this.crudService.GetData(k, '0').subscribe((d) => {
        this.seleccion[k] = d;
        // console.log(`OnInit() Details : [k,v] -> ${k} : ${v} seleccion -> ${JSON.stringify(this.seleccion[k])}`);

        });

        } );
    }

    this.load(this.ref);
    this.listForm = this.fb.group(this.lgroup);

  }

}
