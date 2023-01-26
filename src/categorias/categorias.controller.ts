import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(private readonly categoriasService: CategoriasService) {
    }


    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        return await this.categoriasService.criarCategoria(criarCategoriaDto);
    }

    @Get()
    async consultarCategorias(): Promise<Categoria[]>{
        return await this.categoriasService.consultarTodasCategorias();
    }

    @Get('/:categoria')
    async consultarCategoriasPeloId(@Param('categoria') categoria: string): Promise<Categoria>{
        return await this.categoriasService.consultarCategoriasPeloId(categoria);
    }

    @Put('/:categoria')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
        @Body() categoriaDto: AtualizarCategoriaDto,
        @Param('categoria') categoria: string): Promise<void> {
        await this.categoriasService.atualizarCategoria(categoria, categoriaDto);
    }

    @Post('/:categoria/jogadores/:idJogador')
    async atribuirCategoriaJogador(
        @Param() params: string[]): Promise<void> {
            await this.categoriasService.atribuirCategoriaJogador(params)
    }
}
