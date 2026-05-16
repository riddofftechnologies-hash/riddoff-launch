import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Zap, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

type ModalTab = "login" | "signup";

export default function Header() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<ModalTab | null>(null);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Account";

  return (
    <>
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

            {user ? (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground font-medium">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </div>
                {(role === "admin" || role === "instructor") && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    Admin Panel
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setModal("login")}
                  className="px-4 py-2 text-sm font-semibold text-foreground border border-[#E0E0E0] rounded-md hover:bg-[#F7F7F7] transition-colors"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setModal("signup")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Join for Free
                </button>
              </>
            )}
          </nav>

          <button type="button" className="sm:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
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
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">{displayName}</span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
                {(role === "admin" || role === "instructor") && (
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); navigate("/admin"); }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-md"
                  >
                    <LayoutDashboard size={14} />
                    Admin Panel
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); setModal("login"); }}
                  className="flex-1 py-2 text-sm font-semibold text-foreground border border-[#E0E0E0] rounded-md"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); setModal("signup"); }}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-primary rounded-md"
                >
                  Join for Free
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {modal && (
        <AuthModal defaultTab={modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}
