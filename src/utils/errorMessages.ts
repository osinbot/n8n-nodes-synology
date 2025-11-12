import { SynologyErrorCode } from '../commons/enums';

const ERROR_MESSAGES: Record<SynologyErrorCode, string> = {
    [SynologyErrorCode.BAD_REQUEST]: 'No such account or incorrect password.',
    [SynologyErrorCode.DISABLED_ACCOUNT]: 'Disabled account.',
    [SynologyErrorCode.DENIED_PERMISSION]: 'Denied permission.',
    [SynologyErrorCode.TWO_FACTOR_REQUIRED]: '2-factor authentication code required.',
    [SynologyErrorCode.TWO_FACTOR_FAILED]: 'Failed to authenticate 2-factor authentication code.',
    [SynologyErrorCode.ENFORCE_TWO_FACTOR]: 'Enforce to authenticate with 2-factor authentication code.',
    [SynologyErrorCode.BLOCKED_IP]: 'Blocked IP source.',
    [SynologyErrorCode.EXPIRED_PASSWORD]: 'Expired password.',
    [SynologyErrorCode.PASSWORD_MUST_CHANGE]: 'Password must be changed.',
};

export function getMessageFromErrorCode(error: number): string {
    const errorCode = error as SynologyErrorCode;
    
    if (errorCode in ERROR_MESSAGES) {
        return `${error} - ${ERROR_MESSAGES[errorCode]}`;
    }
    
    return error ? `${error} - Unknown error.` : 'Unknown error.';
}

export function isKnownErrorCode(error: number): boolean {
    return error in ERROR_MESSAGES;
}

