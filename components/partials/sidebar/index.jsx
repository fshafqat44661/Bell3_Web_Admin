import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import SidebarFooter from "./SidebarFooter";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";

const Sidebar = () => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const node = scrollableNodeRef.current;
    if (!node) return;

    const handleScroll = () => {
      setScroll(node.scrollTop > 0);
    };
    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);
  const [isSemiDark] = useSemiDark();
  const [skin] = useSkin();

  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`sidebar-wrapper flex h-screen flex-col bg-white dark:bg-slate-800 ${
          collapsed ? "w-[72px] close_sidebar" : "w-[248px]"
        }
      ${menuHover ? "sidebar-hovered" : ""}
      ${
        skin === "bordered"
          ? "border-r border-slate-200 dark:border-slate-700"
          : "shadow-base"
      }
      `}
        onMouseEnter={() => {
          setMenuHover(true);
        }}
        onMouseLeave={() => {
          setMenuHover(false);
        }}
      >
        <div className="shrink-0">
          <SidebarLogo menuHover={menuHover} />
        </div>

        <div
          className={`pointer-events-none absolute top-[80px] z-[1] h-[60px] w-full transition-all duration-200 nav-shadow ${
            scroll ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scrollable nav only — logo + footer stay fixed */}
        <SimpleBar
          className="sidebar-menu min-h-0 flex-1 px-4"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <div className="pb-4">
            <Navmenu menus={menuItems} />
          </div>
        </SimpleBar>

        <SidebarFooter />
      </div>
    </div>
  );
};

export default Sidebar;
