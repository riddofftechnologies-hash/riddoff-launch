import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Program",
    links: ["How it works", "Builder track", "Founder Member", "Equity Partner"],
  },
  {
    title: "Company",
    links: ["About Riddoff", "Careers", "Press", "Contact"],
  },
  {
    title: "Community",
    links: ["Builder network", "Demo days", "Open projects", "Refer a founder"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Code of Conduct"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-white pt-14 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                Riddoff <span className="text-white/50 font-medium">Ed</span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Build. Ship. Own. A founder-first program from Riddoff Technologies.
            </p>
            <Link
              to="/waitlist"
              className="inline-flex items-center mt-4 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition-colors no-underline"
            >
              Join the waitlist
            </Link>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/70 hover:text-white transition-colors no-underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2025 Riddoff Education Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Made in Kerala</p>
        </div>
      </div>
    </footer>
  );
}
