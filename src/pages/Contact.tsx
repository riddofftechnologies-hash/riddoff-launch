import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", email: "", company: "", message: "",
    industry: "", scale: "", timeline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This website has no verified form-delivery backend. Open a real email draft
    // instead of misleading users with a fabricated "message sent" confirmation.
    const subject = "Riddoff enquiry" + (form.company ? " — " + form.company : "");
    const body = [
      "Name: " + form.name,
      "Email: " + form.email,
      "Company: " + (form.company || "Not provided"),
      "Industry: " + (form.industry || "Not specified"),
      "Company size: " + (form.scale || "Not specified"),
      "Timeline: " + (form.timeline || "Not specified"),
      "",
      form.message,
    ].join("\\n");
    const mailto = "mailto:system@riddoff.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.location.href = mailto;
    toast({ title: "Email draft requested", description: "Send the message from your email application to complete your enquiry." });
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-hero">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-melodrama text-3xl sm:text-4xl md:text-6xl font-extrabold text-foreground mb-4 sm:mb-6">Contact</h1>
            <p className="text-lg text-muted-foreground font-satoshi">Let's discuss how Riddoff can transform your operations.</p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-muted/40 rounded-2xl p-4 sm:p-8 md:p-10 border border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-satoshi text-sm text-muted-foreground">Name</label>
                    <Input
                      placeholder=""
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-satoshi text-sm text-muted-foreground">Email</label>
                    <Input
                      type="email"
                      placeholder=""
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="font-satoshi text-sm text-muted-foreground">Company</label>
                  <Input
                    placeholder=""
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="bg-background rounded-xl h-12"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="font-satoshi text-sm text-muted-foreground">What are you building?</label>
                  <Textarea
                    placeholder="Describe your project, challenge, or what you're looking to accomplish..."
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="bg-background rounded-xl font-melodrama placeholder:font-melodrama resize-none"
                  />
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-satoshi text-sm text-muted-foreground">Industry</label>
                    <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                      <SelectTrigger className="font-melodrama bg-background rounded-xl h-12">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-satoshi text-sm text-muted-foreground">Scale</label>
                    <Select value={form.scale} onValueChange={(v) => setForm({ ...form, scale: v })}>
                      <SelectTrigger className="font-melodrama bg-background rounded-xl h-12">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1–10 employees</SelectItem>
                        <SelectItem value="11-50">11–50 employees</SelectItem>
                        <SelectItem value="51-200">51–200 employees</SelectItem>
                        <SelectItem value="201-500">201–500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-satoshi text-sm text-muted-foreground">Timeline</label>
                    <Select value={form.timeline} onValueChange={(v) => setForm({ ...form, timeline: v })}>
                      <SelectTrigger className="font-melodrama bg-background rounded-xl h-12">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1-3">1–3 months</SelectItem>
                        <SelectItem value="3-6">3–6 months</SelectItem>
                        <SelectItem value="6+">6+ months</SelectItem>
                        <SelectItem value="exploring">Just exploring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">This opens your email application with your enquiry. Your message is not sent until you send it from your email app.</p>
                {/* Divider + Submit */}
                <div className="border-t border-border pt-6 flex justify-end">
                  <button
                    type="submit"
                    className="font-melodrama bg-secondary text-secondary-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Open email draft
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8 pt-2"
          >
            <div>
              <h2 className="font-melodrama text-2xl font-bold text-foreground mb-2">Reach Us</h2>
              <p className="font-satoshi text-sm text-muted-foreground">Reach out by email or phone to discuss your requirements.</p>
            </div>
            {[
              { icon: Mail, label: "Email", value: "system@riddoff.com" },
              { icon: Phone, label: "Phone", value: "+91 9633779968" },
              { icon: MapPin, label: "Office", value: "Thrissur, Kerala" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="text-primary" size={22} />
                </div>
                <div>
                  <p className="font-satoshi font-medium text-foreground">{item.label}</p>
                  <p className="font-satoshi text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
