import { motion } from 'framer-motion';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';

const options = [
  {
    title: 'Register as User',
    description: 'Book trusted services, track requests, and manage bookings easily.',
    to: '/register/user',
    icon: User,
    gradient: 'from-blue-500 to-cyan-500',
    border: 'border-blue-400/30',
  },
  {
    title: 'Register as Professional',
    description: 'Offer your services, receive bookings, and grow your business.',
    to: '/register/professional',
    icon: Briefcase,
    gradient: 'from-orange-500 to-amber-500',
    border: 'border-orange-400/30',
  },
];

export default function RegisterOptions() {
  useWindowScroll(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-white md:text-4xl">Create Your JobJiffy Account</h1>
          <p className="mt-3 text-slate-300">
            Choose how you want to continue with registration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {options.map((option, idx) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <Link
                  to={option.to}
                  className={`group block rounded-2xl border ${option.border} bg-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-200/40 hover:bg-slate-900`}
                >
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${option.gradient} text-white shadow-lg`}>
                    <Icon size={22} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{option.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{option.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 font-medium text-slate-100">
                    Continue
                    <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-8 text-center text-sm text-slate-400"
        >
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:underline">
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
