import fs from 'fs'
import subsrt from '../lib/subsrt.js'
import { describe, test, expect } from 'vitest'

describe('Convert', () => {
  const extensions = subsrt.list()

  for (let i = 0; i < extensions.length; i++) {
    const ext1 = extensions[i]
    for (let j = 0; j < extensions.length; j++) {
      const ext2 = extensions[j]

      test(`Convert .${ext1} to .${ext2}`, () => {
        console.log(`Convert .${ext1} to .${ext2}`)

        const content1 = fs.readFileSync(`./test/fixtures/sample.${ext1}`, 'utf8')
        const content2 = subsrt.convert(content1, { from: ext1, to: ext2 })

        expect(typeof content2).toBe('string')
        expect(content2.length).toBeGreaterThan(0)

        const format = subsrt.detect(content2)
        expect(format).toBe(ext2)

        const captions = subsrt.parse(content2, { format: ext2 })
        expect(captions).toBeDefined()
        expect(captions.length).toBeGreaterThan(0)

        if (fs.existsSync('./test/output')) {
          fs.writeFileSync(`./test/output/convert.${ext1}.${ext2}`, content2)
        }
      })
    }
  }
})
