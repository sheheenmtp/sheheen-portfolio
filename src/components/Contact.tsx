import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { profile } from '../content';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

/** Serverless function in api/contact.ts; override with VITE_CONTACT_ENDPOINT if it lives elsewhere. */
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';

type Status = { type: 'success' | 'error'; message: string } | null;

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          company: form.company,
          startedAt: startedAt.current,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? 'The message was not sent.');
      }
      setStatus({ type: 'success', message: 'Message sent. I will reply by email.' });
      setForm({ name: '', email: '', message: '', company: '' });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'The message was not sent.';
      setStatus({ type: 'error', message: `${reason} Email me directly at ${profile.email}.` });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      <div className="contact-form__row">
        <label htmlFor="contact-name">Your name</label>
        <Input id="contact-name" name="name" autoComplete="name" maxLength={100} value={form.name} onChange={onChange} required />
      </div>
      <div className="contact-form__row">
        <label htmlFor="contact-email">Your email</label>
        <Input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} required />
      </div>
      <div className="contact-form__row">
        <label htmlFor="contact-message">Message</label>
        <Textarea id="contact-message" name="message" rows={5} minLength={10} maxLength={5000} value={form.message} onChange={onChange} required />
      </div>
      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div className="contact-form__trap" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={onChange} />
      </div>
      <Button type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send message'}
      </Button>
      <p className={status ? `contact-form__status is-${status.type}` : 'contact-form__status'} role="status" aria-live="polite">
        {status?.message}
      </p>
    </form>
  );
}

export function Contact() {
  const profiles = [
    { label: 'LinkedIn', href: profile.links.linkedin },
    { label: 'GitHub', href: profile.links.github },
    { label: 'Hugging Face', href: profile.links.huggingface },
    { label: 'Résumé (PDF)', href: profile.links.resume },
  ];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact__intro reveal">
        <h2 id="contact-title" className="contact__title">
          Let&apos;s talk{' '}
          <span className="contact__ml" lang="ml">
            നമുക്ക് സംസാരിക്കാം
          </span>
        </h2>
        <p className="contact__lede">
          I am in the {profile.location} and open to Applied AI Engineer and AI automation roles in Dubai, Abu Dhabi or anywhere in the Emirates. Send a message here, or reach me directly.
        </p>
        <a className="contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <dl className="contact__phones">
          {profile.phones.map((phone) => (
            <div key={phone.label}>
              <dt>{phone.label}</dt>
              <dd>
                <a href={phone.href}>{phone.display}</a>
              </dd>
            </div>
          ))}
        </dl>
        <ul className="contact__profiles">
          {profiles.map((item) => (
            <li key={item.label}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="contact__details reveal">
        <ContactForm />
      </div>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
      </footer>
    </section>
  );
}
