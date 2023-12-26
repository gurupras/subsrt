import fs from 'fs'
import subsrt from '../lib/subsrt.js'
import { describe, test, expect } from 'vitest'

describe('Parse', () => {
  const formats = subsrt.list()

  for (let i = 0; i < formats.length; i++) {
    const ext = formats[i]
    test(`Parse .${ext}`, () => {
      console.log(`Parse .${ext}`)
      const content = fs.readFileSync(`./test/fixtures/sample.${ext}`, 'utf8')
      const captions = subsrt.parse(content, { format: ext })
      expect(captions.length).toBeGreaterThan(0)

      if (fs.existsSync('./test/output')) {
        fs.writeFileSync(`./test/output/parse.${ext}.json`, JSON.stringify(captions, null, 2))
      }
    })
  }
})
