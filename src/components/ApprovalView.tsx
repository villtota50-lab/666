import React from 'react';
import { InventoryRequest, RequestStatus } from '@/src/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApprovalViewProps {
  requests: InventoryRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalView({ requests, onApprove, onReject }: ApprovalViewProps) {
  const pendingRequests = requests.filter(r => r.status === RequestStatus.PENDING);
  const historicRequests = requests.filter(r => r.status !== RequestStatus.PENDING);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" /> 待审批
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>申请人</TableHead>
                <TableHead>物品</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>申请时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.userName}</TableCell>
                  <TableCell>{req.itemName}</TableCell>
                  <TableCell>{req.quantity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(req.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => onApprove(req.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> 同意
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onReject(req.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> 拒绝
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pendingRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    暂无待处理申请
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm border-b pb-2">审批历史</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>申请人</TableHead>
                <TableHead>物品</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>完成时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicRequests.slice(0, 10).map(req => (
                <TableRow key={req.id}>
                  <TableCell>{req.userName}</TableCell>
                  <TableCell>{req.itemName}</TableCell>
                  <TableCell>
                    {req.status === RequestStatus.APPROVED ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">已同意</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700">已拒绝</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {req.approvalDate ? new Date(req.approvalDate).toLocaleDateString() : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
