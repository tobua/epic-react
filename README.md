# epic-react

Not epic but handy helpers for conditional React rendering. Functional utilities to quickly implement recurring rendering patters in a readable way.

> Jump directly to the [epic](#epic).

## Usage

`npm install react epic-react`

```tsx
import React from 'react';
import { when } from 'epic-react';

export const DaytimeTheme = (time: number) =>
  when(
    time > 6 && time < 18,
    () => <Daylight />,
    () => <Nighttime />
  );
```

## Available Methods

```tsx
import { not, when, epic, until, list, random } from 'epic-react';
```

### not

If the provided condition is true nothing will be rendered.

```tsx
export const CartButton = (stock: number) =>
  not(stock === 0, <Button onClick={Store.addToCart}>Buy</Button>);
```

### when

If the condition is true render the component and if it's false render the fallback if one is provided.

```tsx
export const DaytimeTheme = (time: number) =>
  when(
    time > 6 && time < 18,
    () => <Daylight />,
    () => <Nighttime /> // Optional
  );
```

### <a name="epic"></a>epic

Usually there is more than an if else required for rendering. In this case an epic will help:

```tsx
// Usage as an object: specifying conditions along with components.
epic
  .loading(() => <p>Loading...</p>, false)
  .error(() => <p>Error...</p>, false)
  .fallback(() => <p>Fallback...</p>, false)
  .done(() => <p>Epic done</p>);

// Usage as a function: specifying conditions first.
epic({
  loading: false,
  error: false,
  fallback: false
})
  .loading(() => <p>Loading...</p>)
  .error(() => <p>Error...</p>)
  .fallback(() => <p>Fallback...</p>)
  .done(() => <p>Epic done</p>);
```

The second option is especially handy if you already have an object with the conditions available or can create a matching state.

### until

Asynchronous rendering depending on the state of a Promise.

```tsx
until<string, null>(
  new Promise<string>(done => setTimeout(() => done('resolved!'), 3000)),
  result => <p>{result}</p>,
  <p>loading...</p>
);
```

If the Promise is rejected an optional error handler will be rendered.

```tsx
until<string, string>(
  new Promise<string>((done, fail) =>
    setTimeout(() => fail('rejected...'), 3000)
  ),
  result => (
    <p>{result}</p>
  ),
  <p>loading...</p>,
  error => (
    <p>{error}</p>
  )
)}
```

### list

```tsx
const ListElement = ({ value }: { value: number }) => <span>{value}</span>;
```

This epic makes rendering lists quicker.

```tsx
list<{ value: number }>(
  [{ value: 1 }, { value: 2 }, { value: 3 }],
  ListElement
);
```

As the third parameter you can pass an element which will be rendered in case list is empty.

```tsx
list<{ value: number }>([], ListElement, <span>It's an empty list ;)</span>);
```

An optional separator element can be inserted in between elements, similar to the join() function for regular Arrays.

```tsx
list<{ value: number }>(
  [{ value: 1 }, { value: 2 }, { value: 3 }],
  ListElement,
  <span>List is empty...</span>
  <span>,</span>
);
```

### random

Randomly picks a component from the list of arguments.

```tsx
random(
  () => <p>first</p>,
  () => <p>second</p>
);
```

## Comparison with other Abstractions

### Vanilla JS

Simply writing all the logic yourself works just fine. These epics however have been created due to very similar parts occurring over and over again.

```tsx
// Vanilla JS
export const AsyncFetchedData = data => {
  if (data.loading) {
    return <Loading />;
  }

  if (data.error) {
    return <Error />;
  }

  return <Data data={data.result} />;
};
```

```tsx
// with an epic
export const AsyncFetchedData = (data) => epic
  .loading(() => <Loading />, data.loading)
  .error(() => <Error>, data.error)
  .done(() => <Data data={data.result} />);
```

### Higher Order Components

```tsx
import { Suspense } from 'react';

const LazyComponent = React.lazy(() => import('./ProfilePage'));

return (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

```tsx
import { until } from 'epic-react';

return until(import('./lazy'), result => <result.default />, <p>Loading...</p>);
```

Suspense (HOC): 4 Lines of Code

until (react-epic): 1 Line of Code 🤓

<br />
<br />
<p align="center">
  <img src="https://raw.githubusercontent.com/naminho/epic-react/master/logo.svg?sanitize=true" alt="epic-react" width="100%">
</p>
