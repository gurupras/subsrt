'use strict'

const FORMAT_NAME = 'srt'

const helper = {
  toMilliseconds: function (s) {
    const match = /^\s*(\d{1,2}):(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s)
    const hh = parseInt(match[1])
    const mm = parseInt(match[2])
    const ss = parseInt(match[3])
    const ff = match[5] ? parseInt(match[5]) : 0
    const ms = hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000 + ff
    return ms
  },
  toTimeString: function (ms) {
    const hh = Math.floor(ms / 1000 / 3600)
    const mm = Math.floor(ms / 1000 / 60 % 60)
    const ss = Math.floor(ms / 1000 % 60)
    const ff = Math.floor(ms % 1000)
    const time = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss + ',' + (ff < 100 ? '0' : '') + (ff < 10 ? '0' : '') + ff
    return time
  }
}

/******************************************************************************************
 * Parses captions in SubRip format (.srt)
 ******************************************************************************************/
function parse (content, options) {
  const eol = options.eol || '\n'
  content = content.replace(/\r\n/g, '\n') // Normalize line endings to \n

  // Regular expression patterns
  // Components of the regex to improve readability
  const indexPattern = '(\\d+)' // Matches the subtitle index (a sequence of digits)
  const timePattern = '(\\d{2}:\\d{2}:\\d{2},\\d{3})' // Matches the time format HH:MM:SS,MS
  const separatorPattern = ' --> ' // Matches the separator between start and end times
  const contentPattern = '([\\s\\S]*?)' // Matches the subtitle content, including new lines
  const possibleCrlfPattern = '\\r?\\n'

  // Update the entryDelimiter to parse the entire next block
  // It now looks ahead for the start of a new index or the end of the string
  const entryDelimiter = `(?=${possibleCrlfPattern}${indexPattern}|${possibleCrlfPattern}*$)`

  // Combine the patterns to form the full regex for matching SRT blocks
  const regexPattern = `${indexPattern}${possibleCrlfPattern}${timePattern}${separatorPattern}${timePattern}${possibleCrlfPattern}${contentPattern}${entryDelimiter}`
  const srtPattern = new RegExp(regexPattern, 'g')

  const captions = []
  let match

  while ((match = srtPattern.exec(content)) !== null) {
    const [_, rawIndex, rawStart, rawEnd, rawContent] = match
    const index = parseInt(rawIndex, 10)
    const start = helper.toMilliseconds(rawStart)
    const end = helper.toMilliseconds(rawEnd)
    const content = rawContent.trim().replace(/\n+/g, eol)

    const caption = {
      type: 'caption',
      index,
      start,
      end,
      duration: end - start,
      content: rawContent,
      text: content
        .replace(/<[^>]+>/g, '') // <b>bold</b> or <i>italic</i>
        .replace(/\{[^}]+\}/g, '') // {b}bold{/b} or {i}italic{/i}
    }

    captions.push(caption)
  }

  return captions
};

/******************************************************************************************
 * Builds captions in SubRip format (.srt)
 ******************************************************************************************/
function build (captions, options) {
  const eol = options.eol || '\n' // Default to Windows-style line endings

  let index = 0
  const srtContent = captions
    .map((item) => {
      if (typeof item.type !== 'undefined' && item.type !== 'caption') {
        return '' // Skip non-caption items
      }

      // Convert start and end times to SRT format
      const startTime = helper.toTimeString(item.start)
      const endTime = helper.toTimeString(item.end)

      // Construct the SRT block for the current item
      return `${++index}${eol}${startTime} --> ${endTime}${eol}${item.text}${eol}`
    })
    .join(eol) // Separate each SRT block with a double line break

  return srtContent
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect (content) {
  if (typeof content === 'string') {
    if (/\d+\r?\n\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?\s*-->\s*\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?/g.test(content)) {
      /*
      3
      00:04:48,280 --> 00:04:50,510
      Sister, perfume?
      */
      return FORMAT_NAME
    }
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
export default {
  name: FORMAT_NAME,
  helper,
  detect,
  parse,
  build
}
