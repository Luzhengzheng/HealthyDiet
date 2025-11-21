import { ipcMain } from 'electron';

import { IpcChannels } from '../../types/ipc';

export function registerIpcHandlers() {
    // 注册 IPC 处理器
    ipcMain.handle('nutrition_item:add', async () => {});

    ipcMain.handle('nutrition_item:delete', async () => {});

    ipcMain.handle('nutrition_item:update', async () => {});

    ipcMain.handle('nutrition_item:getAll', async () => {});

    ipcMain.handle('nutrition_item:getById', async () => {});

    ipcMain.handle('nutrition_item:getByDate', async () => {});

    ipcMain.handle('nutrition_item:markCompleted', async () => {});

    ipcMain.handle('nutrition_stat:getColoriesGoal', async () => {});

    ipcMain.handle('nutrition_stat:setColoriesGoal', async () => {});

    ipcMain.handle('nutrition_stat:getTotalEnergyByDate', async () => {});
}
