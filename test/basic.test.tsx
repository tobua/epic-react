import React from 'react'
import { create } from 'react-test-renderer'
import { when, not, random } from '../index'

const first = () => <p>first</p>
const firstElement = create(<p>first</p>).toJSON()
const second = () => <p>second</p>
const secondElement = create(<p>second</p>).toJSON()

test('when: renders the markup if condition is truthy.', () => {
  let markup = create(when(true, first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(when('hello', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('true', first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(when(1, first)).toJSON()
  expect(markup).toEqual(firstElement)
})

test('when: renders nothing if condition is falsy.', () => {
  let markup = create(when(false, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('hello', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when(0, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when('false', first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(when(0, first)).toJSON()
  expect(markup).toEqual(null)
})

test('when: renders otherwise if condition is falsy.', () => {
  let markup = create(when(false, first, second)).toJSON()
  expect(markup).toEqual(secondElement)
  markup = create(when('hello', first, second)).toJSON()
  expect(markup).toEqual(secondElement)
  markup = create(when('false', first, second)).toJSON()
  expect(markup).toEqual(secondElement)
  markup = create(when(0, first, second)).toJSON()
  expect(markup).toEqual(secondElement)
})

test('not: renders only if condition is falsy.', () => {
  let markup = create(not(true, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(not(false, first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(not('false', first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(not(-1, first)).toJSON()
  expect(markup).toEqual(firstElement)
  markup = create(not(1, first)).toJSON()
  expect(markup).toEqual(null)
  markup = create(not('true', first)).toJSON()
  expect(markup).toEqual(null)
})

test('random: randomly picks component from list.', () => {
  const component = () => <p>first</p>
  let tree = create(random(component, component, component, component)).toJSON()
  expect(tree).toEqual(firstElement)
  tree = create(random(component)).toJSON()
  expect(tree).toEqual(firstElement)
})
