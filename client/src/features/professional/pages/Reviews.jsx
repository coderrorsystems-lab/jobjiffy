import { motion } from 'framer-motion';
import { RatingDisplay } from '../components';
import { Star, ThumbsUp } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    customer: 'Rajesh Kumar',
    rating: 5,
    date: '26 Apr 2024',
    service: 'AC Repair',
    review:
      'Excellent service! The technician was very professional and fixed the AC quickly. Highly recommended!',
    helpful: 24,
  },
  {
    id: 2,
    customer: 'Anjali Singh',
    rating: 4.5,
    date: '24 Apr 2024',
    service: 'AC Service',
    review:
      'Very good experience. The work was done efficiently and the technician was courteous. Minor delay but overall satisfied.',
    helpful: 18,
  },
  {
    id: 3,
    customer: 'Vikram Patel',
    rating: 5,
    date: '22 Apr 2024',
    service: 'AC Maintenance',
    review:
      'Best service in the area! The professional is very knowledgeable and provides excellent guidance for AC maintenance.',
    helpful: 31,
  },
  {
    id: 4,
    customer: 'Priya Sharma',
    rating: 4,
    date: '20 Apr 2024',
    service: 'AC Repair',
    review:
      'Good service but could have been a bit quicker. Overall satisfied with the work done.',
    helpful: 12,
  },
  {
    id: 5,
    customer: 'Suresh Mishra',
    rating: 5,
    date: '18 Apr 2024',
    service: 'AC Installation',
    review:
      'Fantastic! The installation was done perfectly. Very professional and honest pricing. Will definitely book again.',
    helpful: 45,
  },
];

const AVERAGE_RATING = 4.7;
const TOTAL_REVIEWS = 156;

export default function Reviews() {
  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm"
      >
        <RatingDisplay rating={AVERAGE_RATING} totalReviews={TOTAL_REVIEWS} />
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {REVIEWS.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {review.customer}
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
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <ThumbsUp size={18} className="text-slate-400 hover:text-blue-500" />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-4">{review.review}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ThumbsUp size={16} />
                <span>{review.helpful} helpful</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}