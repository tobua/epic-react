import * as React from 'react';

if (!React.useState) {
  console.warn(
    'epic-react: Hooks required, please upgrade react version to at least 16.0.'
  );
}

// Casts various types to boolean.
const toBoolean = (value: any) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value === 'true';
  }

  if (typeof value === 'number') {
    return value >= 1;
  }

  return !!value;
};

// Conditionally render markup.
export function when(
  condition: any,
  content: React.FunctionComponent,
  otherwise?: React.FunctionComponent
) {
  if (!toBoolean(condition)) {
    return (otherwise && React.createElement(otherwise, null)) || null;
  }

  return React.createElement(content, null);
}

// Render only if not condition.
export function not(condition: any, content: React.FunctionComponent) {
  if (toBoolean(condition)) {
    return null;
  }

  return React.createElement(content, null);
}

// Renders content after promise resolved, with optional loader and error elements.
export function until<TDone, TFail = {}>(
  promise: Promise<TDone>,
  after: (data: TDone) => JSX.Element,
  loading?: JSX.Element,
  error?: (error: TFail) => JSX.Element
) {
  const Component = function() {
    const [result, setResult] = React.useState<{
      done: TDone | false;
      fail: TFail | false;
    }>({
      done: false,
      fail: false
    });

    React.useEffect(() => {
      promise
        .then((result: TDone) =>
          setResult({
            done: result,
            fail: false
          })
        )
        .catch((fail: TFail) =>
          setResult({
            done: false,
            fail
          })
        );
    }, []);

    if (result.done === false && result.fail === false) {
      return loading || null;
    }

    if (result.fail !== false && error) {
      return error(result.fail);
    }

    if (result.done !== false) {
      return after(result.done);
    }

    return null;
  };

  return React.createElement(Component, null);
}

interface EpicConditions {
  loading?: any;
  error?: any;
  fallback: any;
}

let _conditions3: EpicConditions;
let _result3: {
  loading: React.FunctionComponent | null;
  error: React.FunctionComponent | null;
  fallback: React.FunctionComponent | null;
} = { loading: null, error: null, fallback: null };
let _epic3 = {
  loading: function(element: React.FunctionComponent, condition?: any) {
    if (
      (_conditions3 && toBoolean(_conditions3.loading)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      _result3.loading = element;
    }

    return _epic3;
  },
  error: function(element: React.FunctionComponent, condition?: any) {
    if (
      (_conditions3 && toBoolean(_conditions3.error)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      _result3.error = element;
    }

    return _epic3;
  },
  fallback: function(element: React.FunctionComponent, condition?: any) {
    if (
      (_conditions3 && toBoolean(_conditions3.fallback)) ||
      (condition !== undefined && toBoolean(condition))
    ) {
      _result3.fallback = element;
    }

    return _epic3;
  },
  done: (done: React.FunctionComponent) => {
    if (!done) {
      return null;
    }

    // Defines order of elements to render before done.
    const result =
      _result3.loading || _result3.error || _result3.fallback || done;
    // Reset results for next epic use.
    _result3 = { loading: null, error: null, fallback: null };
    return React.createElement(result, null);
  }
};

// Epic constructor function.
export const epic: ((conditions: EpicConditions) => typeof _epic3) &
  typeof _epic3 = function(this: any, conditions: EpicConditions) {
  _conditions3 = conditions;
  return _epic3;
};

epic.loading = _epic3.loading;
epic.error = _epic3.error;
epic.fallback = _epic3.fallback;
epic.done = _epic3.done;

export const list = <TListElement>(
  list: TListElement[],
  component: React.FunctionComponent<TListElement>,
  empty: JSX.Element = null,
  separator?: JSX.Element
) => {
  let elements: React.FunctionComponentElement<any>[] = [];

  if (!list.length) {
    return empty;
  }

  list.forEach((item: TListElement, index) => {
    elements.push(
      React.createElement(component, {
        key: index,
        ...item
      })
    );

    if (separator && index !== list.length - 1) {
      elements.push(
        React.cloneElement(separator, { key: list.length + index })
      );
    }
  });

  return elements;
};

// Randomly pick a react component from the arguments list.
export function random(...components: React.FunctionComponent<any>[]) {
  // NOTE Array.isArray polyfill.
  if (!(Object.prototype.toString.call(components) === '[object Array]')) {
    console.warn('epic-react: Please provide an array of components.');
    return null;
  }

  if (components.length === 0) {
    console.warn(
      'epic-react: An empty Array was provided to random(...components).'
    );
    return null;
  }

  // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
  const index = Math.floor(Math.random() * components.length);

  return React.createElement(components[index], null);
}
