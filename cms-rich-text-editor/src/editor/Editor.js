import React from 'react'
import { Plate, PlateProvider } from '@udecode/plate-common';
import equal from 'fast-deep-equal';
import Toolbar from './Toolbar';
import StickyToolbarWrapper from './Toolbar/components/StickyToolbarWrapper';
import { normalizeInitialValue } from './internal';
import { toSlateValue } from './helpers/toSlateValue';
import { ContentfulEditorIdProvider } from './ContentfulEditorProvider';
import { styles } from './RichTextEditor.styles';
import { cx } from '@emotion/css';
import { SyncEditorChanges } from './SyncEditorChanges';
import { getPlugins, disableCorePlugins } from './plugins';
import { useLifecycle } from '../debugRte';

function useStableDeepValue(value) {
  const ref = React.useRef(value)
  if (!equal(ref.current, value)) {
    ref.current = value
  }
  return ref.current
}

export const Editor = (props) => {
  useLifecycle('Editor')
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

  return (
    <ContentfulEditorIdProvider value={id}>
      <div className={styles.root} data-test-id="rich-text-editor">
        <PlateProvider
          id={id}
          initialValue={initialValue}
          plugins={plugins}
          disableCorePlugins={disableCorePlugins}
        >
          <div className={styles.toolbarSlot}>
            <StickyToolbarWrapper isDisabled={props.isDisabled}>
              <Toolbar controls={props.controls} isDisabled={props.isDisabled} />
            </StickyToolbarWrapper>
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
              }}
            />
          </div>
        </PlateProvider>
      </div>
    </ContentfulEditorIdProvider>
  )
}

