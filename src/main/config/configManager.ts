import { app } from 'electron';
import path from 'path';

interface AppConfig {
    database: { path: string; timeout: number };
    app: { name: string; version: string };
    ui: { theme: 'light' | 'dark'; dateFormat: string };
    nutrition: { dailyCalorieGoal: number };
}

class ConfigManager {
    private config: AppConfig;
    constructor() {
        this.config = {
            database: { path: '', timeout: 0 },
            app: { name: '', version: '' },
            ui: { theme: 'light', dateFormat: '' },
            nutrition: { dailyCalorieGoal: 0 },
        };
    }

    getConfig<T extends keyof AppConfig>(key: T): AppConfig[T] {
        return this.config[key];
    }

    setConfig<T extends keyof AppConfig>(key: T, value: AppConfig[T]): void {
        this.config[key] = value;
    }
}

export const configManager = new ConfigManager();
