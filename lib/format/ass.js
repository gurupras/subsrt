'use strict'

import ssa from './ssa'

var FORMAT_NAME = 'ass'

// Compatible format

export default {
  name: FORMAT_NAME,
  helper: ssa.helper,
  detect: ssa.detect,
  parse: ssa.parse,
  build: ssa.build
}
