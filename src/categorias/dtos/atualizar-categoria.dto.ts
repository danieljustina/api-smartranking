import { IsOptional, IsString, IsArray, ArrayMinSize } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";


export class AtualizarCategoriaDto {
    
    @IsOptional()
    @IsString()
    readonly descricao: string;

    @IsArray()
    @ArrayMinSize(1)
    readonly eventos: Array<Evento>;
}