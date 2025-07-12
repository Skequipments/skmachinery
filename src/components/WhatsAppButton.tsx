
'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhatsAppButton({ product }: { product: { title: string; price: number } }) {
  const handleWhatsAppOrder = () => {
    const phoneNumber = '9818900247';
    const message = `Hi, I want to order this product:\n\n*${product.title}*\n\n Product URL: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppOrder}
      className="bg-[hsl(var(--bonik-blue))] hover:bg-blue-950 text-white px-8 py-2 rounded flex items-center gap-2"
    >
      <ShoppingCart size={18} />
      Order on Whatsapp
    </Button>
  );
}
