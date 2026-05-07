import { cn } from "@/lib/utils";

export default function Loader({ className, size = "default" }) {
  const sizes = {
    small: "h-6 w-6 border-2",
    default: "h-12 w-12 border-4",
    large: "h-20 w-20 border-6",
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-t-transparent border-accent-secondary shadow-lg shadow-rose-600/20",
        sizes[size] || sizes.default
      )}></div>
    </div>
  );
}
