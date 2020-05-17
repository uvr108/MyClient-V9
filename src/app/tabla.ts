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
    back : null,
    lgroup: { id: [''], nombre: ['', Validators.required] },
    compon: { id: 'hidden', nombre: 'text' }
  }

, Item: {
    next: 'SubItem',
    back: null,
    lgroup: { id: [''], nombre: ['', Validators.required] },
    compon: { id: 'hidden', nombre: 'text' }
  }

, SubItem: {
    next: 'Solicitud',
    back: null,
    lgroup: { id: [''], nombre: ['', Validators.required], monto: ['', Validators.required] },
    compon: { id: 'hidden', nombre: 'text', monto: 'text' }
}

, Solicitud: {
    next: 'OrdenCompra',
    back: {CentroCosto: 'centrocostoId', EstadoSolicitud: 'estadosolicitudId'},
    lgroup: { id: [''], solicitante: ['', Validators.required], fecha: [''], numero_registro: ['', Validators.required] },
    compon: { id: 'hidden', solicitante: 'text', fecha: 'date', numero_registro: 'text'}
  }


, OrdenCompra: {
    next: 'factura',
    back: {EstadoOc: 'estadoocId', CentroCosto: 'centrocostoId'},
    lgroup: { id: [''], fecha_emision: [''], numero_oc: [''], observaciones: [''] },
    compon: { id: 'hidden', fecha_emision: 'date', numero_oc: 'text', observaciones: 'text' }
}

, Factura: {
  next: null,
  back: null,
  lgroup: { id: [''], numero_registro: [''], numero_cuotas: [''], monto: [''], fecha_recepcion: [''], observacion: [''] },
  compon: { id: 'hidden', solicitante: 'text', fecha: 'date', numero_registro: 'text'}
}
};
