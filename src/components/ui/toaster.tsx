// Primary toaster mount (shadcn-style). Sonner is mounted alongside it in App.tsx.
import { Toaster as Sonner } from "sonner";

export const Toaster = () => <Sonner position="top-right" richColors closeButton />;
