import type React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

interface ButtonProps extends Omit<AntButtonProps, 'type'> {
  children: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
}

const Button: React.FC<ButtonProps> = ({ children, type, ...props }) => {
  return (
    <AntButton className='undp-button button-secondary' htmlType={type} {...props}>
      {children}
    </AntButton>
  );
};

export default Button;
