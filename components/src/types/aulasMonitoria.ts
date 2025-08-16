export type Frequencia = "Única" | "Semanal" | "Mensal" | "Anual";

export interface NovaAulaMonitoria {
  materia: string;
  dataHora: Date;      // do DateTimePicker
  local: string;
  frequencia: Frequencia;
  descricao?: string;
}

// Registro completo lido do Firestore
export interface AulaMonitoria extends Omit<NovaAulaMonitoria, "dataHora"> {
  id: string;
  dataHora: Date;      
  Uid: string;
  Matricula: string;
  criadoEm?: Date | null;
  atualizadoEm?: Date | null;
}
// (Opcional) útil como payload para salvar no Firestore
export interface NovaAulaMonitoriaDoc extends NovaAulaMonitoria {
  Uid: string;
  Matricula: string;
}
