import { createContext, useContext } from "react";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange?: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

type TabsProps = {
  value: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
};

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = HTMLAttributes<HTMLDivElement>;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-black/20 text-oir-cream/80",
        className
      )}
      role="tablist"
      {...props}
    />
  );
}

type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium transition-colors",
        isActive ? "bg-black/30 text-oir-cream shadow" : "text-oir-cream/70 hover:text-oir-cream",
        className
      )}
      onClick={() => ctx?.onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return (
    <div
      role="tabpanel"
      className={cn("mt-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}
