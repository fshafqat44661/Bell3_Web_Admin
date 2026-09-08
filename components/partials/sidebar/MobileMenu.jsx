import React, { useRef, useEffect, useState } from "react";
import Navmenu from "./Navmenu";
import SidebarFooter from "./SidebarFooter";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import useDarkMode from "@/hooks/useDarkMode";
import Link from "next/link";
import useMobileMenu from "@/hooks/useMobileMenu";
import Icon from "@/components/ui/Icon";

const MobileMenu = ({ className = "custom-class" }) => {
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

  const [isSemiDark] = useSemiDark();
  const [skin] = useSkin();
  const [isDark] = useDarkMode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  return (
    <div
      className={`${className} fixed top-0 flex h-full w-[248px] flex-col bg-white shadow-lg dark:bg-slate-800`}
    >
      <div className="logo-segment z-[9] flex h-[85px] shrink-0 items-center justify-between bg-white px-4 dark:bg-slate-800">
        <Link href="/">
          <div className="flex items-center space-x-4">
            <div className="logo-icon">
              {!isDark && !isSemiDark ? (
                <img src="/assets/images/logo/logo-c.svg" alt="" />
              ) : (
                <img src="/assets/images/logo/logo-c-white.svg" alt="" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Bell3
              </h1>
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="cursor-pointer text-2xl text-slate-900 dark:text-white"
        >
          <Icon icon="heroicons:x-mark" />
        </button>
      </div>

      <div
        className={`pointer-events-none absolute top-[80px] z-[1] h-[60px] w-full transition-all duration-200 nav-shadow ${
          scroll ? "opacity-100" : "opacity-0"
        }`}
      />

      <SimpleBar
        className="sidebar-menu min-h-0 flex-1 px-4"
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        <div className="pb-4">
          <Navmenu menus={menuItems} />
        </div>
      </SimpleBar>

      <SidebarFooter forceExpanded />
    </div>
  );
};

export default MobileMenu;
