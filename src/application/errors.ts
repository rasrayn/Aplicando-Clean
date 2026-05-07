export abstract class AppError extends Error {
    abstract readonly type: 'validation' | 'not_found' | 'conflict' | 'infra';

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    readonly type = 'validation';

    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends AppError {
    readonly type = 'not_found';

    constructor(message: string) {
        super(message);
    }
}

export class ConflictError extends AppError {
    readonly type = 'conflict';

    constructor(message: string) {
        super(message);
    }
}

export class InfraError extends AppError {
    readonly type = 'infra';

    constructor(message: string) {
        super(message);
    }
}

export type ApplicationError =
    | ValidationError
    | NotFoundError
    | ConflictError
    | InfraError;
