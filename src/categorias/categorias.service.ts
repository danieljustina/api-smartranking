import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoriasService {

    constructor(@InjectModel('Categoria') private readonly categoriaModel: Model<Categoria> ) {
    }

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {      
        const { categoria } = criarCategoriaDto;
        const categoriaEncontrado = await this.categoriaModel.findOne({categoria}).exec();

        if(categoriaEncontrado) {
            throw new BadRequestException(`Categoria ${categoria} já cadastrado!`);
        } 
        const jogadorCriador = new this.categoriaModel(criarCategoriaDto);
        return await jogadorCriador.save();
    }
}
