// Copyright (c) Microsoft Corporation.// Licensed under the MIT license.

/*
 * Important note for module augmentation:
 * Importing powerbi-client for module augmentation.
 * Don't remove it in spite of not using pbi in the file.
 * In addition, do not change to import needed classes by name.
 */
import * as pbi from 'powerbi-client';

import {
    IBaseTarget,
    IError,
    IVisualCapabilities,
    IVisualLayout,
    IVisualPropertySelector,
    IVisualPropertyValue,
} from 'powerbi-models';

import { extensions } from './extensions';
import { IVisualResponse } from './models';

/*
 * Class Augmentation/Extension Notes:
 *   - No need for export: all declarations are implicitly exported in an ambient context (inside declare)
 *   - Class augmentation of instance methods works through interface declaration merge.
 *   - Class augmentation of static methods works through namespace declaration merge.
 */

/*
 * Augment 'report' module from 'powerbi-client'. Augmenting Report class from 'powerbi-client' directly is not possible.
 * This is due to an open issue in typescript: Re-exported classes cannot be augmented. A workaround is to augment the class from the internal module.
 * @see <a href="https://github.com/Microsoft/TypeScript/issues/12607">open issue</a>
 */
declare module 'report' {

    // See "Class Augmentation/Extension Notes" above.
    /**
     * Power BI report component
     *
     * @interface Report
     */
    interface Report {
        /**
         * Get a visual type capabilities
         *
         * @param visualType
         * @returns {Promise<IVisualCapabilities>}
         */
        getVisualCapabilities(visualType: string): Promise<IVisualCapabilities>;

        /**
         * Get all available visual types of a report.
         *
         * @returns {Promise<string[]>}
         */
        getAvailableVisualTypes(): Promise<string[]>;
    }
}

/*
 * Extending Page object of 'page' module declared in 'powerbi-client' library.
 * @see comments about declare module 'report'.
 */
declare module 'page' {
    // See "Class Augmentation/Extension Notes" above.
    /**
     * Power BI report page component
     *
     * @interface Page
     */
    interface Page {
        /**
         * Creates an empty visual of a specific type.
         *
         * IMPORTANT: Visuals which are not installed in visualization pane cannot be added.
         *            This is true for custom visuals that are not installed and native visuals that were uninstalled.
         *
         * @param visualType - The type of the visual to create.
         * @param layout – Optional. The layout which will be applied to the new visual. Default: a best effort to put a new visual in an empty space on the canvas.
         * @param autoFocus – Optional. Focus on the new visual after creation.
         *
         * @returns {ICreateVisualResponse}
         */
        createVisual(this: Page, visualType: string, layout?: IVisualLayout, autoFocus?: boolean): Promise<IVisualResponse>;

        /**
         * Deletes a visual by a visual name.
         *
         * @param visualName – The name of the visual to delete.
         */
        deleteVisual(this: Page, visualName: string): Promise<void>;
    }
}

/*
 * Extending VisualDescriptor object of 'visualDescriptor' module declared in 'powerbi-client' library.
 * @see comments about declare module 'report'.
 */
declare module 'visualDescriptor' {
    // See "Class Augmentation/Extension Notes" above.
    /**
     * Component to change visual properties
     *
     * @interface VisualDescriptor
     */
    interface VisualDescriptor {
        /**
         * Changes the visual type of an existing visual.
         *
         * @param visualType – a new visual type.
         */
       changeType(visualType: string): Promise<void>;

       /**
        * Get the visual's type capabilities
        *
        * @returns {(Promise<IVisualCapabilities>)}
        */
       getCapabilities(): Promise<IVisualCapabilities>;

       /**
        * Gets the display name of a data role field.
        *
        * @param dataRole - the name of the target data role.
        * @param index - the data field index.
        */
       getDataFieldDisplayName(dataRole: string, index: number): Promise<string>;

       /**
        * Sets the display name of a data role field.
        *
        * @param dataRole - the name of the target data role.
        * @param index - the index at which data field should be renamed.
        * @param newDisplayName - the new display name for the data role field.
        */
       setDataFieldDisplayName(dataRole: string, index: number, newDisplayName: string): Promise<IError>;

       /**
        * Adds a field to a data role.
        *
        * @param dataRole - the name of the target data role.
        * @param dataField - the field to add to the data role. The field can be a column, column with aggregation, measure, hierarchy, or hierarchy with aggregation.
        * @param index - Optional. The index at which data field should be added. Default: the field is added last.
        */
       addDataField(dataRole: string, dataField: IBaseTarget, index?: number): Promise<IError>;

       /**
        * Gets a list of fields defined in a data role.
        *
        * @param dataRole - a name of a data role.
        * @returns a list of the data role fields.
        */
       getDataFields(dataRole: string): Promise<IBaseTarget[]>;

       /**
        * Removes a data role field.
        *
        * @param dataRole - the name of the target data role.
        * @param index - the index at which data field should be deleted.
        */
       removeDataField(dataRole: string, index: number): Promise<IError>;

       /**
        * Get a visual property value.
        *
        * @param selector: a selector for the property.
        * ```javascript
        * visual.getProperty(selector)
        *  .then(value => { ... });
        * ```
        *
        * @returns {(Promise<IVisualPropertyValue>)}
        */
       getProperty(selector: IVisualPropertySelector): Promise<IVisualPropertyValue>;

       /**
        * Set a visual property value.
        *
        * @param selector: a selector for the property.
        * @param value: a value to set.
        * ```javascript
        * visual.setProperty(selector)
        *  .then(() => { ... });
        * ```
        */
       setProperty(selector: IVisualPropertySelector, value: IVisualPropertyValue): Promise<void>;

       /**
        * Reset property value to default value.
        *
        * @param selector: a selector for the property.
        * ```javascript
        * visual.resetProperty(selector)
        *  .then(() => { ... });
        * ```
        */
       resetProperty(selector: IVisualPropertySelector): Promise<void>;
    }
}

/**
 * @hidden
 */
export function startAuthoring(): void {
    extensions.forEach((extension) => {
        extension.initialize();
    });
}

startAuthoring();
