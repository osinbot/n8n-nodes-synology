export enum DriveResourceType {
    FILE = 'file',
    FILE_AND_FOLDER_SHARING = 'fileAndFolderSharing',
    TEAM_FOLDER = 'teamFolder',
    LABEL = 'label',
}

export enum SpreadsheetResourceType {
    SPREADSHEET = 'spreadsheet',
    SHEET = 'sheet',
    STYLE = 'styles',
    VALUE = 'values',
}

export enum DriveOperationType {
    GET_FILES = 'getFiles',
    SEARCH = 'search',
    LIST_ITEMS_RECENTLY_USED = 'listItemsRecentlyUsed',
    CREATE_FILE_OR_FOLDER = 'createFileOrFolder',
    UPLOAD = 'upload',
    DELETE_FILE_OR_FOLDER = 'deleteFileOrFolder',
    DOWNLOAD_FILE = 'downloadFile',
}

export enum SpreadsheetOperationType {
    CREATE_SPREADSHEET = 'createSpreadsheet',
    GET_SPREADSHEET = 'getSpreadsheet',
}

export enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc',
}

export enum SortBy {
    MODIFIED_TIME = 'modified_time',
    SIZE = 'size',
    OWNER = 'owner',
    TYPE = 'type',
    NAME = 'name',
}
export enum ConflictAction {
    OVERWRITE = 'overwrite',
    AUTORENAME = 'autorename',
    STOP = 'stop',
    VERSION = 'version',
}

export enum CreateType {
    FILE = 'file',
    FOLDER = 'folder',
}

export enum SynologyErrorCode {
    BAD_REQUEST = 400,
    DISABLED_ACCOUNT = 401,
    DENIED_PERMISSION = 402,
    TWO_FACTOR_REQUIRED = 403,
    TWO_FACTOR_FAILED = 404,
    ENFORCE_TWO_FACTOR = 406,
    BLOCKED_IP = 407,
    EXPIRED_PASSWORD = 409,
    PASSWORD_MUST_CHANGE = 410,
}

