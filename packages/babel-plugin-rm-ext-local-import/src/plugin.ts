import { ImportDeclaration } from '@babel/types'
import { Visitor, NodePath } from "@babel/traverse"

export interface PluginOptions {
  /** list of valid extensions to replace (default [.js, .ts]) */
  extensions?: string[]
}

export const isLocal = (module: string) => module.match(/^(\/|\.\/|\.\.\/)/)
export const addTs = (module: string) => `${module}.ts`
export const removeExt = (mod: string) => {
  const m = mod.split('.')
  m.pop()
  return m.join('.')
}
const cleanExt = (ext: string) => ext.match(/^\./) ? ext : `.${ext}`
const cleanExts = (exts: string | string[]) => (Array.isArray(exts) ? exts : [exts]).map(cleanExt)
const hasExt = (mod: string, exts: string[]) => {
  const m = mod.split('.')
  const last = m[m.length - 1]
  const addDot = `.${last}`
  return (exts.indexOf(addDot) !== -1)
}

export default function plugin( babel, options: PluginOptions ): { visitor: Visitor<PluginOptions> } {
  const e = options?.extensions ? cleanExts(options.extensions) : ['.ts', '.js']
  return {
    visitor: {
      ImportDeclaration (path: NodePath<ImportDeclaration>) {
        const p = path.node.source.value
        if (isLocal(p) && hasExt(p, e)) {
          path.node.source.value = removeExt(path.node.source.value)
        }
      }
    }
  }
}
