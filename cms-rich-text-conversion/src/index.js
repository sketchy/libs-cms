import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { parseHtml } from 'contentful-html-rich-text-converter'

window.richTextDocToHtml = documentToHtmlString
window.richTextDocToPlainText = documentToPlainTextString
window.htmlToRichTextDoc = parseHtml
