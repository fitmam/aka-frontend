"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
  IoMdAnalytics,
} from "react-icons/io";
import { usePathname } from "next/navigation";
import { BiSolidReport } from "react-icons/bi";
import { LuSettings2 } from "react-icons/lu";
import { BsPeopleFill, BsGearFill, BsBarChartFill } from "react-icons/bs";
import { FaDatabase } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { setRoleId, setUserId } from "@/redux/reducer/user";
import { useDispatch } from "react-redux";
import http from "@/helpers/http.helper";
import { useQuery } from "@tanstack/react-query";
import { setColor } from "@/redux/reducer/colorscheme";
import { getCookie } from "cookies-next";

export function Sidebar() {
  const [toggleReport, setToggleReport] = useState(false);
  const [toggleMarketing, setToggleMarketing] = useState(false);
  const [toggleChannel, setToggleChannel] = useState(false);
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleMaster, setToggleMaster] = useState(false);
  const role_id = useSelector((state) => state.user.role_id);
  const dispatch = useDispatch();
  const token = getCookie("token");
  const currentRoute = usePathname();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const textcolor = useSelector((state) => state.color.color.text);

  function toggleShowSettings() {
    if (typeof window !== "undefined") {
      document.getElementById("navbar").classList.add("w-[310px]");
      document.getElementById("navbar").classList.remove("w-[78px]");
      document.getElementById("version").innerHTML = "Administrator";
      if (typeof window !== "undefined") {
        const toggleSettingsValue = localStorage.getItem("toggleSettings");
        const toggleChannelValue = localStorage.getItem("toggleChannel");
        const toggleMarketingValue = localStorage.getItem("toggleMarketing");
        const toggleReportValue = localStorage.getItem("toggleReport");
        const toggleMasterValue = localStorage.getItem("toggleMaster");
        if (toggleSettingsValue === "true") {
          localStorage.setItem("toggleSettings", "false");
        } else {
          localStorage.setItem("toggleSettings", "true");
        }
        document
          .getElementById("settingsBtn")
          .classList.toggle("transform-settings");
        setToggleSettings(!toggleSettings);
        if (toggleMarketingValue === "true") {
          localStorage.setItem("toggleMarketing", "false");
          document
            .getElementById("marketingBtn")
            .classList.toggle("transform-marketing");
        }
        if (toggleChannelValue === "true") {
          localStorage.setItem("toggleChannel", "false");
          document
            .getElementById("channelBtn")
            .classList.toggle("transform-channel");
        }
        if (toggleReportValue === "true") {
          localStorage.setItem("toggleReport", "false");
          document
            .getElementById("reportBtn")
            .classList.toggle("transform-report");
        }
        if (toggleMasterValue === "true") {
          localStorage.setItem("toggleMaster", "false");
          document
            .getElementById("masterBtn")
            .classList.toggle("transform-master");
        }
      }
    }
  }

  function toggleShowMaster() {
    if (typeof window !== "undefined") {
      document.getElementById("navbar").classList.add("w-[310px]");
      document.getElementById("navbar").classList.remove("w-[78px]");
      document.getElementById("version").innerHTML = "Administrator";
      if (typeof window !== "undefined") {
        const toggleSettingsValue = localStorage.getItem("toggleSettings");
        const toggleChannelValue = localStorage.getItem("toggleChannel");
        const toggleMarketingValue = localStorage.getItem("toggleMarketing");
        const toggleReportValue = localStorage.getItem("toggleReport");
        const toggleMasterValue = localStorage.getItem("toggleMaster");
        if (toggleMasterValue === "true") {
          localStorage.setItem("toggleMaster", "false");
        } else {
          localStorage.setItem("toggleMaster", "true");
        }
        document
          .getElementById("masterBtn")
          .classList.toggle("transform-master");
        setToggleMaster(!toggleMaster);
        if (toggleMarketingValue === "true") {
          localStorage.setItem("toggleMarketing", "false");
          document
            .getElementById("marketingBtn")
            .classList.toggle("transform-marketing");
        }
        if (toggleChannelValue === "true") {
          localStorage.setItem("toggleChannel", "false");
          document
            .getElementById("channelBtn")
            .classList.toggle("transform-channel");
        }
        if (toggleReportValue === "true") {
          localStorage.setItem("toggleReport", "false");
          document
            .getElementById("reportBtn")
            .classList.toggle("transform-report");
        }
        if (toggleSettingsValue === "true") {
          localStorage.setItem("toggleSettings", "false");
          document
            .getElementById("settingsBtn")
            .classList.toggle("transform-settings");
        }
      }
    }
  }

  function toggleShowChannel() {
    if (typeof window !== "undefined") {
      document.getElementById("navbar").classList.add("w-[310px]");
      document.getElementById("navbar").classList.remove("w-[78px]");
      document.getElementById("version").innerHTML = "Administrator";
      if (typeof window !== "undefined") {
        const toggleSettingsValue = localStorage.getItem("toggleSettings");
        const toggleChannelValue = localStorage.getItem("toggleChannel");
        const toggleMarketingValue = localStorage.getItem("toggleMarketing");
        const toggleReportValue = localStorage.getItem("toggleReport");
        const toggleMasterValue = localStorage.getItem("toggleMaster");
        if (toggleChannelValue === "true") {
          localStorage.setItem("toggleChannel", "false");
        } else {
          localStorage.setItem("toggleChannel", "true");
        }
        document
          .getElementById("channelBtn")
          .classList.toggle("transform-channel");
        setToggleChannel(!toggleChannel);
        if (toggleMarketingValue === "true") {
          localStorage.setItem("toggleMarketing", "false");
          document
            .getElementById("marketingBtn")
            .classList.toggle("transform-marketing");
        }
        if (toggleSettingsValue === "true") {
          localStorage.setItem("toggleSettings", "false");
          document
            .getElementById("settingsBtn")
            .classList.toggle("transform-settings");
        }
        if (toggleReportValue === "true") {
          localStorage.setItem("toggleReport", "false");
          document
            .getElementById("reportBtn")
            .classList.toggle("transform-report");
        }
        if (toggleMasterValue === "true") {
          localStorage.setItem("toggleMaster", "false");
          document
            .getElementById("masterBtn")
            .classList.toggle("transform-master");
        }
      }
    }
  }

  function toggleShowMarketing() {
    if (typeof window !== "undefined") {
      document.getElementById("navbar").classList.add("w-[310px]");
      document.getElementById("navbar").classList.remove("w-[78px]");
      document.getElementById("version").innerHTML = "Administrator";
      if (typeof window !== "undefined") {
        const toggleSettingsValue = localStorage.getItem("toggleSettings");
        const toggleChannelValue = localStorage.getItem("toggleChannel");
        const toggleMarketingValue = localStorage.getItem("toggleMarketing");
        const toggleReportValue = localStorage.getItem("toggleReport");
        const toggleMasterValue = localStorage.getItem("toggleMaster");
        if (toggleMarketingValue === "true") {
          localStorage.setItem("toggleMarketing", "false");
        } else {
          localStorage.setItem("toggleMarketing", "true");
        }
        document
          .getElementById("marketingBtn")
          .classList.toggle("transform-marketing");
        setToggleMarketing(!toggleMarketing);
        setToggleReport(!toggleReport);
        if (toggleSettingsValue === "true") {
          localStorage.setItem("toggleSettings", "false");
          document
            .getElementById("settingsBtn")
            .classList.toggle("transform-settings");
        }
        if (toggleChannelValue === "true") {
          localStorage.setItem("toggleChannel", "false");
          document
            .getElementById("channelBtn")
            .classList.toggle("transform-channel");
        }
        if (toggleReportValue === "true") {
          localStorage.setItem("toggleReport", "false");
          document
            .getElementById("reportBtn")
            .classList.toggle("transform-report");
        }
        if (toggleMasterValue === "true") {
          localStorage.setItem("toggleMaster", "false");
          document
            .getElementById("masterBtn")
            .classList.toggle("transform-master");
        }
      }
    }
  }

  function toggleShowReport() {
    if (typeof window !== "undefined") {
      document.getElementById("navbar").classList.add("w-[310px]");
      document.getElementById("navbar").classList.remove("w-[78px]");
      document.getElementById("version").innerHTML = "Administrator";
      if (typeof window !== "undefined") {
        const toggleSettingsValue = localStorage.getItem("toggleSettings");
        const toggleChannelValue = localStorage.getItem("toggleChannel");
        const toggleMarketingValue = localStorage.getItem("toggleMarketing");
        const toggleReportValue = localStorage.getItem("toggleReport");
        const toggleMasterValue = localStorage.getItem("toggleMaster");
        if (toggleReportValue === "true") {
          localStorage.setItem("toggleReport", "false");
        } else {
          localStorage.setItem("toggleReport", "true");
        }
        document
          .getElementById("reportBtn")
          .classList.toggle("transform-report");
        setToggleReport(!toggleReport);
        if (toggleMarketingValue === "true") {
          localStorage.setItem("toggleMarketing", "false");
          document
            .getElementById("marketingBtn")
            .classList.toggle("transform-marketing");
        }
        if (toggleChannelValue === "true") {
          localStorage.setItem("toggleChannel", "false");
          document
            .getElementById("channelBtn")
            .classList.toggle("transform-channel");
        }
        if (toggleSettingsValue === "true") {
          localStorage.setItem("toggleSettings", "false");
          document
            .getElementById("settingsBtn")
            .classList.toggle("transform-settings");
        }
        if (toggleMasterValue === "true") {
          localStorage.setItem("toggleMaster", "false");
          document
            .getElementById("masterBtn")
            .classList.toggle("transform-master");
        }
      }
    }
  }

  useEffect(() => {
    const toggleSettingsValue = localStorage.getItem("toggleSettings");
    const toggleChannelValue = localStorage.getItem("toggleChannel");
    const toggleMarketingValue = localStorage.getItem("toggleMarketing");
    const toggleReportValue = localStorage.getItem("toggleReport");
    const toggleMasterValue = localStorage.getItem("toggleMaster");

    if (toggleSettingsValue === "true") {
      document
        .getElementById("settingsBtn")
        .classList.add("transform-settings");
      setToggleSettings(true);
    }
    if (toggleMasterValue === "true") {
      document.getElementById("masterBtn").classList.add("transform-master");
      setToggleMaster(true);
    }
    if (toggleChannelValue === "true") {
      document.getElementById("channelBtn").classList.add("transform-channel");
      setToggleChannel(true);
    }
    if (toggleMarketingValue === "true") {
      document
        .getElementById("marketingBtn")
        .classList.add("transform-marketing");
      setToggleMarketing(true);
    }
    if (toggleReportValue === "true") {
      document.getElementById("reportBtn").classList.add("transform-report");
      setToggleReport(true);
    }
  }, [toggleSettings]);

  async function fetchProfile() {
    const { data } = await http(token).get("/profile");
    return data.results;
  }

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchColor() {
    const { data } = await http().get("/color");
    return data.results;
  }

  const { data: colorData } = useQuery({
    queryKey: ["color"],
    queryFn: () => fetchColor(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    dispatch(setUserId(profileData?.user?.id));
    dispatch(setRoleId(profileData?.user?.role_id));
  }, [dispatch, profileData?.user?.id, profileData?.user?.role_id]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primary);
    document.documentElement.style.setProperty("--secondary-color", secondary);
    document.documentElement.style.setProperty("--text-color", textcolor);
    dispatch(
      setColor({
        primary: colorData?.[0]?.primary,
        secondary: colorData?.[0]?.secondary,
        text: colorData?.[0]?.text,
      })
    );
  }, [primary, secondary, colorData, dispatch, textcolor]);

  return (
    <div
      className={`text-color hidden xl:flex flex-col w-[310px] bg-secondary overflow-y-scroll overflow-x-hidden scrollbar navbar-slide z-20`}
      id="navbar"
    >
      <div
        className="w-full h-24 text-2xl font-medium uppercase text-center pt-7 cursor-default"
        id="version"
      >
        Administrator
      </div>
      <div className={`w-[300px]`}>
        <div className="flex flex-col pt-2 text-sm">
          <Link
            href="/paneladmin"
            scroll={false}
            className={
              currentRoute === "/paneladmin"
                ? "flex items-center gap-8 hover:bg-[#162339] bg-[#162339] text-[#3bc0c3] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
                : "flex items-center gap-8 hover:bg-[#162339] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
            }
          >
            <div className="w-6">
              <BsBarChartFill size={25} />
            </div>
            <div className="w-28" id="nav-menu-1">
              Dashboard
            </div>
          </Link>
          <button
            className={
              "flex items-center gap-8 hover:bg-[#162339] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
            }
            onClick={() => {
              toggleShowMaster();
            }}
          >
            <div className="w-6">
              <FaDatabase size={25} />
            </div>
            <div className="w-full flex items-center gap-[90px]">
              <div id="nav-menu-2">Master Data</div>
              <div>{toggleMaster ? <IoIosArrowDown /> : <IoIosArrowUp />}</div>
            </div>
          </button>
          <div
            id="masterBtn"
            className="transform w-full ml-20 box overflow-hidden"
          >
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/peran-pengguna"
                  className={
                    currentRoute === "/paneladmin/peran-pengguna" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Peran Pengguna
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/tipe-bisnis"
                  className={
                    currentRoute === "/paneladmin/tipe-bisnis" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Tipe Bisnis
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/departement"
                  className={
                    currentRoute === "/paneladmin/departement" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Departemen
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/jabatan"
                  className={
                    currentRoute === "/paneladmin/jabatan" && "text-[#3bc0c3]"
                  }
                >
                  Jabatan
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/bidang-pekerjaan"
                  className={
                    currentRoute === "/paneladmin/bidang-pekerjaan" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Bidang Pekerjaan
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/posisi-dibutuhkan"
                  className={
                    currentRoute === "/paneladmin/posisi-dibutuhkan" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Posisi Dibutuhkan
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/hitungan-gaji-pokok"
                  className={
                    currentRoute === "/paneladmin/hitungan-gaji-pokok" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Hitungan Gaji Pokok
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/status-karyawan"
                  className={
                    currentRoute === "/paneladmin/status-karyawan" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Status Karyawan
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/jenis-kelamin"
                  className={
                    currentRoute === "/paneladmin/jenis-kelamin" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Jenis Kelamin
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/agama"
                  className={
                    currentRoute === "/paneladmin/agama" && "text-[#3bc0c3]"
                  }
                >
                  Agama
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/vaksin"
                  className={
                    currentRoute === "/paneladmin/vaksin" && "text-[#3bc0c3]"
                  }
                >
                  Vaksin
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/pendidikan"
                  className={
                    currentRoute === "/paneladmin/pendidikan" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Pendidikan
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/pengalaman-kerja"
                  className={
                    currentRoute === "/paneladmin/pengalaman-kerja" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Pengalaman Kerja
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/status-pernikahan"
                  className={
                    currentRoute === "/paneladmin/status-pernikahan" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Status Nikah
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/surat-izin-mengemudi"
                  className={
                    currentRoute === "/paneladmin/surat-izin-mengemudi" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Surat Izin Mengemudi
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/kendaraan"
                  className={
                    currentRoute === "/paneladmin/kendaraan" && "text-[#3bc0c3]"
                  }
                >
                  Kendaraan
                </Link>
              </div>
            </div>
          </div>
          {role_id === 2 && (
            <Link
              scroll={false}
              href="/paneladmin/pengguna"
              className={
                currentRoute === "/paneladmin/pengguna"
                  ? "flex items-center gap-8 hover:bg-[#162339] bg-[#162339] text-[#3bc0c3] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
                  : "flex items-center gap-8 hover:bg-[#162339] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
              }
            >
              <div className="w-6">
                <BsPeopleFill size={25} />
              </div>
              <div className="w-28" id="nav-menu-2">
                Pengguna
              </div>
            </Link>
          )}
          <button
            className={
              currentRoute === "/paneladmin/testimoni"
                ? "flex items-center gap-8 hover:bg-[#162339] bg-[#162339] text-[#3bc0c3] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
                : "flex items-center gap-8 hover:bg-[#162339] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
            }
            onClick={() => {
              toggleShowSettings();
            }}
          >
            <div className="w-6">
              <BsGearFill size={24} />
            </div>
            <div className="w-full flex items-center gap-8">
              <div id="nav-menu-3">Pengaturan Website</div>
              <div>
                {toggleSettings ? <IoIosArrowDown /> : <IoIosArrowUp />}
              </div>
            </div>
          </button>
          <div
            id="settingsBtn"
            className="transform w-full ml-20 box overflow-hidden"
          >
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/settings"
                  className={
                    currentRoute === "/paneladmin/settings" && "text-[#3bc0c3]"
                  }
                >
                  Umum
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/menu"
                  className={
                    (currentRoute === "/paneladmin/submenu" &&
                      "text-[#3bc0c3]") ||
                    (currentRoute === "/paneladmin/menu" && "text-[#3bc0c3]")
                  }
                >
                  Menu
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/banner"
                  className={
                    currentRoute === "/paneladmin/banner" && "text-[#3bc0c3]"
                  }
                >
                  Banner
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/kategori"
                  className={
                    currentRoute === "/paneladmin/kategori" && "text-[#3bc0c3]"
                  }
                >
                  Kategori
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/halaman"
                  className={
                    (currentRoute === "/paneladmin/halaman" &&
                      "text-[#3bc0c3]") ||
                    (currentRoute === "/paneladmin/edit-halaman" &&
                      "text-[#3bc0c3]") ||
                    (currentRoute === "/paneladmin/tambah-halaman" &&
                      "text-[#3bc0c3]")
                  }
                >
                  Halaman
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/acara"
                  className={
                    currentRoute === "/paneladmin/acara" && "text-[#3bc0c3]"
                  }
                >
                  Acara
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/artikel"
                  className={
                    (currentRoute === "/paneladmin/artikel" &&
                      "text-[#3bc0c3]") ||
                    (currentRoute === "/paneladmin/tambah-artikel" &&
                      "text-[#3bc0c3]") ||
                    (currentRoute === "/paneladmin/edit-artikel" &&
                      "text-[#3bc0c3]")
                  }
                >
                  Artikel
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/galeri"
                  className={
                    currentRoute === "/paneladmin/galeri" && "text-[#3bc0c3]"
                  }
                >
                  Galeri
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/team"
                  className={
                    currentRoute === "/paneladmin/team" && "text-[#3bc0c3]"
                  }
                >
                  Team
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/testimoni"
                  className={
                    currentRoute === "/paneladmin/testimoni" && "text-[#3bc0c3]"
                  }
                >
                  Testimoni
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/klien-kami"
                  className={
                    currentRoute === "/paneladmin/klien-kami" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Klien Kami
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/faq"
                  className={
                    currentRoute === "/paneladmin/faq" && "text-[#3bc0c3]"
                  }
                >
                  FAQ
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/service-kami"
                  className={
                    currentRoute === "/paneladmin/service-kami" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Service Kami
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/project-kami"
                  className={
                    currentRoute === "/paneladmin/project-kami" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Project Kami
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/pilih-perusahaan-kami"
                  className={
                    currentRoute === "/paneladmin/pilih-perusahaan-kami" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Pilih perusahaan kami
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              toggleShowChannel();
            }}
            className={
              currentRoute === "/paneladmin/karir"
                ? "flex items-center gap-8 hover:bg-[#162339] bg-[#162339] text-[#3bc0c3] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
                : "flex items-center gap-8 hover:bg-[#162339] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
            }
          >
            <div className="w-6">
              <LuSettings2 size={25} />
            </div>
            <div className="w-full flex items-center gap-[30px]">
              <div id="nav-menu-3">Pengaturan Channel</div>
              <div>{toggleChannel ? <IoIosArrowDown /> : <IoIosArrowUp />}</div>
            </div>
          </button>
          <div
            id="channelBtn"
            className="transform w-full ml-20 box overflow-hidden"
          >
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/maps"
                  className={
                    currentRoute === "/paneladmin/maps" && "text-[#3bc0c3]"
                  }
                >
                  Maps
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/sosialmedia"
                  className={
                    currentRoute === "/paneladmin/sosialmedia" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Sosial Media
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/warna"
                  className={
                    currentRoute === "/paneladmin/warna" && "text-[#3bc0c3]"
                  }
                >
                  Warna
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/email"
                  className={
                    currentRoute === "/paneladmin/email" && "text-[#3bc0c3]"
                  }
                >
                  Email
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/kontak"
                  className={
                    currentRoute === "/paneladmin/kontak" && "text-[#3bc0c3]"
                  }
                >
                  Kontak
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              toggleShowMarketing();
            }}
            className={
              "flex items-center gap-8 hover:bg-[#162339] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
            }
          >
            <div className="w-6">
              <IoMdAnalytics size={23} />
            </div>
            <div className="w-full flex items-center gap-[103px]">
              <div id="nav-menu-3">Marketing</div>
              <div>
                {toggleMarketing ? <IoIosArrowDown /> : <IoIosArrowUp />}
              </div>
            </div>
          </button>
          <div
            id="marketingBtn"
            className="transform w-full ml-20 box overflow-hidden"
          >
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/service"
                  className={
                    currentRoute === "/paneladmin/service" && "text-[#3bc0c3]"
                  }
                >
                  Service
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/bisnis"
                  className={
                    currentRoute === "/paneladmin/bisnis" && "text-[#3bc0c3]"
                  }
                >
                  Bisnis
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              toggleShowReport();
            }}
            className={
              currentRoute === "/paneladmin/klien-kami"
                ? "flex items-center gap-8 hover:bg-[#162339] bg-[#162339] text-[#3bc0c3] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
                : "flex items-center gap-8 hover:bg-[#162339] hover:text-[#3bc0c3] h-12 px-6 cursor-pointer"
            }
          >
            <div className="w-6">
              <BiSolidReport size={25} />
            </div>
            <div className="w-full flex items-center gap-[116px]">
              <div id="nav-menu-3">Laporan</div>
              <div>{toggleReport ? <IoIosArrowDown /> : <IoIosArrowUp />}</div>
            </div>
          </button>
          <div
            id="reportBtn"
            className="transform w-full ml-20 box overflow-hidden"
          >
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/laporan-pengunjung"
                  className={
                    currentRoute === "/paneladmin/laporan-pengunjung" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Pengunjung
                </Link>
                <IoIosArrowForward size={15} />
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/laporan-karir"
                  className={
                    currentRoute === "/paneladmin/laporan-karir" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Karir
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/laporan-klien"
                  className={
                    currentRoute === "/paneladmin/laporan-klien" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Klien
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/kritiksaran"
                  className={
                    currentRoute === "/paneladmin/kritiksaran" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Kritik & Saran
                </Link>
              </div>
              <div className="flex items-center justify-between hover:text-[#3bc0c3]">
                <Link
                  scroll={false}
                  href="/paneladmin/laporan-log-pengguna"
                  className={
                    currentRoute === "/paneladmin/laporan-log-pengguna" &&
                    "text-[#3bc0c3]"
                  }
                >
                  Log Pengguna
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
