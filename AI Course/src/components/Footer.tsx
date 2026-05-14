import { Zap } from "lucide-react";

const columns = [
  {
    title: "Learn",
    links: ["Live Bootcamps", "Self-Paced Courses", "Riddoff Masterclass", "Certifications", "Free Previews"],
  },
  {
    title: "Company",
    links: ["About Riddoff", "Careers", "Press", "Blog", "Contact"],
  },
  {
    title: "Community",
    links: ["Alumni Network", "Forum", "Events", "Hiring Partners", "Refer a Friend"],
  },
  {
    title: "Support",
    links: ["Help Centre", "Refund Policy", "Prerequisites FAQ", "Privacy Policy", "Terms of Service"],
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
              <span className="font-bold text-lg">Riddoff</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              AI education for the professionals who build the future.
            </p>
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
