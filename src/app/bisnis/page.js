"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import http from "@/helpers/http.helper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { getCookie } from "cookies-next";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import Slider from "react-slick";
import HomeNav from "@/components/homenav";

export default function Business() {
  const dispatch = useDispatch();
  const businessDataRef = useRef();
  const businessTitleRef = useRef();

  const handleNextBtnClick = () => {
    businessDataRef.current.slickNext();
    businessTitleRef.current.slickNext();
  };

  const handlePrevBtnClick = () => {
    businessDataRef.current.slickPrev();
    businessTitleRef.current.slickPrev();
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
  };

  const secondSettings = {
    dots: false,
    infinite: false,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
  };

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

  async function fetchBusiness() {
    const { data } = await http(token).get("/business");
    return data.results;
  }

  const { data: businessData } = useQuery({
    queryKey: ["business"],
    queryFn: () => fetchBusiness(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  return (
    <div>
      <HomeNav />
      <div className="flex w-full h-auto lg:h-screen pt-24 xl:pt-0 flex-col z-0">
        <div className="w-full relative">
          <Image
            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/zbl6ll3hxnq7hjxlioft`}
            alt=""
            width={1000}
            height={1000}
            style={{ width: "100%", height: "130px", objectFit: "cover" }}
          />
          <div className="font-bold text-white absolute top-[24px] left-10 text-5xl">
            Bisnis
            <div className="text-sm font-normal pt-2">
              Solusi untuk transaksi bisnis perusahaan anda
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 xl:gap-10">
          <button onClick={() => handlePrevBtnClick()}>
            <IoIosArrowDropleft size={35} />
          </button>
          <div className="max-w-[250px] lg:max-w-[400px] w-full">
            <Slider {...settings} ref={businessTitleRef}>
              {businessData?.data?.map((item) => {
                return (
                  <button key={item.id} className="h-[80px]">
                    <div className="bg-white border-2 h-[50px] border-[#636466] flex justify-center items-center font-bold rounded-md cursor-pointer hover:bg-gray-300">
                      {item.title}
                    </div>
                  </button>
                );
              })}
            </Slider>
          </div>
          <button onClick={() => handleNextBtnClick()}>
            <IoIosArrowDropright size={35} />
          </button>
        </div>
        <Slider {...secondSettings} ref={businessDataRef}>
          {businessData?.data?.map((item) => {
            return (
              <div
                className="w-full h-auto lg:h-[400px] lg:px-20 px-10 py-5"
                key={item.id}
              >
                <div className="w-full h-full border flex flex-col lg:flex-row">
                  <div className="flex flex-auto w-full">
                    <Image
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item?.picture}`}
                      alt=""
                      width={1000}
                      height={1000}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-10 justify-center px-10 flex-auto w-full">
                    <div className="text-3xl font-bold">{item?.title}</div>
                    <div className="">{item?.description}</div>
                    <div>
                      <Link
                        href={{
                          pathname: `/business-description/${item?.id}`,
                          query: {
                            id: item?.id,
                          },
                        }}
                        className="btn btn-primary bg-primary border-none text-white normal-case"
                      >
                        Selengkapnya
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
      <div className="w-full h-[80px] bg-[#42495b]">
        <div className="w-full h-full flex justify-center items-center text-white text-center px-10 md:px-0">
          © 2023 PT ARYA KEMUNING ABADI
        </div>
      </div>
    </div>
  );
}
