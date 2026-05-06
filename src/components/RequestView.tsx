import React, { useState } from 'react';
import { Item, InventoryRequest, RequestStatus } from '@/src/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface RequestViewProps {
  items: Item[];
  onRequest: (requestId: string, quantity: number) => void;
}

export function RequestView({ items, onRequest }: RequestViewProps) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('');

  const selectedItem = items.find(i => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !userName || quantity <= 0) {
      toast.error("请填写完整申请信息");
      return;
    }
    
    if (selectedItem && quantity > selectedItem.stock) {
      toast.warning("库存不足，可能需要等待补货");
    }

    onRequest(selectedItemId, quantity);
    toast.success("申请已提交，请等待审批");
    setQuantity(1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>领用申请单</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">申请人</Label>
              <Input 
                id="user" 
                placeholder="请输入您的姓名" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item">物品搜索</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择要领用的物品" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} (当前库存: {item.stock} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">数量</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">提交申请</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium">领用需知</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. 请按需申请，避免物品闲置或浪费。</p>
          <p>2. 电子产品领用需额外提供主管签字。</p>
          <p>3. 审批通常在 1 个工作日内完成。</p>
        </CardContent>
      </Card>
    </div>
  );
}
