import { ipcMain } from 'electron';

import { IpcChannels } from '../../types/ipc';

export const registerIpcHandlers = () => {
    // 注册 IPC 处理器
    ipcMain.handle('nutrition-item:add', async () => {});

    ipcMain.handle('nutrition-item:delete', async () => {});

    ipcMain.handle('nutrition-item:update', async () => {});

    ipcMain.handle('nutrition-item:getAll', async () => {});

    ipcMain.handle('nutrition-item:getById', async () => {});

    ipcMain.handle('nutrition-item:getByDate', async () => {});

    ipcMain.handle('nutrition-item:markCompleted', async () => {});

    ipcMain.handle('nutrition-item:getColoriesGoal', async () => {});

    ipcMain.handle('nutrition-item:setColoriesGoal', async () => {});
};
