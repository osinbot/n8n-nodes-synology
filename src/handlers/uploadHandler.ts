import type {
    IExecuteSingleFunctions,
    IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import FormData from 'form-data';

/**
 * Pre-send handler for Upload operation
 */
export async function uploadPreSend(
    this: IExecuteSingleFunctions,
    requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
    requestOptions.headers = {
        ...requestOptions.headers,
    };
    
    const body = new FormData();
    
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
    
    body.append('conflict_action', conflictAction);
    body.append('path', path);
    body.append('type', 'file');
    body.append('file', binaryDataBuffer, {
        filename: binaryData.fileName,
        contentType: binaryData.mimeType,
        knownLength: binaryDataBuffer.length,
    });
    
    requestOptions.body = body;
    requestOptions.headers['Content-Length'] = body.getLengthSync();
    requestOptions.headers['Content-Type'] = `multipart/related; boundary=${body.getBoundary()}`;
    requestOptions.headers['Content-Type'] = 'multipart/form-data';
    
    return requestOptions;
}

