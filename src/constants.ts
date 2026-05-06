import { Category, Item, RequestStatus, InventoryRequest } from './types';

export const CATEGORIES: Category[] = [
  { id: 'writing', name: '书写用具' },
  { id: 'paper', name: '纸张本册' },
  { id: 'desktop', name: '桌面办公' },
  { id: 'storage', name: '文件存储' },
  { id: 'electronics', name: '电子耗材' },
  { id: 'cleaning', name: '清洁卫生' },
];

// Generate ~60 items for a realistic demo
export const MOCK_ITEMS: Item[] = [
  { id: '1', name: '晨光中性笔 0.5mm 黑色', category: '书写用具', stock: 120, minStock: 50, unit: '支', price: 2.5, lastRestockDate: new Date() },
  { id: '2', name: '得力 A4 打印纸 80g', category: '纸张本册', stock: 15, minStock: 20, unit: '包', price: 25, lastRestockDate: new Date() },
  { id: '3', name: '齐心 订书机 大号', category: '桌面办公', stock: 8, minStock: 5, unit: '个', price: 15, lastRestockDate: new Date() },
  { id: '4', name: '广博 A4 文件夹 3寸', category: '文件存储', stock: 45, minStock: 30, unit: '个', price: 8, lastRestockDate: new Date() },
  { id: '5', name: '罗技 M170 无线鼠标', category: '电子耗材', stock: 3, minStock: 10, unit: '个', price: 49, lastRestockDate: new Date() },
  { id: '6', name: '维达 抽取式面巾纸 3层', category: '清洁卫生', stock: 80, minStock: 40, unit: '包', price: 4.5, lastRestockDate: new Date() },
  // ... more can be added algorithmically in the app or kept in state
];

for (let i = 7; i <= 60; i++) {
  const cat = CATEGORIES[i % CATEGORIES.length];
  MOCK_ITEMS.push({
    id: i.toString(),
    name: `${cat.name} 耗材 ${i}`,
    category: cat.name,
    stock: Math.floor(Math.random() * 100),
    minStock: 20,
    unit: '份',
    price: Math.floor(Math.random() * 100),
    lastRestockDate: new Date(),
  });
}

export const MOCK_REQUESTS: InventoryRequest[] = [
  { id: 'r1', itemId: '1', itemName: '晨光中性笔 0.5mm 黑色', userId: 'u1', userName: '张三', quantity: 5, status: RequestStatus.PENDING, requestDate: new Date() },
  { id: 'r2', itemId: '2', itemName: '得力 A4 打印纸 80g', userId: 'u2', userName: '李四', quantity: 2, status: RequestStatus.APPROVED, requestDate: new Date(Date.now() - 86400000), approvalDate: new Date() },
];
