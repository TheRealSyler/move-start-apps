deno compile --allow-run --unstable --lite --output moveStartupApps mod.ts

sudo cp ./moveStartupApps /usr/bin/moveStartupApps
echo installed /usr/bin/moveStartupApps

cp ./moveStartup.desktop ~/.config/autostart/moveStartup.desktop
echo installed ~/.config/autostart