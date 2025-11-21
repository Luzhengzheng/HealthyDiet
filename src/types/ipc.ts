// IPC 通道定义 - 待实现
export interface IpcChannels {
  'nutrition-item:add': {request: void; response: void;},
      'nutrition-item:delete': {request: void; response: void;},
      'nutrition-item:update': {request: void; response: void;},
      'nutrition-item:getAll': {request: void; response: void;},
      'nutrition-item:getById': {request: void; response: void;},
      'nutrition-item:getByDate': {request: void; response: void;},
      'nutrition-item:markCompleted': {request: void; response: void;},
      'nutrition-item:getColoriesGoal': {request: void; response: void;},
      'nutrition-item:setColoriesGoal': {request: void; response: void;}
}