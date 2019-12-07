// { http: int, ws: int }
module.exports = drawLine = args => {
  const s = ['┌', '┬', '┐', '└', '┴', '┘', '─', '│', '░']
  const width = process.stdout.columns || 80
  const w = (width - Object.values(args).reduce((a, i) => a + (i + '').length + 15, 0)) / 2
  const lines = ['', s[8].repeat(w), s[8].repeat(w), s[8].repeat(w), '']

  lines[0] = lines[4] = s[8].repeat(width)

  Object.keys(args).forEach(key => {
    const len = key.length + (args[key] + '').length + 4

    lines[1] += s[0] + s[6].repeat(len) + s[2]
    lines[2] += s[7] + ' ' + key + ': ' + args[key] + ' ' + s[7]
    lines[3] += s[3] + s[6].repeat(len) + s[5]
  })

  lines[1] += s[8].repeat(w + 1)
  lines[2] += s[8].repeat(w + 1)
  lines[3] += s[8].repeat(w + 1)

  lines.forEach(i => log(i))
}
