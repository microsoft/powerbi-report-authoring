import { HttpPostMessage } from 'http-post-message';
import { VisualDescriptor } from 'powerbi-client';
import {
    IBaseTarget,
    IDefaultProperty,
    IError,
    IVisualCapabilities,
    IVisualPropertySelector,
    IVisualPropertyValue,
} from 'powerbi-models';

import { config } from '../config';
import { Errors } from '../errors';
import { IPowerBIClientExtension } from './powerBIClientExtension';

export class VisualExtensions implements IPowerBIClientExtension {
    initialize(): void {
        if (VisualDescriptor == null) {
            console.error(Errors.PowerBIClientIsNotInitialized);
            return;
        }

        VisualDescriptor.prototype.changeType = function (this: VisualDescriptor, visualType: string): Promise<void> {
          return VisualExtensions.post<void>(this, `/report/pages/${this.page.name}/visuals/${this.name}/changeType`, { visualType });
        };

        VisualDescriptor.prototype.getCapabilities = function(this: VisualDescriptor): Promise<IVisualCapabilities> {
            return VisualExtensions.get<IVisualCapabilities>(this, `/report/visuals/types/${this.type}/capabilities`);
        };

        VisualDescriptor.prototype.addDataField = function(this: VisualDescriptor, dataRole: string, dataField: IBaseTarget): Promise<IError> {
            return VisualExtensions.post<IError>(this, `/report/pages/${this.page.name}/visuals/${this.name}/dataroles/${dataRole}/fields`, dataField);
        };

        VisualDescriptor.prototype.getDataFields = function(this: VisualDescriptor, dataRole: string): Promise<IBaseTarget[]> {
          return VisualExtensions.get<IBaseTarget[]>(this, `/report/pages/${this.page.name}/visuals/${this.name}/dataroles/${dataRole}/fields`);
        };

        VisualDescriptor.prototype.removeDataField = function(this: VisualDescriptor, dataRole: string, index: number): Promise<IError> {
          const url = `/report/pages/${this.page.name}/visuals/${this.name}/dataroles/${dataRole}/fields/${index}`;
          return VisualExtensions.delete<IError>(this, url, index);
        };

        VisualDescriptor.prototype.getProperty = function(this: VisualDescriptor, selector: IVisualPropertySelector): Promise<IVisualPropertyValue> {
            return VisualExtensions.post<IVisualPropertyValue>(this, `/report/pages/${this.page.name}/visuals/${this.name}/property`, selector)
        };

        VisualDescriptor.prototype.setProperty = function(this: VisualDescriptor, selector: IVisualPropertySelector, value: IVisualPropertyValue): Promise<void> {
            return VisualExtensions.put<void>(this, `/report/pages/${this.page.name}/visuals/${this.name}/property`, { selector: selector, value: value })
        };

        VisualDescriptor.prototype.resetProperty = function(this: VisualDescriptor, selector: IVisualPropertySelector): Promise<void> {
          return this.setProperty(selector, { schema: "http://powerbi.com/product/schema#default", value: <IDefaultProperty>{} });
        };
    }

    private static delete<T>(visual: VisualDescriptor, url: string, body: any): Promise<T> {
      return VisualExtensions.sendRequestWithBody(visual, "delete", url, body);
    }

    private static post<T>(visual: VisualDescriptor, url: string, body: any): Promise<T> {
        return VisualExtensions.sendRequestWithBody(visual, "post", url, body);
    }

    private static put<T>(visual: VisualDescriptor, url: string, body: any): Promise<T> {
        return VisualExtensions.sendRequestWithBody(visual, "put", url, body);
    }

    private static sendRequestWithBody<T>(visual: VisualDescriptor, method: "post" | "delete" | "put", url: string, body: any): Promise<T> {
        const hpm = VisualExtensions.hpm(visual);
        const uid = VisualExtensions.uid(visual);
        const contentWindow = VisualExtensions.contentWindow(visual);
        const sdkVersion = config.version;

        return hpm[<string>method]<T>(url, body, { uid, sdkVersion }, contentWindow)
            .then(
                response => response.body,
                response => {
                    throw response.body;
                });
    }

    private static get<T>(visual: VisualDescriptor, url: string): Promise<T> {
      const hpm = VisualExtensions.hpm(visual);
      const uid = VisualExtensions.uid(visual);
      const contentWindow = VisualExtensions.contentWindow(visual);
      const sdkVersion = config.version;

      return hpm.get<T>(url, { uid, sdkVersion }, contentWindow)
          .then(
              response => response.body,
              response => {
                  throw response.body;
              });
  }

    private static contentWindow(visual: VisualDescriptor): Window {
        return visual.page.report.iframe.contentWindow;
    }

    private static uid(visual: VisualDescriptor): string {
        return visual.page.report.config.uniqueId;
    }

    private static hpm(visual: VisualDescriptor): HttpPostMessage {
        return visual.page.report.service.hpm;
    }
}
