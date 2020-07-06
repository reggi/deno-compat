import * as assert from 'assert'
import * as fs from 'fs'

describe('to-node-example', () => {
  it('should remove .ts', () => {
    assert.strictEqual(fs.readFileSync('./src/fun_use.ts', 'utf8'), `import * as fun from "./fun.ts";`)
    assert.strictEqual(fs.readFileSync('./lib/fun_use.ts', 'utf8'), `import * as fun from "./fun";`)
  })
})