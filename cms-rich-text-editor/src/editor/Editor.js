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
import { log, useLifecycle } from '../debugRte';

function useStableDeepValue(value) {
  const ref = React.useRef(value)
  if (!equal(ref.current, value)) {
    ref.current = value
  }
  return ref.current
}

function useLayoutProbe() {
  React.useEffect(() => {
    const root = document.querySelector('[data-test-id="rich-text-editor"]')
    const editable = root?.querySelector('[data-slate-editor="true"], [contenteditable="true"]')
    const slot = editable?.parentElement
    if (!root || !slot || !editable) {
      return undefined
    }

    let lastKey = ''
    const report = (reason) => {
      const payload = {
        reason,
        innerHeight: window.innerHeight,
        htmlScrollHeight: document.documentElement.scrollHeight,
        slotClientHeight: slot.clientHeight,
        editableClientHeight: editable.clientHeight,
        editableScrollHeight: editable.scrollHeight,
        editorGrewPastSlot: editable.clientHeight > slot.clientHeight + 1,
        innerCanScroll: editable.scrollHeight > editable.clientHeight + 1,
      }
      const key = JSON.stringify(payload)
      if (key === lastKey) {
        return
      }
      lastKey = key
      log('layout', payload)
    }

    report('mount')
    const observer = new ResizeObserver(() => report('resize'))
    observer.observe(slot)
    observer.observe(editable)
    return () => observer.disconnect()
  }, [])
}

export const Editor = (props) => {
  useLifecycle('Editor')
  useLayoutProbe()
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

