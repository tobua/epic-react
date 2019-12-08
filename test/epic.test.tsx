import React, { createElement } from 'react';
import { epic } from '../index';

const loading = () => <p>loading</p>;
const loadingElement = createElement(loading);
const error = () => <p>error</p>;
const errorElement = createElement(error);
const fallback = () => <p>fallback</p>;
const fallbackElement = createElement(fallback);
const done = () => <p>done</p>;
const doneElement = createElement(done);

test('epic: skips when loader provided but false.', () => {
  let markup = epic.loading(loading, false).done(done);
  expect(markup).toEqual(doneElement);
});

test('epic: shows loader when condition somehow true.', () => {
  let markup = epic.loading(loading, true).done(done);
  expect(markup).toEqual(loadingElement);
  markup = epic.loading(loading, 1).done(done);
  expect(markup).toEqual(loadingElement);
  markup = epic.loading(loading, 'true').done(done);
  expect(markup).toEqual(loadingElement);
});

test('epic: order of elements is correct.', () => {
  let markup = epic
    .loading(loading, true)
    .error(error, true)
    .fallback(fallback, true)
    .done(done);
  expect(markup).toEqual(loadingElement);
  markup = markup = epic
    .loading(loading, false)
    .error(error, true)
    .fallback(fallback, true)
    .done(done);
  expect(markup).toEqual(errorElement);
  markup = markup = epic
    .loading(loading, false)
    .error(error, false)
    .fallback(fallback, true)
    .done(done);
  expect(markup).toEqual(fallbackElement);
  markup = markup = epic
    .loading(loading, false)
    .error(error, false)
    .fallback(fallback, false)
    .done(done);
  expect(markup).toEqual(doneElement);
});

test('epic: also works when conditions provided initially.', () => {
  let markup = epic({
    loading: true,
    error: true,
    fallback: true
  })
    .loading(loading)
    .error(error)
    .fallback(fallback)
    .done(done);
  expect(markup).toEqual(loadingElement);
  markup = epic({
    loading: false,
    error: false,
    fallback: false
  })
    .loading(loading)
    .error(error)
    .fallback(fallback)
    .done(done);
  expect(markup).toEqual(doneElement);
  markup = epic({
    loading: false,
    error: false,
    fallback: false
  }).done(done);
  expect(markup).toEqual(doneElement);
});
