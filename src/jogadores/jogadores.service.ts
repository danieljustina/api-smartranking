import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name);

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador> ) {
    }

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {      
        const { email } = criarJogadorDto;
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();

        if(jogadorEncontrado) {
            this.atualizar(criarJogadorDto);
        } else {
            this.criar(criarJogadorDto);
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {      
        return await this.jogadorModel.find().exec();
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {     
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();
        if (jogadorEncontrado) {
            return jogadorEncontrado;
        }
        throw new NotFoundException(`Jogador com email ${email} não encontrado!`);        
    }

    async deletarJogadores(email: string): Promise<any> { 
        return await this.jogadorModel.remove({email}).exec();       
    }

    private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriador = new this.jogadorModel(criarJogadorDto);
        return await jogadorCriador.save();
    }

    private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadorModel.findOneAndUpdate( 
                {email: criarJogadorDto.email}, 
                {$set: criarJogadorDto}
            ).exec();
    }

}
