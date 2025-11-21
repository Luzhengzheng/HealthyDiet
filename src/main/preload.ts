// Preload 脚本 - 待实现
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  addNutritionItem: () => ipcRenderer.invoke("nutrition-item:add"),
  deleteNutritionItem: () => ipcRenderer.invoke("nutrition-item:delete"),
  updateNutritionItem: () => ipcRenderer.invoke("nutrition-item:update"),
  getAllNutritionItems: () => ipcRenderer.invoke("nutrition-item:getAll"),
  getNutritionItemById: () => ipcRenderer.invoke("nutrition-item:getById"),
  getNutritionItemsByDate: () => ipcRenderer.invoke("nutrition-item:getByDate"),
  markNutritionItemCompleted: () =>
    ipcRenderer.invoke("nutrition-item:markCompleted"),
});
