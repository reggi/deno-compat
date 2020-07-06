import { ImportDeclaration } from "@babel/types"
import { Visitor, NodePath } from "@babel/traverse"

export interface PluginOptions {
  /** list of valid extensions to replace (default [.js, .ts]) */
  extensions?: string[]
  /** extension to replace (default .ts) */
  extension?: string
}

const isLocal = (module: string) => module.match(/^(\/|\.\/|\.\.\/)/)
const addTs = (module: string, ext: string) => `${module}${cleanExt(ext)}`
const cleanExt = (ext: string) => ext.match(/^\./) ? ext : `.${ext}`
const cleanExts = (exts: string | string[]) => (Array.isArray(exts) ? exts : [exts]).map(cleanExt)
const hasExt = (mod: string, exts: string[]) => {
  const m = mod.split('.')
  const last = m[m.length - 1]
  const addDot = `.${last}`
  return (exts.indexOf(addDot) !== -1)
}

export default function plugin( babel, options ): { visitor: Visitor<PluginOptions> } {
  const exts = options?.extensions ? cleanExts(options.extensions) : ['.ts', '.js']
  const ext = options?.extension ? cleanExt(options.extension) : '.ts'
  return {
    visitor: {
      ImportDeclaration(path: NodePath<ImportDeclaration>) {
        const p = path.node.source.value
        if (isLocal(p) && !hasExt(p, exts)) {
          path.node.source.value = addTs(path.node.source.value, ext)
        }
      }
    }
  }
}
