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

window.htmlToRichTextDoc = parseHtml;
window.richTextDocToHtml = documentToHtmlString;
window.richTextDocToPlainText = documentToPlainTextString;
window.richTextDocStringToPlainText = documentStringToPlainTextString;
