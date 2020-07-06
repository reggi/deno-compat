import { transform } from "@babel/core"
import * as assert from "assert"
import plugin from "./plugin"

const withNoOptions = (before: string, after?: string) => {
  if (!after) after = before
  const { code } = transform(before, {
    plugins: [plugin]
  })
  assert.strictEqual(after, code)
}

const withTypescript = (before: string, after?: string) => {
  if (!after) after = before
  const { code } = transform(before, {
    plugins: ["@babel/plugin-syntax-typescript", plugin]
  })
  assert.strictEqual(after, code)
}

const getWithOptions = (opt) => {
  return (before: string, after?: string) => {
    if (!after) after = before
    const { code } = transform(before, {
      plugins: ["@babel/plugin-syntax-typescript", [plugin, opt]]
    })
    assert.strictEqual(after, code)
  }
}

describe("babel-plugin-rm-ext-local-import", () => {
  it("should remove .ts extension where there is none for import", () => {
    withNoOptions(
      [`import a from "./alpha.ts";`, `import { b } from "./beta.ts";`].join('\n'),
      [`import a from "./alpha";`, `import { b } from "./beta";`].join('\n')
    )
    withNoOptions(`import love from "/love.ts";`, `import love from "/love";`)
    withNoOptions(`import love from "./love.ts";`, `import love from "./love";`)
    withNoOptions(`import love from "../love.ts";`, `import love from "../love";`)
    withNoOptions(`import love from "/love.js";`, `import love from "/love";`)
    withNoOptions(`import love from "./love.js";`, `import love from "./love";`)
    withNoOptions(`import love from "../love.js";`, `import love from "../love";`)
    withNoOptions(`import love from "/love";`, `import love from "/love";`)
    withNoOptions(`import love from "./love";`, `import love from "./love";`)
    withNoOptions(`import love from "../love";`, `import love from "../love";`)
  })
  it('should work with typescript syntax', () => {
    withTypescript(
      [`import love from "../love.ts";`, `type example = "meow";`].join('\n'),
      [`import love from "../love";`, `type example = "meow";`].join('\n')
    )
  })
  it('should not remove .js with .ts option', () => {
    const withOptions = getWithOptions({ extensions: '.ts' })
    withOptions(`import love from "../love.js";`, `import love from "../love.js";`)
    withOptions(`import love from "../love.ts";`, `import love from "../love";`)
  })
  it('should not remove .ts with .js option', () => {
    const withOptions = getWithOptions({ extensions: '.js' })
    withOptions(`import love from "../love.ts";`, `import love from "../love.ts";`)
    withOptions(`import love from "../love.js";`, `import love from "../love";`)
  })
  it('should work with array option', () => {
    const withOptions = getWithOptions({ extensions: ['.js'] })
    withOptions(`import love from "../love.ts";`, `import love from "../love.ts";`)
    withOptions(`import love from "../love.js";`, `import love from "../love";`)
  })
})
