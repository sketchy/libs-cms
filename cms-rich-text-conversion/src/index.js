import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { parseHtml } from 'contentful-html-rich-text-converter';

function documentStringToPlainTextString(input) {
  let parsed;

  try {
    parsed = JSON.parse(input)
  } catch (e) {
    console.error('Parsing stringified document json failed')
  }

  if (!parsed) {
    return null;
  }

  return documentToPlainTextString(parsed)
}

/*
  * INFO: Helpful within retool to not worry about type checking
  * This was created because retool doesn't really offer type enforcement
  * Adding conditionals all over retool is quite annoying
  */
function richTextToPlainText(input) {
  if (typeof input === 'string') {
    return documentStringToPlainTextString(input)
  } else {
    return documentToPlainTextString(input);
  }
}

window.htmlToRichTextDoc = parseHtml;
window.richTextDocToHtml = documentToHtmlString;
window.richTextDocToPlainText = richTextToPlainText;
window.richTextDocStringToPlainText = documentStringToPlainTextString;
