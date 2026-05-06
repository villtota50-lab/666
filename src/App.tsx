/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardView } from '@/src/components/DashboardView';
import { InventoryView } from '@/src/components/InventoryView';
import { RequestView } from '@/src/components/RequestView';
import { ApprovalView } from '@/src/components/ApprovalView';
import { MOCK_ITEMS, MOCK_REQUESTS } from './constants';
import { Item, InventoryRequest, RequestStatus } from './types';
import { Toaster, toast } from 'sonner';
import { LayoutDashboard, BookOpen, Send, ShieldCheck, Warehouse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialization
  useEffect(() => {
    const savedItems = localStorage.getItem('erp_items');
    const savedRequests = localStorage.getItem('erp_requests');
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(MOCK_ITEMS);
    }

    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      setRequests(MOCK_REQUESTS);
    }
  }, []);

  // Persistence
  useEffect(() => {
    if (items.length > 0) localStorage.setItem('erp_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (requests.length > 0) localStorage.setItem('erp_requests', JSON.stringify(requests));
  }, [requests]);

  // Inventory Actions
  const handleRestock = (itemId: string, amount: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, stock: item.stock + amount, lastRestockDate: new Date() }
        : item
    ));
    const itemName = items.find(i => i.id === itemId)?.name;
    toast.success(`${itemName} 补货成功 (+${amount})`);
  };

  const handleRequest = (itemId: string, quantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newRequest: InventoryRequest = {
      id: Math.random().toString(36).substr(2, 9),
      itemId,
      itemName: item.name,
      userId: 'current-user',
      userName: '演示用户',
      quantity,
      status: RequestStatus.PENDING,
      requestDate: new Date(),
    };

    setRequests(prev => [newRequest, ...prev]);
  };

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const item = items.find(i => i.id === request.itemId);
    if (!item) return;

    if (item.stock < request.quantity) {
      toast.error(`库存不足：${item.name} 当前仅剩 ${item.stock} ${item.unit}`);
      return;
    }

    // 自动扣减库存 (Automatic Inventory)
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { ...i, stock: i.stock - request.quantity }
        : i
    ));

    // 更新申请状态
    setRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: RequestStatus.APPROVED, approvalDate: new Date() }
        : r
    ));

    toast.success(`申请已批准，${item.name} 库存已自动更新`);
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: RequestStatus.REJECTED, approvalDate: new Date() }
        : r
    ));
    toast.info("申请已驳回");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              办公用品 ERP 系统
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex gap-1 text-indigo-600 border-indigo-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              自动盘点已启用
            </Badge>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              管
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white p-1 rounded-xl shadow-sm border inline-flex">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 rounded-lg transition-all flex gap-2">
                <LayoutDashboard className="h-4 w-4" /> <span className="hidden sm:inline">仪表盘</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 rounded-lg transition-all flex gap-2">
                <BookOpen className="h-4 w-4" /> <span className="hidden sm:inline">库存目录</span>
              </TabsTrigger>
              <TabsTrigger value="request" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 rounded-lg transition-all flex gap-2">
                <Send className="h-4 w-4" /> <span className="hidden sm:inline">领用申请</span>
              </TabsTrigger>
              <TabsTrigger value="approval" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 rounded-lg transition-all flex gap-2">
                <ShieldCheck className="h-4 w-4" /> <span className="hidden sm:inline">审批中心</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="dashboard" className="mt-0">
                <DashboardView items={items} requests={requests} />
              </TabsContent>
              <TabsContent value="inventory" className="mt-0">
                <InventoryView items={items} onRestock={handleRestock} />
              </TabsContent>
              <TabsContent value="request" className="mt-0">
                <RequestView items={items} onRequest={handleRequest} />
              </TabsContent>
              <TabsContent value="approval" className="mt-0">
                <ApprovalView requests={requests} onApprove={handleApprove} onReject={handleReject} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2026 办公用品管理专家 | 自动盘点 · 智能预警 · 高效审批
        </div>
      </footer>
      
      <Toaster position="top-center" richColors />
    </div>
  );
}

