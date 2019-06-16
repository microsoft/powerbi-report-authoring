// Copyright (c) Microsoft Corporation.// Licensed under the MIT license.

import { PageExtensions } from "./pageExtensions";
import { IPowerBIClientExtension } from "./powerBIClientExtension";
import { ReportExtensions } from "./reportExtensions";
import { VisualExtensions } from "./visualExtensions";

// TODO: Add unit tests to all methods in all extensions.
export const extensions: IPowerBIClientExtension[] = [
    new ReportExtensions(),
    new PageExtensions(),
    new VisualExtensions()
];
