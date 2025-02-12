/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_extract_exif_files_exif__post } from '../models/Body_extract_exif_files_exif__post';
import type { Body_upload_file_files_upload__deployment_id__post } from '../models/Body_upload_file_files_upload__deployment_id__post';
import type { Body_upload_files_files_upload_deployment__deployment_id__post } from '../models/Body_upload_files_files_upload_deployment__deployment_id__post';
import type { Body_upload_files_files_upload_device__device_id__post } from '../models/Body_upload_files_files_upload_device__device_id__post';
import type { Body_upload_files_files_upload_files__deployment_id__post } from '../models/Body_upload_files_files_upload_files__deployment_id__post';
import type { Body_upload_files_files_upload_project__project_id__post } from '../models/Body_upload_files_files_upload_project__project_id__post';
import type { Body_upload_files_files_upload_site__site_id__post } from '../models/Body_upload_files_files_upload_site__site_id__post';
import type { Body_upload_zip_files_upload_zip__deployment_id__post } from '../models/Body_upload_zip_files_upload_zip__deployment_id__post';
import type { Files } from '../models/Files';
import type { UpdateFile } from '../models/UpdateFile';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FilesService {

    /**
     * Get Files
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFilesFilesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Update Annotations
     * @param fileId
     * @param requestBody
     * @returns Files Successful Response
     * @throws ApiError
     */
    public static updateAnnotationsFilesAnnotationFileIdPatch(
        fileId: string,
        requestBody: UpdateFile,
    ): CancelablePromise<Files> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/files/annotation/{file_id}',
            path: {
                'file_id': fileId,
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
     * Get Files With Filters
     * @param deploymentId
     * @param species
     * @param family
     * @param genus
     * @param classe
     * @param order
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFilesWithFiltersFilesFiltersDeploymentIdGet(
        deploymentId: number,
        species?: string,
        family?: string,
        genus?: string,
        classe?: string,
        order?: string,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/filters/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            query: {
                'species': species,
                'family': family,
                'genus': genus,
                'classe': classe,
                'order': order,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Display File
     * @param name
     * @returns any Successful Response
     * @throws ApiError
     */
    public static displayFileFilesUrlsGet(
        name: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/urls/',
            query: {
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Extract Exif
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static extractExifFilesExifPost(
        formData: Body_extract_exif_files_exif__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/exif/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload Files
     * @param deploymentId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFilesFilesUploadFilesDeploymentIdPost(
        deploymentId: number,
        formData: Body_upload_files_files_upload_files__deployment_id__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload_files/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload Files
     * @param deviceId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFilesFilesUploadDeviceDeviceIdPost(
        deviceId: number,
        formData: Body_upload_files_files_upload_device__device_id__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload/device/{device_id}',
            path: {
                'device_id': deviceId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload File
     * @param deploymentId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFileFilesUploadDeploymentIdPost(
        deploymentId: number,
        formData: Body_upload_file_files_upload__deployment_id__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload Files
     * @param projectId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFilesFilesUploadProjectProjectIdPost(
        projectId: number,
        formData: Body_upload_files_files_upload_project__project_id__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload/project/{project_id}',
            path: {
                'project_id': projectId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload Files
     * @param siteId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFilesFilesUploadSiteSiteIdPost(
        siteId: number,
        formData: Body_upload_files_files_upload_site__site_id__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload/site/{site_id}',
            path: {
                'site_id': siteId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload Files
     * @param deploymentId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadFilesFilesUploadDeploymentDeploymentIdPost(
        deploymentId: number,
        formData: Body_upload_files_files_upload_deployment__deployment_id__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload/deployment/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Files
     * @param deploymentId
     * @param name
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteFilesFilesDeleteDeploymentDeploymentIdNamePost(
        deploymentId: number,
        name: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/delete/deployment/{deployment_id}/{name}',
            path: {
                'deployment_id': deploymentId,
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Files
     * @param hashName
     * @param name
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteFilesFilesDeleteMediaHashNamePost(
        hashName: string,
        name: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/delete/media/{hash_name}',
            path: {
                'hash_name': hashName,
            },
            query: {
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Files
     * @param projectId
     * @param name
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteFilesFilesDeleteProjectProjectIdNamePost(
        projectId: number,
        name: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/delete/project/{project_id}/{name}',
            path: {
                'project_id': projectId,
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Files
     * @param deviceId
     * @param name
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteFilesFilesDeleteDeviceDeviceIdNamePost(
        deviceId: number,
        name: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/delete/device/{device_id}/{name}',
            path: {
                'device_id': deviceId,
                'name': name,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Download File
     * @param id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadFileFilesDownloadIdGet(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/download/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload Zip
     * @param deploymentId
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadZipFilesUploadZipDeploymentIdPost(
        deploymentId: number,
        formData: Body_upload_zip_files_upload_zip__deployment_id__post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload_zip/{deployment_id}',
            path: {
                'deployment_id': deploymentId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Deployment Files
     * @param deploymentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readDeploymentFilesFilesDeploymentIdGet(
        deploymentId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/{deployment_id}',
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
     * Get Length Deployment Files
     * @param deploymentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getLengthDeploymentFilesFilesDeploymentIdLengthGet(
        deploymentId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/{deployment_id}/length',
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
