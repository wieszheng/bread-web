import { useModel } from '@umijs/max';
import React, { PropsWithChildren } from 'react';

export interface AccessProps {
  accessible?: boolean;
  fallback?: React.ReactNode;
  key?: string;
}

export const Access: React.FC<PropsWithChildren<AccessProps>> = (props) => {
  const { initialState } = useModel('@@initialState');
  let accessible: boolean =
    (props.accessible ?? false) || (initialState?.currentUser?.role === 2 ?? false);

  if (!accessible && props.key) {
    accessible =
      initialState?.currentUser?.role === 2 ??
      !!initialState?.currentUser?.hasOwnProperty(props.key);
  }

  return <>{accessible ? props.children : props.fallback}</>;
};
