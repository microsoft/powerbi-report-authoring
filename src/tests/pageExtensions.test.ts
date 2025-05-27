import { Page } from 'powerbi-client';
import { ICreateVisualResponse, IVisualLayout } from 'powerbi-models';
import { PageExtensions } from '../extensions/pageExtensions';

describe('PageExtensions', () => {
  let page: Page;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    page = {
      name: 'testPage',
      report: {
        config: { uniqueId: 'test-uid' },
        iframe: { contentWindow: window } as any,
        service: {
          hpm: {
            post: jest.fn()
          }
        }
      }
    } as any as Page;

    new PageExtensions().initialize();
  });

  afterEach(() => {
    spy?.mockRestore();
  });

  it('should call pageExtensions.post with correct URL and body for createVisual', async () => {
    const layout: IVisualLayout = { x: 1, y: 2, width: 300, height: 200 };
    const response: ICreateVisualResponse = {
      visual: {
        name: 'visual1',
        title: 'Test Visual',
        type: 'barChart',
        layout
      }
    };

    spy = jest.spyOn(PageExtensions as any, 'post').mockResolvedValue(response);

    const result = await Page.prototype.createVisual.call(page, 'barChart', layout, true);

    expect(spy).toHaveBeenCalledWith(
      page,
      '/report/pages/testPage/createVisual',
      {
        visualType: 'barChart',
        layout,
        autoFocus: true
      }
    );

    expect(result.visual.name).toBe('visual1');
    expect(result.visual.type).toBe('barChart');
  });

  it('should call pageExtensions.post with correct URL and body for deleteVisual', async () => {
    spy = jest.spyOn(PageExtensions as any, 'post').mockResolvedValue({});

    await Page.prototype.deleteVisual.call(page, 'visual1');

    expect(spy).toHaveBeenCalledWith(
      page,
      '/report/pages/testPage/deleteVisual',
      { visualName: 'visual1' }
    );
  });

  it('should throw error when createVisual fails', async () => {
    const error = { error: 'create visual request failed' };
    spy = jest.spyOn(PageExtensions as any, 'post').mockRejectedValue(error);

    await expect(Page.prototype.createVisual.call(page, 'barChart')).rejects.toEqual(error);
  });

  it('should throw error when deleteVisual fails', async () => {
    const error = { error: 'delete visual request failed' };
    spy = jest.spyOn(PageExtensions as any, 'post').mockRejectedValue(error);

    await expect(Page.prototype.deleteVisual.call(page, 'visual1')).rejects.toEqual(error);
  });
});