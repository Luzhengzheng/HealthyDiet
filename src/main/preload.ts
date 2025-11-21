// Preload 脚本 - 待实现
import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  addNutritionItem: (item: any) => ipcRenderer.invoke('nutrition-item:add'),
  deleteNutritionItem: (id: string) =>
      ipcRenderer.invoke('nutrition-item:delete'),
  updateNutritionItem: (item: any) =>
      ipcRenderer.invoke('nutrition-item:update'),
  getAllNutritionItems: () => ipcRenderer.invoke('nutrition-item:getAll'),
  getNutritionItemById: (id: string) =>
      ipcRenderer.invoke('nutrition-item:getById'),
  getNutritionItemsByDate: (date: Date) =>
      ipcRenderer.invoke('nutrition-item:getByDate'),
  markNutritionItemCompleted: (id: string) =>
      ipcRenderer.invoke('nutrition-item:markCompleted')
});