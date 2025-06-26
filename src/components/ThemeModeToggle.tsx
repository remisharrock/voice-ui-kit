import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "@/icons";

export function ThemeModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <SunIcon className="vkui:h-[1.2rem] vkui:w-[1.2rem] vkui:scale-100 vkui:rotate-0 vkui:transition-all vkui:dark:scale-0 vkui:dark:-rotate-90" />
          <MoonIcon className="vkui:absolute vkui:h-[1.2rem] vkui:w-[1.2rem] vkui:scale-0 vkui:rotate-90 vkui:transition-all vkui:dark:scale-100 vkui:dark:rotate-0" />
          <span className="vkui:sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ThemeModeToggle;
