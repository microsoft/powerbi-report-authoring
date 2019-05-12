import { HttpPostMessage } from 'http-post-message';
import { VisualDescriptor, IVisualNode } from 'powerbi-client';
import {
    IBaseTarget,
    IDefaultProperty,
    IError,
    IVisualCapabilities,
    IVisualPropertySelector,
    IVisualPropertyValue,
} from 'powerbi-models';

import { config } from './config';

export function startVisualAuthoring(): void {
    VisualDescriptor.prototype.changeType = function (this: VisualDescriptor, visualType: string): Promise<void> {
        return VisualOperations.create(this).changeType(visualType);
    };

    VisualDescriptor.prototype.getCapabilities = function(): Promise<IVisualCapabilities> {
        return VisualOperations.create(this).getCapabilities();
    };

    VisualDescriptor.prototype.addDataField = function(dataRole: string, dataField: IBaseTarget): Promise<IError> {
        return VisualOperations.create(this).addDataField(dataRole, dataField);
    };

    VisualDescriptor.prototype.getDataFields = function(dataRole: string): Promise<IBaseTarget> {
        return VisualOperations.create(this).getDataFields(dataRole);
    };

    VisualDescriptor.prototype.removeDataField = function(dataRole: string, index: number): Promise<IError> {
        return VisualOperations.create(this).removeDataField(dataRole, index);
    };

    VisualDescriptor.prototype.getProperty = function(selector: IVisualPropertySelector): Promise<IVisualPropertyValue> {
        return VisualOperations.create(this).getProperty(selector);
    };

    VisualDescriptor.prototype.setProperty = function(selector: IVisualPropertySelector, value: IVisualPropertyValue): Promise<void> {
        return VisualOperations.create(this).setProperty(selector, value);
    };

    VisualDescriptor.prototype.resetProperty = function(selector: IVisualPropertySelector): Promise<void> {
        return VisualOperations.create(this).resetProperty(selector);
    };
}

class VisualOperations implements IVisualNode {
    constructor(private visual: VisualDescriptor) {}

    static create(visual: VisualDescriptor): VisualOperations {
        return new VisualOperations(visual);
    }

    changeType(visualType: string): Promise<void> {
      return this.hpm.post<void>(`/report/pages/${this.pageName}/visuals/${this.visualName}/changeType`, { visualType }, { uid: this.uid }, this.contentWindow)
      .then(response => {
        return response.body;
      },
      response => {
        throw response.body;
      });
    }

    getCapabilities(): Promise<IVisualCapabilities> {
      const url = `/report/visuals/types/${this.visual.type}/capabilities`;
      return this.hpm.get<IVisualCapabilities>(url, { uid: this.uid }, this.contentWindow)
        .then(response => response.body,
          response => {
            throw response.body;
          });
    }

    getDataFields(dataRole: string): Promise<IBaseTarget> {
      const url = `/report/pages/${this.pageName}/visuals/${this.visualName}/dataroles/${dataRole}/fields`;
      return this.hpm.get<IBaseTarget>(url, { uid: this.uid }, this.contentWindow)
        .then(response => response.body,
          response => {
            throw response.body;
          });
    }

    addDataField(dataRole: string, dataField: IBaseTarget): Promise<IError> {
      const url = `/report/pages/${this.pageName}/visuals/${this.visualName}/dataroles/${dataRole}/fields`;
      return this.hpm.post<IError>(url, dataField, { uid: this.uid }, this.contentWindow)
        .then(response => response.body,
          response => {
            throw response.body;
          });
    }

    removeDataField(dataRole: string, index: number): Promise<IError> {
      const url = `/report/pages/${this.pageName}/visuals/${this.visualName}/dataroles/${dataRole}/fields/${index}`;
      return this.hpm.delete<IError>(url, index, { uid: this.uid }, this.contentWindow)
        .then(response => response.body,
          response => {
            throw response.body;
          });
    }

    getProperty(selector: IVisualPropertySelector): Promise<IVisualPropertyValue> {
      return this.hpm.post<IVisualPropertyValue>(`/report/pages/${this.pageName}/visuals/${this.visualName}/property`, selector, { uid: this.uid, sdkVersion: config.version }, this.contentWindow)
        .then(response => response.body,
          response => {
            throw response.body;
          });
    }

    setProperty(selector: IVisualPropertySelector, value: IVisualPropertyValue): Promise<void> {
      return this.hpm.put<void>(`/report/pages/${this.pageName}/visuals/${this.visualName}/property`, { selector: selector, value: value }, { uid: this.uid, sdkVersion: config.version }, this.contentWindow)
      .then(response => response.body,
        response => {
          throw response.body;
        });
    }

    resetProperty(selector: IVisualPropertySelector): Promise<void> {
      return this.setProperty(selector, { schema: "http://powerbi.com/product/schema#default", value: <IDefaultProperty>{} });
    }

    private get contentWindow(): Window {
        return this.visual.page.report.iframe.contentWindow;
    }

    private get uid(): string {
        return this.visual.page.report.config.uniqueId;
    }

    private get pageName(): string {
        return this.visual.page.name;
    }

    private get visualName(): string {
        return this.visual.name;
    }

    private get hpm(): HttpPostMessage {
        return this.visual.page.report.service.hpm;
    }
}
