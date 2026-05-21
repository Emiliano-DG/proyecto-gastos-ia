export interface Transaccion {
  id: string
  monto: number
  categoria: string
  fecha: string
  descripcion: string
  tipo: 'ingreso' | 'gasto'
  numero_whatsapp: string
  created_at: string
}
