import * as React from 'react';
import { Flex } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { ToolbarHyperlinkButton } from '../plugins/Hyperlink';
import { ToolbarListButton } from '../plugins/List';
import { ToolbarBoldButton } from '../plugins/Marks/Bold';
import { ToolbarItalicButton } from '../plugins/Marks/Italic';
import { ToolbarUnderlineButton } from '../plugins/Marks/Underline';

type ToolbarProps = {
  isDisabled?: boolean;
  controls?: string[];
};

const styles = {
  toolbar: css({
    border: `1px solid ${tokens.gray400}`,
    backgroundColor: tokens.gray100,
    padding: tokens.spacingXs,
    borderRadius: `${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium} 0 0`,
  }),
  toolbarBtn: css({
    height: '30px',
    width: '30px',
    marginLeft: tokens.spacing2Xs,
    marginRight: tokens.spacing2Xs,
  }),
  divider: css({
    display: 'inline-block',
    height: '21px',
    width: '1px',
    background: tokens.gray300,
    margin: `0 ${tokens.spacing2Xs}`,
  }),
  embedActionsWrapper: css({
    display: ['-webkit-box', '-ms-flexbox', 'flex'],
    webkitAlignSelf: 'flex-start',
    alignSelf: 'flex-start',
    msFlexItemAlign: 'start',
    marginLeft: 'auto',
  }),
  formattingOptionsWrapper: css({
    display: ['-webkit-box', '-ms-flexbox', 'flex'],
    msFlexAlign: 'center',
    webkitBoxAlign: 'center',
    alignItems: 'center',
    msFlexWrap: 'wrap',
    flexWrap: 'wrap',
    marginRight: '20px',
  }),
};

const Toolbar = ({ isDisabled, controls }: ToolbarProps) => {
  const showControl = (ctrl, cmpnt) => controls.indexOf(ctrl) > -1 ? cmpnt : <></>
  return (
    <Flex testId="toolbar" className={styles.toolbar} alignItems="center">
      <div className={styles.formattingOptionsWrapper}>
        {showControl('bold', <ToolbarBoldButton isDisabled={isDisabled} />)}
        {showControl('italics', <ToolbarItalicButton isDisabled={isDisabled} />)}
        {showControl('underline', <ToolbarUnderlineButton isDisabled={isDisabled} />)}
        {showControl('list',
          <>
            <span className={styles.divider} />
            <ToolbarListButton isDisabled={isDisabled} />
          </>
        )}
        {showControl('link',
          <>
            <span className={styles.divider} />
            <ToolbarHyperlinkButton isDisabled={isDisabled} />
          </>
        )}

        {/* <ToolbarHeadingButton isDisabled={isDisabled || !canInsertBlocks} /> */}
        {/* {validationInfo.isAnyMarkEnabled && <span className={styles.divider} />} */}
        {/* <ToolbarSuperscriptButton isDisabled={isDisabled} /> */}
        {/* <ToolbarSubscriptButton isDisabled={isDisabled} /> */}
        {/* <ToolbarCodeButton isDisabled={isDisabled} /> */}
        {/* {shouldShowDropdown && <Dropdown sdk={sdk} isDisabled={isDisabled} />} */}
        {/* {validationInfo.isAnyBlockFormattingEnabled && <span className={styles.divider} />} */}
        {/* <ToolbarQuoteButton isDisabled={isDisabled || !canInsertBlocks} /> */}
        {/* <ToolbarHrButton isDisabled={isDisabled || !canInsertBlocks} /> */}
        {/* <ToolbarTableButton isDisabled={shouldDisableTables} /> */}
      </div>
    </Flex>
  );
};

export default Toolbar;
