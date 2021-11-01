const cachedResources: Record<string, Promise<string>> = {};

export async function loadSvgResource(url: string): Promise<string> {
  if (cachedResources[url] !== undefined) {
    return cachedResources[url];
  }
  cachedResources[url] = new Promise((resolve, reject) => {
    fetch(url)
      .then(res => {
        if (res.ok) {
          res
            .text()
            .then(text => resolve(text))
            .catch(() => reject());
        } else {
          reject();
        }
      })
      .catch(() => reject());
  });
  return cachedResources[url];
}
