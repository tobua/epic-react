import * as React from 'react'

if (!React.useState) {
  console.warn(
    'epic-react: Hooks required, please upgrade react version to at least 16.0.'
  )
}

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
  content: React.FunctionComponent,
  otherwise?: React.FunctionComponent
) {
  if (!toBoolean(condition)) {
    return (otherwise && React.createElement(otherwise, null)) || null
  }

  return React.createElement(content, null)
}

// Render only if not condition.
export function not(condition: any, content: React.FunctionComponent) {
  if (toBoolean(condition)) {
    return null
  }

  return React.createElement(content, null)
}

// Renders content after promise resolved, with optional loader and error elements.
export function until<TDone, TFail = {}>(
  promise: Promise<TDone>,
  after: (data: TDone) => JSX.Element,
  loading?: JSX.Element,
  error?: (error: TFail) => JSX.Element
) {
  const Component = function () {
    const [result, setResult] = React.useState<{
      done: TDone | false
      fail: TFail | false
    }>({
      done: false,
      fail: false,
    })

    React.useEffect(() => {
      promise
        .then((result: TDone) =>
          setResult({
            done: result,
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

  return React.createElement(Component, null)
}

interface EpicConditions {
  loading?: any
  error?: any
  fallback: any
}

let _conditions: EpicConditions
let _result: {
  loading: React.FunctionComponent | null
  error: React.FunctionComponent | null
  fallback: React.FunctionComponent | null
} = { loading: null, error: null, fallback: null }
let _epic = {
  loading: function (element: React.FunctionComponent, condition?: any) {
    if (
      (_conditions && toBoolean(_conditions.loading)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      _result.loading = element
    }

    return _epic
  },
  error: function (element: React.FunctionComponent, condition?: any) {
    if (
      (_conditions && toBoolean(_conditions.error)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      _result.error = element
    }

    return _epic
  },
  fallback: function (element: React.FunctionComponent, condition?: any) {
    if (
      (_conditions && toBoolean(_conditions.fallback)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      _result.fallback = element
    }

    return _epic
  },
  done: (done: React.FunctionComponent) => {
    if (!done) {
      return null
    }

    // Defines order of elements to render before done.
    const result = _result.loading || _result.error || _result.fallback || done
    // Reset results for next epic use.
    _result = { loading: null, error: null, fallback: null }
    return React.createElement(result, null)
  },
}

// Epic constructor function.
export const epic: ((conditions: EpicConditions) => typeof _epic) &
  typeof _epic = function (this: any, conditions: EpicConditions) {
  _conditions = conditions
  return _epic
}

epic.loading = _epic.loading
epic.error = _epic.error
epic.fallback = _epic.fallback
epic.done = _epic.done

export const list = <TListElement>(
  list: TListElement[],
  component: React.FunctionComponent<TListElement>,
  empty: JSX.Element = null,
  separator?: JSX.Element
) => {
  let elements: React.FunctionComponentElement<any>[] = []

  if (!list.length) {
    return empty
  }

  list.forEach((item: TListElement, index) => {
    elements.push(
      React.createElement(component, {
        key: index,
        ...item,
      })
    )

    if (separator && index !== list.length - 1) {
      elements.push(React.cloneElement(separator, { key: list.length + index }))
    }
  })

  return elements
}

// Randomly pick a react component from the arguments list.
export function random(...components: React.FunctionComponent<any>[]) {
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

  return React.createElement(components[index], null)
}
