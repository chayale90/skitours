export const navigations = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { 
    name: 'Storefront', 
    icon: 'web',
    children: [
      { name: 'Assets', iconText: 'SI', path: '/admin/storefront' }
    ]
  },
  {
    name: 'Transfers',
    icon: 'local_taxi',
    children: [
      {
        name:"All", iconText: 'AL', path: '/admin/transfers'
      }
    ]
  },
  {
    name: 'Lessons',
    icon: 'castforeducation',
    children: [
      {name: 'All', iconText: 'AL', path: '/admin/lessons'},
      {name: 'Availability', iconText: 'AV', path: '/admin/lessons/availability'},
      {name: 'Skill Levels', iconText: 'SL', path: '/admin/lessons/skill-levels'}
    ]
  },
  { name: "Translations", path: '/admin/translations', icon: 'language' },
  { name: 'Settings', path: '/admin/settings', icon: 'settings' },
  // { label: 'PAGES', type: 'label' },
  // {
  //   name: 'Session/Auth',
  //   icon: 'security',
  //   children: [
  //     { name: 'Sign in', iconText: 'SI', path: '/admin/session/signin' },
  //     { name: 'Sign up', iconText: 'SU', path: '/admin/session/signup' },
  //     { name: 'Forgot Password', iconText: 'FP', path: '/admin/session/forgot-password' },
  //     { name: 'Error', iconText: '404', path: '/admin/session/404' },
  //   ],
  // },
  // { label: 'Components', type: 'label' },
  // {
  //   name: 'Components',
  //   icon: 'favorite',
  //   badge: { value: '30+', color: 'secondary' },
  //   children: [
  //     { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
  //     { name: 'Buttons', path: '/material/buttons', iconText: 'B' },
  //     { name: 'Checkbox', path: '/material/checkbox', iconText: 'C' },
  //     { name: 'Dialog', path: '/material/dialog', iconText: 'D' },
  //     { name: 'Expansion Panel', path: '/material/expansion-panel', iconText: 'E' },
  //     { name: 'Form', path: '/material/form', iconText: 'F' },
  //     { name: 'Icons', path: '/material/icons', iconText: 'I' },
  //     { name: 'Menu', path: '/material/menu', iconText: 'M' },
  //     { name: 'Progress', path: '/material/progress', iconText: 'P' },
  //     { name: 'Radio', path: '/material/radio', iconText: 'R' },
  //     { name: 'Switch', path: '/material/switch', iconText: 'S' },
  //     { name: 'Slider', path: '/material/slider', iconText: 'S' },
  //     { name: 'Snackbar', path: '/material/snackbar', iconText: 'S' },
  //     { name: 'Table', path: '/material/table', iconText: 'T' },
  //   ],
  // },
  // {
  //   name: 'Charts',
  //   icon: 'trending_up',
  //   children: [{ name: 'Echarts', path: '/charts/echarts', iconText: 'E' }],
  // },
  // {
  //   name: 'Documentation',
  //   icon: 'launch',
  //   type: 'extLink',
  //   path: 'http://demos.ui-lib.com/matx-react-doc/',
  // },
];
