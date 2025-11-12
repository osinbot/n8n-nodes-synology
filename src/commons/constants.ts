export const API_ENDPOINTS = {
    SynologyAuth: {
        LOGIN: '/webapi/auth.cgi?api=SYNO.API.Auth&method=login&version=3',
        LOGOUT: '/webapi/auth.cgi?api=SYNO.API.Auth&method=logout&version=3',
    },
    SynologyDrive: {
        LIST: '/api/SynologyDrive/default/v1/files/list',
        SEARCH: '/api/SynologyDrive/default/v1/files/search',
        RECENT: '/api/SynologyDrive/default/v1/files/recent',
        CREATE: '/api/SynologyDrive/default/v1/files',
        UPLOAD: '/api/SynologyDrive/default/v1/files/upload',
        DELETE: '/api/SynologyDrive/default/v1/files/delete',
        DOWNLOAD: '/api/SynologyDrive/default/v1/files/download',
    },
    SynologySpreadsheet: {
        CREATE_SPREADSHEET: '/spreadsheets/create',
        GET: '/spreadsheets/{spreadsheetId}',
    },
} as const;

export const DEFAULTS = {
    RESOURCE: 'file',
    OPERATION: 'listItemsRecentlyUsed',
    LIMIT: 50,
    OFFSET: 0,
    SORT_DIRECTION: 'asc',
    SORT_BY: 'modified_time',
    CREATE_TYPE: 'folder',
    CONFLICT_ACTION: 'version',
    BINARY_PROPERTY_NAME: 'data',
    FILE_CONTENT: '',
    PATH: '',
    DELETE_PERMANENTLY: false,
} as const;

export const NODE_DRIVE_CONFIG = {
    DISPLAY_NAME: 'Synology Drive',
    NAME: 'synologyDrive',
    ICON: 'file:SynologyDrive.svg',
    VERSION: 1,
    DESCRIPTION: 'Synology Drive Node',
    CREDENTIAL_NAME: 'synologyApi',
} as const;

export const NODE_SPREADSHEET_CONFIG = {
    DISPLAY_NAME: 'Synology Spreadsheet',
    NAME: 'synologySpreadsheet',
    ICON: 'file:SynologyOffice.png',
    VERSION: 1,
    DESCRIPTION: 'Synology Spreadsheet Node',
    COLOR: '#0033ff',
    CREDENTIAL_NAME: 'synologyApi',
} as const;

