import { PageExtensions } from "./pageExtensions";
import { IPowerBIClientExtension } from "./powerBIClientExtension";
import { ReportExtensions } from "./reportExtensions";
import { VisualExtensions } from "./visualExtensions";

export const extensions: IPowerBIClientExtension[] = [
    new ReportExtensions(),
    new PageExtensions(),
    new VisualExtensions()
];
