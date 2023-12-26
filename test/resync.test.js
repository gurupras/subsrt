import fs from 'fs'
import subsrt from '../lib/subsrt.js'
import { describe, test, expect } from 'vitest'

describe('Resync Tests', () => {
  test('Resync +3000 ms', () => {
    const srt = fs.readFileSync('./test/fixtures/sample.srt', 'utf8')
    const captions = subsrt.parse(srt)
    const resynced = subsrt.resync(captions, +3000)

    if (fs.existsSync('./test/output')) {
      fs.writeFileSync('./test/output/resync-add-3000.json', JSON.stringify(resynced, ' ', 2))
    }

    expect(resynced).toBeTypeOf('object')
    expect(resynced.length).toBeGreaterThan(0)
    expect(resynced.length).toBe(captions.length)

    expect(resynced[0].start).not.toBe(captions[0].start)
    expect(resynced[0].end).not.toBe(captions[0].end)
  })

  test('Resync -250 ms', () => {
    const sbv = fs.readFileSync('./test/fixtures/sample.sbv', 'utf8')
    const captions = subsrt.parse(sbv)
    const resynced = subsrt.resync(captions, -250)

    if (fs.existsSync('./test/output')) {
      fs.writeFileSync('./test/output/resync-sub-250.json', JSON.stringify(resynced, ' ', 2))
    }

    expect(resynced).toBeTypeOf('object')
    expect(resynced.length).toBeGreaterThan(0)
    expect(resynced.length).toBe(captions.length)

    expect(resynced[3].start).not.toBe(captions[3].start)
    expect(resynced[3].end).not.toBe(captions[3].end)
  })

  test('Resync 25 to 30 FPS', () => {
    const sub = fs.readFileSync('./test/fixtures/sample.sub', 'utf8')
    const captions = subsrt.parse(sub, { fps: 25 })
    const resynced = subsrt.resync(captions, { ratio: 30 / 25, frame: true })

    if (fs.existsSync('./test/output')) {
      fs.writeFileSync('./test/output/resync-fps-30.json', JSON.stringify(resynced, ' ', 2))
    }

    expect(resynced).toBeTypeOf('object')
    expect(resynced.length).toBeGreaterThan(0)
    expect(resynced.length).toBe(captions.length)

    expect(resynced[3].frame.start).not.toBe(captions[3].frame.start)
    expect(resynced[3].frame.end).not.toBe(captions[3].frame.end)
    expect(resynced[3].frame.count).toBeGreaterThan(captions[3].frame.count)
  })

  test('Resync with non-linear function', () => {
    const vtt = fs.readFileSync('./test/fixtures/sample.vtt', 'utf8')
    const captions = subsrt.parse(vtt)
    const resynced = subsrt.resync(captions, function (a) {
      return [
        a[0] + 0, // Keep the start time
        a[1] + 500 // Extend each end time by 500 ms
      ]
    })

    if (fs.existsSync('./test/output')) {
      fs.writeFileSync('./test/output/resync-extend.json', JSON.stringify(resynced, ' ', 2))
    }

    expect(resynced).toBeTypeOf('object')
    expect(resynced.length).toBeGreaterThan(0)
    expect(resynced.length).toBe(captions.length)

    expect(resynced[3].start).toBe(captions[3].start + 0)
    expect(resynced[3].end).toBe(captions[3].end + 500)
  })
})
