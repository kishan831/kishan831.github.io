/**
 * Converts the source plate PNGs into responsive AVIF and WebP.
 *
 * Sources live in reference/plates-source/ and are gitignored — they are
 * roughly 2MB each. Only the converted output is committed.
 *
 * Run: npm run plates
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'reference/plates-source'
const OUT = 'public/plates'
const WIDTHS = [960, 1440, 1672]
const BUDGET_KB = 200

await mkdir(OUT, { recursive: true })

const files = (await readdir(SRC)).filter((f) => f.endsWith('.png')).sort()
if (files.length === 0) {
  console.error(`No PNGs found in ${SRC}`)
  process.exit(1)
}

let worst = 0

for (const file of files) {
  const { name } = parse(file)
  for (const width of WIDTHS) {
    const base = sharp(join(SRC, file)).resize({ width, withoutEnlargement: true })

    const avifPath = join(OUT, `${name}-${width}.avif`)
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(avifPath)

    const webpPath = join(OUT, `${name}-${width}.webp`)
    await base.clone().webp({ quality: 74 }).toFile(webpPath)

    for (const p of [avifPath, webpPath]) {
      const kb = Math.round((await stat(p)).size / 1024)
      worst = Math.max(worst, kb)
      const flag = kb > BUDGET_KB ? ' OVER BUDGET' : ''
      console.log(`${String(kb).padStart(4)}KB  ${p}${flag}`)
    }
  }
}

console.log(`\nLargest output: ${worst}KB (budget ${BUDGET_KB}KB)`)
if (worst > BUDGET_KB) {
  console.error('At least one plate is over budget — lower the quality settings.')
  process.exit(1)
}
