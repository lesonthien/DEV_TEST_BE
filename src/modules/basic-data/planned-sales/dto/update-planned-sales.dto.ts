import { PartialType } from '@nestjs/swagger';

import { CreatePlannedSalesDto } from './create-planned-sales.dto';

export class UpdatePlannedSalesDto extends PartialType(CreatePlannedSalesDto) {}
