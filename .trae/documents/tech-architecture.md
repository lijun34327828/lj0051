## 1. 架构设计

```mermaid
graph TD
    subgraph 前端层
        A["React + Vite + Tailwind CSS"]
        B["爱好者端页面"]
        C["管理端页面"]
        D["状态管理 (Zustand)"]
    end
    
    subgraph 后端层
        E["Express.js (8811端口)"]
        F["预约管理API"]
        G["设备管理API"]
        H["天气数据API"]
        I["统计数据API"]
    end
    
    subgraph 数据层
        J["内存数据存储"]
        K["模拟数据"]
    end
    
    A --> B
    A --> C
    A --> D
    B --> E
    C --> E
    E --> F
    E --> G
    E --> H
    E --> I
    F --> J
    G --> J
    H --> J
    I --> J
    J --> K
```

## 2. 技术描述

- **前端**：React@18 + TypeScript + Vite + Tailwind CSS
- **状态管理**：Zustand
- **路由**：React Router DOM
- **图标**：Lucide React
- **后端**：Express@4（独立运行在 8811 端口）
- **数据**：内存存储 + Mock 数据
- **前端开发服务器**：Vite (3811端口)

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 爱好者首页（预约系统） |
| /admin | 管理端首页（数据看板与管理） |

## 4. API 定义

### 4.1 观测点位

```typescript
interface ObservationPoint {
  id: string;
  name: string;
  type: 'telescope' | 'indoor';
  x: number;
  y: number;
  status: 'available' | 'maintenance';
  isBooked?: boolean;
  isAvailable?: boolean;
}

GET /api/observation-points
GET /api/observation-points?date=YYYY-MM-DD&timeSlot=HH:MM-HH:MM
PUT /api/observation-points/:id
```

### 4.2 设备管理

```typescript
interface Equipment {
  id: string;
  name: string;
  category: 'telescope' | 'filter' | 'binocular' | 'accessory';
  total: number;
  available?: number;
  price: number;
  status: 'active' | 'inactive';
}

GET /api/equipment
GET /api/equipment?date=YYYY-MM-DD&timeSlot=HH:MM-HH:MM
POST /api/equipment
PUT /api/equipment/:id
```

### 4.3 天气数据

```typescript
interface WeatherData {
  date: string;
  condition: string;
  visibility: string;
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
  temperature: number;
  humidity: number;
  windSpeed: number;
}

GET /api/weather?date=YYYY-MM-DD
GET /api/weather/calendar?month=YYYY-MM
```

### 4.4 预约管理

```typescript
interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  pointId: string;
  userName: string;
  phone: string;
  equipment: { id: string; quantity: number }[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

GET /api/bookings
GET /api/bookings/:id
POST /api/bookings
DELETE /api/bookings/:id
```

### 4.5 季节定价

```typescript
interface SeasonPrice {
  id: string;
  name: string;
  months: number[];
  basePrice: number;
  pointMultiplier: number;
}

GET /api/season-prices
PUT /api/season-prices/:id
```

### 4.6 统计数据

```typescript
interface DashboardStats {
  today: {
    date: string;
    bookingCount: number;
    vacantPoints: number;
    totalPoints: number;
  };
  overall: {
    totalBookings: number;
    totalRevenue: number;
    totalEquipment: number;
    totalPoints: number;
  };
  recentBookings: Booking[];
}

GET /api/stats/dashboard
```

### 4.7 价格计算

```typescript
GET /api/price/calculate?date=YYYY-MM-DD&pointId=xxx
```

## 5. 服务端架构图

```mermaid
graph LR
    A["API路由层"] --> B["业务逻辑层"]
    B --> C["数据存储层"]
    
    subgraph API路由层
        A1["观测点位路由"]
        A2["设备管理路由"]
        A3["天气数据路由"]
        A4["预约管理路由"]
        A5["统计数据路由"]
    end
    
    subgraph 业务逻辑层
        B1["可用性检测"]
        B2["价格计算"]
        B3["冲突检测"]
    end
    
    subgraph 数据存储层
        C1["点位数据"]
        C2["设备数据"]
        C3["预约数据"]
        C4["天气数据"]
    end
```

## 6. 数据模型

### 6.1 数据模型关系

```mermaid
erDiagram
    OBSERVATION_POINT ||--o{ BOOKING : "被预约"
    EQUIPMENT ||--o{ BOOKING_EQUIPMENT : "被预约"
    BOOKING ||--o{ BOOKING_EQUIPMENT : "包含"
    SEASON_PRICE ||--o{ BOOKING : "定价"
    
    OBSERVATION_POINT {
        string id PK
        string name
        string type
        number x
        number y
        string status
    }
    
    EQUIPMENT {
        string id PK
        string name
        string category
        number total
        number price
        string status
    }
    
    BOOKING {
        string id PK
        string date
        string timeSlot
        string pointId FK
        string userName
        string phone
        number totalPrice
        string status
        string createdAt
    }
    
    BOOKING_EQUIPMENT {
        string bookingId FK
        string equipmentId FK
        number quantity
    }
    
    SEASON_PRICE {
        string id PK
        string name
        string months
        number basePrice
        number pointMultiplier
    }
```

### 6.2 项目目录结构

```
frontend/
├── src/
│   ├── components/       # 可复用组件
│   │   ├── FloorMap/    # 平面图组件
│   │   ├── Calendar/    # 日历组件
│   │   ├── EquipmentList/ # 设备列表
│   │   └── ...
│   ├── pages/           # 页面组件
│   │   ├── Home.tsx     # 爱好者首页
│   │   └── Admin.tsx    # 管理端首页
│   ├── stores/          # Zustand状态管理
│   ├── services/        # API服务
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tailwind.config.js
```
