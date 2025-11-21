# HealthyDiet 软件设计方案

本软件使用 `Electron` + `TypeScript` 。这个软件结合了待办事项的功能（添加、删除、打勾、修改）和营养分析（能量统计）。

## 1. 核心需求分析

- 待办事项功能：
    - 添加新的营养项（食物/餐食）。
    - 删除现有营养项。
    - 标记营养项为已完成（“打勾”），并记录完成时间。
    - 修改营养项的详细信息。
    - 显示所有营养项的列表。
- 营养分析功能：
    - 每个营养项应包含名称、数量、单位、单位能量（例如：每 100 克多少卡路里）。
    - 当营养项被标记为“完成”时，计算并累加其总能量。
    - 显示已完成营养项的总能量统计（例如：当日总摄入能量）。
- 辅助功能:
    - 日期选择器：允许用户查看不同日期的营养项和能量统计。
    - 常用营养项模板：预设一些常见食物(比如米饭,面包,蛋类,奶类,肉类)，方便快速添加。
    - 单位转换：支持不同单位之间的转换（如克与千克，毫升与升,cal 与 kcal 等）。
    - 自定义标签：允许用户为营养项添加标签（如早餐、午餐、晚餐、零食等），以便分类查看。
- 技术栈： `Electron` (桌面应用), `TypeScript` (强类型), 前端框架 `Vue`。

## 2. 软件架构设计 (`Electron` 特性)

`Electron` 应用通常分为两个主要进程：

- 主进程 (`Main Process`):
    - 负责创建和管理浏览器窗口。
    - 处理原生桌面功能（如菜单、通知、文件系统访问）。
    - 管理应用生命周期。
    - 数据持久化层： 负责与本地数据库（如 `SQLite`）交互，进行数据的增删改查。
    - `IPC` (`Inter-Process Communication`) 处理器： 接收渲染进程的请求，执行相应的业务逻辑和数据操作，并将结果返回。

- 渲染进程 (`Renderer Process`):
    - 运行用户界面 (`UI`)，本质上是一个 `Chromium` 浏览器实例。
    - 使用 `HTML`, `CSS`, `JavaScript`/`TypeScript` 和前端框架构建。
    - 通过 `IPC` 与主进程通信，请求数据或执行需要原生能力的操作。
    - 不直接访问 `Node.js API`： 为了安全，渲染进程不应直接访问 `Node.js API`。通过 `contextBridge` 在 `preload` 脚本中安全地暴露主进程提供的功能。

## 3. 数据模型设计 (`TypeScript` 接口)

定义营养项的数据结构：

```typescript
1 interface NutritionItem {
2   id?: number; // 唯一标识符，数据库自动生成
3   name: string; // 食物或餐食名称，例如 "燕麦粥", "鸡胸肉沙拉"
4   quantity: number; // 数量，例如 100, 1
5   unit: string; // 单位，例如 "g", "ml", "份", "碗"
6   energyPerUnit: number; // 每单位的能量（卡路里），例如 3.5 (表示每g 3.5 kcal)
7   isCompleted: boolean; // 是否已完成（已摄入），布尔值
8   completionDate?: string; // 完成日期，ISO 格式字符串，如果未完成则为 null
9   creationDate: string; // 创建日期，ISO 格式字符串
10   notes?: string; // 备注，可选
11 }
```

## 4. 数据库设计 (`SQLite`)

考虑到数据量不大且需要本地持久化，`SQLite` 是一个非常好的选择。

- 数据库文件： `nutrition.db` (可以放在用户数据目录，如 `app.getPath('userData')`)
- 表名： `nutrition_items`
- 表结构：

```sql
1     CREATE TABLE IF NOT EXISTS nutrition_items (
2         id INTEGER PRIMARY KEY AUTOINCREMENT,
3         name TEXT NOT NULL,
4         quantity REAL NOT NULL,
5         unit TEXT NOT NULL,
6         energy_per_unit REAL NOT NULL,
7         is_completed INTEGER NOT NULL DEFAULT 0, -- 0 for false, 1 for true
8         completion_date TEXT, -- ISO date string, nullable
9         creation_date TEXT NOT NULL, -- ISO date string
10         notes TEXT
11     );
```

## 5. 用户界面 (`UI/UX`) 设计

- 主界面布局：
    - 顶部导航/日期选择器： 允许用户选择查看特定日期的营养项。
    - 添加项区域： 一个表单，用于输入新的营养项的名称、数量、单位、单位能量。
    - 营养项列表：
        - 显示所有营养项，每项一行。
        - 每行包含：一个复选框（用于“打勾”）、项名称、数量、单位、计算出的单项总能量。
        - 编辑按钮和删除按钮。
        - 可以根据完成状态、日期等进行筛选和排序。
    - 能量统计区域：
        - 清晰地显示当前日期（或选定日期范围）内所有已完成营养项的总能量（卡路里）。
        - 可以显示其他宏量营养素（蛋白质、脂肪、碳水化合物）的统计（可选，高级功能）。

- 交互流程：
    - 添加项： 用户在添加区域输入信息，点击“添加”按钮，新项出现在列表中。
    - 打勾/取消打勾： 用户点击复选框，项的状态更新，如果变为“完成”，则总能量统计会实时更新。
    - 修改项： 用户点击“编辑”按钮，可能弹出一个模态框或在添加区域加载该项信息进行修改，保存后列表更新。
    - 删除项： 用户点击“删除”按钮，项从列表中移除，如果该项已完成，总能量统计会相应减少。

## 6. 技术栈选择与实现细节

- 前端框架 (`Renderer Process`):
    - `Vue` + `TypeScript`: 组件化开发，生态系统成熟。
        - 状态管理： 对于这种规模的应用，`useState` 和 `useContext` 配合使用可能就足够了。如果应用复杂，可以考虑 `Zustand` 或 `Redux Toolkit`。
        - `UI` 组件库： `Material-UI (MUI)` 或 `Ant Design` 可以快速构建美观且响应式的界面。
    - 构建工具： `Vite` (配合 `electron-vite` 模板) 可以提供极快的开发体验和构建速度。

- 数据库驱动 (`Main Process`):
    - `sqlite3` (`Node.js` 模块): 用于与 `SQLite` 数据库交互。需要注意 `Electron` 环境下原生模块的编译问题，`electron-builder` 或 `electron-rebuild` 可以帮助解决。
    - 使用 `ORM`: `Drizzle` 轻量化,0 运行时代理,集成 `ts` 类型支持,与 `sqlite3` 兼容。

- `IPC` 通信 (`Main` <-> `Renderer`):
    - `preload.ts` 脚本： 在这里使用 `contextBridge` 安全地暴露主进程的功能给渲染进程。

- `npm` 依赖项:
    - `Electron` 相关: `electron`, `electron-builder`, `electron-rebuild`
    - `TypeScript` 相关: `typescript`, `@types/node`
    - 前端框架相关: `vue`, `@vue/compiler-sfc`
    - `UI` 组件库: `ant-design-vue`
    - 前端构建工具: `vite`, `electron-vite`
    - 数据库与 `ORM`: `better-sqlite3`, `drizzle-orm`
    - 语义化版本控制: `standard-version`

```typescript
1     // preload.ts 示例
2     import { contextBridge, ipcRenderer } from 'electron';
3
4     contextBridge.exposeInMainWorld('api', {
5       addItem: (item: Omit<NutritionItem, 'id' | 'creationDate'>) => ipcRenderer.invoke('add-item', item),
6       updateItem: (item: NutritionItem) => ipcRenderer.invoke('update-item', item),
7       deleteItem: (id: number) => ipcRenderer.invoke('delete-item', id),
8       toggleItemCompletion: (id: number, isCompleted: boolean) => ipcRenderer.invoke('toggle-item-completion', id, isCompleted),
9       getAllItems: (date?: string) => ipcRenderer.invoke('get-all-items', date),
10       getTotalEnergy: (date?: string) => ipcRenderer.invoke('get-total-energy', date),
11       // ... 其他需要暴露的 API
12     });
```

- 主进程中的 IPC 处理器：

```typescript
1     // main.ts 示例
2     import { ipcMain } from 'electron';
3     import { db } from './database'; // 假设你的数据库操作封装在 database.ts 中
4
5     ipcMain.handle('add-item', async (event, item) => {
6       // 验证 item 数据
7       const newItem = { ...item, creationDate: new Date().toISOString(), isCompleted: false };
8       return db.run('INSERT INTO nutrition_items (...) VALUES (...)', [...Object.values(newItem)]);
9     });
10
11     ipcMain.handle('toggle-item-completion', async (event, id, isCompleted) => {
12       const completionDate = isCompleted ? new Date().toISOString() : null;
13       return db.run('UPDATE nutrition_items SET is_completed = ?, completion_date = ? WHERE id = ?', [isCompleted ? 1 : 0, completionDate, id]);
14     });
15
16     ipcMain.handle('get-total-energy', async (event, date) => {
17       // 根据日期查询已完成的项，并计算总能量
18       const rows = await db.all('SELECT quantity, energy_per_unit FROM nutrition_items WHERE is_completed = 1 AND completion_date LIKE ?', [`${date}%`]);
19       return rows.reduce((sum, row) => sum + (row.quantity * row.energy_per_unit), 0);
20     });
21     // ... 其他 IPC 处理器
```

## 7. 核心业务逻辑

- 能量计算：
    - 当用户添加或修改营养项时，确保 `quantity` 和 `energyPerUnit` 是有效的数字。
    - 当一个项被标记为“完成”时，其贡献的能量为 `quantity * energyPerUnit`。
    - 总能量统计需要查询数据库中所有 `is_completed = 1` 的项，并累加它们的能量。如果需要按日期统计，则需要根据 `completion_date` 字段进行过滤。

- 数据验证： 在主进程接收到渲染进程的数据时，进行严格的数据验证，防止无效数据写入数据库。

- 错误处理： 数据库操作、`IPC` 通信都应有适当的错误处理机制，向用户提供友好的反馈。

## 8. 开发流程

1. 项目初始化： 使用 `electron-vite` 模板快速搭建 `Electron` + `TypeScript` + `Vue` 项目。
2. 主进程开发：
    - 设置 `main.ts` 和 `preload.ts`。
    - 实现 `database.ts` 模块，包括数据库初始化和 `CRUD` 操作。
    - 在 `main.ts` 中注册所有 `IPC` 处理器。
3. 渲染进程开发：
    - 设计 `UI` 组件，实现主界面布局。
    - 使用 `window.api` 调用主进程提供的功能。
    - 实现前端状态管理，确保 `UI` 能够响应数据变化。
4. 测试：(可选项,非优先)
    - 单元测试：针对主进程的数据库操作和业务逻辑。
    - 集成测试：测试主进程和渲染进程之间的 `IPC` 通信。
    - 端到端测试：使用 `Spectron` 等工具测试整个 `Electron` 应用。
5. 打包发布： 使用 `electron-builder` 配置和打包应用，生成适用于不同操作系统的安装包。

## 9. 安全性考虑 (`Electron` 关键)

- 启用 `contextIsolation`： 在 `BrowserWindow` 的 `webPreferences` 中始终设置为 `true`。这是 `Electron` 最重要的安全特性之一。
- 禁用 `nodeIntegration`： 在 `BrowserWindow` 的 `webPreferences` 中始终设置为 `false`。
- 使用 `preload` 脚本和 `contextBridge`： 这是在渲染进程中安全地暴露主进程功能的唯一推荐方式。只暴露你需要的功能，并且对暴露的函数进行严格的参数验证和沙盒化。
- 输入验证： 任何从渲染进程发送到主进程的数据都必须在主进程中进行严格验证，以防止恶意输入或意外错误。

## 10. 架构与设计模式详解

### 10.1 分层架构概述

本应用采用标准的分层架构，确保代码的可维护性、可测试性和可扩展性：

- **Entity Layer**: 数据库映射对象（与数据库结构对应）
- **DTO Layer**: 数据传输对象（`IPC` 通信用）
- **Repository Layer**: 数据访问层（封装数据库操作）
- **Service Layer**: 业务逻辑层（核心业务规则）
- **IPC Layer**: 进程间通信层（主进程与渲染进程通信）
- **UI Layer**: 用户界面层（`Vue` 组件）

### 10.2 详细架构设计

#### 1. Entity 与 DTO 分离模式

**Entity - 数据库映射对象**

```typescript
// 与数据库结构一一对应
interface NutritionItemEntity {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    energy_per_unit: number; // 数据库中使用蛇形命名
    is_completed: number; // 数据库中用 0/1 表示布尔值
    completion_date: string | null;
    creation_date: string;
    notes: string | null;
}
```

**DTO - 数据传输对象**

```typescript
// 用于 IPC 通信和外部接口
interface NutritionItemDTO {
    id?: number;
    name: string;
    quantity: number;
    unit: string;
    energyPerUnit: number; // 使用驼峰命名
    isCompleted: boolean; // DTO 中用布尔值
    completionDate?: string;
    creationDate?: string;
    notes?: string;
}

// 创建请求 DTO（不包含自动生成的字段）
type CreateNutritionItemRequest = Omit<NutritionItemDTO, 'id' | 'creationDate' | 'isCompleted' | 'completionDate'>;

// 更新请求 DTO（所有字段可选）
type UpdateNutritionItemRequest = Partial<CreateNutritionItemRequest>;
```

**转换器函数**

```typescript
const entityToDTO = (entity: NutritionItemEntity): NutritionItemDTO => ({
    id: entity.id,
    name: entity.name,
    quantity: entity.quantity,
    unit: entity.unit,
    energyPerUnit: entity.energy_per_unit,
    isCompleted: entity.is_completed === 1,
    completionDate: entity.completion_date || undefined,
    creationDate: entity.creation_date,
    notes: entity.notes || undefined,
});

const dtoToEntity = (dto: CreateNutritionItemRequest): Omit<NutritionItemEntity, 'id'> => ({
    name: dto.name,
    quantity: dto.quantity,
    unit: dto.unit,
    energy_per_unit: dto.energyPerUnit,
    is_completed: 0,
    completion_date: null,
    creation_date: new Date().toISOString(),
    notes: dto.notes || null,
});
```

#### 2. Repository 模式（数据访问层）

```typescript
class NutritionRepository {
    // 封装所有数据库操作，便于测试和切换数据库

    async create(data: Omit<NutritionItemEntity, 'id'>): Promise<NutritionItemEntity> {
        // 调用数据库驱动插入数据
    }

    async findById(id: number): Promise<NutritionItemEntity | null> {
        // 按 ID 查询单个项
    }

    async findByDate(date: string): Promise<NutritionItemEntity[]> {
        // 按日期查询，根据 creation_date 过滤
    }

    async findAll(): Promise<NutritionItemEntity[]> {
        // 查询所有项
    }

    async update(id: number, data: Partial<NutritionItemEntity>): Promise<NutritionItemEntity> {
        // 更新项
    }

    async delete(id: number): Promise<void> {
        // 删除项
    }

    async findCompletedByDate(date: string): Promise<NutritionItemEntity[]> {
        // 查询特定日期内已完成的项
    }
}
```

#### 3. Service 层架构（业务逻辑）

```typescript
class NutritionService {
    constructor(
        private repository: NutritionRepository,
        private logger: Logger,
    ) {}

    // 单一职责原则：业务逻辑与数据库操作分离

    async createItem(request: CreateNutritionItemRequest): Promise<NutritionItemDTO> {
        this.logger.info('Creating nutrition item', { name: request.name });

        // 数据验证
        this.validateRequest(request);

        // 转换 DTO 为 Entity
        const entityData = dtoToEntity(request);

        // 调用 Repository 执行数据库操作
        const entity = await this.repository.create(entityData);

        // 转换 Entity 为 DTO 返回
        this.logger.info('Item created successfully', { id: entity.id });
        return entityToDTO(entity);
    }

    async updateItem(id: number, request: UpdateNutritionItemRequest): Promise<NutritionItemDTO> {
        this.logger.info('Updating nutrition item', { id, data: request });

        this.validateRequest(request);

        const updateData: Partial<NutritionItemEntity> = {
            name: request.name,
            quantity: request.quantity,
            unit: request.unit,
            energy_per_unit: request.energyPerUnit,
            notes: request.notes,
        };

        const entity = await this.repository.update(id, updateData);
        this.logger.info('Item updated successfully', { id });
        return entityToDTO(entity);
    }

    async toggleCompletion(id: number, isCompleted: boolean): Promise<void> {
        this.logger.info('Toggling item completion', { id, isCompleted });

        const completionDate = isCompleted ? new Date().toISOString() : null;
        await this.repository.update(id, {
            is_completed: isCompleted ? 1 : 0,
            completion_date: completionDate,
        });

        this.logger.info('Item completion toggled', { id });
    }

    async deleteItem(id: number): Promise<void> {
        this.logger.info('Deleting nutrition item', { id });
        await this.repository.delete(id);
        this.logger.info('Item deleted successfully', { id });
    }

    async getItemsByDate(date: string): Promise<NutritionItemDTO[]> {
        const entities = await this.repository.findByDate(date);
        return entities.map(entityToDTO);
    }

    async calculateTotalEnergy(date: string): Promise<number> {
        const items = await this.getItemsByDate(date);
        return items
            .filter((item) => item.isCompleted)
            .reduce((sum, item) => sum + item.quantity * item.energyPerUnit, 0);
    }

    private validateRequest(request: any): void {
        if (!request.name?.trim()) {
            throw new Error('食物名称不能为空');
        }
        if (request.quantity <= 0) {
            throw new Error('数量必须大于 0');
        }
        if (request.energyPerUnit < 0) {
            throw new Error('能量值不能为负数');
        }
    }
}
```

#### 4. IPC 通道类型安全（Type-Safe IPC）

```typescript
// types/ipc.ts - 定义类型安全的 IPC 通道

export interface IpcChannels {
    'nutrition:add': {
        request: CreateNutritionItemRequest;
        response: NutritionItemDTO;
    };
    'nutrition:update': {
        request: { id: number; data: UpdateNutritionItemRequest };
        response: NutritionItemDTO;
    };
    'nutrition:delete': {
        request: number; // id
        response: void;
    };
    'nutrition:toggle': {
        request: { id: number; isCompleted: boolean };
        response: void;
    };
    'nutrition:getByDate': {
        request: string; // date (YYYY-MM-DD)
        response: NutritionItemDTO[];
    };
    'nutrition:getTotalEnergy': {
        request: string; // date (YYYY-MM-DD)
        response: number;
    };
    'nutrition:getAll': {
        request: void;
        response: NutritionItemDTO[];
    };
}

// 类型安全的 IPC 处理器定义
type IpcHandler<T extends keyof IpcChannels> = (
    event: IpcMainInvokeEvent,
    args: IpcChannels[T]['request'],
) => Promise<IpcChannels[T]['response']>;
```

**主进程 IPC 注册（main.ts）**

```typescript
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IpcChannels } from '../types/ipc';

type IpcHandler<T extends keyof IpcChannels> = (
    event: IpcMainInvokeEvent,
    args: IpcChannels[T]['request'],
) => Promise<IpcChannels[T]['response']>;

// 注册类型安全的 IPC 处理器
ipcMain.handle<'nutrition:add'>('nutrition:add', async (event, request) => {
    return await nutritionService.createItem(request);
});

ipcMain.handle<'nutrition:update'>('nutrition:update', async (event, { id, data }) => {
    return await nutritionService.updateItem(id, data);
});

ipcMain.handle<'nutrition:delete'>('nutrition:delete', async (event, id) => {
    await nutritionService.deleteItem(id);
});

ipcMain.handle<'nutrition:toggle'>('nutrition:toggle', async (event, { id, isCompleted }) => {
    await nutritionService.toggleCompletion(id, isCompleted);
});

ipcMain.handle<'nutrition:getByDate'>('nutrition:getByDate', async (event, date) => {
    return await nutritionService.getItemsByDate(date);
});

ipcMain.handle<'nutrition:getTotalEnergy'>('nutrition:getTotalEnergy', async (event, date) => {
    return await nutritionService.calculateTotalEnergy(date);
});
```

**preload.ts 脚本**

```typescript
import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannels } from '../types/ipc';

type InvokeHandler<T extends keyof IpcChannels> = (
    args: IpcChannels[T]['request'],
) => Promise<IpcChannels[T]['response']>;

// 类型安全的 IPC 调用包装
const createInvokeHandler = <T extends keyof IpcChannels>(channel: T): InvokeHandler<T> => {
    return (args) => ipcRenderer.invoke(channel, args);
};

contextBridge.exposeInMainWorld('api', {
    nutrition: {
        add: createInvokeHandler('nutrition:add'),
        update: createInvokeHandler('nutrition:update'),
        delete: createInvokeHandler('nutrition:delete'),
        toggle: createInvokeHandler('nutrition:toggle'),
        getByDate: createInvokeHandler('nutrition:getByDate'),
        getTotalEnergy: createInvokeHandler('nutrition:getTotalEnergy'),
    },
});

// 渲染进程中的使用示例：
// const item = await window.api.nutrition.add({ name: '燕麦粥', quantity: 100, unit: 'g', energyPerUnit: 3.5, notes: '' });
```

#### 5. 错误处理规范（Result/Either 模式）

```typescript
// types/result.ts

type Result<T, E = AppError> = { ok: true; value: T } | { ok: false; error: E };

interface AppError {
    code: string;
    message: string;
    statusCode: number;
}

// 在 Service 中使用 Result 模式
class NutritionService {
    async createItem(request: CreateNutritionItemRequest): Promise<Result<NutritionItemDTO>> {
        try {
            this.validateRequest(request);
            const entityData = dtoToEntity(request);
            const entity = await this.repository.create(entityData);
            return { ok: true, value: entityToDTO(entity) };
        } catch (error) {
            this.logger.error('Failed to create item', error as Error);
            return {
                ok: false,
                error: {
                    code: 'CREATE_ITEM_FAILED',
                    message: (error as Error).message,
                    statusCode: 500,
                },
            };
        }
    }
}

// preload.ts 中处理 Result
contextBridge.exposeInMainWorld('api', {
    nutrition: {
        add: async (item: CreateNutritionItemRequest) => {
            const result = await ipcRenderer.invoke('nutrition:add', item);
            if (!result.ok) {
                throw new Error(result.error.message);
            }
            return result.value;
        },
    },
});
```

#### 6. 配置管理（Configuration Pattern）

```typescript
// main/config/configManager.ts

import { app } from 'electron';
import path from 'path';

interface AppConfig {
    database: {
        path: string;
        timeout: number;
    };
    app: {
        name: string;
        version: string;
    };
    ui: {
        theme: 'light' | 'dark';
        dateFormat: string;
    };
}

class ConfigManager {
    private config: AppConfig;

    constructor() {
        this.config = {
            database: {
                path: path.join(app.getPath('userData'), 'nutrition.db'),
                timeout: 5000,
            },
            app: {
                name: 'Nutrition Tracker',
                version: '1.0.0',
            },
            ui: {
                theme: 'light',
                dateFormat: 'YYYY-MM-DD',
            },
        };
    }

    get<T extends keyof AppConfig>(key: T): AppConfig[T] {
        return this.config[key];
    }

    set<T extends keyof AppConfig>(key: T, value: AppConfig[T]): void {
        this.config[key] = value;
    }
}

export const configManager = new ConfigManager();
```

#### 7. 日志和监控（Logging Pattern）

```typescript
// main/utils/logger.ts

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDev = process.env.NODE_ENV === 'development';

    info(message: string, context?: LogContext): void {
        console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
    }

    error(message: string, error?: Error | string): void {
        console.error(`[ERROR] ${message}`, error instanceof Error ? error.stack : error);
    }

    warn(message: string, context?: LogContext): void {
        console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
    }

    debug(message: string, context?: LogContext): void {
        if (this.isDev) {
            console.debug(`[DEBUG] ${message}`, context ? JSON.stringify(context) : '');
        }
    }
}

// 在 Service 中使用
class NutritionService {
    constructor(
        private repository: NutritionRepository,
        private logger: Logger,
    ) {}

    async createItem(request: CreateNutritionItemRequest): Promise<NutritionItemDTO> {
        this.logger.info('Creating nutrition item', { name: request.name });
        try {
            this.validateRequest(request);
            const entityData = dtoToEntity(request);
            const entity = await this.repository.create(entityData);
            const dto = entityToDTO(entity);
            this.logger.info('Item created successfully', {
                id: dto.id,
                name: dto.name,
            });
            return dto;
        } catch (error) {
            this.logger.error('Failed to create item', error as Error);
            throw error;
        }
    }
}
```

### 8. 代码组织结构

```plaintext
src/
├── main/
│   ├── services/
│   │   └── NutritionService.ts
│   ├── repositories/
│   │   └── NutritionRepository.ts
│   ├── database/
│   │   ├── Database.ts
│   │   └── migrations.ts
│   ├── ipc/
│   │   └── handlers.ts
│   ├── config/
│   │   └── configManager.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── preload.ts
│   └── main.ts
├── renderer/
│   ├── components/
│   │   ├── NutritionForm.vue          # 添加/编辑表单
│   │   ├── NutritionList.vue          # 营养项列表
│   │   └── EnergyStats.vue            # 能量统计
│   ├── composables/
│   │   └── useNutritionAPI.ts         # 组合式 API，类似 hooks
│   ├── pages/
│   │   └── Home.vue                   # 主页
│   ├── App.vue                        # 应用根组件
│   └── main.ts                        # Vue 入口
├── types/
│   ├── ipc.ts
│   ├── entities.ts
│   ├── dtos.ts
│   └── result.ts
└── config/
    └── electron-builder.json
```

### 9. 关键设计模式总结

| 模式                | 用途                       | 位置                         |
| ------------------- | -------------------------- | ---------------------------- |
| **DTO 模式**        | 隔离内部数据模型与外部通信 | `types/dtos.ts`              |
| **Repository 模式** | 集中化数据访问逻辑         | `main/repositories/`         |
| **Service 层**      | 包含核心业务逻辑和验证     | `main/services/`             |
| **类型安全的 IPC**  | 编译时检查 IPC 通信        | `types/ipc.ts` + `main/ipc/` |
| **Result 模式**     | 统一错误处理               | `types/result.ts`            |
| **配置管理**        | 集中管理应用配置           | `main/config/`               |
| **日志系统**        | 追踪应用运行状态           | `main/utils/logger.ts`       |
