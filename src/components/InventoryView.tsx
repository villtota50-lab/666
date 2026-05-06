import React, { useState } from 'react';
import { Item } from '@/src/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InventoryViewProps {
  items: Item[];
  onRestock: (itemId: string, amount: number) => void;
}

export function InventoryView({ items, onRestock }: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-bottom flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="搜索物品名称或类别..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> 新增物品
          </Button>
        </div>
        
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>物品名称</TableHead>
                <TableHead>类别</TableHead>
                <TableHead className="text-right">当前库存</TableHead>
                <TableHead className="text-right">最低数量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right font-mono">{item.stock} {item.unit}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.minStock} {item.unit}</TableCell>
                  <TableCell>
                    {item.stock <= item.minStock ? (
                      <Badge variant="destructive">需补货</Badge>
                    ) : item.stock <= item.minStock * 1.5 ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">警戒</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700">充足</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRestock(item.id, 10)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-3 w-3 mr-1" /> 补货
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
