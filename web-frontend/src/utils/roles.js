export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  PRINCIPAL: 'PRINCIPAL',
  SUPERVISOR: 'SUPERVISOR',
  FACULTY: 'FACULTY',
  PARENT: 'PARENT',
  GATE_KEEPER: 'GATE_KEEPER',
  CLERK: 'CLERK',
  HELPDESK: 'HELPDESK',
  SCHOOL_TRUSTEE: 'SCHOOL_TRUSTEE',
};

// Role-based route permissions
// null = all authenticated users
export const ROUTE_PERMISSIONS = {
  '/': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK, ROLES.HELPDESK, ROLES.SCHOOL_TRUSTEE],
  '/my-child': [ROLES.PARENT],
  '/students': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.CLERK],
  '/faculty': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL],
  '/attendance': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT],
  '/coursework': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT],
  '/timetable-builder': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR],
  '/exams': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT],
  '/finance': [ROLES.SUPER_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK, ROLES.SCHOOL_TRUSTEE],
  '/inventory': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY],
  '/safety': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.PARENT],
  '/helpdesk': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.HELPDESK, ROLES.PARENT],
  '/almanac': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT],
  '/communication': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT],
  '/events': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT],
  '/notifications': null,
  '/settings': [ROLES.SUPER_ADMIN],
};

// Sidebar nav items filtered by role
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK, ROLES.HELPDESK, ROLES.SCHOOL_TRUSTEE] },
  { path: '/my-child', label: 'My Child', icon: 'Users', roles: [ROLES.PARENT] },
  { path: '/students', label: 'Students', icon: 'Users', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.CLERK] },
  { path: '/faculty', label: 'Faculty', icon: 'GraduationCap', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL] },
  { path: '/attendance', label: 'Attendance', icon: 'CalendarCheck', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/coursework', label: 'Coursework', icon: 'BookOpen', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/timetable-builder', label: 'Timetable', icon: 'Calendar', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR] },
  { path: '/exams', label: 'Exams', icon: 'ClipboardList', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/finance', label: 'Finance', icon: 'DollarSign', roles: [ROLES.SUPER_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK, ROLES.SCHOOL_TRUSTEE] },
  { path: '/inventory', label: 'Inventory', icon: 'Package', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY] },
  { path: '/safety', label: 'Safety', icon: 'Shield', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.PARENT] },
  { path: '/helpdesk', label: 'Helpdesk', icon: 'LifeBuoy', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.HELPDESK, ROLES.PARENT] },
  { path: '/almanac', label: 'Almanac', icon: 'BookMarked', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/communication', label: 'Communication', icon: 'Megaphone', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/events', label: 'Events', icon: 'CalendarDays', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/notifications', label: 'Notifications', icon: 'Bell', roles: null },
  { path: '/settings', label: 'School Settings', icon: 'Settings', roles: [ROLES.SUPER_ADMIN] },
];

export function canAccessRoute(path, userRole) {
  const allowed = ROUTE_PERMISSIONS[path];
  if (!allowed) {
    // Check if a parent path is explicitly allowed
    for (const [route, roles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (route !== '/' && path.startsWith(route + '/')) {
        if (roles && roles.includes(userRole)) return true;
      }
    }
    return true; // null = all authenticated users
  }
  return allowed.includes(userRole);
}

export function getNavItemsForRole(userRole) {
  return NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });
}

export function getDefaultRoute(userRole) {
  const defaults = {
    [ROLES.FACULTY]: '/students',
    [ROLES.PARENT]: '/my-child',
    [ROLES.GATE_KEEPER]: '/login',
    [ROLES.HELPDESK]: '/helpdesk',
  };
  return defaults[userRole] || '/';
}
