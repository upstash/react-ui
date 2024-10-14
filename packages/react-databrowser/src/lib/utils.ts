import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { bytes } from "bytes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function zip<T, U>(array1: T[], array2: U[]): Array<[T, U]> {
  const length = Math.min(array1.length, array2.length);
  const result: Array<[T, U]> = [];

  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]]);
  }

  return result;
}

export function partition<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

type ColorOptions = {
  keyColor?: string;
  numberColor?: string;
  stringColor?: string;
  trueColor?: string;
  falseColor?: string;
  nullColor?: string;
};

const defaultColors: ColorOptions = {
  keyColor: "#B58900",
  numberColor: "#1A01CC",
  stringColor: "#2AA198",
  trueColor: "#1A01CC",
  falseColor: "#1A01CC",
  nullColor: "#1A01CC",
};

type ColorKeys = keyof ColorOptions;
type ColorParts = ColorKeys extends `${infer Part}Color` ? Part : never;

const entityMap: { [key: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

function escapeHtml(html: string): string {
  return String(html).replace(/[&<>"'`=]/g, (s) => entityMap[s] || s);
}

export function formatNumberWithCommas(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function formatHighlight(json: unknown, colorOptions: ColorOptions = {}): string {
  let jsonStr: string;
  if (typeof json === "string") {
    jsonStr = json;
  } else {
    jsonStr = JSON.stringify(json, null, 2) ?? ""; // default to empty string if stringify returns undefined
  }

  const colors: ColorOptions = { ...defaultColors, ...colorOptions };

  return jsonStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g,
    (match) => {
      let updatedMatch = match;

      let cls: ColorParts = "number"; // default to 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
          updatedMatch = `"${escapeHtml(match.slice(1, -1))}"`;
        }
      } else if (/true/.test(updatedMatch)) {
        cls = "true";
      } else if (/false/.test(updatedMatch)) {
        cls = "false";
      } else if (/null/.test(updatedMatch)) {
        cls = "null";
      }
      return `<span class="${cls}" style="color:${colors[`${cls}Color`]}">${updatedMatch}</span>`;
    },
  );
}

export const formatBytes = (byteCount: number) =>
  bytes(byteCount, {
    unitSeparator: " ",
    decimalPlaces: 0,
    fixedDecimals: true,
  });
