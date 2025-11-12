import type {
    IExecuteSingleFunctions,
    IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { createMultipartFormData } from '../utils';

export async function uploadPreSend(
    this: IExecuteSingleFunctions,
    requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
    requestOptions.headers = {
        ...requestOptions.headers,
    };
    
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName') as string;
    if (!binaryPropertyName) {
        throw new NodeOperationError(this.getNode(), 'Binary property name is required');
    }
    
    const binaryData = this.helpers.assertBinaryData(binaryPropertyName);
    if (!binaryData) {
        throw new NodeOperationError(this.getNode(), 'Binary data is required');
    }
    
    const fileName = binaryData.fileName?.toString();
    if (!fileName) {
        throw new NodeOperationError(
            this.getNode(),
            'File name is needed to upload image. Make sure the property that holds the binary data has the file name property set.'
        );
    }
    
    const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);
    const filePath = this.getNodeParameter('path') as string;
    const path = filePath.endsWith('/') ? filePath + fileName : filePath;
    const conflictAction = this.getNodeParameter('uploadConflictAction') as string;
    
    this.logger.debug(`Upload path: ${path}`);

    const multipartData = createMultipartFormData([
        {
            name: 'conflict_action',
            value: conflictAction,
        },
        {
            name: 'path',
            value: path,
        },
        {
            name: 'type',
            value: 'file',
        },
        {
            name: 'file',
            value: binaryDataBuffer,
            filename: binaryData.fileName?.toString() || fileName,
            contentType: binaryData.mimeType,
        },
    ]);
    
    requestOptions.body = multipartData.body;
    requestOptions.headers['Content-Length'] = multipartData.body.length.toString();
    requestOptions.headers['Content-Type'] = multipartData.contentType;
    
    return requestOptions;
}

