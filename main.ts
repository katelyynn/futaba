// these docs suck how do u do vite and this at the same time lol

const win = new Deno.BrowserWindow({
  title: "futaba",
  frameless: true,
  transparentTitlebar: true
});

win.bind("readSettings", async () => {
  const text = await Deno.readTextFile("settings.json");
  return JSON.parse(text);
});

win.bind("saveSettings", async (settings) => {
  await Deno.writeTextFile("settings.json", JSON.stringify(settings, null, 2));
});
