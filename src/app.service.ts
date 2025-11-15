import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  env: string
  constructor(private readonly configService: ConfigService) {
    this.env = 
      this.configService.get<string>('NODE_ENV') ?? "no-env-var"  
    }
  
  getHello(): string {
    const env = this.configService.get<string>('NODE_ENV')

    return `{
    title: "Pokemons [in ${env}]",
    links: {
      get-all-pokemons: "localhost:3000/pokemons",
      get-one-pokemon: "localhost:3000/pokemons/[id]",
      get-all-type-pokemons: "localhost:3000/pokemons?type=[type]"
    }
}`
  }
}
