"use client";
import React, { useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import Link from "next/link";
import { useSelector } from "react-redux";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const NavBar = useRef();
  const router = useRouter();
  const role_id = useSelector((state) => state.user.role_id);

  useEffect(() => {
    if (
      window.location.pathname === "/paneladmin/settings" ||
      window.location.pathname === "/paneladmin/team" ||
      window.location.pathname === "/paneladmin/testimoni" ||
      window.location.pathname === "/paneladmin/karir" ||
      window.location.pathname === "/paneladmin/kritiksaran" ||
      window.location.pathname === "/paneladmin/masteracara" ||
      window.location.pathname === "/paneladmin/masterartikel" ||
      window.location.pathname === "/paneladmin/mastergaleri" ||
      window.location.pathname === "/paneladmin/menu" ||
      window.location.pathname === "/paneladmin/project" ||
      window.location.pathname === "/paneladmin/klien" ||
      window.location.pathname === "/paneladmin/kategori" ||
      window.location.pathname === "/paneladmin/halaman" ||
      window.location.pathname === "/paneladmin/service"
    ) {
      NavBar.current.classList.remove("h-18");
      NavBar.current.classList.add("h-18");
    }
  }, []);

  function showMenu() {
    if (typeof window !== "undefined") {
      const toggleSettingsValue = localStorage.getItem("toggleSettings");
      const toggleChannelValue = localStorage.getItem("toggleChannel");
      const toggleMarketingValue = localStorage.getItem("toggleMarketing");
      const toggleReportValue = localStorage.getItem("toggleReport");
      const toggleMasterValue = localStorage.getItem("toggleMaster");
      if (toggleSettingsValue === "true") {
        document
          .getElementById("settingsBtn")
          .classList.toggle("transform-settings");
        localStorage.setItem("toggleSettings", "false");
      }
      if (toggleChannelValue === "true") {
        document
          .getElementById("channelBtn")
          .classList.toggle("transform-channel");
        localStorage.setItem("toggleChannel", "false");
      }
      if (toggleMarketingValue === "true") {
        document
          .getElementById("marketingBtn")
          .classList.toggle("transform-marketing");
        localStorage.setItem("toggleMarketing", "false");
      }
      if (toggleReportValue === "true") {
        document
          .getElementById("reportBtn")
          .classList.toggle("transform-report");
        localStorage.setItem("toggleReport", "false");
      }
      if (toggleMasterValue === "true") {
        document
          .getElementById("masterBtn")
          .classList.toggle("transform-master");
        localStorage.setItem("toggleMaster", "false");
      }
      if (
        document.getElementById("mobileSidebar").classList.contains("w-[0px]")
      ) {
        document.getElementById("mobileSidebar").classList.add("w-[310px]");
        document.getElementById("mobileSidebar").classList.remove("w-[0px]");
      } else if (
        document.getElementById("mobileSidebar").classList.contains("w-[310px]")
      ) {
        document.getElementById("mobileSidebar").classList.add("w-[0px]");
        document.getElementById("mobileSidebar").classList.remove("w-[310px]");
      }
      if (document.getElementById("navbar").classList.contains("w-[78px]")) {
        document.getElementById("navbar").classList.remove("w-[78px]");
        document.getElementById("navbar").classList.add("w-[310px]");
        document.getElementById("version").innerHTML = "Administrator";
      } else if (
        document.getElementById("navbar").classList.contains("w-[310px]")
      ) {
        document.getElementById("navbar").classList.add("w-[78px]");
        document.getElementById("navbar").classList.remove("w-[310px]");
        document.getElementById("version").innerHTML = "V 1.0";
      }
    }
  }

  return (
    <div className="w-full h-16 shadow-md flex" ref={NavBar}>
      <button
        onClick={showMenu}
        className="flex justify-center items-center h-full w-20 hover:bg-gray-200"
      >
        <RxHamburgerMenu size={18} color="rgba(54,64,76,.8)" />
      </button>
      <div className="flex h-full flex-1">
        <div className="flex w-full justify-end pr-8">
          <div className="flex gap-8">
            <div className="flex gap-2 h-full justify-center items-center cursor-pointer">
              <div>
                <HiGlobeAsiaAustralia size={20} color="rgba(54,64,76,.8)" />
              </div>
              <Link
                href="/"
                className="text-sm text-[rgba(54,64,76,.8)]"
                replace={false}
              >
                Website
              </Link>
            </div>
            <div className="flex gap-2 h-full justify-center items-center text-center text-sm">
              {role_id === 2 ? "Super Administrator" : "Administrator"}
            </div>
            <button
              onClick={() => {
                deleteCookie("token");
                router.push("/login");
              }}
              className="text-red-500 flex justify-center items-center"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
