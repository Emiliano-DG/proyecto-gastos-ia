export interface Transaccion {
  monto: number
  descripcion: string
  categoria: string
  fecha: string
  tipo: 'gasto' | 'ingreso'
}
