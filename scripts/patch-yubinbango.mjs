/**
 * yubinbango-core and yubinbango-core2 ship their .ts source files without @ts-nocheck.
 * The Nuxt-generated tsconfig includes all node_modules/**\/*.ts via a glob,
 * which causes vue-tsc to check these files and fail. This script patches them.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

for (const pkg of ['yubinbango-core', 'yubinbango-core2']) {
  const target = join(__dirname, `../node_modules/${pkg}/yubinbango-core.ts`)
  try {
    const src = readFileSync(target, 'utf8')
    if (!src.startsWith('// @ts-nocheck')) {
      writeFileSync(target, '// @ts-nocheck\n' + src)
      console.log(`✓ Patched ${pkg}/yubinbango-core.ts`)
    }
  } catch {
    // package not installed yet — ignore
  }
}
