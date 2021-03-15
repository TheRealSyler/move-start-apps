import { action, error } from "./log.ts";
import { getAppsInfo, getDisplayInfo, moveWindow, moveWindowDisplay, sleep } from "./utils.ts";


const displayInfo = await getDisplayInfo()
const appsInfo = await getAppsInfo()

async function findAndMove(name: string, desktop: number, displayIndex: number) {
  const app = appsInfo.find((val) => val.name === name)
  if (app) {
    await moveWindow(app.id, desktop)
    action('Moved', name, 'to', '' + desktop)

    const display = displayInfo.getDisplay(displayIndex)
    if (display) {
      await moveWindowDisplay(app.id, display.position)
      action('Set Display of', name, 'to', '' + display.name)
    }
    return
  }
  error('Could not move', name, 'to', '' + desktop)
}

await sleep(1000)

await findAndMove('spotify.Spotify', 2, 1)
await findAndMove('github desktop.GitHub Desktop', 1, 1)
