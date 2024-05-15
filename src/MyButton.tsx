import { memo, MouseEventHandler } from 'react';

import { Button, ButtonProps } from '@mui/material';


type MyButtonPropsType = {
  variant: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  color: string;
  title: string;
} & ButtonProps;

export const MyButton = memo(({ variant, onClick, color, title, ...rest }: MyButtonPropsType) => {
  return (
    <Button variant={variant} onClick={onClick} color={color} {...rest}>
      {title}
    </Button>
  );
});
