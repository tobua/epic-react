import React from 'react'
import { create } from 'react-test-renderer'
import { list } from '../index'

const ListElement = ({ value }: { value: number }) => <span>{value}</span>

test('list: works with a single and multiple elements.', () => {
  let tree = create(
    <>{list<{ value: number }>([{ value: 1 }], ListElement)}</>
  ).toJSON()
  expect(tree).toEqual(create(<span>1</span>).toJSON())
  tree = create(
    <>
      {list<{ value: number }>(
        [{ value: 1 }, { value: 2 }, { value: 3 }],
        ListElement
      )}
    </>
  ).toJSON()
  expect(tree).toEqual(
    create(
      <>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </>
    ).toJSON()
  )
})

test('list: approprite keys with multiple elements.', () => {
  const tree = create(
    <>
      {list<{ value: number }>(
        [{ value: 1 }, { value: 2 }, { value: 3 }],
        ListElement
      )}
    </>
  )
  const elements = tree.root.findAllByType(ListElement)

  expect(elements.length).toEqual(3)

  expect((elements[0] as any)._fiber.key).toEqual('0')
  expect((elements[1] as any)._fiber.key).toEqual('1')
  expect((elements[2] as any)._fiber.key).toEqual('2')
})

test('list: renders null if list empty an no empty fallback provided.', () => {
  const tree = create(<>{list<{ value: number }>([], ListElement)}</>)

  const rendered = tree.toJSON()

  expect(rendered).toEqual(create(null).toJSON())
})

test('list: renders null if list empty an no empty fallback provided.', () => {
  const tree = create(
    <>{list<{ value: number }>([], ListElement, <p>List is empty</p>)}</>
  )

  const rendered = tree.toJSON()

  expect(rendered).toEqual(create(<p>List is empty</p>).toJSON())
})

test('list: separator will be added between elements with appropriate keys.', () => {
  const tree = create(
    <>
      {list<{ value: number }>(
        [{ value: 1 }, { value: 2 }, { value: 3 }],
        ListElement,
        null,
        <span>,</span>
      )}
    </>
  )
  const elements = tree.root.findAll(
    (instance) => (instance as any)._fiber.key !== null
  )

  expect(elements.length).toEqual(5)

  expect((elements[0] as any)._fiber.key).toEqual('0')
  expect((elements[1] as any)._fiber.key).toEqual('3')
  expect((elements[2] as any)._fiber.key).toEqual('1')
  expect((elements[3] as any)._fiber.key).toEqual('4')
  expect((elements[4] as any)._fiber.key).toEqual('2')

  const rendered = tree.toJSON()

  expect(rendered).toEqual(
    create(
      <>
        <span>1</span>
        <span>,</span>
        <span>2</span>
        <span>,</span>
        <span>3</span>
      </>
    ).toJSON()
  )
})
