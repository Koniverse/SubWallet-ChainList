import customALM from '../../src/data/custom/AssetLogoMap.json' with { type: 'json' }
import customCLM from '../../src/data/custom/ChainLogoMap.json' with { type: 'json' }
// Update icon with chain asset url
export function fillAssetUrl(
  contents: string,
  filename: string,
  env: Record<string, string>
) {
  const assetUrl =
    env.CHAIN_ASSET_URL || 'https://chain-list-data.subwallet.app';
  // Transform JSON files to remove comments
  const isLogoFiles =
    filename.endsWith('AssetLogoMap.json') ||
    filename.endsWith('ChainLogoMap.json');
  const isDataFile =
    filename.endsWith('ChainInfo.json') ||
    filename.endsWith('ChainAsset.json') ||
    filename.endsWith('MultiChainAsset.json');
  const defaultIcon = `${assetUrl}/assets/default.png`
  if (isLogoFiles || isDataFile) {
    if (isLogoFiles) {
      const data = JSON.parse(contents) as Record<string, string>;

      // Add custom logo
      if (filename.endsWith('AssetLogoMap.json')) {
        Object.entries(customALM).forEach(([k,v]) => {
          data[k.toLowerCase()] = v || defaultIcon;
        })
      }
      if (filename.endsWith('ChainLogoMap.json')) {
        Object.entries(customCLM).forEach(([k,v]) => {
          data[k.toLowerCase()] = v || defaultIcon;
        })
      }

      // Update chain asset URL
      Object.entries(data).forEach(([key, value]) => {
        data[key] = `${assetUrl}${value}` || defaultIcon;
      });

      return JSON.stringify(data, null, 2);
    }

    if (isDataFile) {
      const data = JSON.parse(contents) as Record<string, { icon?: string }>;

      // Update chain asset URL
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          data[key].icon = value.icon ? `${assetUrl}${value.icon}` : defaultIcon;
        }
      });
      return JSON.stringify(data, null, 2);
    }
  }
  return contents;
}
