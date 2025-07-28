// src/app/admin/edit-product/[slug]/page.tsx
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
import { Loader2, Trash2, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  discountedPrice: z.coerce.number().optional(),
  brand: z.string().min(2, "Brand is required"),
  category: z.enum(["Laptops", "Smartphones", "Accessories"]),
  aiHint: z.string().min(2, "AI hint is required"),
  specs: z.string().min(10, "At least one specification is required"),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
  const [product, setProduct] = useState<Product | null>(null);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const productId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountedPrice: undefined,
      brand: "",
      category: "Laptops",
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
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = { id: docSnap.id, ...docSnap.data() } as Product;
        setProduct(productData);
        setImageUrls(productData.images || []);

        form.reset({
          ...productData,
          discountedPrice: productData.discountedPrice ?? undefined,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Product not found.",
        });
        router.push("/admin");
      }
      setPageLoading(false);
    };

    fetchProduct();
  }, [productId, form, router, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index: number) => {
    const imageUrlToRemove = imageUrls[index];
    try {
      const imageRef = ref(storage, imageUrlToRemove);
      await deleteObject(imageRef);
    } catch (error: any) {
      if (error.code !== "storage/object-not-found") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete existing image from storage.",
        });
        return;
      }
    }
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

      const docData: any = {
        name: values.name,
        description: values.description,
        price: values.price,
        brand: values.brand,
        category: values.category,
        aiHint: values.aiHint,
        specs: values.specs,
        isFeatured: values.isFeatured,
        isNew: values.isNew,
        images: finalImageUrls,
        createdAt: product.createdAt,
        updatedAt: serverTimestamp(),
      };

      // Handle discountedPrice explicitly
      if (values.discountedPrice && values.discountedPrice > 0) {
        docData.discountedPrice = values.discountedPrice;
      } else {
        docData.discountedPrice = deleteField(); // Remove the field if empty or invalid
      }

      await updateDoc(productRef, docData);

      toast({
        title: "Success!",
        description: "Product has been updated successfully.",
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
  if (pageLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Edit Product</CardTitle>
          <CardDescription>Update the details of the product.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., StellarBook Pro 15"
                        {...field}
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the product..."
                        {...field}
                        className="min-h-[150px]"
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
                      <FormLabel>Price (NGN)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="850000" {...field} />
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
                      <FormLabel>Discounted Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="825000"
                          {...field}
                          value={field.value ?? ""}
                          onChange={field.onChange}
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
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Stellar" {...field} />
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
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Laptops">Laptops</SelectItem>
                          <SelectItem value="Smartphones">
                            Smartphones
                          </SelectItem>
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

              <div className="space-y-4">
                <FormLabel>Product Images</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={url} className="relative group">
                      <Image
                        src={url}
                        alt={`product image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {newImageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview ${index}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md hover:bg-muted transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="mt-2 text-sm text-muted-foreground">
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
                    <FormLabel>AI Hint for Images</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., laptop desk" {...field} />
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
                    <FormLabel>Specifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List product specifications here. Use new lines for each spec. e.g.,&#10;- Display: 15-inch 4K&#10;- Processor: Core i9&#10;- RAM: 32GB"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-8">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Product</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>New Arrival</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-gradient"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Update Product"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
