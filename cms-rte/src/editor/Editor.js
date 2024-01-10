import React from 'react'
import { Plate, PlateProvider } from '@udecode/plate-common';
import Toolbar from './Toolbar';
import StickyToolbarWrapper from './Toolbar/components/StickyToolbarWrapper';
import { normalizeInitialValue } from './internal';
import { toSlateValue } from './helpers/toSlateValue';
import { ContentfulEditorIdProvider } from './ContentfulEditorProvider';
import { styles } from './RichTextEditor.styles';
import { css, cx } from '@emotion/css';
import { SyncEditorChanges } from './SyncEditorChanges';
import { getPlugins, disableCorePlugins } from './plugins';

export const Editor = (props) => {
  const id = 'rich-text-editor'
  const plugins = getPlugins(props.onAction, props.restrictedMarks, props.controls)

  const initialValue = React.useMemo(() => {
    return normalizeInitialValue(
      {
        plugins,
        disableCorePlugins,
      },
      toSlateValue(props.value)
    );
  }, [props.value, plugins]);

  const plateClassNames = cx(
    styles.editor,
    props.height !== undefined ? css({ height: props.height }) : undefined,
    props.height !== undefined ? css({ maxHeight: props.height }) : undefined,
    props.minHeight !== undefined ? css({ minHeight: props.minHeight }) : undefined,
    props.maxHeight !== undefined ? css({ maxHeight: props.maxHeight }) : undefined,
    props.isDisabled ? styles.disabled : styles.enabled,
    props.isToolbarHidden && styles.hiddenToolbar
  );

  return (
    <ContentfulEditorIdProvider value={id}>
      <div className={styles.root} data-test-id="rich-text-editor">
        <PlateProvider
          id={id}
          initialValue={initialValue}
          plugins={plugins}
          disableCorePlugins={disableCorePlugins}
        >
          <StickyToolbarWrapper isDisabled={props.isDisabled}>
            <Toolbar controls={props.controls} isDisabled={props.isDisabled} />
          </StickyToolbarWrapper>

          <SyncEditorChanges
            incomingValue={initialValue}
            onChange={props.onChange}
          />

          <Plate
            id={id}
            editableProps={{
              className: plateClassNames,
              readOnly: props.isDisabled,
            }}
          />
        </PlateProvider>
      </div>
    </ContentfulEditorIdProvider>
  )
}

