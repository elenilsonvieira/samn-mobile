import { IAluno } from "./IAluno";
import { IDisciplina } from "./IDisciplina";

export interface ICurso {
    id: number;
    nome: string;
    codigo: string;
    listaAlunos: IAluno[];
    listaDisciplinas: IDisciplina[];
}
