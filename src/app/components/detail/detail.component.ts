import {Input, OnInit, Output, EventEmitter, ComponentFactoryResolver} from '@angular/core';

import { Component, ViewChild, ViewContainerRef} from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from '../../shared/crud.service';
import { NAVEGA, TABLAS } from '../../tabla';

import { MasterComponent } from '../master/master.component';

export interface Hijo  {
    nombre: string;
    monto: number;
}

@Component({
  selector: 'app-detail',
  template: `
  <ng-template #mostraTemplate let-peopleCounter="numberOfPeople">
      <button class="btn btn-link" (click)="marcar_mostra()">-[*]-</button>
      [{{out[1]}}]
      [{{out[2]}}]
      <button class="btn btn-link" (click)="mensage(padre)">[x]</button>
      <div *ngIf="mostra" style="padding-left: 25px;">
          <h4>{{tablas[index+1]}} |  {{out[0] | json}}</h4>
          <table width="100%" border="1">
          <tr><td>
          <button class="btn btn-link btn-sm" (click)="marcar_nuevo()">((+))</button>
          {{campos[index+1] | json}}
              <table width="100%" border="1">
              <tr *ngFor="let h of hijo; index as Id">
                  <td *ngFor="let c of campos[index+1]">
                    <div *ngIf="c==='id'; else mostra">
                    <button type="button" class="btn btn-link btn-sm" (click)="activa_recursivo()">=[*]=</button>
                    <template #messagecontainer>
                    </template>
                    </div>
                  <ng-template #mostra>{{h[c]}}</ng-template>
                  </td>
                  <td><button class="btn btn-link btn-sm" (click)="modifica(h, h.id)">[x]</button></td>
              </tr>
              </table>
        </td>
        </tr>
      </table>
      </div>
      <div *ngIf="nuevo" style="padding-left: 20px; padding-right: 20px; ">
      <br>
      <form [formGroup]="listForm" (ngSubmit)="onSubmit()">

          <span *ngFor="let c of components">
                {{c[1]}} <input type="{{c[0]}}" formControlName="{{c[1]}}"/>
          </span>
          <hr>
          <span>
            <table width="70%" border="1"><tr><td>
             <button *ngIf="!editTable" class="btn btn-info btn-sm" type="submit"
             [disabled]="!listForm.valid">Agregar</button>
             </td>
             <td>
             <button *ngIf="editTable" class="btn btn-info btn-sm" type="button"
             [disabled]="!listForm.valid" (click)="Update()">Modificar</button>
             </td>
             <td>
             <button *ngIf="editTable" class="btn btn-info btn-sm" type="button"
             [disabled]="!listForm.valid" (click)="Borrar()">Borrar</button>&nbsp;
             </td>
             <td>
             <button class="btn btn-info btn-sm" type="button"
             (click)="cerrar()">Cerrar</button>
             </td>
             </tr>
            </table>
          </span>
          <hr>

      </form>
      </div>

  </ng-template>
  <ng-container *ngTemplateOutlet="mostraTemplate;context:ctx"></ng-container>
  `
})
export class DetailComponent implements OnInit {

  @Input() ref: number;
  @Input() name: string;
  @Input() padre: {};
  @Input() index: number;
  @Input() listForm: FormGroup;
  @Input() lgroup: object;
  @Input() components: Array<Array<string|boolean>>;

  @Output() enviar = new EventEmitter<object>();

  @ViewChild('messagecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  totalPeople = 4;
  ctx = {numberOfPeople: this.totalPeople};

  hijo: Array<any>;
  id = 0;

  mostra = false; // muestra listado hijo
  nuevo = false;  // muestra treeForm
  recursivo = true;

  editTable = false; // habilita/desabilita boton editar / agregar
  detalle: Array<any>;

  campos = NAVEGA;
  tablas = TABLAS;

  componentRef: any;
  out = [];

  activa_recursivo() {
    console.log(`recursivo : ${this.recursivo}`);
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(MasterComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.message = this.tablas[this.index + 2];
    this.recursivo = this.recursivo === true ? false : true;
    if (this.recursivo) { this.desactiva_recursivo(); }
  }

  desactiva_recursivo() {
    this.componentRef.destroy();
  }

  load(id: number) {
    const out = [];
    // console.log('HIJOOOO : ',  this.tablas[this.index + 1], id);

    return this.crudService.GetByFk(this.tablas[this.index + 1], id).subscribe((data: Array<{}>) => {
      this.hijo = data;
      // console.log('data xxx : ', JSON.stringify(data));

      if (Object(this.hijo).length > 0) {
        let out2 = [];
        this.hijo.forEach((a) => {

          this.campos[this.index + 1 ].forEach((b: any) => out2.push(a[b])), out.push(out2), out2 = [];
        }), this.detalle = out;
      }

    });

  }

  mensage(padre: {}) {
      this.enviar.emit(padre);
  }

  marcar_mostra() {
      this.mostra = this.mostra === true ? false : true;
  }

  updateTabla(msg: object = null) {
    console.log(`msg xuxa : ${JSON.stringify(msg)}`);
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

  marcar_nuevo() {
      this.updateTabla();
      this.nuevo = this.nuevo === true ? false : true;
      this.editTable = false;
      this.updateTree();

  }

  modifica(h: Hijo, id: number) {
    console.log(h, id);
    this.editTable = true;
    this.nuevo = this.nuevo === true ? false : true;
    this.updateTree(h);
    this.id = id;

  }

  updateTree(h: Hijo = null) {
    if (h === null) {
        this.listForm.patchValue({nombre: ''});
    } else {
        this.listForm.patchValue({
        nombre: h.nombre,
        // monto: h.monto
        });
    }
  }

  Update() {
    // console.log(`Form : ${JSON.stringify(this.listForm.value)} | ${this.id} | ${this.index+1}`);
    this.crudService.Update(this.id, this.listForm.value, this.tablas[this.index + 1]).subscribe(() => this.load(this.ref));
  }

  Borrar() {
      // console.log(this.id, this.table);
      this.crudService.Delete(this.id, this.tablas[this.index + 1]).subscribe(() => this.load(this.ref));
      this.nuevo = false;
  }

  cerrar() { this.nuevo = false; }

  constructor(private crudService: CrudService, private fb: FormBuilder, private resolver: ComponentFactoryResolver ) { }

  onSubmit() {
    // console.log('bbbbbbb');
    // this.updateTree();
    this.editTable = false;
    // console.log(`this.ref : ${this.ref}`);

    this.crudService.adds_hijo(this.tablas[this.index], this.tablas[this.index + 1], this.ref , this.listForm.value).
    subscribe(() => this.load(this.ref));


  }


  ngOnInit() {
    // console.log(`campos : ${JSON.stringify(this.campos[this.index])} | ${this.index} | ref ${this.ref}`);
    this.campos[this.index].forEach((a) => this.out.push(this.padre[a]));
    this.load(this.ref);

    // console.log(`index: ${this.index} ${this.out}`);
  }

}
