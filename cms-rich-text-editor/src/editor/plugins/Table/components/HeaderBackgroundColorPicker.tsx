import * as React from 'react';

import { Button, Menu } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

interface HeaderBackgroundColorPickerProps {
  currentColor?: string;
  onColorSelect: (color: string | undefined) => void;
  onClose: () => void;
}

const colorOptions = [
  { name: 'Default (Gray)', value: undefined, color: tokens.gray200 },
  { name: 'Light Blue', value: tokens.blue100, color: tokens.blue100 },
  { name: 'Light Green', value: tokens.green100, color: tokens.green100 },
  { name: 'Light Yellow', value: tokens.yellow100, color: tokens.yellow100 },
  { name: 'Light Orange', value: tokens.orange100, color: tokens.orange100 },
  { name: 'Light Red', value: tokens.red100, color: tokens.red100 },
  { name: 'Light Purple', value: tokens.purple100, color: tokens.purple100 },
];

const colorSwatchStyle = css`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 8px;
  border: 1px solid ${tokens.gray300};
  vertical-align: middle;
`;

const menuItemStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background-color: ${tokens.gray100};
  }
`;

export const HeaderBackgroundColorPicker: React.FC<HeaderBackgroundColorPickerProps> = ({
  currentColor,
  onColorSelect,
  onClose,
}) => {
  const handleColorSelect = (color: string | undefined) => {
    onColorSelect(color);
    onClose();
  };

  return (
    <Menu.List>
      {colorOptions.map((option) => (
        <Menu.Item 
          key={option.name}
          onClick={() => handleColorSelect(option.value)}
        >
          <span
            className={colorSwatchStyle}
            style={{ backgroundColor: option.color }}
          />
          {option.name}
          {currentColor === option.value && ' ✓'}
        </Menu.Item>
      ))}
    </Menu.List>
  );
};
