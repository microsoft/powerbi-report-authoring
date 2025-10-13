// Copyright (c) Microsoft Corporation.// Licensed under the MIT license.

/*
 * Important note for module augmentation:
 * Importing powerbi-client for module augmentation.
 * Don't remove it in spite of not using pbi in the file.
 * In addition, do not change to import needed classes by name.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
     * This is true for custom visuals that are not installed and native visuals that were uninstalled.
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
     * @remarks
     * The visual type will not be changed if the visual contains visual calculations or hidden fields 
     * and the target visual type is incompatible with these features.
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
     * Sets the display name of a data role field. This will also set the DataFieldName which will be unique per visual.
     *
     * @param dataRole - the name of the target data role.
     * @param index - the index at which data field should be renamed.
     * @param newDisplayName - the new display name for the data role field. Will ensure that DataFieldName is unique
     */
    setDataFieldDisplayName(dataRole: string, index: number, newDisplayName: string): Promise<IError>;

    /**
     * Adds a field to a data role.
     *
     * @param dataRole - the name of the target data role.
     * @param dataField - the field to add to the data role. The field can be one of the following:
     *     - column,
     *     - column with aggregation,
     *        - can be hidden
     *     - measure,
     *        - can be hidden
     *     - hierarchy,
     *     - hierarchy with aggregation,
     *        - can be hidden
     *     - visual calculation
     *        - can be hidden
     * hidden fields and visual calculations can be added if the visual can support visual calculation.
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

    /**
     * Gets the name of a data role field. This name is unique within the visual. 
     * This is what should be used to reference a field in the DAX Expressions of Visual Calculations
     *
     * @param dataRole - the name of the target data role.
     * @param index - the data field index.
     */
    getDataFieldName(dataRole: string, index: number): Promise<string>;

    /**
     * Gets the format string of a data role field.
     * This format string is scoped at the visual level.
     *
     * @param dataRole - the name of the target data role.
     * @param index - the data field index.
     */
    getFieldFormatString(dataRole: string, index: number): Promise<string>;

    /**
     * Sets the format string of a data role field. 
     * This format string is scoped at the visual level.
     *
     * @param dataRole - the name of the target data role.
     * @param index - the data field index.
     * @param formatString - the format string.
     */
    setFieldFormatString(dataRole: string, index: number, formatString: string): Promise<IError>;

    /**
     * Sets whether a data role field is hidden or not.
     * 
     * @remarks
     * - Only measures, aggregated fields, and visual calculations can be hidden.
     * - You can only hide the fields if the visual supports visual calculation.
     * - If unhiding a field causes an overflow within the dataRole, the system will try to hide another field within the dataRole.
     *
     * @param dataRole - the name of the target data role.
     * @param index - the data field index.
     * @param isHidden - whether the field should be hidden.
     */
    setFieldHidden(dataRole: string, index: number, isHidden: boolean): Promise<IError>;
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
