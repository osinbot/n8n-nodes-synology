import type {
    IExecuteSingleFunctions,
    IHttpRequestOptions,
} from 'n8n-workflow';

export async function createFileOrFolderPreSend(
    this: IExecuteSingleFunctions,
    requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
    requestOptions.headers = {
        ...requestOptions.headers,
    };
    
    const type = this.getNodeParameter('createFileOrFolderType') as string;
    if (type === 'file') {
        const fileContent = this.getNodeParameter('createFileOrFolderFileContent') as string;
        requestOptions.body = {
            file_content: Buffer.from(fileContent).toString('base64'),
        };
    }
    
    return requestOptions;
}

