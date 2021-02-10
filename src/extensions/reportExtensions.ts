// Copyright (c) Microsoft Corporation.// Licensed under the MIT license.

import { HttpPostMessage } from 'http-post-message';
import { Report } from 'powerbi-client';
import {
    IError,
    IVisualCapabilities
} from 'powerbi-models';

import { Config } from '../config';
import { Errors } from '../errors';
import { IPowerBIClientExtension } from './powerBIClientExtension';

/**
 * @hidden
 * @export
 * @class ReportExtensions
 * @implements {IPowerBIClientExtension}
 */
export class ReportExtensions implements IPowerBIClientExtension {

    /**
     * @hidden
     */
    private static get<T>(report: Report, url: string): Promise<T> {
        const hpm = ReportExtensions.hpm(report);
        const uid = ReportExtensions.uid(report);
        const contentWindow = ReportExtensions.contentWindow(report);
        const sdkVersion = Config.version;

        return hpm.get<T>(url, { uid, sdkVersion }, contentWindow)
            .then(
                (response) => response.body,
                (response) => {
                    throw response.body;
                });
    }

    /**
     * @hidden
     */
    private static contentWindow(report: Report): Window {
        return report.iframe.contentWindow;
    }

    /**
     * @hidden
     */
    private static uid(report: Report): string {
        return report.config.uniqueId;
    }

    /**
     * @hidden
     */
    private static hpm(report: Report): HttpPostMessage {
        return report.service.hpm;
    }

    /**
     * @hidden
     */
    initialize(): void {
        if (Report == null) {
            console.error(Errors.PowerBIClientIsNotInitialized);
            return;
        }

        Report.prototype.getVisualCapabilities = function(this: Report, visualType: string): Promise<IVisualCapabilities> {
            if (!visualType)
            {
                const error: IError = { message: "visualType parameter is missing" };
                throw error;
            }

            return ReportExtensions.get<IVisualCapabilities>(this, `/report/visuals/types/${visualType}/capabilities`);
        };

        Report.prototype.getAvailableVisualTypes = function(this: Report): Promise<string[]> {
            return ReportExtensions.get<string[]>(this, `/report/availableVisualTypes`);
        };
    }
}
