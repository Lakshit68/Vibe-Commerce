-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for checkout receipts
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

-- Cart items are accessible by session
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (true);

-- Orders are accessible by session
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert mock products
INSERT INTO public.products (name, price, description, stock, image_url) VALUES
  ('Premium Wireless Headphones', 299.99, 'High-quality wireless headphones with noise cancellation', 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
  ('Smart Watch Pro', 399.99, 'Advanced fitness tracking and smart notifications', 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'),
  ('Laptop Stand', 79.99, 'Ergonomic aluminum laptop stand', 100, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
  ('Mechanical Keyboard', 149.99, 'RGB mechanical keyboard with custom switches', 45, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'),
  ('USB-C Hub', 59.99, 'Multi-port USB-C hub with 4K HDMI', 75, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'),
  ('Portable Charger', 49.99, '20000mAh fast charging power bank', 120, 'https://images.unsplash.com/photo-1609592806427-6e5a4ec8e6e6?w=500'),
  ('Wireless Mouse', 39.99, 'Ergonomic wireless mouse with precision tracking', 80, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'),
  ('Phone Case', 24.99, 'Premium protective phone case', 200, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500'),
  ('Desk Lamp', 89.99, 'LED desk lamp with adjustable brightness', 60, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'),
  ('Webcam HD', 129.99, '1080p HD webcam with auto-focus', 40, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500');