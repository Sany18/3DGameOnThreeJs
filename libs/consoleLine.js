// { http: int, ws: int }
module.exports = drawLine = (args) => {
  const s = ['┌', '┬', '┐', '└', '┴', '┘', '─', '│']
  const lines = []

  Object.keys(args).forEach(key => {
    const len = key.length + (args[key] + '').length + 4

    lines[0] = s[0] + s[6].repeat(len) + s[2]
    lines[1] = s[7] + ' ' + key + ': ' + args[key] + ' ' + s[7]
    lines[2] = s[3] + s[6].repeat(len) + s[5]

    lines.forEach(i => log(i))
  })
}
