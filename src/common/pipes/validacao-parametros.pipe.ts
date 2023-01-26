import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

export class ValidacaoParametrosPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata){
        if (value) {
            return value;
        }
        throw new BadRequestException(`O valor do parametro ${metadata.data} não pode ser vazio!`);        
    }    

}