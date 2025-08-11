import { IMonitor } from "./IMonitor";
import { IAluno } from "./IAluno";
import { IProfessor } from "./IProfessor";

export interface IDisciplina {
    id: number;
    nome: string;
    codigo: string;
    professoresResponsaveis: IProfessor[];
    monitor: IMonitor;
    alunos: IAluno[];
}
