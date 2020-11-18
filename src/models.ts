// Copyright (c) Microsoft Corporation.// Licensed under the MIT license.

import { VisualDescriptor } from "powerbi-client";

/**
 * Return value of methods that create a visual
 *
 * @export
 * @interface IVisualResponse
 */
export interface IVisualResponse {
    visual: VisualDescriptor;
}
