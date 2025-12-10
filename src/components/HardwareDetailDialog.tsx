import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface HardwareDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  component: {
    name: string;
    description: string;
    longDescription: string;
    imageUrl: string;
  } | null;
}

const HardwareDetailDialog = ({ isOpen, onOpenChange, component }: HardwareDetailDialogProps) => {
  if (!component) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-lg border border-primary/20 shadow-2xl shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="text-slate-100">{component.name}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {component.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <img src={component.imageUrl} alt={component.name} className="w-full h-auto rounded-md object-cover border border-primary/20" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {component.longDescription}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HardwareDetailDialog;