import { Star } from 'lucide-react';

export default function RatingDisplay({ rating, totalReviews }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Your Rating
        </h2>
        <div className="flex items-end gap-4">
          <div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              {rating}
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            based on <span className="font-semibold text-slate-900 dark:text-white">{totalReviews}</span>{' '}
            reviews
          </p>
        </div>
      </div>

      <div className="mt-8 md:mt-0 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Average Response</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          98%
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Customer satisfaction</p>
      </div>
    </div>
  );
}
