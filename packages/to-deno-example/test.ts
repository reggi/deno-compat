import * as assert from 'assert'
import * as fs from 'fs'

describe('to-deno-example', () => {
  it('should have .ts', () => {
    assert.strictEqual(fs.readFileSync('./src/fun_use.ts', 'utf8'), `import * as fun from "./fun";`)
    assert.strictEqual(fs.readFileSync('./lib/fun_use.ts', 'utf8'), `import * as fun from "./fun.ts";`)
  })
})