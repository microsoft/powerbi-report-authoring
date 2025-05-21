import { extensions } from '../extensions';
import { startAuthoring } from '../powerbi-report-authoring';

describe('powerbi-report-authoring', () => {
  it('calls initialize on all extensions', () => {
    // Spy on each extension's initialize method
    const spies = extensions.map(ext => jest.spyOn(ext, 'initialize'));

    startAuthoring();

    // Check that each extension's initialize method was called
    for (const spy of spies) {
      expect(spy).toHaveBeenCalled();
    }
  });
});

