// src/components/admin/admin-orders.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'fulfilled': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Orders</CardTitle>
        <CardDescription>View and manage all customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>
                    {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{order.shippingInfo.name}</TableCell>
                  <TableCell>₦{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No orders found yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
