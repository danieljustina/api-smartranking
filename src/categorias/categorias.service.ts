import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService 
    ) {}

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {      
        const { categoria } = criarCategoriaDto;
        const categoriaEncontrado = await this.categoriaModel.findOne({categoria}).exec();

        if(categoriaEncontrado) {
            throw new BadRequestException(`Categoria ${categoria} já cadastrado!`);
        } 
        const jogadorCriador = new this.categoriaModel(criarCategoriaDto);
        return await jogadorCriador.save();
    }

    async consultarTodasCategorias(): Promise<Categoria[]> {      
        return await this.categoriaModel.find().populate("jogadores").exec();
    }

    async consultarCategoriasPeloId(categoria: string): Promise<Categoria> {     
        const categoriaEncontrado = await this.categoriaModel.findOne({categoria}).populate("jogadores").exec();
        if (!categoriaEncontrado) {
            throw new NotFoundException(`Categoria ${categoria} não encontrado!`);  
        }
        return categoriaEncontrado;              
    }

    async atualizarCategoria(categoria: string, categoriaDto: AtualizarCategoriaDto): Promise<void> {      
        const jogadorEncontrado = await this.categoriaModel.findOne({categoria}).exec();

        if(!jogadorEncontrado) {
            throw new NotFoundException(`Categoria ${categoria} não encontrado!`);
        } 
            
        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaDto}).exec();
    }

    async atribuirCategoriaJogador(params: string[]): Promise<void> {      
        const categoria = params['categoria'];
        const idJogador = params['idJogador'];

        await this.jogadoresService.consultarJogadoresPeloId(idJogador);

        const categoriaEncontrado = await this.categoriaModel.findOne({categoria}).exec();
        const jogadorJaCadastradoNaCategoria = await this.categoriaModel.find({categoria}).where('jogadores').in(idJogador).exec();

        if(!categoriaEncontrado) {
            throw new NotFoundException(`Categoria ${categoria} não encontrado!`);
        } 

        if(jogadorJaCadastradoNaCategoria.length > 0 ) {
            throw new NotFoundException(`Jogador ${idJogador} já cadastrado na categoria ${categoria}!`);
        } 

        categoriaEncontrado.jogadores.push(idJogador);
            
        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaEncontrado}).exec();
    }

}
