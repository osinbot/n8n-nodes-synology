import type {
    IExecuteSingleFunctions,
    IHttpRequestOptions,
    IN8nHttpFullResponse,
    INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { generatePairedItemData } from '../utils';

/**
 * Pre-send handler for Download File operation
 */
export async function downloadPreSend(
    this: IExecuteSingleFunctions,
    requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
    requestOptions.headers = {
        ...requestOptions.headers,
        Accept: '*/*',
    };
    
    requestOptions.encoding = 'arraybuffer';
    requestOptions.returnFullResponse = true;
    
    const filePath = this.getNodeParameter('path') as string;
    if (!filePath) {
        throw new NodeOperationError(this.getNode(), 'File paths are required');
    }
    
    requestOptions.body = {
        force_download: false, // to get correct mime type in response header
        files: [filePath],
    };
    
    return requestOptions;
}

/**
 * Post-receive handler for Download File operation
 */
export async function downloadPostReceive(
    this: IExecuteSingleFunctions,
    items: INodeExecutionData[],
    response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
    const pairedItem = generatePairedItemData(items.length);
    const headers = response.headers as Record<string, string>;
    
    const contentType = headers['content-type'] || 'application/octet-stream';
    const binaryDataBuffer = await this.helpers.binaryToBuffer(
        response.body as Buffer | import('stream').Readable
    );
    
    let mimeType = contentType.split(';')[0]?.trim();
    
    // Handle JSON response (error case)
    if (mimeType === 'application/json') {
        const bodyString = binaryDataBuffer.toString('utf-8');
        const bodyObject = JSON.parse(bodyString);
        return [
            {
                binary: {},
                json: {
                    ...bodyObject,
                },
                pairedItem: pairedItem,
            },
        ];
    }
    
    // Extract filename from Content-Disposition header
    const contentDisposition = headers['content-disposition'] || '';
    const fileName = /filename="([^"]+)"/.exec(contentDisposition)?.[1] || 'download.zip';
    
    if (mimeType === 'application/octet-stream') {
        mimeType = 'application/zip';
    }
    
    const binaryData = await this.helpers.prepareBinaryData(binaryDataBuffer, fileName, mimeType);
    
    return [
        {
            binary: {
                data: binaryData,
            },
            json: {},
            pairedItem: pairedItem,
        },
    ];
}

