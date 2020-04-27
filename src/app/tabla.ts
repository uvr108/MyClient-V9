export const Presupuesto: Array<string> = ['id', 'nombre', 'monto'];
export const Item: Array<string> = ['id', 'nombre', 'presupuestoId', 'monto'];
export const SubItem: Array<string> = ['nombre', 'itemId', 'monto'];
export const Solicitud: Array<string> = ['solicitante', 'fecha', 'numero_registro', 'centrocostoId',
'subitemId', 'estadosolicitudId'];
export const OrdenCompra: Array<string> = ['fecha_emision', 'numero_oc', 'observaciones',
'solicitudId', 'estadoocId', 'centrocostoId'];
export const Factura: Array<string> = ['numero_registro', 'numero_cuotas', 'monto', 'fecha_recepcion', 'observacion'];

export const NAVEGA: Array<Array<string>> = [Presupuesto, Item, SubItem, Solicitud, OrdenCompra, Factura];
export const TABLAS: Array<string> = ['Presupuesto', 'Item', 'SubItem', 'Solicitud', 'OrdenCompra', 'Factura'];
