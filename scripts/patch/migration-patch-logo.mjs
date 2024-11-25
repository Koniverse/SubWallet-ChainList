import { DEV_LOGO_PREFIX, PATCH_SAVE_DEV, PATCH_SAVE_STABLE, PRODUCT_LOGO_PREFIX } from "./patch-api.mjs";
import fs from 'fs';

const main = async () => {
  const migrationData = fs.readFileSync(PATCH_SAVE_DEV, 'utf-8').replaceAll(DEV_LOGO_PREFIX, PRODUCT_LOGO_PREFIX);
  await fs.writeFileSync(PATCH_SAVE_STABLE, migrationData);
}

main().catch((error) => console.error(error));
