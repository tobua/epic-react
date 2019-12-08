import React from 'react';
import ReactDOM from 'react-dom';
import 'exmpl/dist/styles.css';
import { not, when, epic, until, list, random } from 'epic-react';

const ListElement = ({ value }: { value: number }) => <span>{value}</span>;

const App = () => {
  return (
    <div className="App">
      <h1>epic-react Demo</h1>
      <h2>not</h2>
      <p>If the provided condition is true nothing will be rendered.</p>
      <code>
        <pre>not(false, () => &lt;p&gt;will appear&lt;/p&gt;)</pre>
      </code>
      {not(false, () => (
        <p>will appear</p>
      ))}
      <pre>
        <code>not(true, () => &lt;p&gt;won't appear&lt;/p&gt;)</code>
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
        <code>when(true, () => &lt;p&gt;match&lt;/p&gt;)</code>
      </pre>
      {when(true, () => (
        <p>match</p>
      ))}
      <pre>
        <code>
          when(false, () => &lt;p&gt;match&lt;/p&gt;, () =>
          &lt;p&gt;fallback&lt;/p&gt;)
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
          &nbsp;&nbsp;.loading(() =&gt; &lt;p&gt;Loading...&lt;/p&gt;, false)
          <br />
          &nbsp;&nbsp;.error(()=&gt; &lt;p&gt;Error...&lt;/p&gt;, true)
          <br />
          &nbsp;&nbsp;.fallback(() =&gt;&lt;p&gt;Fallback...&lt;/p&gt;, false)
          <br />
          &nbsp;&nbsp;.done(() =&gt; ( &lt;p&gt;Epic done&lt;/p&gt; )<br />)
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
          epic(&#123; loading: false, error: false, fallback: false })
          <br />
          &nbsp;&nbsp;.loading(() =&gt; &lt;p&gt;Loading...&lt;/p&gt;)
          <br />
          &nbsp;&nbsp;.error(() =&gt; &lt;p&gt;Error...&lt;/p&gt;)
          <br />
          &nbsp;&nbsp;.fallback(() =&gt; &lt;p&gt;Fallback...&lt;/p&gt;)
          <br />
          &nbsp;&nbsp;.done(() =&gt; ( &lt;p&gt;Epic done&lt;/p&gt; )<br />)
        </code>
      </pre>
      {epic({
        loading: false,
        error: false,
        fallback: false
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
          random(() => &lt;p&gt;first&lt;/p&gt;, () =>
          &lt;p&gt;second&lt;/p&gt;)
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
          until&lt;string, null&gt;(
          <br />
          &nbsp;&nbsp;new Promise&lt;string&gt;(done =&gt; setTimeout(() =&gt;
          done('resolved!'), 3000)),
          <br />
          &nbsp;&nbsp;result =&gt; ( &lt;p&gt; &#123;result}&lt;/p&gt; ),
          <br />
          &nbsp;&nbsp;&lt;p&gt;loading...&lt;/p&gt;
          <br />)
        </code>
      </pre>
      {until<string, null>(
        new Promise<string>(done => setTimeout(() => done('resolved!'), 3000)),
        result => (
          <p>{result}</p>
        ),
        <p>loading...</p>
      )}
      <p>
        If the Promise is rejected an optional error handler will be rendered.
      </p>
      <pre>
        <code>
          until&lt;string, string&gt;(
          <br />
          &nbsp;&nbsp;new Promise&lt;string&gt;((done, fail) =&gt; setTimeout(()
          =&gt; fail('rejected...'), 3000) ),
          <br />
          &nbsp;&nbsp;result =&gt; ( &lt;p&gt;&#123;result}&lt;/p&gt; ),
          <br />
          &nbsp;&nbsp;&lt;p&gt;loading...&lt;/p&gt;,
          <br />
          &nbsp;&nbsp;error =&gt; ( &lt;p&gt;&#123;error}&lt;/p&gt; )<br />)
        </code>
      </pre>
      {until<string, string>(
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
      <p>
        Even load components asynchronously, comparable to the upcoming React
        Suspense.
      </p>
      <pre>
        <code>
          until(import('./lazy'), result =&gt; &lt;result.default /&gt;,
          &lt;p&gt;loading...&lt;/p&gt;)
        </code>
      </pre>
      {until(
        import('./lazy'),
        result => (
          <result.default />
        ),
        <p>loading...</p>
      )}
      <h2>list</h2>
      <pre>
        <code>
          const ListElement = (&#123; value }: &#123; value: number }) =&gt;
          &lt;span&gt;&#123;value}&lt;/span&gt;;
        </code>
      </pre>
      <p>This epic makes rendering lists quicker.</p>
      <pre>
        <code>
          list&lt;&#123; value: number }&gt;(
          <br />
          &nbsp;&nbsp;[&#123; value: 1 }, &#123; value: 2 }, &#123; value: 3 }],
          <br />
          &nbsp;&nbsp;ListElement
          <br />)
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
        An optional separator element can be inserted in between elements,
        similar to the join() function for regular Arrays.
      </p>
      <pre>
        <code>
          list&lt;&#123; value: number }&gt;(
          <br />
          &nbsp;&nbsp;[&#123; value: 1 }, &#123; value: 2 }, &#123; value: 3 }],
          <br />
          &nbsp;&nbsp;ListElement,
          <br />
          &nbsp;&nbsp;&lt;span&gt;,&lt;/span&gt;
          <br />)
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
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
