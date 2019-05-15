import { IPowerBIClientExtension } from "./powerBIClientExtension";
import { PageExtensions } from "./pageExtensions";
import { VisualExtensions } from "./visualExtensions";

export const extensions: IPowerBIClientExtension[] = [
    new PageExtensions(),
    new VisualExtensions()
];
