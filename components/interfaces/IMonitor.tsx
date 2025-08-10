import { IAluno } from "./IAluno";
import { IDisciplina } from "./IDisciplina";

export interface IMonitor extends IAluno{
    disciplina: IDisciplina;
    disponibilidade: {
        diaSemana: string;
        horarioInicio: string;
        horarioFim: string;
    }[];
}