import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { API_ENDPOINTS, DEFAULTS, NODE_DRIVE_CONFIG } from '../../commons/constants';
import { DriveOperationType, DriveResourceType, SortBy, SortDirection, ConflictAction, CreateType } from '../../commons/enums';
import {
    createFileOrFolderPreSend,
    uploadPreSend,
    downloadPreSend,
    downloadPostReceive,
} from '../../handlers';

export class SynologyDrive implements INodeType {
    description: INodeTypeDescription = {
        displayName: NODE_DRIVE_CONFIG.DISPLAY_NAME,
        name: NODE_DRIVE_CONFIG.NAME,
        version: NODE_DRIVE_CONFIG.VERSION,
        description: NODE_DRIVE_CONFIG.DESCRIPTION,
        icon: 'file:SynologyDrive.svg',
        group: ['input'],
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        defaults: {
            name: NODE_DRIVE_CONFIG.DISPLAY_NAME,
        },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: NODE_DRIVE_CONFIG.CREDENTIAL_NAME,
                required: true,
            },
        ],
        usableAsTool: true,
        requestDefaults: {
            baseURL: '={{$credentials.baseUrl}}',
            json: true,
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'File',
                        value: DriveResourceType.FILE,
                    },
                    {
                        name: 'File and Folder Sharing',
                        value: DriveResourceType.FILE_AND_FOLDER_SHARING,
                    },
                    {
                        name: 'Team Folder',
                        value: DriveResourceType.TEAM_FOLDER,
                    },
                    {
                        name: 'Label',
                        value: DriveResourceType.LABEL,
                    },
                ],
                default: DEFAULTS.RESOURCE,
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [DriveResourceType.FILE],
                    },
                },
                options: [
                    {
                        name: 'Get File',
                        value: DriveOperationType.GET_FILES,
                        action: 'Get files',
                        routing: {
                            request: {
                                method: 'POST',
                                url: API_ENDPOINTS.SynologyDrive.LIST,
                                qs: {
                                    sort_direction: '={{$parameter["sortDirection"]}}',
                                    sort_by: '={{$parameter["sortBy"]}}',
                                    offset: '={{$parameter["offset"]}}',
                                    limit: '={{$parameter["limit"]}}',
                                    path: '={{$parameter["path"]}}',
                                },
                                body: {
                                    filter: '={{$parameter["filter"]}}',
                                },
                            },
                        },
                    },
                    {
                        name: 'Search',
                        value: DriveOperationType.SEARCH,
                        action: 'Search',
                        routing: {
                            request: {
                                method: 'POST',
                                url: API_ENDPOINTS.SynologyDrive.SEARCH,
                                qs: {
                                    sort_direction: '={{$parameter["sortDirection"]}}',
                                    sort_by: '={{$parameter["sortBy"]}}',
                                    offset: '={{$parameter["offset"]}}',
                                    limit: '={{$parameter["limit"]}}',
                                },
                                body: {
                                    keyword: '={{$parameter["keyword"]}}',
                                },
                            },
                        },
                    },
                    {
                        name: 'List Items Recently Used',
                        value: DriveOperationType.LIST_ITEMS_RECENTLY_USED,
                        action: 'List items recently used',
                        routing: {
                            request: {
                                method: 'GET',
                                url: API_ENDPOINTS.SynologyDrive.RECENT,
                            },
                        },
                    },
                    {
                        name: 'Create File Or Folder',
                        value: DriveOperationType.CREATE_FILE_OR_FOLDER,
                        action: 'Create file or folder',
                        routing: {
                            send: {
                                preSend: [createFileOrFolderPreSend],
                            },
                            request: {
                                method: 'POST',
                                url: API_ENDPOINTS.SynologyDrive.CREATE,
                                qs: {
                                    type: '={{$parameter["createFileOrFolderType"]}}',
                                    path: '={{$parameter["path"]}}',
                                },
                                body: {
                                    modified_time: new Date().getTime(),
                                },
                            },
                        },
                    },
                    {
                        name: 'Upload',
                        value: DriveOperationType.UPLOAD,
                        action: 'Upload',
                        routing: {
                            send: {
                                preSend: [uploadPreSend],
                            },
                            request: {
                                method: 'PUT',
                                url: API_ENDPOINTS.SynologyDrive.UPLOAD,
                            },
                        },
                    },
                    {
                        name: 'Delete File Or Folder',
                        value: DriveOperationType.DELETE_FILE_OR_FOLDER,
                        action: 'Delete file or folder',
                        routing: {
                            request: {
                                method: 'POST',
                                url: API_ENDPOINTS.SynologyDrive.DELETE,
                                body: {
                                    permanent: '={{$parameter["deleteFileOrFolderPermanent"]}}',
                                    files: ['={{$parameter["path"]}}'],
                                },
                            },
                        },
                    },
                    {
                        name: 'Download File',
                        value: DriveOperationType.DOWNLOAD_FILE,
                        action: 'Download file',
                        routing: {
                            send: {
                                preSend: [downloadPreSend],
                            },
                            request: {
                                method: 'POST',
                                url: API_ENDPOINTS.SynologyDrive.DOWNLOAD,
                                body: {
                                    files: ['={{$parameter["path"]}}'],
                                },
                            },
                            output: {
                                postReceive: [downloadPostReceive],
                            },
                        },
                    },
                ],
                default: DEFAULTS.OPERATION,
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                typeOptions: {
                    minValue: 1,
                },
                default: DEFAULTS.LIMIT,
                displayOptions: {
                    show: {
                        operation: [
                            DriveOperationType.LIST_ITEMS_RECENTLY_USED,
                            DriveOperationType.GET_FILES,
                            DriveOperationType.SEARCH,
                        ],
                        resource: [DriveResourceType.FILE],
                    },
                },
                description: 'Max number of results to return',
            },
            {
                displayName: 'Type',
                name: 'createFileOrFolderType',
                type: 'options',
                required: true,
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.CREATE_FILE_OR_FOLDER],
                    },
                },
                options: [
                    {
                        name: 'File',
                        value: CreateType.FILE,
                    },
                    {
                        name: 'Folder',
                        value: CreateType.FOLDER,
                    },
                ],
                default: DEFAULTS.CREATE_TYPE,
            },
            {
                displayName: 'File Content',
                name: 'createFileOrFolderFileContent',
                type: 'string',
                required: true,
                placeholder: 'Text content',
                hint: 'Text content to be written to the file',
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.CREATE_FILE_OR_FOLDER],
                        'createFileOrFolderType': [CreateType.FILE],
                    },
                },
                default: DEFAULTS.FILE_CONTENT,
            },
            {
                displayName: 'Path',
                name: 'path',
                type: 'string',
                required: true,
                placeholder: '/mydrive/...',
                displayOptions: {
                    show: {
                        operation: [
                            DriveOperationType.CREATE_FILE_OR_FOLDER,
                            DriveOperationType.GET_FILES,
                            DriveOperationType.UPLOAD,
                            DriveOperationType.DOWNLOAD_FILE,
                            DriveOperationType.DELETE_FILE_OR_FOLDER,
                        ],
                    },
                },
                default: DEFAULTS.PATH,
            },
            {
                displayName: 'Delete Permanently',
                name: 'deleteFileOrFolderPermanent',
                type: 'boolean',
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.DELETE_FILE_OR_FOLDER],
                    },
                },
                default: DEFAULTS.DELETE_PERMANENTLY,
            },
            {
                displayName: 'Sort Direction',
                name: 'sortDirection',
                type: 'options',
                options: [
                    { name: 'Ascending', value: SortDirection.ASCENDING },
                    { name: 'Descending', value: SortDirection.DESCENDING },
                ],
                default: DEFAULTS.SORT_DIRECTION,
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.GET_FILES, DriveOperationType.SEARCH],
                    },
                },
            },
            {
                displayName: 'Sort By',
                name: 'sortBy',
                type: 'options',
                options: [
                    { name: 'Modified Time', value: SortBy.MODIFIED_TIME },
                    { name: 'Size', value: SortBy.SIZE },
                    { name: 'Owner', value: SortBy.OWNER },
                    { name: 'Type', value: SortBy.TYPE },
                    { name: 'Name', value: SortBy.NAME },
                ],
                default: DEFAULTS.SORT_BY,
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.GET_FILES, DriveOperationType.SEARCH],
                    },
                },
            },
            {
                displayName: 'Offset',
                name: 'offset',
                type: 'number',
                default: DEFAULTS.OFFSET,
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.GET_FILES, DriveOperationType.SEARCH],
                    },
                },
            },
            {
                displayName: 'Filter',
                name: 'filter',
                type: 'json',
                default: {},
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.GET_FILES],
                    },
                },
                placeholder: '{"extensions": ["jpg", "png"], "types": ["file", "folder", "image"], "label_id": "mylabel", "starred": true}',
            },
            {
                displayName: 'Keyword',
                name: 'keyword',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.SEARCH],
                    },
                },
            },
            {
                displayName: 'Input Binary Field',
                name: 'binaryPropertyName',
                type: 'string',
                default: DEFAULTS.BINARY_PROPERTY_NAME,
                required: true,
                hint: 'The name of the input binary field containing the file to be upload',
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.UPLOAD],
                    },
                },
                placeholder: 'data',
                description: 'Name of the binary property that contains the data to upload',
            },
            {
                displayName: 'Upload Conflict Action',
                name: 'uploadConflictAction',
                type: 'options',
                options: [
                    { name: 'Overwrite', value: ConflictAction.OVERWRITE },
                    { name: 'Autorename', value: ConflictAction.AUTORENAME },
                    { name: 'Stop', value: ConflictAction.STOP },
                    { name: 'Version', value: ConflictAction.VERSION },
                ],
                default: DEFAULTS.CONFLICT_ACTION,
                displayOptions: {
                    show: {
                        operation: [DriveOperationType.UPLOAD],
                    },
                },
            },
        ],
    };
}
