import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonsService {
  public findAll(type?: string) {
    return `Returned all pokemons ${type ? `with type ${type}` : ''}`;
  }

  public findOne(id: string) {
    return `Returned pokemon with id ${id}`;
  }
}
