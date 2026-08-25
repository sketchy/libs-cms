import React, { ReactNode } from 'react';

type StickyToolbarProps = {
  isDisabled?: boolean;
  children: ReactNode;
};

const StickyToolbarWrapper = ({ children }: StickyToolbarProps) => (
  <div>{children}</div>
);

export default StickyToolbarWrapper;
