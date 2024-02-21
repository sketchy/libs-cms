import TurndownService from "turndown";
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";

const EXAMPLES = {
  list: `<ul>\n  <li>Glycolysis Payoff Phase: Steps 6 through 10 of glycolysis</li>\n  <ul>\n    <li>Starting with two G3P molecules</li>\n  </ul>\n  <li>Step 6: Glyceraldehyde 3 phosphate dehydrogenase (GAPDH) transforms G3P into 1,3-Bisphosphoglycerate (1,3BPG)</li>\n  <ul>\n    <li>GAPDH transfers 2 electrons to NAD+ which makes NADH</li>\n    <li>Produces 2 NADH for every 1 glucose molecule</li>\n  </ul>\n  <li>Step 7: Phosphoglycerate kinase transfers a phosphate group from 1, 3BPG to ADP to make ATP</li>\n  <ul>\n    <li>Produces 3-phosphoglycerate (3PG)</li>\n  </ul>\n  <li>Step 8: Phosphoglycerate mutase transforms 3PG to 2PG</li>\n  <li>Step 9: Enolase removes a molecule of water from 2PG to form PEP</li>\n  <li>Step 10: Pyruvate kinase irreversibly transfers the last phosphate group from PEP to ADP to make pyruvate and ATP</li>\n  <ul>\n    <li>Regulatory step in glycolysis</li>\n    <li>ATP inhibits pyruvate kinase when ATP levels are high</li>\n    <li>Acetyl-CoA, which enters the TCA cycle, also inhibits pyruvate kinase</li>\n    <li>F1,6BP activates pyruvate kinase (feed-forward activation)</li>\n  </ul>\n</ul> `,
  sup: `1 glucose candy chest, 2 energy ("NAD<sup>+</sup>") drink bottles, 2 powered down <sub>ADP</sub> seagulls, 2 P-batteries → 2 pyruvate pirates, 2 NAD H-capped energy ("NADH") drink bottles, 2 powered up ATP seagulls, 2 H<sup>+</sup> binoculars, 2 water canteens`,
  sub: `"f" kelp + ‘ fish + "f" kelp + "V+" <sup>fish</sup> + "V<sub>D</sub>" fin + "V-" fish + "V<sub>S</sub>" fin`,
  del: `2 Stereos + <del>Ants</del>`,
  weird: `In addition to elevated CRP/ESR, ≥3 of 6 lab findings must be present to suspected incomplete KD - anemia for age, WBC ≥15k, <b>elevated ALT<!--?b-->, albumin ≤3 g/dL, urine ≥10 WBC/HPF, plt ≥450k after 7th day of fever <b>(Labs)</b></b>`,
  cool: `<ul>
  <li>Glycolysis Payoff Phase: Steps 6 through 10 of glycolysis</li>
  <ul>
    <li>Starting with two G3P molecules</li>
  </ul>
  <li>Step 6: Glyceraldehyde 3 phosphate dehydrogenase (GAPDH) transforms G3P into 1,3-Bisphosphoglycerate (1,3BPG)</li>
  <ul>
    <li>GAPDH transfers 2 electrons to NAD+ which makes NADH</li>
    <li>Produces 2 NADH for every 1 glucose molecule</li>
    <ul>
      <li>GAPDH transfers 2 electrons to NAD+ which makes <sup>NADH</sup> post sup</li>
      <li>Produces 2 NADH for every 1 glucose <sub>molecule</sub> post sub</li>
    </ul>
  </ul>
  <li>Step 7: Phosphoglycerate kinase transfers a phosphate group from 1, 3BPG to ADP to make ATP</li>
  <ul>
    <li>Produces 3-phosphoglycerate (3PG)</li>
  </ul>
  <li>Step 8: Phosphoglycerate mutase transforms 3PG to 2PG</li>
  <li>Step 9: Enolase removes a molecule of water from 2PG to form PEP</li>
  <li>Step 10: Pyruvate kinase irreversibly transfers the last phosphate group from PEP to ADP to make pyruvate and ATP</li>
  <ul>
    <li>Regulatory step in glycolysis</li>
    <li>ATP inhibits pyruvate kinase when ATP levels are high</li>
    <li>Acetyl-CoA, which enters the TCA cycle, also inhibits pyruvate kinase</li>
    <li>F1,6BP activates pyruvate kinase (feed-forward activation)</li>
  </ul>
</ul>`,
  crazy: `<div class="t_symbol ui-draggable ui-draggable-handle circle small red selected" id="t_symbol_1" style="left: 947px; top: 284px;">1<div class="t_tooltip_content_wrap left" style="width: auto; opacity: 0.9;"><div class="t_tooltip_name">Mat the Poet</div><div class="t_tooltip_description"> <b>Hematopoietic stem cells</b> are immature cells produced in bone marrow that differentiate into leukocytes (WBCs), erythrocytes (RBCs), and cells that produce platelets</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_2" style="left: 916px; top: 80px;">2<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Bone tapestry</div><div class="t_tooltip_description"> Hematopoietic stem cells are immature cells produced in bone marrow that differentiate into leukocytes (WBCs), erythrocytes (RBCs), and cells that produce platelets</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_3" style="left: 564px; top: 467px;">3<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Myellers</div><div class="t_tooltip_description"> <b>Common myeloid progenitor cells</b> are bone marrow stem cells that give rise to granulocytes, monocytes, red blood cells, and the cells that produce platelets</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_4" style="left: 1432px; top: 463px;">4<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Lymphulets</div><div class="t_tooltip_description"> <b>Common lymphoid progenitor cells</b> are bone marrow stem cells that give rise to NK cells, B-cells, and T-cells</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_5" style="left: 237px; top: 616px;">5<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">First responder</div><div class="t_tooltip_description"> <b>Neutrophils</b> are innate immune cells of myeloid lineage that are important in the first line of defense against pathogens</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_6" style="left: 274px; top: 673px;">6<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Eating cookie</div><div class="t_tooltip_description"> Neutrophils <b>phagocytize pathogens</b></div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_7" style="left: 396px; top: 638px;">7<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Lady Eosin</div><div class="t_tooltip_description"> <b>Eosinophils</b> are innate immune cells of myeloid lineage</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_8" style="left: 483px; top: 674px;">8<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Lady eosinâs tissue</div><div class="t_tooltip_description"> Most eosinophils reside in<b> body tissues</b></div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_9" style="left: 413px; top: 575px;">9<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Hair bow</div><div class="t_tooltip_description"> Eosinophils have a <b>bilobate nucleus</b></div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_10" style="left: 428px; top: 684px;">10<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Pink polka dots</div><div class="t_tooltip_description"> Eosinophils â granules appear pink</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_11" style="left: 406px; top: 715px;">11<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Worm</div><div class="t_tooltip_description">  Eosinophils target <b>helminths and other parasites</b></div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_12" style="left: 434px; top: 622px;">12<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Sneeze + pollen</div><div class="t_tooltip_description"> Eosinophils cause basophils and mast cells to release histamines in response to <b>allergens</b></div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_13" style="left: 613px; top: 693px;">13<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Purple polka dots</div><div class="t_tooltip_description"> <b>Basophils</b> are innate immune cells of myeloid lineage that circulate in the blood</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_14" style="left: 558px; top: 663px;">14<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Sneeze</div><div class="t_tooltip_description"> Basophils circulate in the blood and release histamine in response to <b>allergens</b></div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_15" style="left: 722px; top: 593px;">15<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Master beekeeper</div><div class="t_tooltip_description"> <b>Mast cells</b> are innate immune cells of myeloid lineage</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_16" style="left: 821px; top: 608px;">16<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Bees + bee sting rash</div><div class="t_tooltip_description"> Mast cells release <b>histamine</b> in response to allergens</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_17" style="left: 515px; top: 728px;">17<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Grainy parchment</div><div class="t_tooltip_description"> <b>Granulocytes</b> are immune cells that contain granules in their cytoplasm (neutrophils, eosinophils, basophils, mast cells)</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_18" style="left: 960px; top: 665px;">18<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Monocle</div><div class="t_tooltip_description"> <b>Monocytes</b> are innate immune cells of myeloid lineage that circulate in blood before migrating to organs/tissues where they differentiate into macrophages or dendritic cells</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_19" style="left: 678px; top: 982px;">19<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Macrocage</div><div class="t_tooltip_description"> <b>Macrophages</b> are innate immune cells of myeloid lineage that are derived from monocytes</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_20" style="left: 653px; top: 912px;">20<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Tissue over cage</div><div class="t_tooltip_description"> Macrophages <b>reside in tissues</b> where they phagocytize pathogens<b>,</b> then communicate with other cells to coordinate an immune response</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_21" style="left: 705px; top: 926px;">21<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Talking parrot</div><div class="t_tooltip_description"> Macrophages reside in tissues where they phagocytize pathogens, then <b>communicate with other cells</b> to coordinate an immune response</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_22" style="left: 971px; top: 892px;">22<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Dendrilocks</div><div class="t_tooltip_description"> <b>Dendritic cells</b> are innate immune cells of myeloid lineage that are derived from monocytes</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_23" style="left: 1138px; top: 888px;">23<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Hair beyond portrait</div><div class="t_tooltip_description"> Dendritic cells reside in tissues that <b>interact with the external environment + communicate to T-cells</b></div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_24" style="left: 1221px; top: 592px;">24<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Assassin</div><div class="t_tooltip_description"> <b>Natural killer cells</b> (NK cells) are innate immune cells of lymphoid lineage</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_25" style="left: 1235px; top: 696px;">25<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Plotting fingers</div><div class="t_tooltip_description"> Natural killer cells<b> induce apoptosis</b> of abnormal body cells (e.g., cells infected by a virus)</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_26" style="left: 1426px; top: 675px;">26<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">B-shaped bow</div><div class="t_tooltip_description"> <b>B-cells</b> are adaptive immune cells of lymphoid lineage that mature in bone marrow</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_27" style="left: 1427px; top: 972px;">27<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Huge quivver of antibody arrows</div><div class="t_tooltip_description"> <b>Plasma cells </b>produce <b>antibodies</b> in response to encountering a specific antigen</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_28" style="left: 1622px; top: 952px;">28<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Wise archer</div><div class="t_tooltip_description"> <b>Memory B-cells </b>retain information about pathogen exposures to mount faster responses during future exposures (immunity)</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_29" style="left: 1658px; top: 635px;">29<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Knight + squire</div><div class="t_tooltip_description"> <b>T-cells</b> are adaptive immune cells of lymphoid lineage that are produced in bone marrow, but mature in the thymus</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_30" style="left: 1566px; top: 667px;">30<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Killer knight + â8â snake<b></b></div><div class="t_tooltip_description"><b> Cytotoxic T-cells (CD8<sup>+</sup> T-cells)</b> induce apoptosis in abnormal cells (e.g., infected cells, cancer cells, damaged cells)</div></div></div><div class="t_symbol ui-draggable ui-draggable-handle circle small red" id="t_symbol_31" style="left: 1739px; top: 686px;">31<div class="t_tooltip_content_wrap left" style="width: auto;"><div class="t_tooltip_name">Helpful squire + â4â straps</div><div class="t_tooltip_description"> <b>Helper T-cells (CD4<sup>+</sup> T-cells)</b> coordinate adaptive and innate immune responses</div></div></div>`
}


/*
 * INFO: https://github.com/mixmark-io/turndown/issues/232#issuecomment-1659413071
 * Yes, we get technically invalid (yet very common) html nested lists
 * Turndown doesn't want to support invalid html, but they don't make the rules here!
 * Thus, LIST_RULE and LIST_ITEM_RULE accomplish the task for us
 */
function indentContent(content) {
  return content
    .replace(/^\n+/, '') // remove leading newlines
    .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
    .replace(/\n/gm, '\n    ') // indent
}

const LIST_RULE = {
  filter: ['ul', 'ol'],

  replacement: function(content, node) {
    var parent = node.parentNode

    // CHANGE: Allow for <ul> and <ol> that are improperly nested outside of <li>.
    if (node.parentNode.nodeName.match(/^(UL|OL)$/i)) {
      content = '    ' + indentContent(content)
    }

    if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
      return '\n' + content
    } else {
      return '\n\n' + content + '\n\n'
    }
  }
}

const LIST_ITEM_RULE = {
  filter: 'li',

  replacement: function(content, node, options) {
    content = indentContent(content)

    let prefix = options.bulletListMarker + '   '
    const parent = node.parentNode

    // Don't output two markers if there is an empty li.
    if (
      node.children.length === 1 &&
      node.children[0].nodeName.match(/^(UL|OL)$/i) &&
      node.textContent === node.children[0].textContent
    ) {
      prefix = '    '
    } else if (parent.nodeName === 'OL') {
      const start = parent.getAttribute('start')
      // When <ol> is improperly nested outside of <li>, get the numbering correct.
      const index = Array.prototype.indexOf.call(Array.prototype.filter.call(parent.children, el => el.nodeName === 'LI'), node)
      prefix = (start ? Number(start) + index : index + 1) + '.  '
    }

    return (
      prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
    )
  }
}

/*
 * INFO: Subscript and Postscript aren't supported by default
 *       This formats html sub and sup tags as makeshift markdown image tags
 *       which allows us to parse the content in the rich text conversion
 */
const SUB_RULE = {
  filter: 'sub',
  replacement: (content) => `![subscript](${content})`
}

const SUP_RULE = {
  filter: 'sup',
  replacement: (content) => `![superscript](${content})`
}

function formatSubAndSupRichText(node) {
  return {
    nodeType: 'text',
    value: node.url,
    marks: [{ type: node.alt }],
    data: { join: true } // flags this node for moving into paragraph element
  }
}

/*
 * Reformat the rich text to properly contain superscript and subscript marks
 * We set the flag above to know when we need to join the content surrounding the "join" data
 * This is because html to markdown and markdown to richtext don't support sup and sub out of the box
 * The SUB_RULE, SUP_RULE and formatSubAndSupText configure sup and sub conversions
 * However the custom handling in rich text creates new lines for each sub and sup mark
 * This refomat fixes that issue, by joining the contents of the blobs when "join" is found
 */
function reformatRichText(rtx) {
  const newContent = [];
  const ignoreIndex = [];

  for (let i = 0; i < rtx.content.length; i++) {
    const item = rtx.content[i];

    if (item.data?.join && i > 0) {
      const next = rtx.content[i + 1]

      item.data = {}
      newContent[newContent.length - 1].content?.push(item);

      if (next?.content?.length) {
        ignoreIndex.push(i + 1)
        newContent[newContent.length - 1].content?.push(...next.content);
      }
    } else if (!ignoreIndex.includes(i)) {
      newContent.push(item);

      // If the item has its own content, recurse into it
      if (item.content) {
        item.content = reformatRichText(item).content;
      }
    }
  }

  rtx.content = newContent;

  return rtx
}

const TDS = new TurndownService()
  .addRule('list', LIST_RULE)
  .addRule('listItem', LIST_ITEM_RULE)
  .addRule('sup', SUP_RULE)
  .addRule('sub', SUB_RULE);

/*
 * Pass in html, get formatted rich text
 */
async function htmlToRichText(html) {
  const markdown = TDS.turndown(html)
  const richtext = await richTextFromMarkdown(markdown, formatSubAndSupRichText)
  const reformat = reformatRichText(richtext);
  return reformat
}

const formatted = htmlToRichText(EXAMPLES.crazy)
