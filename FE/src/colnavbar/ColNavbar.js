import React from "react";
import { Layout, Menu, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import LogoFB from './logo-img/Logo-FB.png';
import LogoZL from './logo-img/Logo-Zalo.png';
import LogoTL from './logo-img/Logo-Telegram.png';
import LogoVB from './logo-img/Logo-Viber.png';

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider theme="light" width={70}>
      <Menu
        theme="light"
        mode="vertical"
        style={{ textAlign: "center", marginTop: "20px", padding: 0 }}
      >
        <Menu.Item
          key="0"
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: "0 5px",
          }}
        >
          <Tooltip
            title="Chat tổng"
            placement="top"
            overlayInnerStyle={{
              backgroundColor: "#fff",  // Màu trắng
              color: "#000",            // Màu chữ đen
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",  // Box shadow
              borderRadius: "4px"       // Độ bo góc
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: "#1890ff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
            >
              <MessageOutlined style={{ fontSize: "20px" }} />
            </div>
          </Tooltip>
        </Menu.Item>

        <Menu.Item
          key="5"
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: "0 5px",
          }}
        >
          <Tooltip
            title="Facebook"
            placement="top"
            overlayInnerStyle={{
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              borderRadius: "4px"
            }}
          >
            <img
              src={LogoFB}
              alt="LogoFB"
              style={{ width: "20px", height: "auto", cursor: "pointer" }}
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item
          key="3"
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: "0 5px",
          }}
        >
          <Tooltip
            title="Zalo"
            placement="top"
            overlayInnerStyle={{
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              borderRadius: "4px"
            }}
          >
            <img
              src={LogoZL}
              alt="LogoZL"
              style={{ width: "20px", height: "auto", cursor: "pointer" }}
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item
          key="2"
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: "0 5px",
          }}
        >
          <Tooltip
            title="Telegram"
            placement="top"
            overlayInnerStyle={{
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              borderRadius: "4px"
            }}
          >
            <img
              src={LogoTL}
              alt="LogoTL"
              style={{ width: "20px", height: "auto", cursor: "pointer" }}
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item
          key="4"
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: "0 5px",
          }}
        >
          <Tooltip
            title="Viber"
            placement="top"
            overlayInnerStyle={{
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              borderRadius: "4px"
            }}
          >
            <img
              src={LogoVB}
              alt="LogoVB"
              style={{ width: "20px", height: "auto", cursor: "pointer" }}
            />
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
