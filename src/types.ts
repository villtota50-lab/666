export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Item {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  lastRestockDate: Date;
}

export interface InventoryRequest {
  id: string;
  itemId: string;
  itemName: string;
  userId: string;
  userName: string;
  quantity: number;
  status: RequestStatus;
  requestDate: Date;
  approvalDate?: Date;
}

export interface Category {
  id: string;
  name: string;
}
