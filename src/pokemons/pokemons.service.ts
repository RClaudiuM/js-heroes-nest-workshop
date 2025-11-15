import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonsService {

    public findAll(type?: string)
    {
        if (type){
            return `Return all ${type} pokemons`;
        }
        return "Returned all Pokemons!";
    }

    public findOne(id: string){
        return `Returned pokemon[id: ${id}]`;
    }
}
