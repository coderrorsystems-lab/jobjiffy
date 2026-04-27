const CATEGORY_LABELS = {
  ac_repair: 'AC Repair & Service',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  beauty: 'Beauty & Grooming',
  cleaning: 'Home Cleaning',
  carpentry: 'Carpentry',
  appliance: 'Appliance Repair',
};

const DEFAULT_ICON = '🛠';

const ICON_MAP = {
  ac: '❄️',
  plumbing: '🚿',
  cleaning: '🧹',
  beauty: '💇',
  electrical: '⚡',
  appliance: '📱',
  paint: '🏠',
  carpenter: '🪚',
  furniture: '🛏️',
  repair: '🔧',
};

const services = [
  { id: 'svc_1', name: 'AC Repair & Service', professionalCount: 25, icon: '❄️' },
  { id: 'svc_2', name: 'Plumbing', professionalCount: 32, icon: '🚿' },
  { id: 'svc_3', name: 'Home Cleaning', professionalCount: 48, icon: '🧹' },
  { id: 'svc_4', name: 'Beauty & Salon', professionalCount: 51, icon: '💇' },
  { id: 'svc_5', name: 'Electronics Repair', professionalCount: 19, icon: '📱' },
  { id: 'svc_6', name: 'Painting', professionalCount: 23, icon: '🏠' },
  { id: 'svc_7', name: 'Electrical', professionalCount: 27, icon: '⚡' },
  { id: 'svc_8', name: 'Furniture Repair', professionalCount: 14, icon: '🛏️' },
];

const professionals = [
  {
    id: 'pro_1001',
    fullName: 'Rohan Mehta',
    email: 'rohan.ac@example.com',
    category: 'ac_repair',
    servicesOffered: ['AC Repair & Service', 'Gas Fill', 'Installation'],
    serviceArea: 'South Delhi',
    experience: 7,
    pricePerService: 499,
    rating: 4.8,
    totalJobsCompleted: 342,
    verified: true,
    availableToday: true,
    responseTime: 'within 15 min',
    shortBio: 'Specialist in split and window AC repair with same-day resolution.',
    profilePhoto:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pro_1002',
    fullName: 'Amit Verma',
    email: 'amit.electric@example.com',
    category: 'electrical',
    servicesOffered: ['Electrical', 'Wiring Repair', 'Fan Installation'],
    serviceArea: 'Noida Sector 62',
    experience: 10,
    pricePerService: 399,
    rating: 4.7,
    totalJobsCompleted: 510,
    verified: true,
    availableToday: false,
    responseTime: 'within 25 min',
    shortBio: 'Licensed electrician for home wiring and appliance connections.',
    profilePhoto:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pro_1003',
    fullName: 'Sana Khan',
    email: 'sana.clean@example.com',
    category: 'cleaning',
    servicesOffered: ['Home Cleaning', 'Deep Cleaning', 'Bathroom Cleaning'],
    serviceArea: 'Gurgaon DLF Phase 3',
    experience: 5,
    pricePerService: 699,
    rating: 4.9,
    totalJobsCompleted: 280,
    verified: true,
    availableToday: true,
    responseTime: 'within 10 min',
    shortBio: 'Premium deep cleaning expert with eco-friendly products.',
    profilePhoto:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pro_1004',
    fullName: 'Imran Sheikh',
    email: 'imran.plumb@example.com',
    category: 'plumbing',
    servicesOffered: ['Plumbing', 'Leak Fix', 'Pipe Installation'],
    serviceArea: 'Mumbai Andheri East',
    experience: 8,
    pricePerService: 449,
    rating: 4.6,
    totalJobsCompleted: 395,
    verified: true,
    availableToday: true,
    responseTime: 'within 20 min',
    shortBio: 'Fast plumbing fixes for kitchens and bathrooms with warranty.',
    profilePhoto:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
];

function normalizeServiceName(name) {
  return String(name || '').trim();
}

function slugify(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function selectIcon(serviceName) {
  const lowered = serviceName.toLowerCase();
  const key = Object.keys(ICON_MAP).find((term) => lowered.includes(term));
  return key ? ICON_MAP[key] : DEFAULT_ICON;
}

function toServiceNames({ category, servicesOffered = [] }) {
  const categoryName = CATEGORY_LABELS[category] || normalizeServiceName(category);
  const allNames = [categoryName, ...servicesOffered]
    .map(normalizeServiceName)
    .filter(Boolean);

  return [...new Set(allNames)];
}

function upsertServicesForProfessional(payload) {
  const serviceNames = toServiceNames(payload);

  serviceNames.forEach((serviceName) => {
    const existing = services.find(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase()
    );

    if (existing) {
      existing.professionalCount += 1;
      return;
    }

    services.push({
      id: `svc_${slugify(serviceName)}`,
      name: serviceName,
      professionalCount: 1,
      icon: selectIcon(serviceName),
    });
  });

  return serviceNames;
}

function addProfessional(payload) {
  const registeredServices = upsertServicesForProfessional(payload);
  const professional = {
    id: `pro_${Date.now()}`,
    fullName: payload.fullName,
    email: payload.email,
    category: payload.category,
    servicesOffered: payload.servicesOffered || [],
    serviceArea: payload.serviceArea,
    experience: Number(payload.experience) || 0,
    pricePerService: Number(payload.pricePerService) || 0,
    rating: 0,
    totalJobsCompleted: 0,
    verified: false,
    availableToday: true,
    responseTime: 'within 30 min',
    shortBio: payload.profileDescription || 'New professional on JobJiffy.',
    profilePhoto:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  };

  professionals.push(professional);

  return {
    professional,
    registeredServices,
  };
}

function resolveCategoryByService(serviceName) {
  const normalized = String(serviceName || '').trim().toLowerCase();
  if (!normalized) return '';

  if (normalized.includes('ac')) return 'ac_repair';
  if (normalized.includes('electric')) return 'electrical';
  if (normalized.includes('plumb')) return 'plumbing';
  if (normalized.includes('beauty') || normalized.includes('salon')) return 'beauty';
  if (normalized.includes('clean')) return 'cleaning';
  if (normalized.includes('appliance')) return 'appliance';

  return normalized.replace(/\s+/g, '_');
}

function listProfessionals({ service = '', search = '', sort = 'top_rated', availableToday = false } = {}) {
  const category = resolveCategoryByService(service);
  const normalizedSearch = String(search || '').trim().toLowerCase();

  let filtered = professionals.filter((professional) => {
    const matchCategory = category
      ? professional.category === category || professional.servicesOffered.some((svc) => svc.toLowerCase().includes(String(service).toLowerCase()))
      : true;
    const matchSearch = normalizedSearch
      ? professional.fullName.toLowerCase().includes(normalizedSearch) ||
        professional.servicesOffered.some((svc) => svc.toLowerCase().includes(normalizedSearch))
      : true;
    const matchAvailability = availableToday ? professional.availableToday : true;

    return matchCategory && matchSearch && matchAvailability;
  });

  if (sort === 'lowest_price') {
    filtered = filtered.sort((a, b) => a.pricePerService - b.pricePerService);
  } else if (sort === 'most_experienced') {
    filtered = filtered.sort((a, b) => b.experience - a.experience);
  } else if (sort === 'nearest') {
    filtered = filtered.sort((a, b) => a.serviceArea.localeCompare(b.serviceArea));
  } else {
    filtered = filtered.sort((a, b) => b.rating - a.rating);
  }

  return {
    data: filtered,
    meta: {
      total: filtered.length,
      service,
      sort,
    },
  };
}

function getProfessionalById(id) {
  return professionals.find((professional) => professional.id === id) || null;
}

function listServices({ query = '', limit = 8, offset = 0 } = {}) {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  const filtered = normalizedQuery
    ? services.filter((service) => service.name.toLowerCase().includes(normalizedQuery))
    : services;

  const safeOffset = Math.max(0, Number(offset) || 0);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 8));

  const paged = filtered
    .slice(safeOffset, safeOffset + safeLimit)
    .map((service) => ({
      ...service,
      count: `${service.professionalCount}+`,
    }));

  return {
    data: paged,
    meta: {
      total: filtered.length,
      offset: safeOffset,
      limit: safeLimit,
      hasMore: safeOffset + safeLimit < filtered.length,
    },
  };
}

export {
  addProfessional,
  getProfessionalById,
  listServices,
  listProfessionals,
};
