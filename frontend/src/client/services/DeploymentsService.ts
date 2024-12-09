/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Deployments } from '../models/Deployments';
import type { DeploymentWithFile } from '../models/DeploymentWithFile';
import type { DeploymentWithTemplateSequence } from '../models/DeploymentWithTemplateSequence';
import type { NewDeploymentWithTemplateSequence } from '../models/NewDeploymentWithTemplateSequence';
import type { ReadDeployment } from '../models/ReadDeployment';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DeploymentsService {

    /**
     * Read Deployments
     * @param skip
     * @param limit
     * @returns Deployments Successful Response
     * @throws ApiError
     */
    public static readDeploymentsDeploymentsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<Deployments>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deployments/',
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
     * Create Deployment
     * @param requestBody
     * @returns Deployments Successful Response
     * @throws ApiError
     */
    public static createDeploymentDeploymentsPost(
        requestBody: NewDeploymentWithTemplateSequence,
    ): CancelablePromise<Deployments> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deployments/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Deployment
     * @param deploymentId
     * @returns Deployments Successful Response
     * @throws ApiError
     */
    public static readDeploymentDeploymentsDeploymentIdGet(
        deploymentId: number,
    ): CancelablePromise<Deployments> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deployments/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Deployment
     * @param requestBody
     * @returns DeploymentWithTemplateSequence Successful Response
     * @throws ApiError
     */
    public static updateDeploymentDeploymentsDeploymentIdPut(
        requestBody: DeploymentWithTemplateSequence,
    ): CancelablePromise<DeploymentWithTemplateSequence> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/deployments/{deployment_id}',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Deployment
     * @param deploymentId
     * @returns Deployments Successful Response
     * @throws ApiError
     */
    public static deleteDeploymentDeploymentsDeploymentIdDelete(
        deploymentId: number,
    ): CancelablePromise<Deployments> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/deployments/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Project Deployments
     * @param projectId
     * @returns Deployments Successful Response
     * @throws ApiError
     */
    public static readProjectDeploymentsDeploymentsProjectProjectIdGet(
        projectId: number,
    ): CancelablePromise<Array<Deployments>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deployments/project/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Deployments With Files
     * @param skip
     * @param limit
     * @returns DeploymentWithFile Successful Response
     * @throws ApiError
     */
    public static readDeploymentsWithFilesDeploymentsFilesGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<DeploymentWithFile>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deployments/files/',
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
     * Read Deployments With Template Sequence
     * @param skip
     * @param limit
     * @returns DeploymentWithTemplateSequence Successful Response
     * @throws ApiError
     */
    public static readDeploymentsWithTemplateSequenceDeploymentsTemplateSequenceGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<DeploymentWithTemplateSequence>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deployments/template_sequence/',
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
     * Read Device Deployments
     * @param deviceId
     * @param skip
     * @param limit
     * @returns ReadDeployment Successful Response
     * @throws ApiError
     */
    public static readDeviceDeploymentsDeploymentsDeviceDeviceIdGet(
        deviceId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<ReadDeployment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deployments/device/{device_id}',
            path: {
                'device_id': deviceId,
            },
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

    public static readDeploymentThumbnail(
        deploymentId: number | undefined,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deployments/fetch_deployment_thumbnail/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
