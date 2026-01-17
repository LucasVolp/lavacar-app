"use client";

import React from "react";
import { Popconfirm, PopconfirmProps } from "antd";

export const CustomPopconfirm: React.FC<PopconfirmProps> = (props) => {
  return (
    <Popconfirm
      {...props}
      overlayInnerStyle={{
        backgroundColor: '#18181b', // zinc-900
      }}
      okButtonProps={{
        ...props.okButtonProps,
        danger: true,
      }}
      cancelButtonProps={{
        ...props.cancelButtonProps,
      }}
      // Force text colors for dark background
      title={
        <span style={{ color: '#fafafa' }}>{props.title}</span>
      }
      description={props.description ? (
        <span style={{ color: '#a1a1aa' }}>{props.description}</span>
      ) : undefined}
    >
      {props.children}
    </Popconfirm>
  );
};
