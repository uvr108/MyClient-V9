export const Presupuesto: Array<string> = ['id', 'nombre', 'monto'];
export const Item: Array<string> = ['id', 'nombre', 'presupuestoId', 'monto'];
export const SubItem: Array<string> = ['nombre', 'itemId', 'monto'];
export const Solicitud: Array<string> = ['solicitante', 'fecha', 'numero_registro', 'centrocostoId', 'subitemId', 'estadosolicitudId'];

export const NAVEGA: Array<Array<string>> = [Presupuesto, Item, SubItem, Solicitud];
export const TABLAS: Array<string> = ['Presupuesto', 'Item', 'SubItem', 'Solicitud'];
