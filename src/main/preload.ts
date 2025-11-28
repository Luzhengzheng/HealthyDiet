import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannels } from '../types/ipc';

type InvokeHandler<T extends keyof IpcChannels> = (
    args: IpcChannels[T]['request'],
) => Promise<IpcChannels[T]['response']>;

// Helper to create type-safe invoke functions
const createInvokeHandler = <T extends keyof IpcChannels>(channel: T): InvokeHandler<T> => {
    return (args) => ipcRenderer.invoke(channel, args);
};

contextBridge.exposeInMainWorld('electronAPI', {
    nutrition_item: {
        add: createInvokeHandler('nutrition_item:add'),
        delete: createInvokeHandler('nutrition_item:delete'),
        update: createInvokeHandler('nutrition_item:update'),
        getAll: createInvokeHandler('nutrition_item:getAll'),
        getById: createInvokeHandler('nutrition_item:getById'),
        getByDate: createInvokeHandler('nutrition_item:getByDate'),
        markCompleted: createInvokeHandler('nutrition_item:markCompleted'),
    },
    nutrition_stat: {
        getColoriesGoal: createInvokeHandler('nutrition_stat:getColoriesGoal'),
        setColoriesGoal: createInvokeHandler('nutrition_stat:setColoriesGoal'),
        getTotalEnergy: createInvokeHandler('nutrition_stat:getTotalEnergy'),
        getTotalEnergyByDate: createInvokeHandler('nutrition_stat:getTotalEnergyByDate'),
    },
});
