import { describe, test, expect } from 'vitest'
import fs from 'fs'
import subsrt from '../lib/subsrt.js'

describe('Detect', () => {
  test('should detect the correct subtitle format', () => {
    const formats = subsrt.list()
    for (let i = 0; i < formats.length; i++) {
      const ext = formats[i]
      console.log('Detect .' + ext)
      const content = fs.readFileSync(`./test/fixtures/sample.${ext}`, 'utf8')

      const expected = ext
      const actual = subsrt.detect(content)

      expect(actual).toBe(expected)
    }
  })
})
