import { ServiceHttpStatusResult } from "../api/ServiceResult";

/**
 * Api Error
 */
export class ApiError extends Error {
    constructor(public detail: ServiceHttpStatusResult<any>) {
        super();
    }
}
