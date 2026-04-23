import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";

function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-r-2xl bg-[#7C5DFA] ${className ?? ""}`}
    >
      <div className="absolute left-1/2 top-4 h-0 w-0 -translate-x-1/2 rotate-180 border-x-[10px] border-b-[20px] border-x-transparent border-b-[#7C5DFA] z-20" />
      <div className="absolute bottom-5 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-white z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-tl-2xl rounded-br-2xl bg-[#9277FF]" />
    </div>
  );
}

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-between gap-3 border-0 bg-[#252945]  dark:bg-[#1E2139] md:hidden">
        <div className="flex min-w-0 items-center gap-3 ">
          <LogoMark className="h-[72px] w-[72px]" />
        </div>
        
        <div className="flex shrink-0 items-center gap-8 px-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer rounded-lg p-2.5 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C5DFA]"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-5 w-5 h-6 w-6 fill-[#7E88C3] stroke-[#7E88C3] transition-all duration-200 hover:fill-[#DFE3FA] hover:stroke-[#DFE3FA]" /> : <Moon className="h-5 w-5 fill-[#7E88C3] stroke-[#7E88C3] transition-all duration-200 hover:fill-[#DFE3FA] hover:stroke-[#DFE3FA]" />}
          </button>
          <div className="rounded-full ring-2 ring-white/20">
            <img
              src="/images/ME.jpg"
              className="h-9 w-9 rounded-full object-cover"
              alt="Profile"
              width={36}
              height={36}
            />
          </div>
        </div>
      </header>

      {/* Desktop: vertical rail */}
      <aside className="relative z-40 hidden h-screen min-h-screen shrink-0 flex-col md:flex md:w-[100px] ">
        <div className="relative h-[72px] shrink-0 bg-transparent dark:bg-[#1E2139]">
          <div className="absolute left-0 top-0 z-20 h-[100px] w-[100px] rounded-r-3xl bg-[#7C5DFA] ">
            <div className="absolute left-1/2 top-8 h-0 w-0 -translate-x-1/2 rotate-180 border-x-transparent border-b-[#7C5DFA] border-x-[10px] border-b-[22px] z-40" />
            <div className="absolute bottom-8 left-1/2 z-30 h-9 w-9 -translate-x-1/2 rounded-full bg-white dark:bg-[#1E2139] " />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-br-3xl rounded-tl-3xl bg-[#9277FF]" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end rounded-br-3xl border-r border-[#1E2139]/40 bg-[#252945] dark:bg-[#0C0E16]">
          <div className="flex items-center justify-center border-b-2 border-gray-600 pb-8 pt-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="cursor-pointer rounded-lg p-2 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C5DFA]"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-6 w-6 fill-[#7E88C3] stroke-[#7E88C3] transition-all duration-200 hover:fill-[#DFE3FA] hover:stroke-[#DFE3FA]" /> : <Moon className="h-6 w-6 fill-[#7E88C3] stroke-[#7E88C3] transition-all duration-200 hover:fill-[#DFE3FA] hover:stroke-[#DFE3FA]" />}
            </button>
          </div>
          <div className="mb-4 flex items-center justify-center py-2">
            <div className="rounded-full ring-2 ring-white/20">
              <img
                src="/images/ME.jpg"
                className="h-[50px] w-[50px] rounded-full object-cover"
                alt="Profile"
                width={50}
                height={50}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
