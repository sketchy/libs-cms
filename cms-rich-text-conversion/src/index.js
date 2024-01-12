import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { parseHtml } from 'contentful-html-rich-text-converter';

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

window.htmlToRichTextDoc = parseHtml;
window.richTextDocToHtml = richTextToHTML;
window.richTextDocToPlainText = richTextToPlainText;
