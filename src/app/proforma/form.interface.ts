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
  }
  

  export interface RowCrono {
    position: number
    period: number
    saldoini: number
    amortization: number
    intereses: number
    seguro_degr: number
    seguro_inm : number
    saldofini:number
    cuota_mensual: number

    
  }
