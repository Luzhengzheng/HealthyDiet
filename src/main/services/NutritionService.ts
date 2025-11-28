import { NutritionItemEntity } from '../../types/entities';
import { NutritionRepository } from '../repositories/NutritionRepository';
import { Result } from '../../types/result';
import { Logger } from '../utils/logger';

export class NutritionService {
    constructor(
        private repository: NutritionRepository,
        private logger: Logger,
    ) {}
}
