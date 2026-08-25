import React from 'react'
import { Plate, PlateProvider } from '@udecode/plate-common';
import equal from 'fast-deep-equal';
import Toolbar from './Toolbar';
import { normalizeInitialValue } from './internal';
import { toSlateValue } from './helpers/toSlateValue';
import { ContentfulEditorIdProvider } from './ContentfulEditorProvider';
import { styles } from './RichTextEditor.styles';
import { css, cx } from '@emotion/css';
import { SyncEditorChanges } from './SyncEditorChanges';
import { getPlugins, disableCorePlugins } from './plugins';
import { scrollRangeIntoContainer } from '../containIframe';

function useStableDeepValue(value) {
  const ref = React.useRef(value)
  if (!equal(ref.current, value)) {
    ref.current = value
  }
  return ref.current
}

export const Editor = (props) => {
  const id = 'rich-text-editor'
  const controlsKey = JSON.stringify(props.controls)
  const restrictedMarksKey = JSON.stringify(props.restrictedMarks)

  const plugins = React.useMemo(
    () => getPlugins(props.onAction, props.restrictedMarks, props.controls),
    [props.onAction, controlsKey, restrictedMarksKey]
  )
  const pluginsRef = React.useRef(plugins)
  pluginsRef.current = plugins

  const stableValue = useStableDeepValue(props.value)

  const initialValue = React.useMemo(() => {
    return normalizeInitialValue(
      {
        plugins: pluginsRef.current,
        disableCorePlugins,
      },
      toSlateValue(stableValue)
    );
  }, [stableValue]);

  const plateClassNames = cx(
    styles.editor,
    props.isDisabled ? styles.disabled : styles.enabled,
    props.isToolbarHidden && styles.hiddenToolbar
  );

  const rootClassName = cx(
    styles.root,
    typeof props.height === 'number' ? css({ height: props.height }) : undefined
  );

  return (
    <ContentfulEditorIdProvider value={id}>
      <div className={rootClassName} data-test-id="rich-text-editor">
        <PlateProvider
          id={id}
          initialValue={initialValue}
          plugins={plugins}
          disableCorePlugins={disableCorePlugins}
        >
          <div className={styles.toolbarSlot}>
            <Toolbar controls={props.controls} isDisabled={props.isDisabled} />
          </div>

          <SyncEditorChanges
            incomingValue={initialValue}
            onChange={props.onChange}
          />

          <div className={styles.editorSlot}>
            <Plate
              id={id}
              editableProps={{
                className: plateClassNames,
                readOnly: props.isDisabled,
                scrollSelectionIntoView: (_editor, domRange) => {
                  const editable = document.querySelector('[data-slate-editor="true"]')
                  scrollRangeIntoContainer(editable, domRange)
                },
                // Slate sets position:relative inline; override so the
                // contenteditable cannot grow the iframe document.
                style: {
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                },
              }}
            />
          </div>
        </PlateProvider>
      </div>
    </ContentfulEditorIdProvider>
  )
}
