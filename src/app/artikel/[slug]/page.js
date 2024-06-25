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
import { useState } from "react";

export default function Article({ params }) {
  const dispatch = useDispatch();
  const [toggled, setToggled] = React.useState(false);
  const [articleCategoriesData, setArticleCategoriesData] = useState([]);
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

  async function fetchArticle() {
    const { data } = await http(token).get(`article?search=${slug}&limit=20`);
    return data.results;
  }

  const { data: articleData } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(),
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

  async function fetchCategories() {
    const { data } = await http(token).get("/categories?limit-20");
    return data.results;
  }

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchArticleByCategory(id) {
    const { data } = await http(token).get(
      `/article/category/?category=${id}&limit-20`
    );
    setArticleCategoriesData(data.results);
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
      <div
        className="w-full box bg-primary fixed -top-1 transform xl:hidden"
        ref={searchNav}
      >
        <div className="w-full h-full hidden" ref={searchInput}>
          <div className="my-32 mx-6">
            <div className="text-xl mb-4 text-white">
              Silahkan masukkan pencarian
            </div>
            <input
              type="text"
              className="border-white border-1 p-4 focus:outline-none rounded-md w-full"
              placeholder="Type here..."
            ></input>
          </div>
        </div>
      </div>
      <div className="flex w-full pt-14 xl:pt-0 xl:h-screen flex-col xl:flex-row">
        <div className="flex flex-auto xl:w-[70%] h-full">
          {articleData?.data?.map((item, index) => {
            return (
              <div key={item.id} className="pt-10">
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
        <div className="flex flex-auto xl:w-[30%] h-auto xl:justify-center overflow-x-auto xl:max-h-[640px]">
          <div className="flex flex-row xl:flex-col pt-10 gap-10 ml-10">
            <div className="flex flex-col">
              <div className="">
                <div className="font-bold pb-4">Pilih kategori berita</div>
                <select
                  className="select select-bordered w-full"
                  onChange={(e) => {
                    fetchArticleByCategory(e.target.value);
                  }}
                >
                  {categoriesData?.data?.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex xl:flex-col gap-10 max-w-4xl overflow-auto no-scrollbar pt-5">
                {articleCategoriesData?.data?.map((item) => {
                  return (
                    <Link
                      href={`/artikel/${item.slug}`}
                      className="flex flex-col gap-4 max-w-[310px] mb-10"
                      key={item.id}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <LuCalendarDays color="orange" />
                          <div className="text-xs">
                            {dayjs(item.createdAt).format("DD")}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaTags color="orange" />
                          <div className="text-xs">{item.category.title}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaGlobe color="orange" />
                          <div className="text-xs">{item.source}</div>
                        </div>
                      </div>
                      <div>
                        <Image
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                          width={300}
                          height={300}
                          alt=""
                          priority={true}
                        ></Image>
                      </div>
                      <div className="text-sm font-bold text-[#42495b]">
                        {item.title}
                      </div>
                    </Link>
                  );
                })}
              </div>
              {articleCategoriesData?.data?.length < 1 && (
                <div className="w-[310px] max-w-[310px]">
                  Artikel tidak ditemukan
                </div>
              )}
            </div>
          </div>
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
