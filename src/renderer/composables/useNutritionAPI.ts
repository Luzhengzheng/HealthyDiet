//组合式 API

import { ref } from 'vue';

import { Result } from '../../types/result';

interface NutritionAPI {
    add: () => Promise<Result<void>>;
    update: () => Promise<Result<void>>;
    delete: () => Promise<Result<void>>;
    getAll: () => Promise<Result<void>>;
    getById: () => Promise<Result<void>>;
    getByDate: () => Promise<Result<void>>;
    markCompleted: () => Promise<Result<void>>;
    getColoriesGoal: () => Promise<Result<void>>;
    setColoriesGoal: () => Promise<Result<void>>;
    getTotalEnergyByDate: () => Promise<Result<void>>;
}

export function useNutritionAPI() {}
