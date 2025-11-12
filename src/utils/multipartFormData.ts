
function generateBoundary(): string {
    return `----n8n-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

function formatField(boundary: string, name: string, value: string): Buffer {
    const nameBuffer = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n`);
    const valueBuffer = Buffer.from(value, 'utf-8');
    const endBuffer = Buffer.from('\r\n');
    
    return Buffer.concat([nameBuffer, valueBuffer, endBuffer]);
}

function formatFileField(
    boundary: string,
    name: string,
    fileBuffer: Buffer,
    filename: string,
    contentType?: string
): Buffer {
    const contentTypeHeader = contentType ? `Content-Type: ${contentType}\r\n` : '';
    const header = Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${name}"; filename="${filename}"\r\n` +
        `${contentTypeHeader}\r\n`
    );
    const endBuffer = Buffer.from('\r\n');
    
    return Buffer.concat([header, fileBuffer, endBuffer]);
}

export interface MultipartField {
    name: string;
    value: string | Buffer;
    filename?: string; // Required if value is Buffer (file field)
    contentType?: string; // Optional, used for file fields
}

export interface MultipartFormDataResult {
    body: Buffer;
    boundary: string;
    contentType: string;
}

export function createMultipartFormData(fields: MultipartField[]): MultipartFormDataResult {
    const boundary = generateBoundary();
    const parts: Buffer[] = [];
    
    for (const field of fields) {
        if (field.filename && Buffer.isBuffer(field.value)) {
            // File field - Buffer with filename
            parts.push(
                formatFileField(
                    boundary,
                    field.name,
                    field.value,
                    field.filename,
                    field.contentType
                )
            );
        } else if (typeof field.value === 'string') {
            // Text field - string value
            parts.push(formatField(boundary, field.name, field.value));
        } else {
            // Buffer without filename - treat as text (base64 or similar)
            parts.push(formatField(boundary, field.name, field.value.toString('utf-8')));
        }
    }
    
    // Add closing boundary
    const closingBoundary = Buffer.from(`--${boundary}--\r\n`);
    parts.push(closingBoundary);
    
    const body = Buffer.concat(parts);
    const contentType = `multipart/form-data; boundary=${boundary}`;
    
    return {
        body,
        boundary,
        contentType,
    };
}

