import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface HardwareDetailContentProps {
  component: {
    name: string;
    description: string;
    longDescription: string;
    imageUrl: string;
  };
}

const HardwareDetailContent = ({ component }: HardwareDetailContentProps) => {
  return (
    <>
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
    </>
  );
};

export default HardwareDetailContent;