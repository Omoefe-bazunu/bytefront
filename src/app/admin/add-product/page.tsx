"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  Loader2,
  Trash2,
  Upload,
  Globe,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountedPrice: undefined,
      brand: "",
      category: "Laptops",
      supplierSource: "China", // ✅ Default
      warranty: "90 Days (3 Months)", // ✅ Default
      noShippingFee: true, // ✅ Default
      aiHint: "",
      specs: "",
      isFeatured: false,
      isNew: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles: File[] = [];
      let error = false;

      files.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `File ${file.name} is too large.`,
          });
          error = true;
        } else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `File ${file.name} has an invalid type.`,
          });
          error = true;
        }
      });

      if (error) return;
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (imageFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one product image.",
      });
      setLoading(false);
      return;
    }

    try {
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const storageRef = ref(storage, `products/${uuidv4()}-${file.name}`);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      const productId = uuidv4();

      const docData: any = {
        id: productId,
        name: values.name,
        description: values.description,
        price: values.price,
        brand: values.brand,
        category: values.category,
        supplierSource: values.supplierSource, // ✅ Added
        warranty: values.warranty, // ✅ Added
        noShippingFee: values.noShippingFee, // ✅ Added
        aiHint: values.aiHint,
        specs: values.specs,
        isFeatured: values.isFeatured,
        isNew: values.isNew,
        images: imageUrls,
        createdAt: serverTimestamp(),
      };

      if (values.discountedPrice && values.discountedPrice > 0) {
        docData.discountedPrice = values.discountedPrice;
      }

      await setDoc(doc(db, "products", productId), docData);

      toast({
        title: "Success!",
        description: "Product has been added successfully.",
      });
      router.push("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
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
            Add New <span className="text-[#FF6B00]">Product</span>
          </CardTitle>
          <CardDescription className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            System Entry Protocol: Hardware Manifest Acquisition
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Product Identity */}
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
                        placeholder="e.g., StellarBook Pro 15"
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
                        placeholder="Describe the product..."
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
                          placeholder="850000"
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
                        Discounted Price (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="825000"
                          {...field}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          className="rounded-none border-zinc-800 focus:border-[#FF6B00]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ✅ NEW: LOGISTICS & SOURCE BLOCK */}
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none border-zinc-800 focus:border-[#FF6B00]">
                            <SelectValue placeholder="Source Node" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-zinc-800 rounded-none text-white">
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
                          placeholder="Stellar"
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-none border-zinc-800 focus:border-[#FF6B00]">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-zinc-800 rounded-none text-white">
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

              {/* Images */}
              <div className="space-y-4">
                <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                  Product Images
                </FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative group border border-zinc-800 p-1"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview ${index}`}
                        className="w-full h-32 object-cover grayscale hover:grayscale-0 transition-all"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 hover:border-[#FF6B00] hover:bg-zinc-950 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-zinc-500" />
                    <span className="mt-2 text-[10px] uppercase font-bold text-zinc-500">
                      Upload
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
                      AI Hint for Images
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., laptop desk"
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
                name="specs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                      Specifications
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List product specifications here..."
                        className="min-h-[150px] rounded-none border-zinc-800 focus:border-[#FF6B00]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkboxes Area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-none border border-zinc-800 p-4 hover:border-zinc-500 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#FF6B00] border-zinc-700"
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest">
                        Featured Unit
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-none border border-zinc-800 p-4 hover:border-zinc-500 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#FF6B00] border-zinc-700"
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest">
                        New Arrival
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {/* ✅ NEW: NO SHIPPING FEE TAG */}
                <FormField
                  control={form.control}
                  name="noShippingFee"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-none border border-zinc-900 bg-zinc-950 p-4 hover:border-[#FF6B00] transition-colors border-dashed">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#FF6B00] border-zinc-700"
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00] flex items-center gap-2">
                        <Truck className="h-3 w-3" /> No Shipping Fee
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
                  "Deploy to Inventory"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
