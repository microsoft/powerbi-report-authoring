import { ReportExtensions } from '../extensions/reportExtensions';
import { Report } from 'powerbi-client';

describe('ReportExtensions', () => {
  let report: Report;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    report = {
      config: { uniqueId: 'test-uid' },
      iframe: { contentWindow: window } as any,
      service: { hpm: { get: jest.fn() } }
    } as unknown as Report;

    new ReportExtensions().initialize();
  });

  afterEach(() => {
    if (spy) {
      spy.mockRestore();
    }
  });

  it('should throw error if getVisualCapabilities is called without visualType', () => {
    expect(() => {
      (Report.prototype as any).getVisualCapabilities();
    }).toThrow('visualType parameter is missing');
  });

  it('should call reportExtensions.get with correct URL for getVisualCapabilities', async () => {
    spy = jest.spyOn(ReportExtensions as any, 'get').mockResolvedValue({ capabilities: [] });

    await (Report.prototype as any).getVisualCapabilities.call(report,'barChart');

    expect(spy).toHaveBeenCalledWith(report, '/report/visuals/types/barChart/capabilities');
  });

  it('should call reportExtensions.get with correct URL for getAvailableVisualTypes', async () => {
    spy = jest.spyOn(ReportExtensions as any, 'get').mockResolvedValue(['barChart', 'lineChart']);

    await (Report.prototype as any).getAvailableVisualTypes.call(report);

    expect(spy).toHaveBeenCalledWith(report, '/report/availableVisualTypes');
  });
});
