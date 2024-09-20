export class CustomError extends Error {
    code: string;
    name: string;
    errors: string[];

    constructor(name: string, message: string, code: string, errors: string[] = []) {
        super(message);
        this.name = name;
        this.code = code;
        this.errors = errors;
    }
}

export class OtpRequiredError extends CustomError {
    constructor(errors: string[] = []) {
        super('OtpRequiredError', 'OTP is required for authentication.', ERROR_CODE_OTP_REQUIRED, errors);
    }
}

export class OtpInvalidError extends CustomError {
    constructor(errors: string[] = []) {
        super('OtpInvalidError', 'Invalid OTP.', '1006', errors);
    }
}

export class AccountVerificationError extends CustomError {
    constructor(errors: string[] = []) {
        super('AccountVerificationError', 'Your account requires verification.', ERROR_CODE_ACCOUNT_VERIFICATION_PENDING, errors);
    }
}

export class InvalidCredentialsError extends CustomError {
    constructor(errors: string[] = []) {
        super('InvalidCredentialsError', 'Invalid credentials.', ERROR_CODE_INVALID_CREDENTIALS, errors);
    }
}

export class CommonAuthError extends CustomError {
    constructor(errors: string[] = []) {
        super('CommonAuthError', errors.length > 0 ? errors[0] : 'Invalid credentials.', ERROR_CODE_COMMON_AUTH_ERROR, errors);
    }
}

export const ERROR_CODE_COMMON_AUTH_ERROR: string = '1000' as const;
export const ERROR_CODE_INVALID_CREDENTIALS: string = '1003' as const;
export const ERROR_CODE_OTP_REQUIRED: string = '1005' as const;
export const ERROR_CODE_ACCOUNT_VERIFICATION_PENDING: string = '1010' as const;
