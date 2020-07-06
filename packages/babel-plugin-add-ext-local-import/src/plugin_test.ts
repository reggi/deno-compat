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

describe("babel-plugin-add-ts-local-import", () => {
  it("should add .ts extension where there is none for import", () => {
    withNoOptions(
      [`import a from "./alpha";`, `import { b } from "./beta";`].join('\n'),
      [`import a from "./alpha.ts";`, `import { b } from "./beta.ts";`].join('\n')
    )
    withNoOptions(`import love from "/love.ts";`)
    withNoOptions(`import love from "./love.ts";`)
    withNoOptions(`import love from "../love.ts";`)
    withNoOptions(`import love from "/love.js";`)
    withNoOptions(`import love from "./love.js";`)
    withNoOptions(`import love from "../love.js";`)
    withNoOptions(`import love from "/love";`, `import love from "/love.ts";`)
    withNoOptions(`import love from "./love";`, `import love from "./love.ts";`)
    withNoOptions(`import love from "../love";`, `import love from "../love.ts";`)
    withNoOptions(`require("./hi");`)
  })
  it('should work with typescript syntax', () => {
    withTypescript(
      [`import love from "../love";`, `type example = "meow";`].join('\n'),
      [`import love from "../love.ts";`, `type example = "meow";`].join('\n')
    )
  })
})
