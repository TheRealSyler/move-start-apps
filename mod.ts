import { action, error } from "./log.ts";
import { getAppsInfo, getDisplayInfo, moveWindow, moveWindowDisplay, sleep } from "./utils.ts";


//           name    desktop display
const apps: [string, number, number][] = [
  ['spotify.Spotify', 2, 1],
  ['discord.discord', 2, 0],
  ['github desktop.GitHub Desktop', 1, 1]
]

let searchForApps = true
while (searchForApps) {
  const appsInfo = await getAppsInfo()
  let foundApp = true
  for (let i = 0; i < apps.length; i++) {
    const app = appsInfo.find((item) => item.name === apps[i][0]);
    foundApp = foundApp && !!app
  }
  searchForApps = !foundApp
  await sleep(500)
}
action('Found Apps')

const displayInfo = await getDisplayInfo()
const appsInfo = await getAppsInfo()

async function findAndMove(name: string, desktop: number, displayIndex: number) {
  const app = appsInfo.find((val) => val.name === name)
  if (app) {
    await moveWindow(app.id, desktop)
    action('Moved', name, 'to', 'desktop: ' + desktop)

    const display = displayInfo.getDisplay(displayIndex)
    if (display) {
      await moveWindowDisplay(app.id, display.position)
      action('Moved', name, 'to', 'display: ' + display.name)
    }
    return
  }
  error('Could not move', name, 'to', '' + desktop)
}

for (let i = 0; i < apps.length; i++) {
  const app = apps[i];
  await findAndMove(...app)
}

action('Started Apps')