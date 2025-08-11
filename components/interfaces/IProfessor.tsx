import { IDisciplina } from "./IDisciplina";

export interface IProfessor {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    disciplinas: IDisciplina[];
}
