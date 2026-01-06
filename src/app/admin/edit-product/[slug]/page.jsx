"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Upload,
  Globe,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  discountedPrice: z.coerce.number().optional(),
  brand: z.string().min(2, "Brand is required"),
  category: z.enum(["Laptops", "Smartphones", "Accessories"]),
  supplierSource: z.enum(["China", "Nigeria"]), // ✅ Added
  warranty: z.string().min(2, "Warranty info is required"), // ✅ Added
  noShippingFee: z.boolean().default(true), // ✅ Added
  aiHint: z.string().min(2, "AI hint is required"),
  specs: z.string().min(10, "At least one specification is required"),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const [imageUrls, setImageUrls] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const productId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountedPrice: undefined,
      brand: "",
      category: "Laptops",
      supplierSource: "China",
      warranty: "",
      noShippingFee: true,
      aiHint: "",
      specs: "",
      isFeatured: false,
      isNew: false,
    },
  });

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setPageLoading(true);
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          setImageUrls(productData.images || []);

          form.reset({
            ...productData,
            discountedPrice: productData.discountedPrice ?? undefined,
            supplierSource: productData.supplierSource || "China",
            warranty: productData.warranty || "",
            noShippingFee: productData.noShippingFee ?? true,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Product not found.",
          });
          router.push("/admin");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form, router, toast]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `File ${file.name} is too large.`,
          });
          return;
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `File ${file.name} has an invalid type.`,
          });
          return;
        }
      });
      setNewImageFiles((prev) => [...prev, ...files]);
    }
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index) => {
    const imageUrlToRemove = imageUrls[index];
    try {
      const imageRef = ref(storage, imageUrlToRemove);
      await deleteObject(imageRef);
    } catch (error) {
      console.warn("Storage delete failed or file missing.");
    }
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values) => {
    if (!product) return;
    setLoading(true);

    if (imageUrls.length + newImageFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Product must have at least one image.",
      });
      setLoading(false);
      return;
    }

    try {
      const newUploadedUrls = await Promise.all(
        newImageFiles.map(async (file) => {
          const storageRef = ref(storage, `products/${uuidv4()}-${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      const finalImageUrls = [...imageUrls, ...newUploadedUrls];
      const productRef = doc(db, "products", product.id);

      const docData = {
        ...values,
        images: finalImageUrls,
        updatedAt: serverTimestamp(),
      };

      if (!values.discountedPrice || values.discountedPrice <= 0) {
        docData.discountedPrice = deleteField();
      }

      await updateDoc(productRef, docData);

      toast({ title: "Success!", description: "Product updated." });
      router.push("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <Skeleton className="h-[600px] w-full max-w-4xl mx-auto rounded-none bg-zinc-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[#FF6B00] transition-colors group"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          RETURN_TO_ADMIN_CONTROL
        </Link>
      </div>

      <Card className="w-full max-w-4xl mx-auto border-2 border-zinc-900 rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b border-zinc-900 bg-zinc-950">
          <CardTitle className="text-3xl font-display font-black uppercase italic">
            Edit <span className="text-[#FF6B00]">Product</span>
          </CardTitle>
          <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            System Protocol: Hardware Configuration Update
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                      Product Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-zinc-800 focus:border-[#FF6B00]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[150px] rounded-none border-zinc-800 focus:border-[#FF6B00]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                        Price (NGN)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="rounded-none border-zinc-800 focus:border-[#FF6B00]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                        Discounted Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          className="rounded-none border-zinc-800 focus:border-[#FF6B00]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* LOGISTICS BLOCK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-zinc-950 border border-zinc-900 border-dashed">
                <FormField
                  control={form.control}
                  name="supplierSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00] flex items-center gap-2">
                        <Globe className="h-3 w-3" /> Supplier Source
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none border-zinc-800">
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-zinc-800 rounded-none text-white font-sans">
                          <SelectItem value="China">
                            China (Refurbished Factory)
                          </SelectItem>
                          <SelectItem value="Nigeria">
                            Nigeria (Lagos UK-Used)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00] flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3" /> Warranty Duration
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 90 Days (3 Months)"
                          {...field}
                          className="rounded-none border-zinc-800 focus:border-[#FF6B00]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                        Brand
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-none border-zinc-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-zinc-800 rounded-none text-white font-sans">
                          <SelectItem value="Laptops">Laptops</SelectItem>
                          <SelectItem value="Accessories">
                            Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* IMAGES */}
              <div className="space-y-4">
                <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                  Product Images
                </FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className="relative group border border-zinc-800 p-1"
                    >
                      <Image
                        src={url}
                        alt="Product"
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-none opacity-0 group-hover:opacity-100"
                        onClick={() => removeExistingImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {newImageFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative group border border-[#FF6B00]/50 p-1"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-none"
                        onClick={() => removeNewImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 hover:border-[#FF6B00] transition-colors"
                  >
                    <Upload className="h-6 w-6 text-zinc-500" />
                    <span className="mt-2 text-[10px] uppercase font-bold text-zinc-500">
                      Add More
                    </span>
                    <Input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleImageChange}
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    />
                  </Label>
                </div>
              </div>

              <FormField
                control={form.control}
                name="aiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                      AI Hint
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-zinc-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                      Specifications
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[150px] rounded-none border-zinc-800 focus:border-[#FF6B00]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 border border-zinc-800 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest">
                        Featured
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 border border-zinc-800 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest">
                        New Entry
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="noShippingFee"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 border border-zinc-900 bg-zinc-950 p-4 border-dashed">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00] flex items-center gap-2">
                        <Truck className="h-3 w-3" /> Free Shipping
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-[#FF6B00] hover:bg-white text-black rounded-none font-display text-xl font-black uppercase italic transition-all disabled:grayscale"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  "Commit Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
