import { VisualDescriptor } from 'powerbi-client';
import { IError, IVisualPropertySelector, IVisualPropertyValue } from 'powerbi-models';
import { VisualExtensions } from '../extensions/visualExtensions';

describe('VisualExtensions', () => {
  let visual: VisualDescriptor;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    visual = {
      name: 'testVisual',
      type: 'barChart',
      page: {
        name: 'testPage',
        report: {
          config: { uniqueId: 'test-uid' },
          iframe: { contentWindow: window } as any,
          service: {
            hpm: {
              get: jest.fn(),
              post: jest.fn(),
              put: jest.fn(),
              delete: jest.fn()
            }
          }
        }
      }
    } as any as VisualDescriptor;

    new VisualExtensions().initialize();
  });

  afterEach(() => {
    spy?.mockRestore();
  });

  it('should call visualExtensions.post with correct URL and body for changeType', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'post').mockResolvedValue({});

    await (VisualDescriptor.prototype).changeType.call(visual, 'columnChart');

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/changeType', { visualType: 'columnChart' });
  });

  it('should call visualExtensions.get with correct URL for getCapabilities', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'get').mockResolvedValue({ capabilities: [] });

    await (VisualDescriptor.prototype).getCapabilities.call(visual);

    expect(spy).toHaveBeenCalledWith(visual, '/report/visuals/types/barChart/capabilities');
  });

  it('should call visualExtensions.get with correct URL for getDataFieldDisplayName', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'get').mockResolvedValue('DisplayName');

    await (VisualDescriptor.prototype).getDataFieldDisplayName.call(visual, 'Axis', 0);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Axis/fields/0/displayName');
  });

  it('should call visualExtensions.put with correct URL and body for setDataFieldDisplayName', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'put').mockResolvedValue({} as IError);

    await (VisualDescriptor.prototype).setDataFieldDisplayName.call(visual, 'Axis', 0, 'New Name');

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Axis/fields/0/displayName', { newDisplayName: 'New Name' });
  });

  it('should call visualExtensions.post with correct URL and body for addDataField', async () => {
    const dataField = { table: 'Sales', column: 'Amount' };
    spy = jest.spyOn(VisualExtensions as any, 'post').mockResolvedValue({} as IError);

    await (VisualDescriptor.prototype).addDataField.call(visual, 'Values', dataField, 1);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Values/fields/1', dataField);
  });

  it('should call visualExtensions.get with correct URL for getDataFields', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'get').mockResolvedValue([]);

    await (VisualDescriptor.prototype).getDataFields.call(visual, 'Axis');

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Axis/fields');
  });

  it('should call visualExtensions.delete with correct URL and body for removeDataField', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'delete').mockResolvedValue({} as IError);

    await (VisualDescriptor.prototype).removeDataField.call(visual, 'Values', 2);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Values/fields/2', 2);
  });

  it('should call visualExtensions.post with correct URL and body for getProperty', async () => {
    const selector: IVisualPropertySelector = { objectName: 'title', propertyName: 'fontSize' };
    spy = jest.spyOn(VisualExtensions as any, 'post').mockResolvedValue({ value: 20 });

    await (VisualDescriptor.prototype).getProperty.call(visual, selector);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/property', selector);
  });

  it('should call visualExtensions.put with correct URL and body for setProperty', async () => {
    const selector: IVisualPropertySelector = { objectName: 'title', propertyName: 'visible' };
    const value: IVisualPropertyValue = { value: true };
    spy = jest.spyOn(VisualExtensions as any, 'put').mockResolvedValue({});

    await (VisualDescriptor.prototype).setProperty.call(visual, selector, value);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/property', { selector, value });
  });

  it('should call setProperty with default value when resetProperty is called', async () => {
    const selector: IVisualPropertySelector = { objectName: 'title', propertyName: 'text' };
    visual.setProperty = jest.fn().mockResolvedValue({});

    await (VisualDescriptor.prototype).resetProperty.call(visual, selector);

    expect(visual.setProperty).toHaveBeenCalledWith(selector, {
      schema: 'http://powerbi.com/product/schema#default',
      value: {}
    });
  });

  it('should call visualExtensions.get with correct URL for getDataFieldName', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'get').mockResolvedValue('FieldName');

    await (VisualDescriptor.prototype).getDataFieldName.call(visual, 'Axis', 0);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Axis/fields/0/dataFieldName');
  });

  it('should call visualExtensions.get with correct URL for getFieldFormatString', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'get').mockResolvedValue('#,##0.00');

    await (VisualDescriptor.prototype).getFieldFormatString.call(visual, 'Values', 1);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Values/fields/1/formatString');
  });

  it('should call visualExtensions.put with correct URL and body for setFieldFormatString', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'put').mockResolvedValue({} as IError);

    await (VisualDescriptor.prototype).setFieldFormatString.call(visual, 'Values', 0, '#,##0');

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Values/fields/0/formatString', { formatString: '#,##0' });
  });

  it('should call visualExtensions.put with correct URL and body for setFieldHidden', async () => {
    spy = jest.spyOn(VisualExtensions as any, 'put').mockResolvedValue({} as IError);

    await (VisualDescriptor.prototype).setFieldHidden.call(visual, 'Legend', 2, true);

    expect(spy).toHaveBeenCalledWith(visual, '/report/pages/testPage/visuals/testVisual/dataroles/Legend/fields/2/hidden', { isHidden: true });
  });
});