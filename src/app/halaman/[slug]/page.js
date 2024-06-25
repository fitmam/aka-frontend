"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import http from "@/helpers/http.helper";
import Hamburger from "hamburger-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { LuCalendarDays } from "react-icons/lu";
import { FaGlobe, FaTags } from "react-icons/fa";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import { getCookie } from "cookies-next";

export default function Pages({ params }) {
  const dispatch = useDispatch();
  const [toggled, setToggled] = React.useState(false);
  const mobileNav = useRef();
  const searchInput = useRef();
  const searchNav = useRef();
  const navList = useRef();

  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const token = getCookie("token");

  async function fetchColor() {
    const { data } = await http(token).get("/color");
    return data.results;
  }

  const { data: colorData } = useQuery({
    queryKey: ["color"],
    queryFn: () => fetchColor(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--primary-color", primary);
      document.documentElement.style.setProperty(
        "--secondary-color",
        secondary
      );
      dispatch(
        setColor({
          primary: colorData?.[0]?.primary,
          secondary: colorData?.[0]?.secondary,
          text: colorData?.[0]?.text,
        })
      );
    }
  }, [primary, secondary, colorData, dispatch]);

  const slug = params.slug;

  async function fetchPages() {
    const { data } = await http(token).get(`pages/?search=${slug}`);
    return data.results;
  }

  const { data: pagesData } = useQuery({
    queryKey: ["pages", slug],
    queryFn: () => fetchPages(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const showNav = () => {
    if (searchNav.current.classList.contains("transform-active")) {
      searchNav.current.classList.toggle("transform-active");
    } else {
      searchNav.current.classList.toggle("1");
    }
    if (!searchInput.current.classList.contains("hidden")) {
      searchInput.current.classList.toggle("hidden");
    } else {
      searchInput.current.classList.toggle("1");
    }
    mobileNav.current.classList.toggle("transform-active");
    navList.current.classList.toggle("hidden");
    setToggled(false);
  };

  async function fetchMainMenu() {
    const { data } = await http(token).get("/menu?limit=20");
    return data.results;
  }

  async function fetchAppInfo() {
    const { data } = await http(token).get("/appinfo");
    return data.results;
  }

  const { data: mainMenu } = useQuery({
    queryKey: ["main-menu"],
    queryFn: () => fetchMainMenu(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data } = useQuery({
    queryKey: ["appinfo"],
    queryFn: () => fetchAppInfo(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  return (
    <div>
      <nav className="w-full bg-primary items-center justify-center px-20 xl:flex">
        <ul className="w-full justify-between items-center text-white font-bold text-lg hidden xl:flex">
          <Image
            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${data?.[0]?.logo}`}
            width={parseInt(data?.[0]?.logo_width) || 100}
            height={parseInt(data?.[0]?.logo_height) || 100}
            alt="logo"
          />
          <div className="flex gap-10">
            {mainMenu?.data?.map((item) => {
              return (
                <li key={item.id}>
                  <Link href={item.url}>{item.menu}</Link>
                </li>
              );
            })}
          </div>
        </ul>
      </nav>
      <nav
        className={
          "w-full absolute top-0 justify-center items-center xl:hidden z-10 bg-primary"
        }
      >
        <ul className="flex w-full justify-between items-center px-5 py-5">
          <li>
            <button onClick={showNav}>
              <Hamburger size={25} color="white" toggled={toggled} />
            </button>
          </li>
        </ul>
      </nav>
      <div
        className="w-full box bg-primary fixed -top-1 transform xl:hidden"
        ref={mobileNav}
      >
        <nav
          className="w-full justify-start items-center hidden px-10 xl:px-20 animate-fade-in"
          ref={navList}
        >
          <ul className="text-2xl xl:text-4xl text-white flex flex-col gap-4 pt-32">
            <div className="flex flex-col gap-10">
              {mainMenu?.data?.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={item.url}>{item.menu}</Link>
                  </li>
                );
              })}
            </div>
          </ul>
        </nav>
      </div>
      <div className="flex w-full pt-14 xl:pt-0 h-screen">
        <div className="flex flex-auto w-[70%] h-full">
          {pagesData?.data?.map((item, index) => {
            return (
              <div key={item.id}>
                <div className="xl:px-20 xl:py-10 px-5 py-5">
                  <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <LuCalendarDays color="orange" />
                      <div className="text-sm">
                        {dayjs(item.createdAt).format("DD-MM-YYYY")}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaTags color="orange" />
                      <div className="text-sm">{item.category.title}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaGlobe color="orange" />
                      <div className="text-sm">{item.source}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold pt-5">{item.title}</div>
                  <div className="pt-5">
                    <Markdown>{item.content}</Markdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full h-[80px] bg-[#42495b]">
        <div className="w-full h-full flex justify-center items-center text-white text-center px-10 md:px-0">
          © 2023 PT ARYA KEMUNING ABADI
        </div>
      </div>
    </div>
  );
}
