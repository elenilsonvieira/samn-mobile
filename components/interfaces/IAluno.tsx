import { ICurso } from "./ICurso";
import { IHistoricoAgenda } from "./IHistoricoAgenda";

export interface IAluno {
    id: number;
    nome: string;
    matricula: number;
    cpf: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    curso: ICurso;
    status: 'ativo' | 'trancado' | 'formado' | 'desvinculado';
    endereco: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
        complemento?: string;
    };
    historicoAgendamento: IHistoricoAgenda[];
}
