import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ReceiptModal } from "@/components/ReceiptModal";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Store } from "lucide-react";

const Index = () => {
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem("cart_session_id");
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem("cart_session_id", newId);
    return newId;
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch cart items
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products(name, price, image_url)
        `)
        .eq("session_id", sessionId);
      if (error) throw error;
      return data;
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      // Check if item already exists in cart
      const existingItem = cartItems.find((item: any) => item.product_id === productId);
      
      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({ product_id: productId, quantity, session_id: sessionId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
      toast({
        title: "Added to cart",
        description: "Product added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
      toast({
        title: "Item removed",
        description: "Product removed from cart",
      });
    },
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      const total = cartItems.reduce(
        (sum: number, item: any) => sum + item.product.price * item.quantity,
        0
      );

      const items = cartItems.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { data, error } = await supabase
        .from("orders")
        .insert({
          session_id: sessionId,
          customer_name: name,
          customer_email: email,
          total,
          items,
        })
        .select()
        .single();

      if (error) throw error;

      // Clear cart after successful checkout
      await supabase.from("cart_items").delete().eq("session_id", sessionId);

      return {
        orderId: data.id,
        customerName: name,
        customerEmail: email,
        total,
        timestamp: data.created_at,
        items,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
      setIsCheckoutOpen(false);
      setReceipt(data);
      setIsReceiptOpen(true);
      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const cartTotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Vibe Commerce</h1>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {cartItems.length} items
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Featured Products</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(productId, quantity) =>
                    addToCartMutation.mutate({ productId, quantity })
                  }
                />
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Cart
                items={cartItems}
                onUpdateQuantity={(itemId, quantity) =>
                  updateQuantityMutation.mutate({ itemId, quantity })
                }
                onRemoveItem={(itemId) => removeItemMutation.mutate(itemId)}
                onCheckout={() => setIsCheckoutOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Form */}
      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={(data) => checkoutMutation.mutate(data)}
        total={cartTotal}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={receipt}
      />
    </div>
  );
};

export default Index;
