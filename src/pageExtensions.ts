import { HttpPostMessage } from 'http-post-message';
import { Page, IPageNode, VisualDescriptor } from 'powerbi-client';
import {
    ICreateVisualResponse,
    ICreateVisualRequest,
    IVisualLayout,
    IVisual
} from 'powerbi-models';

import { IVisualResponse } from './models';
import { Errors } from './errors';

export function startPageAuthoring(): void {
    if (Page == null) {
        console.error(Errors.PowerBIClientIsNotInitialized);
        return;
    }

    Page.prototype.createVisual = function (this: Page, visualType: string, layout?: IVisualLayout): Promise<IVisualResponse> {
        return PageOperations.create(this).createVisual(visualType, layout);
    }

    Page.prototype.deleteVisual = function (this: Page, visualName: string): Promise<void> {
        return PageOperations.create(this).deleteVisual(visualName);
    }
}

class PageOperations implements IPageNode {
    constructor(private page: Page) {}

    static create(page: Page): PageOperations {
        return new PageOperations(page);
    }

    createVisual(visualType: string, layout?: IVisualLayout): Promise<IVisualResponse> {
        let createVisualRequest: ICreateVisualRequest = { visualType, layout };
        return this.hpm.post<ICreateVisualResponse>(`/report/pages/${this.page.name}/createVisual`, createVisualRequest, { uid: this.uid }, this.contentWindow)
        .then(response => {
            let visual: IVisual = response.body.visual;
            let visualResponse: IVisualResponse = {
                visual: new VisualDescriptor(this.page, visual.name, visual.title, visual.type, visual.layout)
            };
            return visualResponse;
        },
        response => {
            throw response.body;
        });
    }

    deleteVisual(visualName: string): Promise<void> {
        return this.hpm.post<void>(`/report/pages/${this.page.name}/deleteVisual`, { visualName }, { uid: this.uid }, this.contentWindow)
        .then(response => {
            return response.body;
        },
        response => {
            throw response.body;
        });
    }

    private get contentWindow(): Window {
        return this.page.report.iframe.contentWindow;
    }

    private get uid(): string {
        return this.page.report.config.uniqueId;
    }

    private get hpm(): HttpPostMessage {
        return this.page.report.service.hpm;
    }
}
