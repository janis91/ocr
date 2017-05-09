import { FinishedJob } from './finished-job.poto';

describe('For the finished job plain old typescript object', () => {
    let cut: FinishedJob;

    beforeEach(() => {
        cut = new FinishedJob();
    });

    describe('the toJSON function', () => {
        it('should return the object as JSON', () => {
            cut.id = 1;
            cut.error = true;
            cut.log = 'test';

            const result = cut.toJSON();

            expect(result).toBe(JSON.stringify({ id: 1, error: true, log: 'test' }));
        });
    });
});
