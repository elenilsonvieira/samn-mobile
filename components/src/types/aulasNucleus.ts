export type Frequencia = "Única" | "Semanal" | "Mensal" | "Anual";

export interface NovaAulaNucleo {
    materia: string;
    dataHora: Date;
    local: string;
    frequencia: Frequencia;
    descricao: string;
}

export interface AulaNucleo extends Omit<NovaAulaNucleo, "dataHora"> {
  id: string;
  dataHora: Date;
  uid: string;
  matricula: string;
  criadoEm?: Date | null;
  atualizadoEm?: Date | null;
}

export interface NovaAulaNucleoDoc extends NovaAulaNucleo {
  uid: string;
  matricula: string;
}
