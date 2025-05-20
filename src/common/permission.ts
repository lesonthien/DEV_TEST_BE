export enum ActionEnum {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  PRINT = 'print',
  READ = 'read',
  CUT = 'cut',
  COPY = 'copy',
  ALL = 'all',
}

export enum ScreenName {
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
  SYSTEM_SETTINGS_BRANCH = 'system_settings.branchs',

  // BASIC_DATA_MODULE
  BASIC_DATA = 'basic_data',
  BASIC_DATA_COUNTRY = 'basic_data.country',
  BASIC_DATA_DEPARTMENT = 'basic_data.department',
  BASIC_DATA_REGIONAL_MARKET = 'basic_data.regional_market',
  BASIC_DATA_DESTINATION_ROUTE = 'basic_data.destination_route',
  BASIC_DATA_BANK = 'basic_data.bank',
  BASIC_DATA_GIFT = 'basic_data.gift',
  BASIC_DATA_CUSTOMER_SOURCE = 'basic_data.customer_source',
  BASIC_DATA_PLANNED_SALES = 'basic_data.planned_sales',
  BASIC_DATA_FOOTER_REPORT = 'basic_data.report_footer',

  MANAGEMENT_TOUR = 'managenment_tour',
  MANAGEMENT_TOUR_LIST = 'managenment_tour.tour_list',

  TOUR_DETAIL_PROGRAM = 'tour_retail_detail.tour_information',
  TOUR_DETAIL_INFORMATION = 'tour_retail_detail.tour_program',
  TOUR_DETAIL_DETERMINE = 'tour_retail_detail.tour_detemine',
  TOUR_DETAIL_BOOKING = 'tour_retail_detail.customer_booking',
  TOUR_DETAIL_ORDER = 'tour_retail_detail.customer_order',
  TOUR_DETAIL_COSTING = 'tour_retail_detail.costing',
  TOUR_DETAIL_PRICE_AGENCY = 'tour_retail.agency_list',
  TOUR_DETAIL_COSTING_LOG = 'tour_retail_detail.costing_log',
  TOUR_DETAIL_COSTING_REPORT = 'tour_retail_detail.costing_report',
  TOUR_DETAIL_MULTIPLIER = 'tour_retail_detail.multiplier',
  TOUR_DETAIL_PARTNER = 'tour_retail_detail.partner',
  TOUR_DETAIL_ROOM_ASSIGNMEN = 'tour_retail_detail.room_assignmen',
  TOUR_DETAIL_SERVICE_KIND = 'tour_retail_detail.service_kind',
  TOUR_DETAIL_SERVICE_PACK = 'tour_retail_detail.service_pack',
  TOUR_DETAIL_GUIDE = 'tour_retail_detail.guide',
  TOUR_DETAIL_AGENCY = 'tour_retail_detail.agency',
  TOUR_DETAIL_AGENCY_DETAIL = 'tour_retail_detail.agency_detail',
  TOUR_DETAIL_TYPE_SERVICE = 'tour_retail_detail.type_service',
  TOUR_DETAIL_UNIT = 'tour_retail_detail.unit',

  TOUR_RETAIL_CUSTOMER = 'retail_custommer.get_customer',
  TOUR_CUSTOMER_DROPDOWN_COUNTRY = 'retail_custommer.country',
  TOUR_CUSTOMER_DROPDOWN_CUSTOMER_RESOURCE = 'retail_custommer.customer_resource',
  TOUR_CUSTOMER_SEAT_ARRANGE = 'retail_custommer.customer_seat_arrange',
  TOUR_CUSTOMER_PAYMENT = 'retail_custommer.customer_payment',
  TOUR_CUSTOMER_REGISTRATION = 'retail_custommer.customer_registration',
  TOUR_CUSTOMER_REGISTRATION_LOG = 'retail_custommer.customer_registration_log',
  TOUR_CUSTOMER_PAYMENT_RECEIPT = 'retail_custommer.customer_payment_receipt',
  TOUR_CUSTOMER_REGISTRATION_FORM = 'retail_custommer.customer_registration_form',

  BANK_TRANSFER_PAYMENT = 'bank_transfer_payment.all_module',

  TOUR_OPERATION_SERVICE_CONVERSION_FACTOR = 'retail_custommer.conversion_factor',
  TOUR_OPERATION_SERVICE_MANAGEMENT_GUIDE = 'retail_custommer.guide',
  TOUR_OPERATION_SERVICE_PARTNER = 'retail_custommer.partner',
  TOUR_OPERATION_SERVICE_PARTNER_DETAIL = 'retail_custommer.partner_detail',
  TOUR_OPERATION_SERVICE_PRICE_NAME = 'retail_custommer.price_name',
  TOUR_OPERATION_SERVICE_PROVINCE = 'retail_custommer.province',
  TOUR_OPERATION_SERVICE = 'retail_custommer.service',
  TOUR_OPERATION_SERVICE_PACK = 'retail_custommer.service_pack',
  TOUR_OPERATION_SERVICE_TYPE = 'retail_custommer.service_type',
  TOUR_OPERATION_SERVICE_UNIT = 'retail_custommer.service_unit',

  VISA_BOOKING = 'visa.booking',
  VISA_CUSTOMER_ON_VISA = 'visa.customer_on_visa',
  VISA_BOOKING_DELETE_CUSTOMER_GROUP = 'visa.booking.delete_customer_group',
  VISA_ORDER = 'visa.order',
  VISA_CUSTOMER_ORDER = 'visa.customer_order',
  VISA_REGISTRATION = 'visa.registration',
  VISA_CUSTOMER_REGISTRATION = 'visa.customer_registration',
  VISA_INFORMATION = 'visa.information',
  VISA_LIST = 'visa.list',
  VISA_PAYMENT_RECEIPT = 'visa.payment_receipt',
  VISA_REGISTRATION_FORM = 'visa.registration_form',
  VISA_REPORT = 'visa.report',

  TICKET_LIST = 'ticket.list',
}

export const ActionOptions = {
  ALL: [
    ActionEnum.ALL,
    ActionEnum.CREATE,
    ActionEnum.UPDATE,
    ActionEnum.DELETE,
    ActionEnum.PRINT,
    ActionEnum.READ,
    ActionEnum.COPY,
    ActionEnum.CUT,
  ],
  CREATE: [ActionEnum.CREATE],
  CREATE_UPDATE: [ActionEnum.CREATE, ActionEnum.UPDATE],
  CREATE_UPDATE_DELETE: [ActionEnum.CREATE, ActionEnum.UPDATE, ActionEnum.DELETE],
};

export interface Permission {
  module: ScreenName;
  action: ActionEnum;
}
