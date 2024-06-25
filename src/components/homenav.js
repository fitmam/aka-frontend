"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Hamburger from "hamburger-react";
import http from "@/helpers/http.helper";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { useState } from "react";
import { useRef } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function HomeNav() {
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const token = getCookie("token");
  const dispatch = useDispatch();
  const [toggled, setToggled] = useState(false);
  const mobileNav = useRef();
  const navList = useRef();
  const router = useRouter();

  const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);

  const showNav = () => {
    mobileNav.current.classList.toggle("transform-active");
    navList.current.classList.toggle("hidden");
    setToggled(false);
  };

  const handleMouseEnter = (index) => {
    setIsSubmenuOpen(index);
  };

  const handleMouseLeave = () => {
    setIsSubmenuOpen(null);
  };

  async function fetchMainMenu() {
    const { data } = await http(token).get("/menu?limit=10");
    return data.results;
  }

  const { data: mainMenu } = useQuery({
    queryKey: ["main-menu"],
    queryFn: () => fetchMainMenu(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchAppInfo() {
    const { data } = await http(token).get("/appinfo");
    return data.results;
  }

  async function fetchColor() {
    const { data } = await http(token).get("/color");
    return data.results;
  }

  const { data } = useQuery({
    queryKey: ["appinfo"],
    queryFn: () => fetchAppInfo(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: colorData } = useQuery({
    queryKey: ["color"],
    queryFn: () => fetchColor(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primary);
    document.documentElement.style.setProperty("--secondary-color", secondary);
    dispatch(
      setColor({
        primary: colorData?.[0]?.primary,
        secondary: colorData?.[0]?.secondary,
      })
    );
  }, [primary, secondary, colorData, dispatch]);

  return (
    <div className="relative z-10">
      <nav
        className={
          "w-full items-center justify-center px-20 animate-scale-up bg-primary hidden xl:flex z-10"
        }
      >
        <ul className="w-full justify-between items-center text-white font-bold text-lg hidden xl:flex cursor-pointer">
          <Link href={"/"}>
            {data?.[0]?.logo && (
              <Image
                src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${data?.[0]?.logo}`}
                width={parseInt(data?.[0]?.logo_width) || 100}
                height={parseInt(data?.[0]?.logo_height) || 100}
                alt="logo"
              />
            )}
          </Link>
          <div className="flex gap-10 relative">
            {mainMenu?.data
              ?.sort((a, b) => a.order - b.order)
              .map((item, index) => {
                return (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(index)}
                  >
                    <button
                      onClick={() => {
                        router.replace(item.url);
                      }}
                      className="font-bold hover:font-black duration-100"
                    >
                      {item.menu}
                    </button>
                    {item.sub_menu && item.sub_menu.length > 0 && (
                      <ul
                        className={`absolute left-0 mt-2 bg-white w-40 h-auto rounded-sm text-black transition-opacity duration-300 ${
                          isSubmenuOpen === index
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                        }`}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.sub_menu.map((subItem) => (
                          <div
                            key={subItem.id}
                            className="flex flex-col text-color-primary text-sm "
                          >
                            <li className="px-5 py-2 font-normal hover:font-bold duration-100">
                              <Link href={subItem.url}>{subItem.menu}</Link>
                            </li>
                          </div>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
          </div>
        </ul>
        <div className="gap-2 hidden xl:flex">
          <Link
            href={"#order"}
            className="btn btn-primary bg-[#F9B572] text-white border-none ml-8 w-32 hover:scale-[1.1] duration-300 font-bold"
          >
            Order
          </Link>
          <Link
            href={"#lowongan"}
            className="btn btn-primary bg-[#F9B572] text-white border-none ml-8 w-32 hover:scale-[1.1] duration-300 font-bold"
          >
            Lowongan
          </Link>
        </div>
      </nav>
      <div></div>
      <nav
        className={
          "w-full fixed top-0 justify-center items-center xl:hidden animate-scale-up z-10 bg-primary"
        }
      >
        <ul className="flex w-full justify-between items-center xl:px-5 xl:py-5">
          <li>
            <button onClick={showNav}>
              <Hamburger size={25} color="white" toggled={toggled} />
            </button>
          </li>
          <li>
            <Image
              src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${data?.[0]?.logo}`}
              width={parseInt(data?.[0]?.logo_width) || 100}
              height={parseInt(data?.[0]?.logo_height) || 100}
              alt="logo"
            />
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
            {mainMenu?.data?.map((item, index) => {
              return (
                <li
                  key={item.id}
                  className="relative"
                  onClick={() => {
                    showNav();
                  }}
                >
                  <Link href={item.url} className="text-color-primary">
                    {item.menu}
                  </Link>
                  {item.sub_menu && item.sub_menu.length > 0 && (
                    <ul
                      className={`absolute left-0 mt-2 bg-white w-40 h-auto rounded-sm text-black transition-opacity duration-300 ${
                        isSubmenuOpen === index
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                      }`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.sub_menu.map((subItem) => (
                        <div
                          key={subItem.id}
                          className="flex flex-col text-color-primary text-sm"
                        >
                          <li className="px-5 py-2 font-normal">
                            <Link href={subItem.url}>{subItem.menu}</Link>
                          </li>
                        </div>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-5 pt-5">
            <Link
              href={"#order"}
              className="p-3 rounded-md text-center bg-[#F9B572] text-white border-none w-32 hover:scale-[1.1] duration-300 font-bold"
              onClick={() => {
                showNav();
              }}
            >
              Order
            </Link>
            <Link
              href={"#lowongan"}
              className="p-3 rounded-md text-center bg-[#F9B572] text-white border-none w-32 hover:scale-[1.1] duration-300 font-bold"
              onClick={() => {
                showNav();
              }}
            >
              Lowongan
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
