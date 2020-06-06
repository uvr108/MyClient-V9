import { Validators } from '@angular/forms';

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
    lgroup: { id: [''], solicitante: ['', Validators.required],
    fecha: [''], numero_registro: ['', Validators.required],
    CentroCosto: [''], EstadoSolicitud: [''] },

    compon: { id: 'hidden', solicitante: 'text', fecha: 'date', numero_registro: 'text'}
  }

, CentroCosto: {
   next: 'Solicitud',
   back: null,
   lgroup: { id: [''], nombre: ['', Validators.required] },
   compon: { id: 'hidden', nombre: 'text' }
}

, EstadoSolicitud: {
  next: 'Solicitud',
  back: null,
  lgroup: { id: [''], nombre: ['', Validators.required] },
  compon: { id: 'hidden', nombre: 'text' }
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
