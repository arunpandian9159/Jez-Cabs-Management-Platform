import { PartialType } from '@nestjs/swagger';
import { CreateCabDto } from './create-cab.dto';

export class UpdateCabDto extends PartialType(CreateCabDto) {}

