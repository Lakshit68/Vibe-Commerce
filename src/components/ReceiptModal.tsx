import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    total: number;
    timestamp: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  } | null;
}

export const ReceiptModal = ({ isOpen, onClose, receipt }: ReceiptModalProps) => {
  if (!receipt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            Order Confirmed!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono font-semibold">{receipt.orderId.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-semibold">{receipt.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-semibold">{receipt.customerEmail}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-semibold">
                {new Date(receipt.timestamp).toLocaleDateString()} {new Date(receipt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Order Items:</h4>
            <div className="space-y-2">
              {receipt.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
