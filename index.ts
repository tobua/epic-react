import {
  createElement,
  FunctionComponent,
  useState,
  useEffect,
  FunctionComponentElement,
  cloneElement,
} from 'react'

// Casts various types to boolean.
const toBoolean = (value: any) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return value === 'true'
  }

  if (typeof value === 'number') {
    return value >= 1
  }

  return !!value
}

// Conditionally render markup.
export function when(
  condition: any,
  content: FunctionComponent,
  otherwise?: FunctionComponent
) {
  if (!toBoolean(condition)) {
    return (otherwise && createElement(otherwise, null)) || null
  }

  return createElement(content, null)
}

// Render only if not condition.
export function not(condition: any, content: FunctionComponent) {
  if (toBoolean(condition)) {
    return null
  }

  return createElement(content, null)
}

// Renders content after promise resolved, with optional loader and error elements.
export function until<TDone, TFail = {}>(
  promise: Promise<TDone>,
  after: (data: TDone) => JSX.Element,
  loading?: JSX.Element,
  error?: (_error: TFail) => JSX.Element
) {
  function Component() {
    const [result, setResult] = useState<{
      done: TDone | false
      fail: TFail | false
    }>({
      done: false,
      fail: false,
    })

    useEffect(() => {
      promise
        .then((_result: TDone) =>
          setResult({
            done: _result,
            fail: false,
          })
        )
        .catch((fail: TFail) =>
          setResult({
            done: false,
            fail,
          })
        )
    }, [])

    if (result.done === false && result.fail === false) {
      return loading || null
    }

    if (result.fail !== false && error) {
      return error(result.fail)
    }

    if (result.done !== false) {
      return after(result.done)
    }

    return null
  }

  return createElement(Component, null)
}

interface EpicConditions {
  loading?: any
  error?: any
  fallback: any
}

let conditions: EpicConditions
let result: {
  loading: FunctionComponent | null
  error: FunctionComponent | null
  fallback: FunctionComponent | null
} = { loading: null, error: null, fallback: null }
const epicObject = {
  loading: function Loading(element: FunctionComponent, condition?: any) {
    if (
      (conditions && toBoolean(conditions.loading)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      result.loading = element
    }

    return epicObject
  },
  error: function Error(element: FunctionComponent, condition?: any) {
    if (
      (conditions && toBoolean(conditions.error)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      result.error = element
    }

    return epicObject
  },
  fallback: function Fallback(element: FunctionComponent, condition?: any) {
    if (
      (conditions && toBoolean(conditions.fallback)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      result.fallback = element
    }

    return epicObject
  },
  done: (done: FunctionComponent) => {
    if (!done) {
      return null
    }

    // Defines order of elements to render before done.
    const toRender = result.loading || result.error || result.fallback || done
    // Reset results for next epic use.
    result = { loading: null, error: null, fallback: null }
    return createElement(toRender, null)
  },
}

// Epic constructor function.
export const epic: ((newConditions: EpicConditions) => typeof epicObject) &
  typeof epicObject = function Epic(this: any, newConditions: EpicConditions) {
  conditions = newConditions
  return epicObject
}

epic.loading = epicObject.loading
epic.error = epicObject.error
epic.fallback = epicObject.fallback
epic.done = epicObject.done

export const list = <TListElement>(
  listElements: TListElement[],
  component: FunctionComponent<TListElement>,
  empty: JSX.Element = null,
  separator?: JSX.Element
) => {
  const elements: FunctionComponentElement<any>[] = []

  if (!listElements.length) {
    return empty
  }

  listElements.forEach((item: TListElement, index) => {
    elements.push(
      createElement(component, {
        // eslint-disable-next-line react/no-array-index-key
        key: index,
        ...item,
      })
    )

    if (separator && index !== listElements.length - 1) {
      elements.push(
        // eslint-disable-next-line react/no-array-index-key
        cloneElement(separator, { key: listElements.length + index })
      )
    }
  })

  return elements
}

// Randomly pick a react component from the arguments list.
export function random(...components: FunctionComponent<any>[]) {
  // NOTE Array.isArray polyfill.
  if (!(Object.prototype.toString.call(components) === '[object Array]')) {
    console.warn('epic-react: Please provide an array of components.')
    return null
  }

  if (components.length === 0) {
    console.warn(
      'epic-react: An empty Array was provided to random(...components).'
    )
    return null
  }

  // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  const index = Math.floor(Math.random() * components.length)

  return createElement(components[index], null)
}

export const onEnter = (callback: (event: Event) => void) => (event: any) => {
  if (event.key === 'Enter') {
    callback(event)
  }
}

export const onEscape = (callback: (event: Event) => void) => (event: any) => {
  if (event.key === 'Escape') {
    callback(event)
  }
}
