import { createRoot } from 'react-dom/client'
import { Exmpl, Code } from 'exmpl'
import { not, when, epic, until, list, random, onEnter, onEscape } from 'epic-react'

const ListElement = ({ value }: { value: number }) => <span>{value}</span>

const App = () => {
  return (
    <Exmpl title="epic-react Demo" npm="epic-react" github="tobua/epic-react">
      <h2>not</h2>
      <p>If the provided condition is true nothing will be rendered.</p>
      <Code>{'not(false, () => <p>will appear</p>)'}</Code>
      {not(false, () => (
        <p>will appear</p>
      ))}
      <Code>{"not(true, () => <p>won't appear</p>)"}</Code>
      {not(true, () => (
        <p>won't appear</p>
      ))}
      <h2>when</h2>
      <p>
        If the condition is true render the component and if it's false render the fallback if one
        is provided.
      </p>
      <Code>{'when(true, () => <p>match</p>)'}</Code>
      {when(true, () => (
        <p>match</p>
      ))}
      <Code>{`when(false, () => <p>match</p>, () => <p>fallback</p>)`}</Code>
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
        An epic makes it easy to write conditionally rendered components in a concise and readable
        way.
      </p>
      <p>
        The first option is to use it as an Object and define the conditions inline along with the
        components to render.
      </p>
      <Code>{`epic
  .loading(() => <p>Loading...</p>, false)
  .error(()=> <p>Error...</p>, true)
  .fallback(() =><p>Fallback...</p>, false)
  .done(() => ( <p>Epic done</p> )<br />)`}</Code>
      {epic
        .loading(() => <p>Loading...</p>, false)
        .error(() => <p>Error...</p>, true)
        .fallback(() => <p>Fallback...</p>, false)
        .done(() => (
          <p>Epic done</p>
        ))}
      <p>
        The second option is to use it as a function and pass the conditions in an object at first.
      </p>
      <Code>{`epic({ loading: false, error: false, fallback: false })
  .loading(() => <p>Loading...</p>)
  .error(() => <p>Error...</p>)
  .fallback(() => <p>Fallback...</p>)
  .done(() => ( <p>Epic done</p> )<br />)`}</Code>
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
      <Code>{`random(() => <p>first</p>, () => <p>second</p>)`}</Code>
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
      <Code>{`until<string, null>(
  new Promise<string>(done => setTimeout(() =>
    done('resolved!'), 3000)),
  result => <p>{result}</p>,
  <p>loading...</p>
)`}</Code>
      {until<string, null>(
        new Promise<string>((done) => setTimeout(() => done('resolved!'), 3000)),
        (result) => (
          <p>{result}</p>
        ),
        <p>loading...</p>
      )}
      <p>If the Promise is rejected an optional error handler will be rendered.</p>
      <Code>{`until<string, string>(
  new Promise<string>((done, fail) => setTimeout(()
          => fail('rejected...'), 3000) ),
  result => <p>{result}</p>,
  <p>loading...</p>,
  error => <p>{error}</p>
)`}</Code>
      {until<string, string>(
        new Promise<string>((done, fail) => setTimeout(() => fail('rejected...'), 3000)),
        (result) => (
          <p>{result}</p>
        ),
        <p>loading...</p>,
        (error) => (
          <p>{error}</p>
        )
      )}
      <p>Even load components asynchronously, comparable to the upcoming React Suspense.</p>
      <Code>{`until(import('./lazy'), result => <result.default />, <p>loading...</p>)`}</Code>
      {until(
        import('./lazy'),
        (result) => (
          <result.default />
        ),
        <p>loading...</p>
      )}
      <h2>list</h2>
      <Code>{`const ListElement = ({ value }: { value: number }) => <span>{value}</span>;`}</Code>
      <p>This epic makes rendering lists quicker.</p>
      <Code>{`list<{ value: number }>(
  [{ value: 1 }, { value: 2 }, { value: 3 }],
  ListElement
)`}</Code>
      <p>[{list<{ value: number }>([{ value: 1 }, { value: 2 }, { value: 3 }], ListElement)}]</p>
      <p>
        As the third parameter you can pass an element which will be rendered in case list is empty.
      </p>
      <Code>{`list<{ value: number }>(
  [],
  ListElement,
  <span>It's an empty list ;)</span>
)`}</Code>
      <p>{list<{ value: number }>([], ListElement, <span>It's an empty list ;)</span>)}</p>
      <p>
        An optional separator element can be inserted in between elements, similar to the join()
        function for regular Arrays.
      </p>
      <Code>{`list<{ value: number }>(
  [{ value: 1 }, { value: 2 }, { value: 3 }],
  ListElement,
  <span>empty</span>,
  <span>,</span>
)`}</Code>
      <p>
        [
        {list<{ value: number }>(
          [{ value: 1 }, { value: 2 }, { value: 3 }],
          ListElement,
          <span>empty</span>,
          <span>,</span>
        )}
        ]
      </p>
      <h2>Event Handlers</h2>
      <p>Shortcuts to do something when a certain key is pressed.</p>
      <Code>{`<input
  onKeyDown={onEnter(() => console.log('Enter was pressed!'))}
  onKeyUp={onEscape(() => console.log('Escape pressed.'))}
/>`}</Code>
      <input
        onKeyDown={onEnter(() => console.log('Enter was pressed!'))}
        onKeyUp={onEscape(() => console.log('Escape pressed.'))}
        defaultValue="Press keys in here"
      />
    </Exmpl>
  )
}

createRoot(document.body).render(<App />)
