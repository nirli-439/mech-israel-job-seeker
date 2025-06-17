import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
};

export default ThemeToggle;
