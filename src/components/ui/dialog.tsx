import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
      <div
        className={cn(
          "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-4 border border-slate-200/90 animate-in zoom-in-95",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {(title || description) && (
          <div className="space-y-1 pr-6">
            {title && (
              <h3 className="text-lg font-bold text-slate-950 tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-600 font-medium">
                {description}
              </p>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
