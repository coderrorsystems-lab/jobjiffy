import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, ShieldCheck, Clock3, Briefcase, IndianRupee } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProfessionalsByService } from '../services/serviceAPI';
import { useWindowScroll } from '@/hooks';

function toServiceTitle(slug = '') {
  return String(slug)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const sortOptions = [
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Lowest Price', value: 'lowest_price' },
  { label: 'Nearest', value: 'nearest' },
  { label: 'Most Experienced', value: 'most_experienced' },
  { label: 'Available Today', value: 'top_rated_available' },
];

export default function ServiceProfessionals() {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('top_rated');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceName = useMemo(() => toServiceTitle(serviceSlug), [serviceSlug]);
  const hasActiveFilters = Boolean(search.trim()) || sort !== 'top_rated';

  const loadProfessionals = async () => {
    setLoading(true);
    setError('');
    try {
      const useAvailabilityFilter = sort === 'top_rated_available';
      const normalizedSort = useAvailabilityFilter ? 'top_rated' : sort;
      const result = await fetchProfessionalsByService({
        service: serviceName,
        search,
        sort: normalizedSort,
        availableToday: useAvailabilityFilter,
      });
      setProfessionals(result?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'We could not load service providers right now. Please try again.');
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setSearch('');
    setSort('top_rated');
    setLoading(true);
    setError('');

    try {
      const result = await fetchProfessionalsByService({
        service: serviceName,
        search: '',
        sort: 'top_rated',
        availableToday: false,
      });
      setProfessionals(result?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'We could not load service providers right now. Please try again.');
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProfessionals();
  }, [serviceName, sort]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 md:py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-6">
          <h1 className="text-xl md:text-3xl font-bold text-white">{serviceName} Professionals Near You</h1>
          <p className="mt-1 text-sm text-slate-300">Compare profiles, ratings, and pricing before booking.</p>

          <div className="mt-4 grid gap-2 md:gap-3 md:grid-cols-[1fr_220px_130px]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or service"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={loadProfessionals}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Search
            </button>
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-700 bg-red-950/40 p-3 text-red-300">{error}</div>}

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">Loading professionals...</div>
        ) : professionals.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-lg font-semibold text-white">
              {hasActiveFilters
                ? 'No professionals matched your current filters.'
                : 'There are no service providers available right now for this service.'}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {hasActiveFilters
                ? 'Try changing search text or sorting option.'
                : 'Please check again after some time or explore other categories.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {professionals.map((professional) => (
              <motion.button
                key={professional.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/professional/${professional.id}`)}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-blue-600"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={professional.profilePhoto}
                    alt={professional.fullName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-white">{professional.fullName}</h3>
                      {professional.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-1 text-xs text-emerald-300">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-sm text-amber-300">
                      <Star className="h-4 w-4 fill-current" />
                      {professional.rating}
                      <span className="text-slate-400">({professional.totalJobsCompleted} jobs)</span>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-sm text-slate-300">{professional.shortBio}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {professional.experience} yrs</div>
                  <div className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5" /> {professional.pricePerService} onwards</div>
                  <div className="col-span-2">{professional.serviceArea}</div>
                  <div className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {professional.responseTime}</div>
                  {professional.availableToday && (
                    <div className="rounded-full bg-blue-600/20 px-2 py-1 text-center text-blue-300">Available Today</div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
