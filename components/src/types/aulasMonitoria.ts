export type Frequencia = "Única" | "Semanal" | "Mensal" | "Anual";

export interface NovaAulaMonitoria {
  materia: string;
  dataHora: Date;    
  local: string;
  frequencia: Frequencia;
  descricao?: string;
}

export interface AulaMonitoria extends Omit<NovaAulaMonitoria, "dataHora"> {
  id: string;
  dataHora: Date;      
  uid: string;
  matricula: string;
  criadoEm?: Date | null;
  atualizadoEm?: Date | null;
}


export interface NovaAulaMonitoriaDoc extends NovaAulaMonitoria {
  uid: string;
  matricula: string;
}
