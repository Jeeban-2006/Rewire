import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-lg font-semibold font-headline", className)}>
      <BrainCircuit className="h-6 w-6 text-primary" />
      <span>Rewire</span>
    </div>
  );
}
