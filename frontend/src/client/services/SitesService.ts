/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SiteBase } from '../models/SiteBase';
import type { Sites } from '../models/Sites';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SitesService {

    /**
     * Read Sites
     * @param skip
     * @param limit
     * @returns Sites Successful Response
     * @throws ApiError
     */
    public static readSitesSitesGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<Sites>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sites/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    public static getSitesNumber(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sites/length',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Site
     * @param requestBody
     * @returns Sites Successful Response
     * @throws ApiError
     */
    public static createSiteSitesPost(
        requestBody: SiteBase,
    ): CancelablePromise<Sites> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sites/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Site
     * @param siteId
     * @returns Sites Successful Response
     * @throws ApiError
     */
    public static readSiteSitesSiteIdGet(
        siteId: number,
    ): CancelablePromise<Sites> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sites/{site_id}',
            path: {
                'site_id': siteId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Site
     * @param siteId
     * @param requestBody
     * @returns Sites Successful Response
     * @throws ApiError
     */
    public static updateSiteSitesSiteIdPut(
        siteId: number,
        requestBody: SiteBase,
    ): CancelablePromise<Sites> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/sites/{site_id}',
            path: {
                'site_id': siteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Site
     * @param siteId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteSiteSitesSiteIdDelete(
        siteId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/sites/{site_id}',
            path: {
                'site_id': siteId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    public static readSiteThumbnail(
        siteId: number | undefined,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sites/fetch_site_thumbnail/{site_id}',
            path: {
                'site_id': siteId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
