import yaml from "js-yaml";
import { getIconData } from "@iconify/utils";
import { resolve } from "path";
import { readFile } from "node:fs/promises";
const DASHBOARD_CONFIG = "D:/Programming/svelte/dashboard/src/config/config.yml";
const DEFAULT_ICON_FAMILY = "mdi";
function stringIconInfo(ii) {
  let s = "";
  if (ii.api !== void 0) {
    s += ii.api + ":";
  }
  s += ii.family + ":";
  s += ii.name;
  return s;
}
function parseIconName(icon) {
  const iconInfo = icon.toLowerCase().split(":");
  if (iconInfo.length == 3) {
    return {
      api: iconInfo[0],
      family: iconInfo[1],
      name: iconInfo[2]
    };
  }
  if (iconInfo.length == 2) {
    return {
      family: iconInfo[0],
      name: iconInfo[1]
    };
  }
  if (iconInfo.length == 1) {
    return {
      family: DEFAULT_ICON_FAMILY,
      name: iconInfo[0]
    };
  }
  throw new Error("Invalid Icon Name");
}
async function loadIconFamilies(strIconFamilies) {
  const obj = {};
  await Promise.all(
    strIconFamilies.map(async (strIconFamily) => {
      try {
        const locate = (await import("@iconify/json")).locate;
        const iconJson = JSON.parse(
          await readFile(resolve(locate(strIconFamily).toString()), "utf-8")
        );
        obj[strIconFamily] = iconJson;
        console.log(`Loaded icon family '${strIconFamily}'`);
      } catch (exception) {
        console.log(
          `Failed to load local icon family '${strIconFamily}'. Using public API fallback: (${exception})`
        );
      }
    })
  );
  return obj;
}
const load = async () => {
  try {
    console.log(`Loading configuration from '${DASHBOARD_CONFIG}'...`);
    const config = yaml.load(await readFile(resolve(DASHBOARD_CONFIG), "utf-8"));
    console.log("Loaded config!");
    const strIconFamilies = [];
    config.apps.map((app) => {
      try {
        const strIconFamily = parseIconName(app.icon).family;
        if (!strIconFamilies.includes(strIconFamily)) {
          strIconFamilies.push(strIconFamily);
        }
      } catch (exception) {
        console.log(`Invalid icon name '${app.icon}'`);
      }
    });
    const allIconFamilies = await loadIconFamilies(strIconFamilies);
    config.apps.map((app) => {
      try {
        if (app.icon_data) {
          console.log("Icon Data Provided");
          return;
        }
        const iconInfo = parseIconName(app.icon);
        app.icon = stringIconInfo(iconInfo);
        if (iconInfo.api !== void 0) {
          console.log("API Provided. Skipping...");
          return;
        }
        const iconData = getIconData(
          allIconFamilies[iconInfo.family],
          iconInfo.name
        );
        if (iconData != null && !app.icon_data) {
          console.log(`Setting Icon Data for '${app.icon}'`);
          app.icon_data = iconData;
        } else {
          console.log("No data", iconInfo.family, iconInfo.name);
        }
      } catch (exception) {
      }
    });
    return config;
  } catch (exception) {
    console.log(exception);
    return {
      apps: [],
      bookmarks: []
    };
  }
};
export {
  load
};
