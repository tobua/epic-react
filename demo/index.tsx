import 'react-app-polyfill/ie11'
import React from 'react'
import { render } from 'react-dom'
import 'exmpl/dist/styles.css'
import {
  not,
  when,
  epic,
  until,
  list,
  random,
  onEnter,
  onEscape,
} from 'epic-react'

const ListElement = ({ value }: { value: number }) => <span>{value}</span>

const App = () => {
  return (
    <div className="App">
      <h1>epic-react Demo</h1>
      <h2>not</h2>
      <p>If the provided condition is true nothing will be rendered.</p>
      <code>
        <pre>{'not(false, () => <p>will appear</p>)'}</pre>
      </code>
      {not(false, () => (
        <p>will appear</p>
      ))}
      <pre>
        <code>{"not(true, () => <p>won't appear</p>)"}</code>
      </pre>
      {not(true, () => (
        <p>won't appear</p>
      ))}
      <h2>when</h2>
      <p>
        If the condition is true render the component and if it's false render
        the fallback if one is provided.
      </p>
      <pre>
        <code>{'when(true, () => <p>match</p>)'}</code>
      </pre>
      {when(true, () => (
        <p>match</p>
      ))}
      <pre>
        <code>
          {`when(false, () => <p>match</p>, () =>
          <p>fallback</p>)`}
        </code>
      </pre>
      {when(
        false,
        () => (
          <p>match</p>
        ),
        () => (
          <p>fallback</p>
        )
      )}
      <h2>epic</h2>
      <p>
        An epic makes it easy to write conditionally rendered components in a
        concise and readable way.
      </p>
      <p>
        The first option is to use it as an Object and define the conditions
        inline along with the components to render.
      </p>
      <pre>
        <code>
          epic
          <br />
          {'  .loading(() => <p>Loading...</p>, false)'}
          <br />
          {'  .error(()=> <p>Error...</p>, true)'}
          <br />
          {'  .fallback(() =><p>Fallback...</p>, false)'}
          <br />
          {'  .done(() => ( <p>Epic done</p> )<br />)'}
        </code>
      </pre>
      {epic
        .loading(() => <p>Loading...</p>, false)
        .error(() => <p>Error...</p>, true)
        .fallback(() => <p>Fallback...</p>, false)
        .done(() => (
          <p>Epic done</p>
        ))}
      <p>
        The second option is to use it as a function and pass the conditions in
        an object at first.
      </p>
      <pre>
        <code>
          {'epic({ loading: false, error: false, fallback: false })'}
          <br />
          {'  .loading(() => <p>Loading...</p>)'}
          <br />
          {'  .error(() => <p>Error...</p>)'}
          <br />
          {'  .fallback(() => <p>Fallback...</p>)'}
          <br />
          {'  .done(() => ( <p>Epic done</p> )<br />)'}
        </code>
      </pre>
      {epic({
        loading: false,
        error: false,
        fallback: false,
      })
        .loading(() => <p>Loading...</p>)
        .error(() => <p>Error...</p>)
        .fallback(() => <p>Fallback...</p>)
        .done(() => (
          <p>Epic done</p>
        ))}
      <h2>random</h2>
      <p>Randomly picks a component from the list of arguments.</p>
      <pre>
        <code>
          {`random(() => <p>first</p>, () =>
          <p>second</p>)`}
        </code>
      </pre>
      {random(
        () => (
          <p>first</p>
        ),
        () => (
          <p>second</p>
        )
      )}
      <h2>until</h2>
      <p>Render depending on the state of a Promise.</p>
      <pre>
        <code>
          {'until<string, null>('}
          <br />
          {`  new Promise<string>(done => setTimeout(() =>
          done('resolved!'), 3000)),`}
          <br />
          {'  result => ( <p> {result}</p> ),'}
          <br />
          {'  <p>loading...</p>'}
          <br />)
        </code>
      </pre>
      {until<string, null>(
        new Promise<string>((done) =>
          setTimeout(() => done('resolved!'), 3000)
        ),
        (result) => (
          <p>{result}</p>
        ),
        <p>loading...</p>
      )}
      <p>
        If the Promise is rejected an optional error handler will be rendered.
      </p>
      <pre>
        <code>
          {'until<string, string>('}
          <br />
          {`  new Promise<string>((done, fail) => setTimeout(()
          => fail('rejected...'), 3000) ),`}
          <br />
          {'  result => ( <p>{result}</p> ),'}
          <br />
          {'  <p>loading...</p>,'}
          <br />
          {'  error => ( <p>{error}</p> )<br />)'}
        </code>
      </pre>
      {until<string, string>(
        new Promise<string>((done, fail) =>
          setTimeout(() => fail('rejected...'), 3000)
        ),
        (result) => (
          <p>{result}</p>
        ),
        <p>loading...</p>,
        (error) => (
          <p>{error}</p>
        )
      )}
      <p>
        Even load components asynchronously, comparable to the upcoming React
        Suspense.
      </p>
      <pre>
        <code>
          {`until(import('./lazy'), result => <result.default />,
          <p>loading...</p>)`}
        </code>
      </pre>
      {until(
        import('./lazy'),
        (result) => (
          <result.default />
        ),
        <p>loading...</p>
      )}
      <h2>list</h2>
      <pre>
        <code>
          {`const ListElement = ({ value }: { value: number }) =>
          <span>{value}</span>;`}
        </code>
      </pre>
      <p>This epic makes rendering lists quicker.</p>
      <pre>
        <code>
          {'list<{ value: number }>('}
          <br />
          {'  [{ value: 1 }, { value: 2 }, { value: 3 }],'}
          <br />
          {'  ListElement'}
          <br />
          {')'}
        </code>
      </pre>
      <p>
        [
        {list<{ value: number }>(
          [{ value: 1 }, { value: 2 }, { value: 3 }],
          ListElement
        )}
        ]
      </p>
      <p>
        As the third parameter you can pass an element which will be rendered in
        case list is empty.
      </p>
      <pre>
        <code>
          {'list<{ value: number }>('}
          <br />
          {'  [],'}
          <br />
          {'  ListElement,'}
          <br />
          {`  <span>It's an empty list ;)</span>`}
          <br />)
        </code>
      </pre>
      <p>
        {list<{ value: number }>(
          [],
          ListElement,
          <span>It's an empty list ;)</span>
        )}
      </p>
      <p>
        An optional separator element can be inserted in between elements,
        similar to the join() function for regular Arrays.
      </p>
      <pre>
        <code>
          {'list<{ value: number }>('}
          <br />
          {'  [{ value: 1 }, { value: 2 }, { value: 3 }],'}
          <br />
          {'  ListElement,'}
          <br />
          {'  <span>,</span>'}
          <br />
          {')'}
        </code>
      </pre>
      <p>
        [
        {list<{ value: number }>(
          [{ value: 1 }, { value: 2 }, { value: 3 }],
          ListElement,
          <span>,</span>
        )}
        ]
      </p>
      <h2>Event Handlers</h2>
      <p>Shortcuts to do something when a certain key is pressed.</p>
      <code>
        <pre>{`<input
  onKeyDown={onEnter(() => console.log('Enter was pressed!'))}
  onKeyUp={onEscape(() => console.log('Escape pressed.'))}
/>`}</pre>
      </code>
      <input
        onKeyDown={onEnter(() => console.log('Enter was pressed!'))}
        onKeyUp={onEscape(() => console.log('Escape pressed.'))}
        defaultValue="Press keys in here"
      />
    </div>
  )
}

render(<App />, document.body)
