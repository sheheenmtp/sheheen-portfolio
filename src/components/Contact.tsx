import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { fade, reveal } from '../lib/motion';

type SubmissionStatus = {
  type: 'success' | 'error';
  message: string;
} | null;

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'muhamammedsheheen0@gmail.com',
      href: 'mailto:muhamammedsheheen0@gmail.com',
      color: 'from-blue-400 to-blue-600',
      external: false,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9895057468',
      href: 'tel:+919895057468',
      color: 'from-blue-400 to-blue-600',
      external: false,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/sheheen-mtp',
      href: 'https://www.linkedin.com/in/sheheen-mtp/',
      color: 'from-blue-400 to-blue-600',
      external: true,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/sheheenmtp',
      href: 'https://github.com/sheheenmtp',
      color: 'from-gray-400 to-gray-600',
      external: true,
    },
    {
      icon: Globe,
      label: 'Portfolio',
      value: 'sheheenmtp.vercel.app',
      href: 'https://sheheenmtp.vercel.app',
      color: 'from-blue-400 to-blue-600',
      external: true,
    },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch(`${apiBaseUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your message right now.');
      }

      setSubmissionStatus({
        type: 'success',
        message: 'Message sent successfully. I’ll get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmissionStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Network error. Please email me directly or try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));

    if (submissionStatus) {
      setSubmissionStatus(null);
    }
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...reveal()}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="accent-chip inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Open to meaningful collaborations</span>
            </div>
          </div>
          <h2 className="section-title text-4xl md:text-5xl font-bold">
            Let’s Build Something Useful
          </h2>
          <p className="section-copy text-lg max-w-2xl mx-auto">
            Have an idea involving NLP, machine translation, LLM applications, backend AI, or
            computer vision? Share the context and let’s start a conversation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            {...reveal(0.06)}
            className="space-y-8"
          >
            <Card className="surface-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Briefcase className="text-blue-400" />
                  <span>Available for Opportunities</span>
                </CardTitle>
                <CardDescription>
                  AI/ML engineering roles, research collaborations, and practical multilingual AI projects.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>Thiruvananthapuram, Kerala, India</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>Typically responds within 1–2 working days</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Contact & Profiles</h3>
              <div className="space-y-3">
                {contactLinks.map((contact, index) => (
                  <motion.a
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? '_blank' : undefined}
                    rel={contact.external ? 'noopener noreferrer' : undefined}
                    {...reveal(index * 0.08)}
                    whileHover={{ scale: 1.02, x: 6 }}
                    className="surface-card flex items-center space-x-4 p-4 border transition-all duration-300 group"
                  >
                    <div className={`contact-icon p-2 rounded-full bg-gradient-to-r ${contact.color}`}>
                      <contact.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="contact-link-label">
                      <div className="text-blue-400 text-sm">{contact.label}</div>
                      <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        {contact.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            {...reveal(0.14)}
          >
            <Card className="surface-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageSquare className="text-blue-400" />
                  <span>Start a Conversation</span>
                </CardTitle>
                <CardDescription>
                  Tell me what you’re building, the problem you’re solving, and how I can help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="contact-name" className="text-gray-300 text-sm">
                      Your name
                    </label>
                    <Input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="How should I address you?"
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-form-control bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="contact-email" className="text-gray-300 text-sm">
                      Email address
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-form-control bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="contact-message" className="text-gray-300 text-sm">
                      Project or message
                    </label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      placeholder="Share a few details about your idea, role, or collaboration."
                      value={formData.message}
                      onChange={handleChange}
                      rows={7}
                      className="contact-form-control bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 resize-none"
                      required
                    />
                  </div>

                  <AnimatePresence initial={false} mode="wait">
                    {submissionStatus && (
                      <motion.div
                        key={`${submissionStatus.type}-${submissionStatus.message}`}
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.24 }}
                        className={`contact-status contact-status--${submissionStatus.type}`}
                        role={submissionStatus.type === 'error' ? 'alert' : 'status'}
                        aria-live="polite"
                      >
                        {submissionStatus.type === 'success' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                        <span>{submissionStatus.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="primary-cta w-full disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                        Sending message...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.footer
          {...fade(0.2)}
          className="text-center mt-16 pt-8 border-t border-gray-700/50"
        >
          <p className="text-gray-500">
            © 2026 Muhammed Sheheen M T P. Engineering the future with AI.
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
