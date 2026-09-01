let fs = require("node:fs")

let file = "./streams/helloWorld.txt"

function countWords(file) {
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(file, { encoding: 'utf8' })

    let leftover = ''

    let wordCount = 0

    let bytesProcessed = 0

    readStream.on('data', (chunk) => {
      bytesProcessed += Buffer.byteLength(chunk, 'utf8')

      let combined = leftover + chunk

      let pieces = combined.split(/\s+/)

      leftover = pieces.pop()

      for (let i = 0; i < pieces.length; i += 1) {
        if (pieces[i].length > 0) {
          wordCount += 1
        }
      }
    })

    readStream.on('end', () => {
      if (leftover.trim().length > 0) {
        wordCount += 1
      }

      resolve({
        words: wordCount,
        bytesProcessed: bytesProcessed
      })
    })

    readStream.on('error', (err) => {
      reject(err)
    })
  })
}

countWords(file)
  .then((result) => {
    console.log(`Words: ${result.words}`)
    console.log(`Bytes processed: ${result.bytesProcessed}`)
  })
  .catch((err) => {
    console.error('Error:', err.message)
  })