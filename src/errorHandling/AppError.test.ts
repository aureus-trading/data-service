import {
  AppError,
  AppErrorPattern,
  ErrorInfoWithMeta,
} from './AppError';

const errorTypes: (keyof AppErrorPattern<any>)[] = [
  'Resolver',
  'Db',
  'Validation',
];

const throwFn = () => {
  throw new Error('Should not happen');
};
const throwPattern: AppErrorPattern<never> = {
  Resolver: throwFn,
  Validation: throwFn,
  Db: throwFn,
};

describe('AppError', () => {
  errorTypes.forEach(type => {
    it(`${type} should be created from message`, () => {
      AppError[type]('Error message', { info: 'some-info' }).matchWith({
        ...throwPattern,
        [type]: (err: ErrorInfoWithMeta) => {
          expect(err.error.message).toEqual('Error message');
          expect(err.meta).not.toBeUndefined();
          if (err.meta) expect(err.meta.info).toEqual('some-info');
        },
      });
    });

    it(`${type} should be created Error object`, () => {
      AppError[type](new Error('Error message'), {
        info: 'some-info',
      }).matchWith({
        ...throwPattern,
        [type]: (err: ErrorInfoWithMeta) => {
          expect(err.error.message).toEqual('Error message');
          expect(err.meta).not.toBeUndefined();
          if (err.meta) expect(err.meta.info).toEqual('some-info');
        },
      });
    });
  });
});
