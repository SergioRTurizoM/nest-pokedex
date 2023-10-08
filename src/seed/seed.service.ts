import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    private pokemonService: PokemonService,
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const  data  = await this.http.get<PokeResponse>(
      ' https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segment = url.split('/');
      const no: number = +segment[segment.length - 2];

      console.log({ name, no });

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}
