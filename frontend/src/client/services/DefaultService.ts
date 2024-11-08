/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Read Users
     * @param skip
     * @param limit
     * @returns User Successful Response
     * @throws ApiError
     */
    public static readUsersUsersGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create User
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static createUserUsersPost(
        requestBody: UserCreate,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read User
     * @param userId
     * @returns User Successful Response
     * @throws ApiError
     */
    public static readUserUsersUserIdGet(
        userId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update User
     * @param userId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static updateUserUsersUserIdPut(
        userId: number,
        requestBody: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete User
     * @param userId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteUserUsersUserIdDelete(
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

}
