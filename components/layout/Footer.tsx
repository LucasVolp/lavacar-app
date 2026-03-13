"use client";

import React from "react";
import { Layout, Typography, Space, Divider } from "antd";
import { GithubOutlined, HeartFilled, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const borderColor = isDarkMode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.06)";
  const shadowColor = isDarkMode
    ? "rgba(0, 0, 0, 0.2)"
    : "rgba(0, 0, 0, 0.03)";

  return (
    <AntFooter
      className="mt-auto"
      style={{
        borderTop: `1px solid ${borderColor}`,
        boxShadow: `0 -1px 2px 0 ${shadowColor}`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div className="flex flex-col">
              <Text strong className="text-sm">
                NexoCar
              </Text>
              <Text type="secondary" className="text-xs">
                Sistema de Gestão de Agendamentos
              </Text>
            </div>
          </div>

          <Space separator={<Divider type="vertical" />} className="hidden md:flex">
            <Link href="mailto:suporte@nexocar.com" className="text-xs hover:text-primary">
              <MailOutlined className="mr-1" />
              Suporte
            </Link>
            <Link href="tel:+5511999990000" className="text-xs hover:text-primary">
              <PhoneOutlined className="mr-1" />
              (11) 99999-0000
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="text-xs hover:text-primary"
            >
              <GithubOutlined className="mr-1" />
              GitHub
            </Link>
          </Space>

          <div className="flex items-center gap-1 text-center">
            <Text type="secondary" className="text-xs">
              © {currentYear} NexoCar. Feito com
            </Text>
            <HeartFilled className="text-error text-xs animate-pulse" />
            <Text type="secondary" className="text-xs">
              no Brasil
            </Text>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
