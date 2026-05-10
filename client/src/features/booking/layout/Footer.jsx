import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const footerSections = [
  {
    title: 'Services',
    links: [
      'Home Services',
      'Beauty & Wellness',
      'Electronics Repair',
      'Appliance Repair',
      'Cleaning Services',
      'View All',
    ],
  },
  {
    title: 'Company',
    links: [
      'About Us',
      'Careers',
      'Blog',
      'Press',
      'Sustainability',
      'Contact',
    ],
  },
  {
    title: 'Support',
    links: [
      'Help Center',
      'Safety Guidelines',
      'Terms of Service',
      'Privacy Policy',
      'Community Guidelines',
      'Cookie Policy',
    ],
  },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  return (
    <motion.footer
      className="bg-slate-950 dark:bg-black text-slate-100 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Top Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 pb-16 border-b border-slate-800"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                ✨
              </div>
              <span className="font-bold text-lg">JobJiffy</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your trusted marketplace for professional home services. Quality, reliability, and
              transparency in every booking.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-orange-500 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIdx) => (
            <motion.div key={sectionIdx} variants={itemVariants}>
              <h4 className="font-semibold text-white mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <motion.li key={linkIdx} whileHover={{ x: 4 }}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: Phone,
              title: 'Call Us',
              info: '+91 9988 776655',
              subtitle: 'Mon-Fri: 9AM-6PM IST',
            },
            {
              icon: Mail,
              title: 'Email Us',
              info: 'coderrorsystems@gmail.com',
              subtitle: 'We reply within 24 hours',
            },
            {
              icon: MapPin,
              title: 'Location',
              info: 'Inodre, India',
              subtitle: 'provide services in indore',
            },
          ].map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <motion.div
                key={idx}
                className="group p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-blue-600 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 text-white w-fit mb-4 group-hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon size={24} />
                </motion.div>
                <h5 className="font-semibold text-white mb-2">{contact.title}</h5>
                <p className="text-blue-400 font-medium mb-1">{contact.info}</p>
                <p className="text-slate-400 text-sm">{contact.subtitle}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 md:p-12 mb-16"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stay Updated
              </h3>
              <p className="text-blue-50">
                Subscribe to get exclusive deals, service updates, and tips straight to your
                inbox.
              </p>
            </div>
            <motion.form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <motion.button
                type="submit"
                className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all duration-300 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-800"
          variants={itemVariants}
        >
          <p className="text-slate-400 text-sm">
            &copy; 2024 JobJiffy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              Terms
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              Cookies
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
