import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useWindowScroll } from '@/hooks';

export default function Contact() {
  useWindowScroll(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: 'support@jobjiffy.com',
      href: 'mailto:support@jobjiffy.com',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      details: '+91 (800) 123-4567',
      href: 'tel:+918001234567',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Address',
      details: 'New Delhi, India',
      href: '#',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      details: 'Available 24/7',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Hero Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Have questions or need support? We're here to help! Reach out to our team anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Your message"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Message
              </motion.button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm"
                >
                  ✓ Thank you! We'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.href}
                className="flex gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500 transition-all duration-300"
                whileHover={{ x: 8 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                <div className="text-cyan-400 flex-shrink-0">{info.icon}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{info.title}</h3>
                  <p className="text-slate-400">{info.details}</p>
                </div>
              </motion.a>
            ))}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social[0]}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              q: 'How do I contact support?',
              a: 'You can reach our support team via email, phone, or live chat. We respond within 24 hours.',
            },
            {
              q: 'What are your business hours?',
              a: 'We operate 24/7 to serve our customers across different time zones.',
            },
            {
              q: 'How can I report an issue?',
              a: 'Use the contact form above or email us directly with details about the issue.',
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="p-6 bg-slate-900/50 rounded-lg border border-slate-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-slate-400">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
