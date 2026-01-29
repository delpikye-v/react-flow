# 🌊 react-flow-z

[![NPM](https://img.shields.io/npm/v/react-flow-z.svg)](https://www.npmjs.com/package/react-flow-z) ![Downloads](https://img.shields.io/npm/dt/react-flow-z.svg)

<a href="https://codesandbox.io/p/sandbox/vkl64l" target="_blank">LIVE EXAMPLE</a>

---

`react-flow-z` is a **small, framework-agnostic async flow runtime**.

It focuses on **how async logic runs**, not:
- how state is stored
- how UI renders
- or how effects are magically managed

> This library is about **orchestration**, not reactivity.

---

## Why react-flow-z

- Typed async execution pipeline
- Immutable flow composition
- Abort & cancellation via `AbortController`
- Async orchestration operators: `debounce` · `retry` · `timeout` · `switchMap` ·` parallel`...
- Control flow: `filter` · `take` · `conditional execution`...
- Pause / resume execution
- Framework-agnostic core
- Optional React hook (`useFlow`)

---

## Installation

```bash
npm install react-flow-z
```

---

## Basic Usage

```ts
import { Flow } from "react-flow-z"

new Flow()
  .debounce(300)
  .switchMap(q => fetch(`/search?q=${q}`))
  .tap(res => console.log(res))
  .run("hello")
```

---

## Cancellation

```ts
const flow = new Flow()
  .step(async (v, _, signal) => {
    await sleep(1000, signal)
    return v
  })

flow.run(1)
flow.cancel()
```

---

## Pause / Resume

```ts
flow.pause()

setTimeout(() => {
  flow.resumeFlow()
}, 1000)
```

---

## React Integration

```ts
import { useFlow } from "react-flow-z"

useFlow(
  keyword,
  flow =>
    flow
      .debounce(300)
      .switchMap(search)
      .tap(setResult)
      .catch(() => []),
  {}
)
```

---

## Search posts (official example)

#### ✅ Pattern 1: Flow instance (recommended)

##### searchFlow.ts
```ts
import { Flow } from "react-flow-z"

export const searchFlow = new Flow()
  .onStart(() => console.log("loading..."))
  .debounce(300)
  .filter((q: string) => q.length > 0)
  .switchMap(async (q: string) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?q=${q}`
    )
    if (!res.ok) throw new Error("network error")
    return res.json()
  })
  .onDone(() => console.log("done"))
  .onError(err => console.error(err))

// searchFlow.run("r")
// searchFlow.run("re")
// searchFlow.run("react")
```

##### React usage
```ts
function SearchExample() {
  const [q, setQ] = useState("")
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    searchFlow
      .tap(setPosts)
      .catch(() => [])
      .run(q)
  }, [q])

  return (
    <>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search posts..."
      />
      <ul>
        {posts.map(p => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </>
  )
}

```

---

#### ✅ Pattern 2: One-off Flow execution

##### Submit form – prevent double submit (leading)

```ts
import { Flow } from "react-flow-z"

export function runSearch(q: string) {
  return new Flow()
    .debounce(300)
    .filter(Boolean)
    .switchMap(async query => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?q=${query}`
      )
      if (!res.ok) throw new Error("network error")
      return res.json()
    })
    .run(q)
}

```

---

## Philosophy

- Explicit over implicit
- Async/await over streams
- No global state
- No magic scheduling
- You own execution

---

## Compare high-level

| Point                  | react-flow-z  | RxJS  | Redux-Saga | XState   | React Query |
| ---------------------- | ------------  | ----- | ---------- | -------  | ----------- |
| Async orchestration    | ✅            | ✅     | ✅         | 🟡       | ❌          |
| Debounce / cancel      | ✅            | ✅     | 🟡         | 🟡       | ❌          |
| Execution-first design | ✅            | ❌     | 🟡         | ❌       | ❌          |
| Framework-agnostic     | ✅            | ✅     | ❌         | 🟡       | ❌          |
| Learning curve         | ⭐ easy       | ⭐⭐⭐  | ⭐⭐       | ⭐⭐⭐    | ⭐          |

---

### What react-flow-z is NOT

- ❌ Not a state manager
- ❌ Not a reactive signal system
- ❌ Not a data cache like React Query
- ❌ Not a stream library like RxJS

If you only need data fetching → use React Query  
If you need event streams → use RxJS  
If you need **explicit async execution with cancel / debounce / queue** → react-flow-z

---

## License

MIT
