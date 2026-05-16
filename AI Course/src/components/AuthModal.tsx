import { useState, useEffect } from "react";
import { X, Zap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "login" | "signup";

interface Props {
  defaultTab?: Tab;
  onClose: () => void;
}

function firebaseMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function AuthModal({ defaultTab = "login", onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function switchTab(t: Tab) {
    setTab(t);
    setError("");
    setPassword("");
    setConfirm("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (tab === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, name.trim() || undefined);
      }
      onClose();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(firebaseMessage(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-foreground">Riddoff</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E0E0E0] mx-6">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === "login"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => switchTab("signup")}
            className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === "signup"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Join for Free
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              required
            />
          </div>

          {tab === "signup" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <PasswordInput
                value={confirm}
                onChange={setConfirm}
                required
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading
              ? "Please wait…"
              : tab === "login"
              ? "Log In"
              : "Create Account"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {tab === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className="text-primary font-semibold hover:underline"
                >
                  Join for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
