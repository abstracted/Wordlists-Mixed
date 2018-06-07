'use strict'
const system = require('child_process')
const fs = require('fs')

/**
 * Function to issue bash commands, returns the stdout.
 * @param stdin
 * @returns {string}
 */
function command (stdin) {
  return system.execSync(stdin).toString().replace('node_modules', '').trim()
}

// Get the current directory
const listDir = command('pwd')

// Get a list of files in the directory, make into an array
const listFiles = command('find ' + listDir + ' -iname "*txt*" -maxdepth 1 -type f | sort').split('\n')

let data = {}
// Process the files; look for matches, create new strings, write to new files
for (let i = 0; i < listFiles.length; i++) {
  let categoryName = listFiles[ i ]
    .replace(/.+\/([^\/]+)$/gm, '$1')
    .replace(/\.txt/gm, '')
    .trim()
  let file = listFiles[ i ].replace(/^|$/gm, '\'')
  let contents = command('cat ' + file)
    .trim()
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .toLowerCase()
    .replace(/\r/gm, '\n')
    .split('\n')
    .sort()
  data[categoryName] = contents
}

fs.writeFileSync('_generated.json', JSON.stringify(data))
