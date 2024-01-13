import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { parseHtml } from 'contentful-html-rich-text-converter';

/*
 * INFO: This is used to alert us of version mismatches in retool and override older versions
 * Helps fix an error that isn't super likely, but a real pain to track down within Retool
 * More info: https://coda.io/d/Product-Project-Cortex_dhy-qH2Cem5/Retool-Learnings-Best-Practices_suL_Z?searchClick=60d0037f-c0af-454a-b24e-df9445b7442a_hy-qH2Cem5#_luwLZ
 */
const VERSION = '0.1.4';

/*
 * INFO: Helpful within retool to not worry about type checking
 * This was created because retool doesn't really offer type enforcement
 * Adding conditionals all over retool is quite annoying
 */
function ensureJSON(input) {
  let parsed;

  if (typeof input === 'string') {
    try {
      parsed = JSON.parse(input)
    } catch (e) {
      console.error('Parsing stringified document json failed')
    }
  }

  if (typeof input === 'object') {
    parsed = input;
  }

  if (!parsed) {
    throw new Error('Sorry, we can\'t ensure that this is JSON:', input)
  }

  return parsed;
}

function richTextToHTML(input) {
  return documentToHtmlString(ensureJSON(input))
}

function richTextToPlainText(input) {
  return documentToPlainTextString(ensureJSON(input))
}

const windowVersion = window.richTextDocRetoolVersion;
const hasOldVersion = windowVersion && windowVersion < VERSION;
const hasNewVersion = windowVersion && windowVersion > VERSION;

if (!windowVersion || hasOldVersion) {
  console.warn(
    `Updating 'cms-rich-text-conversion' from the 'libs-cms' library to version ${VERSION}:\n`,
    `An older version (${windowVersion}) was in use and conflicting with ${VERSION}.\n`,
    `Please update the app or module in Retool that is using version ${windowVersion} to use ${VERSION}`
  )

  window.richTextDocRetoolVersion = VERSION
  window.htmlToRichTextDoc = parseHtml;
  window.richTextDocToHtml = richTextToHTML;
  window.richTextDocToPlainText = richTextToPlainText;
}

if (hasNewVersion) {
  console.warn(
    `A newer version of 'cms-rich-text-conversion' from the 'libs-cms' library (${windowVersion}) has already been loaded:\n`,
    `Version ${windowVersion} is in use and conflicts with loading ${VERSION}.\n`,
    `Please update the app or module in Retool that is using version ${VERSION} to use ${windowVersion}`
  )
}

