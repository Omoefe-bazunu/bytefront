"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Terminal, Cpu, ArrowUpRight, Box, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          shippingInfo: doc.data().shippingInfo || { name: "N/A" },
          total: doc.data().total || 0,
          status: doc.data().status || "pending",
          createdAt: doc.data().createdAt || { seconds: 0, nanoseconds: 0 },
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching order logs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, router]);

  // Industrial Status Styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
      case "fulfilled":
        return "bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30";
      case "cancelled":
        return "bg-red-900/10 text-red-500 border-red-900/30";
      default:
        return "bg-zinc-900 text-zinc-500 border-zinc-800";
    }
  };

  return (
    <Card className="bg-black border-2 border-zinc-900 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-16">
        {/* Cyber Orange Top Progress Bar */}
        <div className="h-1 w-full bg-zinc-900">
          <div className="h-full bg-[#FF6B00] w-1/4 animate-pulse" />
        </div>

        <CardHeader className="p-8 border-b border-zinc-900 bg-zinc-950/50">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-[#FF6B00]" />
            <span className="font-sans text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">
              Orders
            </span>
          </div>
          <CardTitle className="font-display text-4xl font-black text-white uppercase tracking-tighter italic">
            Order <span className="text-zinc-700">Logs</span>
          </CardTitle>
          <CardDescription className="font-sans text-[10px] uppercase font-bold text-zinc-600 tracking-widest">
            Comprehensive record of Order request and fulfillment.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full bg-zinc-900 rounded-none" />
              <Skeleton className="h-12 w-full bg-zinc-900 rounded-none" />
              <Skeleton className="h-12 w-full bg-zinc-900 rounded-none" />
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-950">
                  <TableRow className="border-zinc-900 hover:bg-transparent">
                    <TableHead className="font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest py-4 pl-8">
                      Date
                    </TableHead>
                    <TableHead className="font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                      Amount
                    </TableHead>
                    <TableHead className="font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                      Order Status
                    </TableHead>
                    <TableHead className="text-right pr-8 font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                      Access
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-zinc-900 hover:bg-zinc-950 transition-colors group"
                    >
                      <TableCell className="pl-8 py-5">
                        <p className="font-mono text-xs text-zinc-400">
                          {new Date(
                            order.createdAt.seconds * 1000
                          ).toLocaleDateString()}
                        </p>
                        <p className="font-mono text-[9px] text-zinc-600 uppercase">
                          Unit_ID: {order.id.slice(-6)}
                        </p>
                      </TableCell>
                      <TableCell className="font-display text-lg font-black text-white italic">
                        ₦{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest",
                            getStatusStyles(order.status)
                          )}
                        >
                          <Activity className="h-2 w-2 mr-1.5" />
                          {order.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Link href={`/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none border-zinc-800 text-[9px] font-black uppercase tracking-widest bg-black hover:bg-[#FF6B00] hover:text-black hover:border-[#FF6B00] transition-all"
                          >
                            SEE DETAILS{" "}
                            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-20 px-8">
              <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Box className="h-8 w-8 text-zinc-700" />
              </div>
              <p className="font-display text-xl font-bold uppercase text-zinc-500 tracking-tighter mb-6">
                No Orders found
              </p>
              <Link href="/">
                <Button className="bg-[#FF6B00] hover:bg-white text-black font-black uppercase tracking-[0.2em] rounded-none px-8 py-6 text-xs transition-all">
                  Browse Products
                </Button>
              </Link>
            </div>
          )}
        </CardContent>

        {/* Footer System Status */}
        <div className="bg-zinc-950 p-4 border-t border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-2 opacity-30">
            <Cpu className="h-3 w-3 text-zinc-500" />
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Secure_Database_Active
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-700">
            Logs_Count: {orders.length}
          </span>
        </div>
      </div>
    </Card>
  );
}
