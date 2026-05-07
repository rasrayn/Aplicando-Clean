/**
 * Result type para manejar errores de forma funcional
 * Representa un valor que puede ser un éxito (Ok) o un fracaso (Fail)
 */

export type Result<T, E> = Ok<T> | Fail<E>;

export interface Ok<T> {
    readonly tag: 'ok';
    readonly value: T;
}

export interface Fail<E> {
    readonly tag: 'fail';
    readonly error: E;
}

/**
 * Crea un Result exitoso
 * @param value Valor del éxito
 * @returns Result con tag 'ok'
 */
export const ok = <T>(value: T): Result<T, never> => ({
    tag: 'ok',
    value,
});

/**
 * Crea un Result fallido
 * @param error Error del fracaso
 * @returns Result con tag 'fail'
 */
export const fail = <E>(error: E): Result<never, E> => ({
    tag: 'fail',
    error,
});

/**
 * Comprueba si un Result es un éxito
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
    result.tag === 'ok';

/**
 * Comprueba si un Result es un fracaso
 */
export const isFail = <T, E>(result: Result<T, E>): result is Fail<E> =>
    result.tag === 'fail';

/**
 * Mapea el valor de un Result exitoso
 */
export const map = <T, E, U>(
    result: Result<T, E>,
    fn: (value: T) => U
): Result<U, E> => (isOk(result) ? ok(fn(result.value)) : result);

/**
 * Mapea el error de un Result fallido
 */
export const mapError = <T, E, F>(
    result: Result<T, E>,
    fn: (error: E) => F
): Result<T, F> => (isFail(result) ? fail(fn(result.error)) : result);

/**
 * Aplica una función que retorna un Result
 */
export const flatMap = <T, E, U>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>
): Result<U, E> => (isOk(result) ? fn(result.value) : result);

/**
 * Retorna el valor o un valor por defecto si es un fracaso
 */
export const getOrElse = <T, E>(
    result: Result<T, E>,
    defaultValue: T
): T => (isOk(result) ? result.value : defaultValue);

/**
 * Ejecuta una función según el tag del Result
 */
export const fold = <T, E, U>(
    result: Result<T, E>,
    onFail: (error: E) => U,
    onOk: (value: T) => U
): U => (isOk(result) ? onOk(result.value) : onFail(result.error));
