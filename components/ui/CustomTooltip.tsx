"use client";

import React from "react";
import { Tooltip, TooltipProps } from "antd";

export const CustomTooltip: React.FC<TooltipProps> = (props) => {
  return (
    <Tooltip
      {...props}
      overlayInnerStyle={{
        background: '#18181b', // zinc-900
        color: '#fafafa', // zinc-50
      }}
    >
      {props.children}
    </Tooltip>
  );
};
