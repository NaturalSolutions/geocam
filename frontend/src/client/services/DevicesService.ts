/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeviceBase } from '../models/DeviceBase';
import type { DeviceMenu } from '../models/DeviceMenu';
import type { Devices } from '../models/Devices';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DevicesService {

    /**
     * Read Devices
     * @param skip
     * @param limit
     * @returns Devices Successful Response
     * @throws ApiError
     */
    public static readDevicesDevicesGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<Devices>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/',
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
     * Create Device
     * @param requestBody
     * @returns Devices Successful Response
     * @throws ApiError
     */
    public static createDeviceDevicesPost(
        requestBody: DeviceBase,
    ): CancelablePromise<Devices> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/devices/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Device
     * @param deviceId
     * @returns Devices Successful Response
     * @throws ApiError
     */
    public static readDeviceDevicesDeviceIdGet(
        deviceId: number,
    ): CancelablePromise<Devices> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/{device_id}',
            path: {
                'device_id': deviceId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Device
     * @param deviceId
     * @param requestBody
     * @returns Devices Successful Response
     * @throws ApiError
     */
    public static updateDeviceDevicesDeviceIdPut(
        deviceId: number,
        requestBody: DeviceBase,
    ): CancelablePromise<Devices> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/devices/{device_id}',
            path: {
                'device_id': deviceId,
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
     * Delete Device
     * @param deviceId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteDeviceDevicesDeviceIdDelete(
        deviceId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/devices/{device_id}',
            path: {
                'device_id': deviceId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Menu Devices
     * @param skip
     * @param limit
     * @returns DeviceMenu Successful Response
     * @throws ApiError
     */
    public static readMenuDevicesDevicesMenuGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<DeviceMenu>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/menu/',
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
     * Fetch Device Thumbnail
     * @param deviceId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static fetchDeviceThumbnailDevicesFetchDeviceThumbnailDeviceIdGet(
        deviceId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/fetch_device_thumbnail/{device_id}',
            path: {
                'device_id': deviceId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
