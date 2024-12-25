import fs from 'fs/promises'
import subsrt from '../lib/subsrt.js'
import { describe, test, expect, beforeAll } from 'vitest'

describe('Line endings', () => {
  let text
  let expectedVTT
  beforeAll(async () => {
    text = await fs.readFile('./test/fixtures/line-endings.srt', 'utf8')
    expectedVTT = await fs.readFile('./test/fixtures/line-endings.vtt', 'utf8')
  })
  test('Convert srt --> vtt with \\r in caption text', async () => {
    const vtt = subsrt.convert(text, { format: 'vtt' })

    const gotLines = vtt.split('\r\n')
    const expectedLines = expectedVTT.split('\r\n')
    // expect(gotLines.length).toEqual(expectedLines.length)
    for (let idx = 0; idx < expectedLines.length; idx++) {
      expect(gotLines[idx]).toEqual(expectedLines[idx])
    }
  })
})
