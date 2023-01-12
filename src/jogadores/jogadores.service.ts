import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name);
    private jogadores: Jogador[] = [];

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {      
        const { email } = criarJogadorDto;
        const jogadorEncontrado = this.jogadores.find((res) => res.email === email);
        if(jogadorEncontrado) {
            this.atualizar(jogadorEncontrado, criarJogadorDto);
        } else {
            this.criar(criarJogadorDto);
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {      
        return this.jogadores;
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {     
        const jogadorEncontrado = this.jogadores.find((res) => res.email === email);
        if (jogadorEncontrado) {
            return jogadorEncontrado;
        }
        throw new NotFoundException(`Jogador com email ${email} não encontrado!`);        
    }

    async deletarJogadores(email: string): Promise<Jogador> {     
        const jogadorEncontrado = this.jogadores.find((res) => res.email === email);
        if (jogadorEncontrado) {
            this.jogadores = this.jogadores.filter((res) => res.email != jogadorEncontrado.email);
            return;
        }
        throw new NotFoundException(`Jogador com email ${email} não encontrado!`);        
    }

    private criar(criarJogadorDto: CriarJogadorDto): void {
        const { nome, email, telefoneCelular } = criarJogadorDto;
        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            email,
            telefoneCelular,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com.br/foto123.jpg'
        }

        this.logger.log(`criarJogadorDto: ${ JSON.stringify(jogador)}`);

        this.jogadores.push(jogador);
    }

    private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): void {
        const { nome } = criarJogadorDto;
        jogadorEncontrado.nome = nome;
        this.logger.log(`atualizarJogadorDto: ${ JSON.stringify(jogadorEncontrado)}`);
    }

}
