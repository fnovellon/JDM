import { Word } from './word';

export class AssocWord {
    nom: string;
    id: number;
    type: number;
    poids: number;
    definition: string;
    relations_sortantes: Word[];
}
