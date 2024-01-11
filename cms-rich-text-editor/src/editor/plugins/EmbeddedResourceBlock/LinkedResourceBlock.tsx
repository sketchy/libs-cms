import React from 'react';

import { useSelected, useReadOnly } from 'slate-react';

import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { Element, findNodePath, removeNodes, RenderElementProps } from '../../internal';
// import { useSdkContext } from '../../SdkProvider';
import { useLinkTracking } from '../links-tracking';
import { FetchingWrappedResourceCard } from '../shared/FetchingWrappedResourceCard';
import { LinkedBlockWrapper } from '../shared/LinkedBlockWrapper';

export type LinkedResourceBlockProps = {
  element: Element & {
    data: {
      target: {
        sys: {
          urn: string;
          linkType: 'Contentful:Entry';
          type: 'ResourceLink';
        };
      };
    };
  };
  attributes: Pick<RenderElementProps, 'attributes'>;
  children: Pick<RenderElementProps, 'children'>;
};

export function LinkedResourceBlock(props: LinkedResourceBlockProps) {
  return null
}
