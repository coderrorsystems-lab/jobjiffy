import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';

export default function ReviewCard({ review, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            {review.User}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(review.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              {review.rating}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {review.service}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {review.date}
            </span>
          </div>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        "{review.review}"
      </p>

      <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <ThumbsUp size={16} />
        Helpful ({review.helpful})
      </button>
    </motion.div>
  );
}
