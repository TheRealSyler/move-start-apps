import { error } from "./log.ts";

export async function Exec(...args: string[]) {
  const cmd = Deno.run({
    cmd: args, stdout: "piped",
    stderr: "piped"
  })
  const res = await Promise.all([
    cmd.status(),
    cmd.output(),
    cmd.stderrOutput()
  ]);

  cmd.close();
  return res
}

interface Position { x: number, y: number }

interface Display {
  name: string
  index: number
  isActive: boolean
  position: Position
  dimensions: Position
  realDimensions: Position
}

interface DisplayInfo {
  numberOfMonitor: number
  displayIndices: string[]
  displays: {
    [key: string]: Display
  }
  getDisplay: (index: number) => Display | undefined
}

export async function getDisplayInfo() {
  const cmdOut = await Exec('xrandr', '--listactivemonitors')
  const text = new TextDecoder().decode(cmdOut[1])
  const lines = text.split('\n')
  const info: DisplayInfo = {
    numberOfMonitor: parseInt(lines[0].replace(/Monitors: /, '')),
    displayIndices: [],
    displays: {},
    getDisplay: function (index) {
      return this.displays[this.displayIndices[index]]
    }
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const displayInfoRaw = / *(\d+): *\+?(\*?)(.*?) (\d+)\/(\d+)x(\d+)\/(\d+)\+(\d+)\+(\d+)/.exec(line)
    if (displayInfoRaw) {
      const index = +displayInfoRaw[1]
      const name = displayInfoRaw[3]
      info.displayIndices[index] = name
      info.displays[name] = {
        name,
        index: +displayInfoRaw[1],
        isActive: !!displayInfoRaw[2],
        position: { x: +displayInfoRaw[8], y: +displayInfoRaw[9] },
        dimensions: { x: +displayInfoRaw[4], y: +displayInfoRaw[6] },
        realDimensions: { x: +displayInfoRaw[5], y: +displayInfoRaw[7] }
      }
    }
  }
  return info
}

export async function getAppsInfo() {
  const cmdOut = await Exec('wmctrl', '-lx')
  const text = new TextDecoder().decode(cmdOut[1])
  const lines = text.split('\n')
  const apps = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const appInfoRaw = /^([\w\d]+) +([-\d]+) +(.*?)  +(.*?) (.*)$/.exec(line)
    if (appInfoRaw) {
      apps.push({
        id: appInfoRaw[1],
        desktop: +appInfoRaw[2],
        name: appInfoRaw[3],
        owner: appInfoRaw[4],
        title: appInfoRaw[5]
      })
    }
  }
  return apps
}
export async function moveWindow(id: string, desktop: number) {
  await Exec('wmctrl', '-i', '-r', id, '-t', '' + desktop)
}

export async function moveWindowDisplay(id: string, pos: Position) {
  await Exec('wmctrl', '-i', '-r', id, '-b', `remove,maximized_vert,maximized_horz`)
  await Exec('wmctrl', '-i', '-r', id, '-e', `2,${pos.x},${pos.y},-1,-1`)
  await Exec('wmctrl', '-i', '-r', id, '-b', `add,maximized_vert,maximized_horz`)
  await Exec('wmctrl', '-i', '-r', id, '-b', `remove,hidden`)
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, ms);
  })
}