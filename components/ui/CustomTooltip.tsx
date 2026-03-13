"use client";

import React from "react";
import { Tooltip, TooltipProps } from "antd";

export const CustomTooltip: React.FC<TooltipProps> = (props) => {
  return (
    <Tooltip
      {...props}
      overlayInnerStyle={{
        background: '#18181b',
        color: '#fafafa',
      }}
    >
      {props.children}
    </Tooltip>
  );
};
