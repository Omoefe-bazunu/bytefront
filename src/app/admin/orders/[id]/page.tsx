// src/app/admin/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Order not found.' });
        router.push('/admin');
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, router, toast]);

  const handleUpdateStatus = async (status: 'fulfilled' | 'cancelled') => {
    if (!order) return;
    setUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { status });
      setOrder(prev => prev ? { ...prev, status } : null);
      toast({ title: 'Success', description: `Order marked as ${status}.` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update order status.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!order || !window.confirm('Are you sure you want to delete this order? This action is permanent.')) return;
    setUpdating(true);
    try {
      await deleteDoc(doc(db, 'orders', order.id));
      toast({ title: 'Success', description: 'Order deleted.' });
      router.push('/admin');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete order.' });
    } finally {
        setUpdating(false);
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'fulfilled': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8"><Skeleton className="h-[500px] w-full" /></div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Order not found.</p>
        <Link href="/admin"><Button variant="link">Back to Admin</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
       <Link href="/admin" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to All Orders
       </Link>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-2xl">Order #{order.id.substring(0, 7)}</CardTitle>
                    <CardDescription>
                        Placed on {new Date(order.createdAt.seconds * 1000).toLocaleString()}
                    </CardDescription>
                  </div>
                   <Badge variant={getStatusVariant(order.status)} className="capitalize text-base px-4 py-1">{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-4">Items Ordered ({order.items.length})</h3>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image src={item.images[0]} alt={item.name} width={64} height={64} className="rounded-md" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₦{( (item.discountedPrice ?? item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
               <div className="flex justify-end space-y-2 text-right">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span> <span>₦{order.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Shipping:</span> <span>₦{order.shipping.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total:</span> <span>₦{order.total.toLocaleString()}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Name:</strong> {order.shippingInfo.name}</p>
              <p><strong>Email:</strong> {order.shippingInfo.email}</p>
              <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
              <Separator className="my-3"/>
              <p><strong>Address:</strong> {order.shippingInfo.address}</p>
              <p><strong>City:</strong> {order.shippingInfo.city}</p>
              <p><strong>State:</strong> {order.shippingInfo.state}</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle>Payment Receipt</CardTitle></CardHeader>
            <CardContent>
                <Link href={order.paymentReceiptUrl} target="_blank" rel="noopener noreferrer">
                    <Image src={order.paymentReceiptUrl} alt="Payment Receipt" width={300} height={400} className="w-full rounded-md object-contain border" />
                    <Button variant="outline" className="w-full mt-2">View Full Receipt <ExternalLink className="ml-2 h-4 w-4"/></Button>
                </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {order.status === 'pending' && (
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus('fulfilled')} disabled={updating}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Fulfilled
                </Button>
              )}
               <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={updating}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
