import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Zap, Menu, X } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E0E0E0] shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">Riddoff</span>
        </Link>

        <div className="flex-1 max-w-xl hidden sm:flex relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="What do you want to learn?"
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#E0E0E0] rounded-full bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex-1" />

        <nav className="hidden sm:flex items-center gap-1">
          <a
            href="https://www.riddoff.com"
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            For Business
          </a>
          <button className="px-4 py-2 text-sm font-semibold text-foreground border border-[#E0E0E0] rounded-md hover:bg-[#F7F7F7] transition-colors">
            Log In
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition-colors">
            Join for Free
          </button>
        </nav>

        <button className="sm:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-[#E0E0E0] bg-white px-4 py-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="What do you want to learn?"
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E0E0E0] rounded-full bg-[#F7F7F7] focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 text-sm font-semibold text-foreground border border-[#E0E0E0] rounded-md">
              Log In
            </button>
            <button className="flex-1 py-2 text-sm font-semibold text-white bg-primary rounded-md">
              Join for Free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
