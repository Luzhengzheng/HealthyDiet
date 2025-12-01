import { createNutritionItemRequest, updateNutritionItemRequest, NutritionItemDTO } from './dtos';

export interface IpcChannels {
    // TODO: 补全完善下方IPC通道的请求和响应类型
    'nutrition_item:add': { request: createNutritionItemRequest; response: NutritionItemDTO };

    'nutrition_item:delete': { request: {id:number}; response: boolean }; 

    'nutrition_item:update': {
        request: { id: number; data: updateNutritionItemRequest };
        response: NutritionItemDTO[];
    };

    'nutrition_item:getAll': {
        request: void;
        response: NutritionItemDTO[];
    };

    'nutrition_item:getById': { request: { id: number }; response: NutritionItemDTO[] };

    //TODO
    'nutrition_item:getByDate': { request: { date:string}; response: NutritionItemDTO[] }; 

    'nutrition_item:markCompleted': { request: { id: number }; response: NutritionItemDTO }; //TODO

    'nutrition_stat:getColoriesGoal': { request:void ; response: number }; //TODO

    'nutrition_stat:setColoriesGoal': { request: number; response: number };

    'nutrition_stat:getTotalEnergy': { request: void; response: number };

    'nutrition_stat:getTotalEnergyByDate': { request: { date: string }; response: number }; // TODO
}
