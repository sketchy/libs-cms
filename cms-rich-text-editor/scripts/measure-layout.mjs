import { spawn } from 'node:child_process'

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const mode = process.argv[2] || 'current'
const url = `http://127.0.0.1:8765/cms-rich-text-editor/scripts/layout-containment.html?mode=${mode}`

const child = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--virtual-time-budget=4000',
  '--window-size=480,240',
  '--dump-dom',
  url,
], { stdio: ['ignore', 'pipe', 'pipe'] })

let stdout = ''
let stderr = ''
child.stdout.setEncoding('utf8')
child.stderr.setEncoding('utf8')
child.stdout.on('data', (chunk) => { stdout += chunk })
child.stderr.on('data', (chunk) => { stderr += chunk })

const timeout = setTimeout(() => {
  child.kill('SIGTERM')
}, 12000)

const exitCode = await new Promise((resolve) => {
  child.on('exit', (code) => resolve(code))
})
clearTimeout(timeout)

const match = stdout.match(/<pre id="result"[^>]*>(.*?)<\/pre>/s)
if (!match) {
  console.error('No result in dump-dom')
  console.error(stderr.slice(-1000))
  console.error(stdout.slice(-1500))
  process.exit(2)
}

const parsed = JSON.parse(match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'))
console.log(JSON.stringify(parsed, null, 2))
process.exit(parsed.pass ? 0 : 1)
