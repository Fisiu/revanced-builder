const AppInfoParser = require('app-info-parser');
const { renameSync } = require('node:fs');
function uploadAPKFile(req, res, ws) {
  const file = req.files.apk;

  file.mv('./revanced/temp.apk', async (err) => {
    if (err) {
      for (const websocket of ws) {
        websocket.send(
          JSON.stringify({
            event: 'error',
            error: err
          })
        );
      }
    }

    const app = new AppInfoParser('./revanced/temp.apk');
    const resp = await app.parse();
    const { package } = resp;
    const { versionName } = resp;

    await renameSync('./revanced/temp.apk', `./revanced/${package}.apk`);

    global.jarNames.selectedApp = {
      packageName: package,
      uploaded: true
    };

    for (const websocket of ws) {
      websocket.send(
        JSON.stringify({
          event: 'apkUploaded',
          package,
          versionName
        })
      );
    }
  });

  return res.sendStatus(204);
}

module.exports = uploadAPKFile;
