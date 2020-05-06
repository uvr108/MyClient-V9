import { Validators } from '@angular/forms';


// export const Presupuesto: Array<string> = ['id', 'nombre', 'monto'];
// export const Item: Array<string> = ['id', 'nombre', 'monto'];
// export const SubItem: Array<string> = ['nombre', 'monto'];
// export const Solicitud: Array<string> = ['solicitante', 'fecha', 'numero_registro'];
// export const OrdenCompra: Array<string> = ['fecha_emision', 'numero_oc', 'observaciones'];
// export const Factura: Array<string> = ['numero_registro', 'numero_cuotas', 'monto', 'fecha_recepcion', 'observacion'];

// export const NAVEGA: Array<Array<string>> = [Presupuesto, Item, SubItem, Solicitud, OrdenCompra, Factura];
// export const TABLAS: Array<string> = ['Presupuesto', 'Item', 'SubItem', 'Solicitud', 'OrdenCompra', 'Factura'];

export const TABLAS: object = {

  Presupuesto: {
    next : 'Item',
    ant : null,
    // column: ['id', 'nombre', 'monto'],
    lgroup : { id: [''], nombre: ['', Validators.required] },
    components: [['hidden', 'id', ''], ['text', 'nombre', 'yes']]
  },

  Item: {
    next: 'SubItem',
    ant: null,
    // column: ['id', 'nombre', 'monto'],
    lgroup : { id: [''], nombre: ['', Validators.required] },
    components: [['hidden', 'id', ''], ['text', 'nombre', 'yes']]
  }

, SubItem: {
    next: 'Solicitud',
    ant: null,
    // column: ['id', 'nombre', 'monto'],
    lgroup : { id: [''], nombre: ['', Validators.required], monto: ['', Validators.required] },
    components: [['hidden', 'id', ''], ['text', 'nombre', 'yes'], ['text', 'monto', 'yes']]}


, Solicitud: {
    next: 'OrdenCompra',
    ant: ['', ''],
    // column: ['id', 'solicitante', 'fecha', 'numero_registro'],
    lgroup: { id: [''], solicitante: ['', Validators.required], fecha: [''], numero_registro: ['', Validators.required] },
    components: [['hidden', 'id', ''], ['text', 'solicitante', 'yes'], ['date', 'fecha', 'yes'], ['text', 'numero_registro', 'yes']]}


, OrdenCompra: {
    next: 'factura',
    ant: null,
    // column: ['id', 'fecha_emision', 'numero_oc', 'observaciones'],
    lgroup: { id: [''], fecha_emision: [''], numero_oc: [''], observaciones: [''] },
    components: [['hidden', 'id', ''], ['text', 'solicitante', 'yes'], ['text', 'fecha', 'yes'], ['text', 'numero_registro', 'yes']]}

, Factura: {
  next: null,
  ant: null,
  // column: ['id', 'numero_registro', 'numero_cuotas', 'monto', 'fecha_recepcion', 'observacion'],
  lgroup : { id: [''], numero_registro: [''], numero_cuotas: [''], monto: [''], fecha_recepcion: [''], observacion: [''] },
  components: [['hidden', 'id', ''], ['text', 'solicitante', 'yes'], ['text', 'fecha', 'yes'], ['text', 'numero_registro', 'yes']]}
};
