export interface Form {
    form_id: number
    client_id: number
    currency: string
    entity: string
    price: number
    initial: number
    sustainable: boolean
    help: boolean
    tea: number
    time: number
    gracePeriod: number
    perInitial: number
    bbp: number
    montof: number
    tcea: number
    cuota: number
    sinmAnual: number
    sdegMensual: number
    tipo: string
    asesor: string
    fecha:string
  }
  

  export interface RowCrono {
    position: number
    period: number
    saldoini: string
    amortization: string
    intereses: string
    seguro_degr: string
    seguro_inm : string
    saldofini:string
    cuota_mensual: string
 
  }
