import fs from 'fs'
import subsrt from '../lib/subsrt.js'
import { describe, test, expect } from 'vitest'

describe('Build', () => {
  test('should build subtitles in all formats', () => {
    const formats = subsrt.list()
    for (let i = 0; i < formats.length; i++) {
      const ext = formats[i]
      console.log('Build .' + ext)
      const json = fs.readFileSync('./test/fixtures/sample.json', 'utf8')
      const captions = JSON.parse(json)
      const content = subsrt.build(captions, { format: ext })
      expect(captions.length).toBeGreaterThan(0)
      if (fs.existsSync('./test/output')) {
        fs.writeFileSync('./test/output/build.' + ext, content)
      }
    }
  })
})
