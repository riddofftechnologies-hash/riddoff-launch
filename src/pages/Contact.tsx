import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/MarketingBlocks";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", interest: "RABOS", message: "" });
  const [draftRequested, setDraftRequested] = useState(false);

  const openDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = "Riddoff enquiry — " + form.interest;
    const message = [
      "Name: " + form.name,
      "Email: " + form.email,
      "Company: " + (form.company || "Not provided"),
      "Interest: " + form.interest,
      "",
      form.message,
    ].join("\n");
    window.location.href = "mailto:system@riddoff.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
    setDraftRequested(true);
  };

  return (
    <div className="mp-page">
      <PageIntro eyebrow="RIDDOFF / CONTACT" title="Let's start a conversation." description="Tell us what you're trying to improve. We'll explore whether Riddoff can help bring more clarity to your operations."/>
      <section className="mp-section">
        <div className="mp-wrap mp-contact-layout">
          <div>
            <div className="mp-section-label">YOUR ENQUIRY</div>
            <h2 className="mp-section-title">What are you working on?</h2>
            <form className="mp-contact-form" onSubmit={openDraft}>
              <div className="mp-field">
                <label htmlFor="riddoff-contact-name">Your name *</label>
                <input id="riddoff-contact-name" autoComplete="name" name="name" required value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
              </div>
              <div className="mp-field">
                <label htmlFor="riddoff-contact-email">Work email *</label>
                <input id="riddoff-contact-email" autoComplete="email" type="email" name="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
              </div>
              <div className="mp-field">
                <label htmlFor="riddoff-contact-company">Company</label>
                <input id="riddoff-contact-company" name="company" autoComplete="organization" value={form.company} onChange={e => setForm({...form,company:e.target.value})}/>
              </div>
              <div className="mp-field">
                <label htmlFor="riddoff-contact-interest">What would you like to discuss?</label>
                <select id="riddoff-contact-interest" name="interest" value={form.interest} onChange={e => setForm({...form,interest:e.target.value})}>
                  <option>RABOS</option><option>Business software</option><option>Partnership</option><option>Other enquiry</option>
                </select>
              </div>
              <div className="mp-field mp-field-full">
                <label htmlFor="riddoff-contact-message">Tell us a little more *</label>
                <textarea id="riddoff-contact-message" name="message" required rows={6} placeholder="Tell us about your business and the problems you're trying to solve." value={form.message} onChange={e => setForm({...form,message:e.target.value})}/>
              </div>
              <div className="mp-contact-submit">
                <button type="submit" className="mp-button">Open email draft <ArrowUpRight size={17} aria-hidden="true"/></button>
                <p>This prepares an email in your own email application. Nothing is submitted to Riddoff until you send it.</p>
                {draftRequested && <p role="status">Your email application should open with your draft. Please send it there to complete your enquiry.</p>}
              </div>
            </form>
          </div>
          <aside className="mp-contact-aside">
            <h2>Reach us directly</h2>
            <a href="mailto:system@riddoff.com">system@riddoff.com</a>
            <p>Prefer email? Reach out directly with a brief description of your needs.</p>
            <p>For now, this website uses your email application rather than a server-side contact form.</p>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Contact;
