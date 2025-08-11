import { IAluno } from "./IAluno";
import { IMonitor } from "./IMonitor";
import { IDisciplina } from "./IDisciplina";

export interface IHistoricoAgenda {
    id: number;
    aluno: IAluno;
    monitor: IMonitor;
    disciplina: IDisciplina;
    data: string;
    local: string;
    status: 'confirmado' | 'pendente' | 'cancelado';
}
