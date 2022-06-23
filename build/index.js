const rollup = require('rollup')
const configFactory = require('./rollup.config')

async function build(option) {
  const bundle = await rollup.rollup(option.input)
  await bundle.write(option.output)
}

(async () => {
  try {
    await build(configFactory({
      input: './src/AxiosEngine.js',
      fileName: './axios-plus.min.js'
    }))
  } catch (e) {
    console.error('build error => ', e)
  }
})()
