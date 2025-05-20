export const DATE_FORMAT_WHERE = 'YYYY-MM-DD HH24:MI:SS';

export enum PermissionApi {
  SUPPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DIRECTOR = 'director',
  MANAGER = 'manager',
  DEPARTMENT_LEADER = 'department_leader',
  SALES = '2',
  AGENT = '3',
}

export enum ModuleName {
  DASHBOARD = 'dashboard',
  DASHBOARD_PAGE = 'dashboard.page',

  // SYSTEM_SETTING_MODULE
  SYSTEM_SETTINGS = 'system_settings',
  SYSTEM_SETTINGS_PERMISSIONS = 'system_settings.permissions',
  SYSTEM_SETTINGS_LIST_COMPANYS = 'system_settings.companys',
  SYSTEM_SETTINGS_SCREENS = 'system_settings.screens',
  SYSTEM_SETTINGS_LOGS = 'system_settings.logs',
  SYSTEM_SETTINGS_ROLES = 'system_settings.roles',
  SYSTEM_SETTINGS_ROLE_USERS = 'system_settings.role_users',
  SYSTEM_SETTINGS_USERS = 'system_settings.users',

  // BASIC_DATA_MODULE
  BASIC_DATA = 'basic_data',
  BASIC_DATA_COUNTRY = 'basic_data.country',
  BASIC_DATA_DEPARTMENT = 'basic_data.department',
  BASIC_DATA_REGIONAL_MARKET = 'basic_data.regional_market',
  BASIC_DATA_DESTINATION_ROUTE = 'basic_data.destination_route',
  BASIC_DATA_CBANK = 'basic_data.bank',
  BASIC_DATA_GIFT = 'basic_data.gift',
  BASIC_DATA_CUSTOMER_SOURCE = 'basic_data.customer_source',
}
