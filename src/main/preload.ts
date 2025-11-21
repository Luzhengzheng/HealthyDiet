// Preload 脚本 - 待实现
import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannels } from '../types/ipc';

type InvokeHandler<T extends keyof IpcChannels> = (
  args: IpcChannels[T]["request"],
) => Promise<IpcChannels[T]["response"]>;

// Helper to create type-safe invoke functions
const createInvokeHandler = <T extends keyof IpcChannels>(
  channel: T,
): InvokeHandler<T> => {
  return (args) => ipcRenderer.invoke(channel, args);
};


contextBridge.exposeInMainWorld('electronAPI', {
    addNutritionItem: () => ipcRenderer.invoke('nutrition-item:add'),
    deleteNutritionItem: () => ipcRenderer.invoke('nutrition-item:delete'),
    updateNutritionItem: () => ipcRenderer.invoke('nutrition-item:update'),
    getAllNutritionItems: () => ipcRenderer.invoke('nutrition-item:getAll'),
    getNutritionItemById: () => ipcRenderer.invoke('nutrition-item:getById'),
    getNutritionItemsByDate: () => ipcRenderer.invoke('nutrition-item:getByDate'),
    markNutritionItemCompleted: () => ipcRenderer.invoke('nutrition-item:markCompleted'),
});
