import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#fcf8ff] font-[Inter,sans-serif] text-[#1b1b24]">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-[#3525cd]/10" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] bg-[#505f76]/10" />
      </div>

      <main className="w-full max-w-[440px] flex flex-col items-center">
        {/* Branding */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-xl flex items-center justify-center bg-[#3525cd]">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 32 }}>admin_panel_settings</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-[#1b1b24]">BootcampAdmin</h1>
          <p className="text-sm mt-1 text-[#464555]">Enterprise Management System</p>
        </header>

        {/* Card */}
        <div className="w-full rounded-xl shadow-sm p-8 bg-white border border-[#c7c4d8]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1b1b24]">Welcome Back</h2>
            <p className="text-sm mt-1 text-[#464555]">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium block text-[#1b1b24]" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#777587]">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>mail</span>
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bootcamp.com"
                  className="block w-full pl-12 pr-4 py-3 rounded-lg text-sm bg-white border border-[#c7c4d8] text-[#1b1b24] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#1b1b24]" htmlFor="login-password">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-[#3525cd] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#777587]">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>lock</span>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-3 rounded-lg text-sm bg-white border border-[#c7c4d8] text-[#1b1b24] placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#777587] hover:text-[#464555] transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-[#ba1a1a]">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-[#3525cd] text-white hover:bg-[#4f46e5] active:scale-[0.98] disabled:opacity-60 transition-all shadow-sm"
            >
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <span className="material-symbols-outlined [font-size:18px]">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-8 pt-6 text-center border-t border-[#c7c4d8]">
            <p className="text-sm text-[#464555]">
              Need an account?{" "}
              <a href="#" className="font-semibold text-[#3525cd] hover:underline">
                Contact Platform Admin
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#464555]">System Online</span>
          </div>
          <span className="text-[#c7c4d8]">•</span>
          <span className="text-xs font-semibold text-[#464555]">v2.4.0-Enterprise</span>
        </footer>
      </main>
    </div>
  );
}
