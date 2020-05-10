import { Input, OnInit, Output, EventEmitter, ComponentFactoryResolver, Injectable } from '@angular/core';

import { Component, ViewChild, ViewContainerRef} from '@angular/core';

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

  @Input() ref: number;
  @Input() padre: Array<{}>;
  @Input() table: string;

  @Output() enviar = new EventEmitter<object>();

  @ViewChild('messagecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  hijo: Array<any>;
  id = 0;

  listForm: FormGroup;

  Tablas = TABLAS;

  mostra = false; // muestra listado hijo
  nuevo = false;  // muestra treeForm
  recursivo = true;

  lgroup: Array<string>;
  components: Array<string>;
  // campos: Array<string>;

  next: string = null;
  back: Array<string> = null;
  seleccion: object = {};

  editTable = false; // habilita/desabilita boton editar / agregar
  detalle: Array<any>;

  // campos = NAVEGA;
  tablas = TABLAS;

  componentRef: any;
  out = [];

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
  // console.log(`marca_nuevo() Detalle: next ${this.next} lgroup : ${JSON.stringify(this.lgroup)}`);
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

modifica(h: object , id: number) {
// console.log(`modifica Detalle : ${h} ${id}`);
this.editTable = true;
this.nuevo = this.nuevo === true ? false : true;
this.listForm.patchValue(h);
this.id = id;

}

  load(id: number) {

    /*
    */
    // console.log(`load()  Detail : this.table ${this.table} next ${this.next} id ${id} back ${this.back}`);
    this.crudService.GetByFk(this.next, id).subscribe((data: Array<{}>) => {
      this.hijo = data;
      // console.log(`load() Detail: this.hijo : ${JSON.stringify(this.hijo)}`);
    });

  }



  Update() {
    // console.log(`Form : ${JSON.stringify(this.listForm.value)} | ${this.id} | ${this.index+1}`);
    this.crudService.Update(this.id, this.listForm.value, this.next).subscribe(() => this.load(this.ref));
  }

  Borrar() {
      // console.log(this.id, this.table);
      this.crudService.Delete(this.id, this.next).subscribe(() => this.load(this.ref));
      this.nuevo = false;
  }

  cerrar() { this.nuevo = false; }

  onSubmit() {

    // this.limpiaTabla();
    // this.editTable = false;
    // this.nuevo = false;
    // console.log(`this.ref : ${this.ref} ${this.table} ${this.next} ${JSON.stringify(this.listForm.value)}`);

    this.crudService.adds_hijo(this.table, this.next, this.ref , this.listForm.value).
    subscribe(() => { this.load(this.ref), this.limpiaTabla(); } );


  }

  ngOnInit() {

    this.next = this.Tablas[this.table]['next'];
    this.back = this.Tablas[this.next]['back'];
    // console.log('Inicio Detalle this.next : ', this.next);
    this.lgroup = this.Tablas[this.next]['lgroup'];
    this.components = this.Tablas[this.next]['components'];
    // this.campos = this.Tablas[this.next]['column'];

    this.listForm = this.fb.group(this.lgroup);
    // console.log(`Inicio Detalle lgroup : ${JSON.stringify(this.lgroup)} ref ${this.ref}`);


    // this.campos.forEach((a) => this.out.push(this.padre[a]));
    this.load(this.ref);

    // console.log(`out:  ${this.out}`);

    if (this.back) {

      this.back.forEach((b: string) => {
        this.crudService.getList(b).subscribe((d) => {
          this.seleccion[b] = d;
          // console.log(`load() Detalle : next b : ${b} ${JSON.stringify(this.seleccion[b])}`);
        });
      });
      // console.log(`load() Detail: select xxx ${this.back}`);
      }

    // this.seleccion = {'EstadoSolicitud': [{"id": 1,"nombre": 'xx1'}, {"id": 2,"nombre": 'xx2'}] ,
    //               'CentroCosto': [{"id": 1,"nombre": 'yy1'}, {"id": 2,"nombre": 'yy2'}]};

  }

}
