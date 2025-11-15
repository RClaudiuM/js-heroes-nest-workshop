import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { Request } from 'express';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  getAll(@Query('type') type?: string) {
    console.log({ type });

    return this.pokemonsService.findAll(type);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.pokemonsService.findOne(id);
  }
}
