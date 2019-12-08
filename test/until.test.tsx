import React from 'react';
import { create } from 'react-test-renderer';
import { until } from '../index';
import Lazy from './component/Lazy';

const first = (data: string) => <p>{data}</p>;
const firstRenderedFinished = create(first('finished')).toJSON();
const loader = <p>loading...</p>;
const loaderRendered = create(loader).toJSON();
const error = (data: string) => <p>{data}</p>;
const errorRenderedFinished = create(first('error')).toJSON();
const lazyRendered = create(<Lazy />).toJSON();

// Disable react-wrap-tests-with-act warning (unable to fix it...)
const regularError = console.error;
console.error = (...args: any[]) => {
  if (args[0].includes('react-wrap-tests-with-act')) {
    return null;
  } else {
    regularError.apply(this, args);
  }
};

test('until: shows loader first and element with props passed afterwards.', async () => {
  const promise = new Promise<string>(done =>
    setTimeout(() => done('finished'), 10)
  );
  let tree = create(until(promise, first, loader));
  expect(tree.toJSON()).toEqual(loaderRendered);
  await new Promise(done =>
    setTimeout(() => {
      expect(tree.toJSON()).toEqual(firstRenderedFinished);
      done();
    }, 10)
  );
});

test('until: shows loader first and fails when promise throws error.', async () => {
  const promise = new Promise<string>((done, fail) =>
    setTimeout(() => fail('error'), 10)
  );
  let tree = create(until(promise, first, loader, error));
  expect(tree.toJSON()).toEqual(loaderRendered);
  await new Promise(done =>
    setTimeout(() => {
      expect(tree.toJSON()).toEqual(errorRenderedFinished);
      done();
    }, 10)
  );
});

test('until: renders lazy loaded components comparable to suspense.', async () => {
  let tree = create(
    until(
      import('./component/Lazy'),
      (result: any) => <result.default />,
      loader
    )
  );

  expect(tree.toJSON()).toEqual(loaderRendered);

  await new Promise(done =>
    setTimeout(() => {
      expect(tree.toJSON()).toEqual(lazyRendered);
      done();
    }, 1000)
  );
});
