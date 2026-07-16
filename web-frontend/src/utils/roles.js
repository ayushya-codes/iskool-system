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
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard', section: 'Main', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK, ROLES.HELPDESK, ROLES.SCHOOL_TRUSTEE] },
  { path: '/my-child', label: 'My Child', icon: 'Users', section: 'Main', roles: [ROLES.PARENT] },
  { path: '/students', label: 'Students', icon: 'Users', section: 'Academics', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.CLERK] },
  { path: '/faculty', label: 'Faculty', icon: 'GraduationCap', section: 'Academics', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL] },
  { path: '/attendance', label: 'Attendance', icon: 'CalendarCheck', section: 'Academics', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/coursework', label: 'Coursework', icon: 'BookOpen', section: 'Academics', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/timetable-builder', label: 'Timetable', icon: 'Calendar', section: 'Academics', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR] },
  { path: '/exams', label: 'Exams', icon: 'ClipboardList', section: 'Academics', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/finance', label: 'Finance', icon: 'DollarSign', section: 'Management', roles: [ROLES.SUPER_ADMIN, ROLES.PRINCIPAL, ROLES.CLERK, ROLES.SCHOOL_TRUSTEE] },
  { path: '/inventory', label: 'Inventory', icon: 'Package', section: 'Management', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY] },
  { path: '/safety', label: 'Safety', icon: 'Shield', section: 'Management', footer: true, roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.PARENT] },
  { path: '/helpdesk', label: 'Helpdesk', icon: 'LifeBuoy', section: 'Management', footer: true, roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.HELPDESK, ROLES.PARENT] },
  { path: '/almanac', label: 'Almanac', icon: 'BookMarked', section: 'System', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/communication', label: 'Communication', icon: 'Megaphone', section: 'System', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/events', label: 'Events', icon: 'CalendarDays', section: 'System', roles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PRINCIPAL, ROLES.SUPERVISOR, ROLES.FACULTY, ROLES.PARENT] },
  { path: '/notifications', label: 'Notifications', icon: 'Bell', section: 'System', roles: null },
  { path: '/settings', label: 'School Settings', icon: 'Settings', section: 'System', footer: true, roles: [ROLES.SUPER_ADMIN] },
];

// Section display order (excluding 'Main' which is rendered as standalone home link)
const SECTION_ORDER = ['Academics', 'Management', 'System'];

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

export function getGroupedNavItemsForRole(userRole) {
  const items = getNavItemsForRole(userRole);
  const homeItem = items.find((item) => item.section === 'Main');
  const footerItems = items.filter((item) => item.footer);
  const groupItems = items.filter((item) => item.section !== 'Main' && !item.footer);
  const groups = SECTION_ORDER
    .map((section) => ({
      section,
      items: groupItems.filter((item) => item.section === section),
    }))
    .filter((group) => group.items.length > 0);
  return { homeItem, groups, footerItems };
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
