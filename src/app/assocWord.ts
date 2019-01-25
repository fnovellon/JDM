import { Word } from './word';

export class AssocWord {
    nom: string;
    id: number;
    type: number;
    poids: number;
    definition: string;
    motFormate: string;
    relations_sortantes: Word[][];
    relations_entrantes: Word[][];
}
