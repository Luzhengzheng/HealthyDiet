// IPC 通道定义 - 待实现
export interface IpcChannels {
    'nutrition_item:add': { request: void; response: void };
    'nutrition_item:delete': { request: void; response: void };
    'nutrition_item:update': { request: void; response: void };
    'nutrition_item:getAll': { request: void; response: void };
    'nutrition_item:getById': { request: void; response: void };
    'nutrition_item:getByDate': { request: void; response: void };
    'nutrition_item:markCompleted': { request: void; response: void };

    'nutrition_stat:getColoriesGoal': { request: void; response: void };
    'nutrition_stat:setColoriesGoal': { request: void; response: void };
    'nutrition_stat:getTotalEnergyByDate': { request: void; response: void };
}
