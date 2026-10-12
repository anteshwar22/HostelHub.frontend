export const ROLES = {
  ADMIN: 'ADMIN',
  WARDEN: 'WARDEN',
  STUDENT: 'STUDENT',
};

export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  FULL: 'FULL',
  MAINTENANCE: 'MAINTENANCE',
  INACTIVE: 'INACTIVE',
};

export const COMPLAINT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const COMPLAINT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
};

export const COMPLAINT_CATEGORIES = [
  'Electrical',
  'Plumbing',
  'Furniture',
  'Cleaning',
  'Water',
  'Internet',
  'Food',
  'Room',
  'Other',
];

export const NIGHT_OUT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
};

export const ROOM_CHANGE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};
