"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Terminal,
  Cpu,
  Plus,
  Activity,
  Package,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrders from "@/components/admin/admin-orders";
import AdminMessages from "@/components/admin/admin-messages";
import AnalyticsDashboard from "../../components/admin/AnalyticsDashboard";

const ADMIN_EMAIL = "raniem57@gmail.com";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push("/login");
      return;
    }

    const fetchProducts = async () => {
      if (user) {
        setPageLoading(true);
        try {
          const querySnapshot = await getDocs(collection(db, "products"));
          const productsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(productsData);
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setPageLoading(false);
        }
      }
    };

    if (!authLoading && user) {
      fetchProducts();
    }
  }, [user, authLoading, router]);

  const handleDelete = async (productId) => {
    if (
      !window.confirm("CONFIRM_DELETION_PROTOCOL? This action is irreversible.")
    )
      return;

    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((p) => p.id !== productId));
      toast({
        title: "LOGGED: DELETED",
        description: "Product purged from database.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "SYSTEM_ERROR",
        description: "Failed to purge product.",
      });
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-[#FF6B00]">
        <Loader2 className="animate-spin mb-4" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Syncing_System_Access...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white pb-20">
      {/* --- ADMIN HEADER --- */}
      <section className="pt-12 pb-12 border-b border-zinc-900 bg-zinc-950">
        <div className="container max-w-screen-xl px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#FF6B00]/30 bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-black tracking-[0.3em] uppercase">
                <ShieldCheck className="h-3 w-3" /> System_Control_Center
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                ADMIN <span className="text-zinc-700">PANEL</span>
              </h1>
            </div>
            <Link href="/admin/add-product">
              <Button className="hover:bg-[#FF6B00] bg-white text-black rounded-none font-black uppercase tracking-widest text-[10px] px-8 py-7 transition-all">
                <Plus className="mr-2 h-4 w-4" /> Add PRODUCT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="container max-w-screen-xl px-4 py-12 mx-auto">
        <Tabs defaultValue="products" className="w-full">
          {/* --- INDUSTRIAL TAB LIST --- */}
          <TabsList className="flex flex-wrap h-auto bg-transparent border-b border-zinc-900 rounded-none gap-2 p-0 mb-12">
            {[
              { val: "products", label: "Inventory", icon: Package },
              { val: "orders", label: "Orders", icon: Activity },
              { val: "messages", label: "Messages", icon: MessageSquare },
              { val: "analytics", label: "Analytics", icon: Terminal },
            ].map((tab) => (
              <TabsTrigger
                key={tab.val}
                value={tab.val}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6B00] data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B00] text-zinc-500 font-mono text-[10px] uppercase tracking-widest px-6 py-4 transition-all hover:text-zinc-100"
              >
                <tab.icon className="mr-2 h-3.5 w-3.5" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* --- INVENTORY TAB --- */}
          <TabsContent value="products">
            <Card className="bg-zinc-950 border-2 border-zinc-900 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="p-8 border-b border-zinc-900">
                <CardTitle className="font-display text-3xl font-black uppercase italic">
                  Inventory_Manifest
                </CardTitle>
                <CardDescription className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                  Total Product in Inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-black">
                    <TableRow className="border-zinc-900 hover:bg-transparent">
                      <TableHead className="font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-8">
                        Unit_Name
                      </TableHead>
                      <TableHead className="font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                        Class
                      </TableHead>
                      <TableHead className="font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                        Payload_Value
                      </TableHead>
                      <TableHead className="font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                        Status
                      </TableHead>
                      <TableHead className="text-right pr-8 font-sans text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                        Access
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-zinc-900 hover:bg-zinc-900 transition-colors"
                      >
                        <TableCell className="font-bold pl-8 uppercase text-xs">
                          {product.name}
                        </TableCell>
                        <TableCell className="font-mono text-[10px] text-zinc-400 uppercase tracking-tighter">
                          {product.category}
                        </TableCell>
                        <TableCell className="font-display text-lg font-black italic">
                          ₦{product.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {product.isFeatured && (
                              <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-[#FF6B00] text-black border border-[#FF6B00]">
                                Featured
                              </span>
                            )}
                            {product.isNew && (
                              <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                                New_Entry
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 text-zinc-500 hover:text-white"
                              >
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-black border border-zinc-800 rounded-none text-white"
                            >
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/edit-product/${product.id}`}
                                  className="cursor-pointer text-xs uppercase font-bold py-3"
                                >
                                  <Pencil className="mr-2 h-3.5 w-3.5" />{" "}
                                  Edit_Data
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(product.id)}
                                className="text-red-500 focus:text-white focus:bg-red-600 cursor-pointer text-xs uppercase font-bold py-3"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />{" "}
                                Purge_Unit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- DEPLOYMENTS (ORDERS) --- */}
          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>

          {/* --- COMMS (MESSAGES) --- */}
          <TabsContent value="messages">
            <AdminMessages />
          </TabsContent>

          {/* --- INTELLIGENCE (ANALYTICS) --- */}
          <TabsContent
            value="analytics"
            className="animate-in fade-in duration-500"
          >
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-12 border-t border-zinc-900 bg-black opacity-30">
        <div className="container max-w-screen-xl px-4 mx-auto flex justify-center items-center gap-4">
          <Cpu className="h-3 w-3" />
          <span className="text-[8px] uppercase font-bold tracking-[0.4em]">
            System Control Node Active // Root_Access_Granted
          </span>
        </div>
      </footer>
    </div>
  );
}

// Internal icons helper for this page
function ShieldCheck(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Loader2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
