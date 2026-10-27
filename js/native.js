// Android app (Capacitor) support. The web build never loads the native plugins.
// scripts/build-web.js sets window.COLORJOY_NATIVE in the packaged index.html.
export const isNative = () => window.COLORJOY_NATIVE === true;

let pluginsPromise = null;
function plugins() {
  if (!pluginsPromise) {
    pluginsPromise = import('./vendor/capacitor-core.js').then(({ registerPlugin }) => ({
      Filesystem: registerPlugin('Filesystem'),
      Share: registerPlugin('Share'),
    }));
  }
  return pluginsPromise;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

// WebViews can't download blob: links, so write the PNG to the app cache and open
// the Android share sheet (Save to Photos / Files, send to family, ...).
export async function shareImage(blob, filename, title = 'My ColorJoy picture') {
  const { Filesystem, Share } = await plugins();
  const data = await blobToBase64(blob);
  const { uri } = await Filesystem.writeFile({ path: filename, data, directory: 'CACHE' });
  try {
    await Share.share({ title, files: [uri], dialogTitle: 'Save or share your picture' });
  } catch (e) {
    // Closing the share sheet rejects; that is not an error for us.
    if (!/cancel/i.test(String(e?.message || e))) throw e;
  }
}
