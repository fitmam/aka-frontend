"use client";
import Slider from "react-slick";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BiCalendar, BiLoader, BiTime } from "react-icons/bi";
import { TfiLocationPin } from "react-icons/tfi";
import { LuCalendarDays } from "react-icons/lu";
import {
  FaGlobe,
  FaSearch,
  FaTags,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import CountUp from "react-countup";
import { BsTelephone } from "react-icons/bs";
import { Squash as Hamburger } from "hamburger-react";
import { useRef } from "react";
import http from "@/helpers/http.helper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useState } from "react";
import HomeLoading from "@/components/homeloading";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getCookie } from "cookies-next";
import { setColor } from "@/redux/reducer/colorscheme";
import { setPositionId, setServiceId } from "@/redux/reducer/id";
import CustomerService from "../../public/customer-service.png";
import { Field, Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaCheck, FaHeadset, FaPencil } from "react-icons/fa6";

export default function Home() {
  const dispatch = useDispatch();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const [loading, setLoading] = useState(true);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showVission, setShowVission] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [search, setSearch] = useState("");
  const [searchService, setSearchService] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [openDropdownCareer, setOpenDropdownCareer] = useState(false);
  const [openDropdownService, setOpenDropdownService] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const token = getCookie("token");
  const router = useRouter();

  const serviceRef = useRef();
  const employeeRef = useRef();

  function goToNext() {
    serviceRef.current.slickNext();
  }

  function goNext() {
    employeeRef.current.slickNext();
  }

  function goPrev() {
    employeeRef.current.slickPrev();
  }

  function goToPrev() {
    serviceRef.current.slickPrev();
  }

  function shortenText(text, maxLength) {
    if (text?.length <= maxLength) {
      return text;
    } else {
      return text?.substring(0, maxLength - 3) + "...";
    }
  }

  async function fetchGender() {
    const { data } = await http().get("/gender?limit=20");
    return data.results;
  }

  const { data: genderData } = useQuery({
    queryKey: ["gender"],
    queryFn: () => fetchGender(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const [index, setIndex] = useState(-1);

  useEffect(() => {
    setShowVission(true);
  }, []);

  const handleClick = (index) => setIndex(index);

  const handleMouseEnter = (index) => {
    setIsSubmenuOpen(index);
  };

  const handleMouseLeave = () => {
    setIsSubmenuOpen(null);
  };

  const handleOpenCareerDropdown = () => {
    setOpenDropdownCareer(!openDropdownCareer);
  };

  const handleOpenServiceDropdown = () => {
    setOpenDropdownService(!openDropdownService);
  };

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

  const hitVisitor = useCallback(async () => {
    try {
      const { data } = await http().post("/visitor");
      return data.results;
    } catch (err) {
      return;
    }
  }, []);

  useEffect(() => {
    hitVisitor();
  }, [hitVisitor]);

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

  async function fetchAppInfo() {
    const { data } = await http(token).get("/appinfo");
    return data.results;
  }

  const { data } = useQuery({
    queryKey: ["appinfo"],
    queryFn: () => fetchAppInfo(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchWorkPosition() {
    const { data } = await http(token).get(
      `/needed-position?limit=20&search=${search}`
    );
    return data.results;
  }

  const { data: positionOfWork } = useQuery({
    queryKey: ["needed-position", search],
    queryFn: () => fetchWorkPosition(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const secondSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    draggable: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  const thirdSettings = {
    dots: false,
    centerPadding: 30,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: false,
  };

  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [toggled, setToggled] = React.useState(false);
  const mobileNav = useRef();
  const navList = useRef();

  const showNav = () => {
    mobileNav.current.classList.toggle("transform-active");
    navList.current.classList.toggle("hidden");
    setToggled(false);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  async function fetchEvents() {
    const { data } = await http(token).get("/events?limit=30");
    return data.results;
  }

  async function fetchAppLink() {
    const { data } = await http(token).get("/applink?limit=30");
    return data.results;
  }

  async function fetchFaq() {
    const { data } = await http(token).get("/faq?limit=30");
    return data.results;
  }

  async function fetchProject(pageData = page) {
    const { data } = await http(token).get("/project?page=" + pageData);
    return data.results;
  }

  async function fetchService() {
    const { data } = await http(token).get(`/service?limit=20`);
    return data.results;
  }

  async function fetchSelectedService() {
    const { data } = await http(token).get(
      `/service?limit=20&search=${searchService}`
    );
    return data.results;
  }

  async function fetchContacts() {
    const { data } = await http(token).get("/contacts");
    return data.results;
  }

  async function fetchClients() {
    const { data } = await http(token).get("/client-picture?limit=20");
    return data.results;
  }

  async function fetchGallery() {
    const { data } = await http(token).get("/gallery?limit=20");
    return data.results;
  }

  async function fetchArticles() {
    const { data } = await http(token).get("/article?limit=20");
    return data.results;
  }

  async function fetchSocialMedia() {
    const { data } = await http(token).get("/socialmedia?limit=20");
    return data.results;
  }

  async function fetchSlider() {
    const { data } = await http(token).get("/slider?limit=20");
    return data.results;
  }

  async function fetchMainMenu() {
    const { data } = await http(token).get("/menu?limit=10");
    return data.results;
  }

  async function fetchCompanyDescription() {
    const { data } = await http(token).get("/company-description?limit=20");
    return data.results;
  }

  async function fetchTeam() {
    const { data } = await http(token).get("/team?limit=20");
    return data.results;
  }

  async function fetchTestimony() {
    const { data } = await http(token).get("/testimony?limit=20");
    return data.results;
  }

  async function fetchVissionMission() {
    const { data } = await http(token).get("/vission-mission?limit=20");
    return data.results;
  }

  const { data: teamData } = useQuery({
    queryKey: ["team"],
    queryFn: () => fetchTeam(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: appLinkData } = useQuery({
    queryKey: ["applink"],
    queryFn: () => fetchAppLink(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: faqData } = useQuery({
    queryKey: ["faq"],
    queryFn: () => fetchFaq(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: serviceData } = useQuery({
    queryKey: ["service"],
    queryFn: () => fetchService(),
  });

  const { data: selectedServiceData } = useQuery({
    queryKey: ["selected-service", searchService],
    queryFn: () => fetchSelectedService(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: projectData } = useQuery({
    queryKey: ["project", page],
    queryFn: () => fetchProject(page),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: clientsData } = useQuery({
    queryKey: ["client-picture"],
    queryFn: () => fetchClients(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: galleryData } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetchGallery(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: testimonyData } = useQuery({
    queryKey: ["testimony"],
    queryFn: () => fetchTestimony(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: mainMenu } = useQuery({
    queryKey: ["main-menu"],
    queryFn: () => fetchMainMenu(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: articleData } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: companyDescriptionData } = useQuery({
    queryKey: ["company-description"],
    queryFn: () => fetchCompanyDescription(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: sliderData } = useQuery({
    queryKey: ["slider"],
    queryFn: () => fetchSlider(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: contactsData } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => fetchContacts(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: socialMediaData } = useQuery({
    queryKey: ["socialmedia"],
    queryFn: () => fetchSocialMedia(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: vissionMission } = useQuery({
    queryKey: ["vission-mission"],
    queryFn: () => fetchVissionMission(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const images = galleryData?.data?.map((item) => {
    return {
      src: `https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`,
      width: 2120,
      height: 2120,
      customOverlay: (
        <div className="bg-black bg-opacity-75 text-white p-3">
          <div>{item.title}</div>
        </div>
      ),
    };
  });

  const divisionCounts = teamData?.data?.reduce((acc, employee) => {
    const division = employee.departement.name;
    if (!acc[division]) {
      acc[division] = 0;
    }
    acc[division]++;
    return acc;
  }, {});

  const queryClient = useQueryClient();

  const postFeedback = useMutation({
    mutationFn: async (values) => {
      const data = new URLSearchParams(values).toString();
      return http(token).post("/feedback", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      setLoading(false);
      toast.success("Kritik dan Saran Berhasil Dikirim");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const validateFeedback = Yup.object({
    name: Yup.string().required("Harap diisi"),
    email: Yup.string().required("Harap diisi"),
    phone_number: Yup.string().required("Harap diisi"),
    gender_id: Yup.string().required("Harap diisi"),
    age: Yup.string().required("Harap diisi"),
    full_address: Yup.string().required("Harap diisi"),
    content: Yup.string().required("Harap diisi"),
  });

  return (
    <div className="relative">
      <div className="relative">
        <Slider {...settings}>
          {sliderData?.data
            ?.sort((a, b) => a.order - b.order)
            .map((item) => {
              return (
                <div className="w-full h-auto" key={item.id}>
                  <h3 className="flex justify-center items-center relative">
                    <Image
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                      sizes="100vw"
                      width={0}
                      height={0}
                      style={{ width: "100%", height: "100vh" }}
                      priority={true}
                      alt=""
                      className="brightness-50 h-screen object-cover md:h-auto"
                    />
                    <div className="absolute top-auto left-auto text-white text-center">
                      <div className="flex flex-col justify-center items-center gap-8 max-w-2xl">
                        <div className="text-5xl font-bold">{item.title}</div>
                        <div>{item.content}</div>
                      </div>
                    </div>
                  </h3>
                </div>
              );
            })}
        </Slider>
        <nav
          className={
            scrollPosition > 130
              ? "w-full fixed top-0 items-center justify-center px-20 animate-scale-up bg-primary z-20 hidden xl:flex"
              : "w-full absolute top-0 items-center justify-center px-20 xl:flex"
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
                  onLoad={() => {
                    setLoading(true);
                  }}
                  onLoadingComplete={() => {
                    setLoading(false);
                  }}
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
            scrollPosition > 130
              ? "w-full fixed top-0 justify-center items-center xl:hidden animate-scale-up z-10 bg-primary"
              : "w-full absolute top-0 justify-center items-center xl:hidden z-10"
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
                onLoad={() => {
                  setLoading(true);
                }}
                onLoadingComplete={() => {
                  setLoading(false);
                }}
              />
            </li>
          </ul>
        </nav>
        <div className="w-full h-24 absolute bottom-0 flex justify-center items-center">
          <Link href="#service">
            <div className="downArrow bounce">
              <Image
                width={35}
                height={35}
                alt=""
                src="data:image/svg+xml,%3Csvg fill='%23ffffff' height='100px' width='100px' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 330 330' xml:space='preserve' stroke='%23ffffff'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath id='XMLID_225_' d='M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E"
              />
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full h-auto py-16 px-5">
        <div
          className="flex flex-col justify-center items-center gap-3 max-w-2xl m-auto text-center"
          data-aos="zoom-out-up"
        >
          <div className="text-3xl font-bold text-[#42495b]">
            Kenapa Harus Pilih Perusahaan Kami
          </div>
          <div>
            Temukan beragam layanan kami yang dirancang untuk mempermudah hidup
            Anda. Apakah Anda membutuhkan solusi parkir yang nyaman, layanan
            pelanggan terbaik, atau solusi IT inovatif, kami siap membantu.
            Jelajahi bagaimana kami dapat meningkatkan pengalaman harian Anda
            dan memenuhi kebutuhan teknologi bisnis Anda
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap w-full justify-around text-center pt-14 max-w-5xl gap-10 m-auto overflow-auto no-scrollbar">
          {companyDescriptionData?.data
            ?.sort((a, b) => {
              a.order - b.order;
            })
            ?.map((item, index) => {
              return (
                <Link
                  scroll={false}
                  href={{
                    pathname: `/company-description/${item.title
                      .replace(/\s/g, "-")
                      .toLowerCase()}`,
                    query: {
                      id: item.id,
                    },
                  }}
                  className="flex flex-col justify-center items-center gap-6 max-w-xs cursor-pointer"
                  key={item.id}
                  data-aos="zoom-in"
                >
                  <div className="h-24 flex justify-center items-center overflow-hidden">
                    <Image
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                      alt=""
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="text-2xl font-bold text-[#42495b] flex justify-center items-center h-10">
                    {item.title}
                  </div>
                  <div>{shortenText(item.content, 100)}</div>
                  <div className="text-blue-600 font-bold hover:scale-[1.05] duration-300">
                    Selengkapnya
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      <div id="service"></div>
      <div className="w-full" data-aos="zoom-in-up" id="service">
        <div>
          <div className="text-color-primary text-center font-bold text-3xl pb-2">
            Service Kami
          </div>
          <div className="text-center pb-16">
            Beberapa Service yang Kami Tawarkan
          </div>
        </div>
        <div className="flex justify-center items-center text-center xl:gap-10">
          <button onClick={goToPrev}>
            <IoIosArrowDropleft size={40} />
          </button>
          <div className="w-full rounded-md overflow-auto max-w-5xl no-scrollbar">
            <Slider {...thirdSettings} ref={serviceRef}>
              {serviceData?.data?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="w-[320px] border h-[350px] py-10 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="flex flex-col gap-5 xl:px-10">
                      <div className="h-[80px] w-full flex justify-center items-center py-10">
                        <div className="w-24 h-24">
                          <Image
                            alt=""
                            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item?.picture}`}
                            width={1000}
                            height={1000}
                            style={{ width: "100%", height: "100%" }}
                            objectFit="contain"
                          ></Image>
                        </div>
                      </div>
                      <div className="font-bold text-xl">{item?.title}</div>
                      <div>{shortenText(item?.content, 100)}</div>
                      <Link
                        scroll={false}
                        href={{
                          pathname: `/service/${item?.title?.toLowerCase()}`,
                          query: {
                            id: item?.id,
                          },
                        }}
                        className="font-bold text-md text-blue-500"
                      >
                        Selengkapnya
                      </Link>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
          <button onClick={goToNext}>
            <IoIosArrowDropright size={40} />
          </button>
        </div>
      </div>
      <div id="order"></div>
      <div
        className="w-full h-[600px] flex flex-col gap-4 justify-center items-center mt-28 2xl:h-screen"
        data-aos="zoom-in-up"
      >
        <div className="flex flex-col gap-3 px-10">
          <div className="text-3xl font-bold text-center">
            Tertarik dengan Service Kami ?
          </div>
          <div className="font-medium text-center max-w-xl">
            Lebih Dari 300,000 Customer Telah Menggunakan Service Kami Untuk
            Menemukan Penyedia Service Terpercaya
          </div>
        </div>
        <div className="rounded-xl w-full flex justify-center items-center px-10">
          <div className="w-full max-w-[600px] h-16 flex border rounded-md border-gray-600 px-5 relative gap-8">
            <div className="flex w-full justify-center items-center">
              <div className="w-full flex justify-center items-center gap-5">
                <input
                  onClick={() => {
                    handleOpenServiceDropdown();
                  }}
                  onChange={(e) => {
                    setSearchService(e.target.value);
                    fetchSelectedService();
                  }}
                  type="text"
                  className="input input-bordered flex gap-2 w-full items-center"
                  placeholder={
                    selectedService
                      ? selectedService
                      : "Cari Service yang Diinginkan"
                  }
                ></input>
                <FaSearch size={25} />
              </div>
              <div className="w-full absolute top-0 right-0">
                <div
                  id="dropdown"
                  className={
                    openDropdownService
                      ? "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute top-16 left-0"
                      : "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute top-16 left-0 hidden"
                  }
                >
                  <ul
                    className={
                      "p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-96 px-5 overflow-auto"
                    }
                  >
                    <div className="h-44 overflow-auto scrollbar">
                      {selectedServiceData?.data?.map((item) => {
                        return (
                          <li
                            key={item.id}
                            onClick={() => {
                              handleOpenServiceDropdown();
                              dispatch(setServiceId(item.id));
                              setSelectedService(item.title);
                            }}
                          >
                            <a>{item.title}</a>
                          </li>
                        );
                      })}
                      {selectedServiceData?.data?.length === 0 && (
                        <div className="font-medium">Data tidak ditemukan</div>
                      )}
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex w-[40%] justify-center items-center">
              <button
                onClick={() => {
                  if (!selectedService) {
                    toast.error("Silahkan cari service yang diinginkan");
                  } else {
                    router.push("/verify-id-service");
                  }
                }}
                className="btn btn-primary bg-green-500 border-none text-white"
              >
                Request Order
              </button>
            </div>
          </div>
        </div>
        <ol class="items-center sm:flex max-w-5xl mt-24">
          <li class="relative mb-6 sm:mb-0">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                <FaPencil size={20} />
              </div>
              <div class="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
            </div>
            <div class="mt-3 sm:pe-8">
              <h3 class="text-lg font-semibold text-gray-900">
                Isi Form Perusahaan
              </h3>
              <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                Detail
              </time>
              <p class="text-base font-normal text-gray-500">
                Isi detail perusahaan untuk merequest service
              </p>
            </div>
          </li>
          <li class="relative mb-6 sm:mb-0">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                <BiLoader size={25} />
              </div>
              <div class="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
            </div>
            <div class="mt-3 sm:pe-8">
              <h3 class="text-lg font-semibold text-gray-900">
                Pemrosesan Data
              </h3>
              <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                Detail
              </time>
              <p class="text-base font-normal text-gray-500">
                Data akan diproses untuk direview lebih lanjut
              </p>
            </div>
          </li>
          <li class="relative mb-6 sm:mb-0">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                <FaCheck size={25} />
              </div>
              <div class="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
            </div>
            <div class="mt-3 sm:pe-8">
              <h3 class="text-lg font-semibold text-gray-900">
                Request service berhasil
              </h3>
              <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                Detail
              </time>
              <p class="text-base font-normal text-gray-500">
                Selamat, request service telah berhasil diproses
              </p>
            </div>
          </li>
        </ol>
      </div>
      <div id="galeri"></div>
      <div
        className="w-full h-auto bg-white flex-col px-5 xl:px-0 mt-20 xl:mt-0"
        data-aos="zoom-in-up"
      >
        <div className="text-4xl font-bold text-[#42495b] text-center pt-10 pb-10">
          Galeri
        </div>
        <div className="p-auto m-auto w-full h-full max-w-5xl">
          <Gallery
            images={images}
            onClick={handleClick}
            enableImageSelection={false}
          />
          <Lightbox
            slides={images}
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
          />
        </div>
      </div>
      <div id="lowongan"></div>
      <div
        className="w-full h-[600px] flex flex-col gap-4 justify-center items-center mt-40 xl:mt-20 2xl:h-screen"
        data-aos="zoom-in-up"
      >
        <div className="flex flex-col gap-3 px-5">
          <div className="text-3xl font-bold text-center">
            Sedang Mencari Lowongan Kerja ?
          </div>
          <div className="font-medium text-center max-w-xl">
            Arya Kemuning Abadi Juga Membantu Pencari Kerja Untuk Menemukan
            Pekerjaan yang Sesuai Dengan Minat dan Bakat yang Mereka Miliki
          </div>
        </div>
        <div className="rounded-xl w-full flex justify-center items-center px-10">
          <div className="w-full max-w-[600px] h-16 flex border rounded-md border-gray-600 px-5 relative gap-8">
            <div className="flex w-full justify-center items-center gap-8">
              <div className="w-full flex justify-center items-center gap-5">
                <input
                  onClick={() => {
                    handleOpenCareerDropdown();
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    fetchWorkPosition();
                  }}
                  type="text"
                  className="input input-bordered flex gap-2 w-full items-center"
                  placeholder={
                    selectedPosition
                      ? selectedPosition
                      : "Cari posisi pekerjaan yang diinginkan"
                  }
                ></input>
                <FaSearch size={25} />
              </div>
              <div className="w-full absolute top-0 right-0">
                <div
                  id="dropdown"
                  className={
                    openDropdownCareer
                      ? "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute top-16 left-0"
                      : "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute top-16 left-0 hidden"
                  }
                >
                  <ul
                    className={
                      "p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-96 px-5 overflow-auto"
                    }
                  >
                    <div className="h-44 overflow-auto">
                      {positionOfWork?.data?.map((item) => {
                        return (
                          <li
                            key={item.id}
                            onClick={() => {
                              handleOpenCareerDropdown();
                              dispatch(setPositionId(item.id));
                              setSelectedPosition(item.name);
                            }}
                          >
                            <a>{item.name}</a>
                          </li>
                        );
                      })}
                      {positionOfWork?.data?.length === 0 && (
                        <div className="font-medium">Data tidak ditemukan</div>
                      )}
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex w-[50%] justify-center items-center">
              <button
                onClick={() => {
                  if (!selectedPosition) {
                    toast.error("Silahkan cari posisi yang diinginkan");
                  } else {
                    router.push("/verify-id-career");
                  }
                }}
                className="btn btn-primary bg-green-500 w-full border-none text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <ol class="items-center sm:flex max-w-5xl mt-24 mx-5">
          <li class="relative mb-6 sm:mb-0">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                <FaPencil size={20} />
              </div>
              <div class="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
            </div>
            <div class="mt-3 sm:pe-8">
              <h3 class="text-lg font-semibold text-gray-900">
                Isi Biodata Pelamar
              </h3>
              <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                Detail
              </time>
              <p class="text-base font-normal text-gray-500">
                Isi biodata pelamar secara lengkap untuk melanjutkan
              </p>
            </div>
          </li>
          <li class="relative mb-6 sm:mb-0">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                <BiLoader size={25} />
              </div>
              <div class="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
            </div>
            <div class="mt-3 sm:pe-8">
              <h3 class="text-lg font-semibold text-gray-900">
                Pemrosesan Data
              </h3>
              <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                Detail
              </time>
              <p class="text-base font-normal text-gray-500">
                Data yang sudah diisi akan diproses secara lanjut
              </p>
            </div>
          </li>
          <li class="relative mb-6 sm:mb-0">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                <FaCheck size={25} />
              </div>
              <div class="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
            </div>
            <div class="mt-3 sm:pe-8">
              <h3 class="text-lg font-semibold text-gray-900">
                Posisi berhasil dilamar
              </h3>
              <time class="block mb-2 text-sm font-normal leading-none text-gray-400">
                Detail
              </time>
              <p class="text-base font-normal text-gray-500">
                Berhasil melamar, selanjutnya menunggu panggilan dari tim kami
              </p>
            </div>
          </li>
        </ol>
      </div>
      <div
        className="w-full h-auto xl:px-20 pt-10 mt-32 xl:mt-0"
        id="project"
        data-aos="fade-up"
      >
        <div>
          <div className="text-color-primary text-center font-bold text-3xl pb-2">
            Project Kami
          </div>
          <div className="text-center pb-16">
            Beberapa Project yang Telah Kami Buat
          </div>
        </div>
        <div className="w-full flex flex-col gap-20 justify-center items-center pb-20">
          {projectData?.data?.map((item, index) => {
            return (
              <div
                className="flex flex-col xl:flex-row justify-around xl:items-center w-full px-10 xl:px-0"
                key={item.id}
              >
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-2xl">
                      Project {index + 1}
                    </div>
                    <div className="font-medium">{item.title}</div>
                  </div>
                  <div className="max-w-md">{item.content}</div>
                </div>
                <div className="flex justify-center items-center relative z-0">
                  <Image
                    src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                    alt=""
                    width={500}
                    height={500}
                    className="z-10 shadow-xl rounded-md"
                  />
                  <div className="border-4 border-color-primary absolute top-10 left-10 max-w-[500px] max-h-[250px] z-0 rounded-md"></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-5 justify-center items-center mb-10">
          <button
            onClick={() => {
              setPage((prev) => prev - 1);
              router.push("#project");
            }}
            disabled={projectData?.currentPage <= 1}
            className="btn btn-primary text-white normal-case bg-primary border-none"
          >
            <div>Sebelumnya</div>
            <IoIosArrowDropleft color="white" size={20} />
          </button>
          <button
            onClick={() => {
              setPage((old) => old + 1);
              router.push("#project");
            }}
            disabled={projectData?.currentPage === projectData?.totalPages}
            className="btn btn-primary text-white normal-case bg-primary border-none"
          >
            <div>Selanjutnya</div>
            <IoIosArrowDropright color="white" size={20} />
          </button>
        </div>
      </div>
      <div className="w-full h-[500px] bg-[#F1F5F9] py-10">
        <div>
          <div className="text-color-primary text-center font-bold text-3xl pb-2">
            Testimoni
          </div>
          <div className="text-center pb-16">
            Beberapa Perusahaan Telah Mempercayai Kami
          </div>
        </div>
        <div>
          <Slider {...secondSettings}>
            {testimonyData?.data?.map((item) => {
              return (
                <div
                  className="w-[500px] h-[250px] bg-white rounded-xl px-10 py-5 border-x-8 border-[#F1F5F9]"
                  key={item.id}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 justify-center items-center">
                        <div className="overflow-hidden w-12 h-12 rounded-full">
                          <Image
                            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.profilephoto}`}
                            alt=""
                            width={50}
                            style={{ width: "100%", height: "100%" }}
                            height={50}
                            objectFit="cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-md">{item.name}</div>
                          <div>{item.position.name}</div>
                        </div>
                      </div>
                      <div>
                        <Image
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                          alt=""
                          width={100}
                          style={{ width: "auto", height: "auto" }}
                          height={100}
                        />
                      </div>
                    </div>
                    <div className="text-sm">{item.description}</div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
      <div id="organisasi"></div>
      <div className="w-full h-auto bg-[#F1F5F9] py-10">
        <div className="text-color-primary text-center font-bold text-3xl pb-2">
          Tim Kami
        </div>
        <div className="flex flex-wrap justify-center items-center gap-20 xl:gap-24 pt-6">
          {teamData?.data?.map((item, index) => {
            return (
              <div key={item.id} className="w-32 xl:w-auto">
                <div className="w-32 h-32 xl:w-64 xl:h-64 rounded-full overflow-hidden">
                  <Image
                    src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                    alt=""
                    width={500}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    height={500}
                  />
                </div>
                <div className="text-xl font-bold text-center pt-10">
                  {item.name}
                </div>
                <div className="text-center">{item.departement.name}</div>
                <div className="text-center">{item.position.name}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full h-auto bg-white py-12">
        <div className="text-color-primary text-center font-bold text-3xl pb-2">
          Klien Kami
        </div>
        <div className="text-center pb-10">
          Perusahaan Kami Memiliki Beberapa Klien yang Telah Mempercayai Kami
        </div>
        <div className="flex justify-center items-center gap-10 flex-wrap max-w-2xl m-auto">
          {clientsData?.data?.map((item, index) => {
            return (
              <div key={item.id}>
                <Image
                  src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                  alt=""
                  width={100}
                  height={100}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full h-[300px] sm:h-[200px] bg-primary flex flex-wrap justify-around items-center">
        <div className="text-3xl text-white font-bold text-center px-5">
          Ingin Tahu Lebih Dalam Tentang Perusahaan Kami ?
        </div>
        <Link
          href="/form-input-klien"
          className="bg-white p-4 w-64 rounded-3xl font-bold text-center hover:bg-green-500 hover:text-white hover:font-black"
        >
          Hubungi Kami
        </Link>
      </div>
      <div
        className="flex flex-col justify-center items-center h-auto py-20"
        id="events"
      >
        <div className="text-4xl font-bold pb-6 text-[#42495b] text-center">
          Berbagai Acara Kami
        </div>
        <div className="pb-6 text-center">
          Jangan Terlewatkan Untuk Lihat Semua Acara Kami yang Akan Datang
          Ataupun Sudah Dilaksanakan
        </div>
        <div className="w-full flex flex-wrap gap-8 justify-center items-center p-8">
          {eventsData?.data?.map((item, index) => {
            return (
              <div
                className="max-w-sm cursor-pointer  hover:scale-[1.05] duration-300"
                key={item.id}
              >
                <div className="w-64 h-64 overflow-hidden rounded-2xl">
                  <Image
                    src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                    width={300}
                    height={300}
                    alt=""
                  ></Image>
                </div>
                <div className="flex flex-col gap-2 pt-5 max-w-xs">
                  <div className="font-bold text-[#42495b]">{item.title}</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <BiCalendar color="orange" size={25} />
                      <div>{dayjs(item.date).format("DD-MMMM-YYYY")}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <BiTime color="orange" size={25} />
                      <div>{item.start_time}</div> -<div>{item.end_time}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <TfiLocationPin color="orange" size={25} />
                      <div>{item.place}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div id="artikel"></div>
      <div className="w-full h-auto bg-white flex flex-col items-center">
        <div className="text-4xl font-bold pb-2 text-[#42495b] text-center">
          Artikel
        </div>
        <div className="text-center">
          Baca Kegiatan Info Populer dan Menarik
        </div>
        <div className="flex flex-col xl:flex-row w-full justify-center items-center">
          <div className="flex flex-wrap justify-center items-center m-14">
            {articleData?.data?.map((item) => {
              return (
                <Link
                  href={`/artikel/${item.slug}`}
                  className="flex flex-col gap-4 mb-10 hover:scale-[1.05] duration-300 max-w-sm justify-center items-center text-center"
                  key={item.id}
                >
                  <div className="flex gap-3">
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
                  <div className="rounded-xl overflow-hidden w-[300px] h-[200px]">
                    <Image
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                      width={800}
                      height={800}
                      objectFit="cover"
                      alt=""
                      className="w-full h-full"
                    ></Image>
                  </div>
                  <div className="text-sm font-bold text-[#42495b]">
                    {item.title}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full h-auto bg-primary py-10 gap-10">
        <div className="flex-1 flex justify-center items-center m-auto gap-8">
          <div className="flex flex-col gap-4 max-w-md text-white px-4 md:p-0">
            <div className="text-4xl font-bold text-center">
              Statistik Karyawan
            </div>
            <div className="text-center">
              Info Statistik Keseluruhan Dari Karyawan Kami. Info Lengkapnya
              Silahkan Berkunjung ke Alamat Perusahaan
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center text-center xl:gap-10">
          <button onClick={goPrev}>
            <IoIosArrowDropleft size={40} color="white" />
          </button>
          <div className="w-full rounded-md overflow-auto max-w-5xl no-scrollbar">
            <Slider {...thirdSettings} ref={employeeRef}>
              {divisionCounts &&
                Object.entries(divisionCounts)?.map(([division, count]) => {
                  return (
                    <div
                      key={division}
                      id="division"
                      className="w-[150px] xl:w-[280px] h-32 flex justify-center items-center"
                    >
                      <div className="flex text-white gap-4 justify-center items-center">
                        <div>
                          <div className="text-2xl xl:text-5xl font-bold">
                            {scrollPosition > 2000 && (
                              <CountUp end={count} duration={5} />
                            )}
                          </div>
                          <div className="xl:text-2xl font-bold">
                            {division}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
          <button onClick={goNext}>
            <IoIosArrowDropright size={40} color="white" />
          </button>
        </div>
      </div>
      <div
        className="w-full h-auto px-8 xl:px-20 bg-[#F5F7F8] py-10"
        id="visi-misi"
      >
        <div className="text-4xl font-bold pb-2 text-[#42495b] text-center">
          Visi Misi
        </div>
        <div className="text-center pb-10">Visi Misi Perusahaan Kami</div>
        <div className="m-auto max-w-5xl text-center flex flex-col gap-3">
          <div className="flex justify-center items-center gap-5">
            <button
              onClick={() => {
                setShowVission(true);
                setShowMission(false);
              }}
              className={
                showVission
                  ? "border py-2 px-8 border-gray-500 rounded-md bg-primary text-white"
                  : "border py-2 px-8 border-gray-500 rounded-md"
              }
            >
              Visi
            </button>
            <button
              onClick={() => {
                setShowVission(false);
                setShowMission(true);
              }}
              className={
                showMission
                  ? "border py-2 px-8 border-gray-500 rounded-md bg-primary text-white"
                  : "border py-2 px-8 border-gray-500 rounded-md"
              }
            >
              Misi
            </button>
          </div>
          {showVission &&
            vissionMission?.data?.map((item) => {
              return (
                <div key={item.id}>
                  <div>{item.vission}</div>
                </div>
              );
            })}
          {showMission &&
            vissionMission?.data?.map((item) => {
              return (
                <div key={item.id}>
                  <div>{item.mission}</div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="w-full h-auto flex flex-col justify-center items-center py-20">
        <div>
          <div className="text-4xl font-bold pb-2 text-[#42495b] text-center">
            Frequently Asked Questions
          </div>
          <div className="text-center pb-10">
            Beberapa Pertanyaan yang Sering Ditanyakan
          </div>
        </div>
        {faqData?.data?.map((item, index) => {
          return (
            <div key={item.id} className="max-w-4xl w-full">
              <h2 className="w-full">
                <button
                  type="button"
                  onClick={() => setActiveFaq(index)}
                  className="flex items-center justify-between w-full p-5 font-medium text-left border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200  hover:bg-gray-100"
                >
                  <span>{item.title}</span>
                  <svg
                    className="w-3 h-3 rotate-180 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div className={activeFaq === index ? "w-full" : "hidden"}>
                <div className="p-5 border border-b-0 border-gray-200 ">
                  <p className="mb-2 text-gray-500 ">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full h-auto bg-[#e9eff4] flex justify-center items-center py-16">
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-0 w-full justify-around pl-10 md:pl-0">
          <div>
            <div className="text-color-primary font-bold text-xl pb-4">
              Kontak Kami
            </div>
            <div className="flex flex-col gap-3 cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-[#42495b] hover:font-bold">
                <div>
                  <TfiLocationPin color="orange" />
                </div>
                {data?.[0]?.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#42495b] hover:font-bold">
                <div>
                  <HiOutlineMail color="orange" />
                </div>
                {data?.[0]?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#42495b] hover:font-bold">
                <div>
                  <BsTelephone color="orange" />
                </div>
                {data?.[0]?.phone}
              </div>
            </div>
          </div>
          <div>
            <div className="text-color-primary font-bold text-xl pb-4">
              Sosial Media
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-sm text-[#42495b]">
                {socialMediaData?.map((item) => {
                  return (
                    <Link
                      href={item.url}
                      key={item.id}
                      className="flex gap-4 pb-3"
                    >
                      <Image
                        alt=""
                        src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                        width={20}
                        height={20}
                      />
                      <div className="hover:font-bold">{item.name}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="text-color-primary font-bold text-xl pb-4">
              Menu Utama
            </div>
            <div className="flex flex-col gap-3">
              {mainMenu?.data?.map((item, index) => {
                return (
                  <Link
                    href={item.url}
                    className="text-sm text-[#42495b] hover:font-bold"
                    key={item.id}
                  >
                    {item.menu}
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-color-primary font-bold text-xl pb-4">
              Layanan
            </div>
            <div className="flex flex-col gap-3">
              {serviceData?.data?.map((item) => {
                return (
                  <div
                    className="text-sm text-[#42495b] hover:font-bold cursor-pointer"
                    key={item.id}
                  >
                    {item.title}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-color-primary font-bold text-xl pb-4">
              Coming Soon ...
            </div>
            {appLinkData?.data?.map((item) => {
              return (
                <div key={item.id}>
                  <Image
                    src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                    alt=""
                    width={150}
                    height={150}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full h-[80px] bg-[#42495b]">
        <div className="w-full h-full flex justify-center items-center text-white text-center px-10 md:px-0">
          © 2023 PT ARYA KEMUNING ABADI
        </div>
      </div>
      <div
        className={
          openFeedback
            ? "fixed z-20 bottom-0 xl:bottom-24 xl:right-24 tilt-in-fwd-br w-full h-full xl:w-96 xl:h-96"
            : "fixed z-20 bottom-0 xl:bottom-24 xl:right-24 hidden"
        }
      >
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone_number: "",
            gender_id: "",
            age: "",
            full_address: "",
            content: "",
          }}
          onSubmit={(values, { resetForm }) => {
            postFeedback.mutate(values);
            setOpenFeedback(!openFeedback);
            resetForm();
          }}
          validationSchema={validateFeedback}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => {
            return (
              <form
                className="xl:w-96 xl:h-96 w-full h-full bg-[#F5F7F8] shadow-2xl rounded-xl p-5 overflow-auto"
                onSubmit={handleSubmit}
              >
                <div className="w-full flex justify-between">
                  <div className="font-bold text-xl">Kritik dan Saran</div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenFeedback(!openFeedback);
                    }}
                  >
                    <MdClose size={25} color="red" />
                  </button>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-sm font-medium">Nama :</div>
                  <div>
                    <input
                      placeholder="Masukkan nama"
                      type="text"
                      className="w-full h-8 border border-gray-200 focus:outline-none px-2 rounded-md text-sm"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></input>
                    {errors.name && touched.name && (
                      <div className="text-xs text-red-500">{errors.name}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-sm font-medium">Email :</div>
                  <div>
                    <input
                      placeholder="Masukkan email"
                      type="text"
                      className="w-full h-8 border border-gray-200 focus:outline-none px-2 rounded-md text-sm"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></input>
                    {errors.email && touched.email && (
                      <div className="text-xs text-red-500">{errors.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-sm font-medium">No Telepon :</div>
                  <div>
                    <input
                      type="number"
                      placeholder="Masukkan no telepon"
                      className="w-full h-8 border border-gray-200 focus:outline-none px-2 rounded-md text-sm"
                      name="phone_number"
                      value={values.phone_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></input>
                    {errors.phone_number && touched.phone_number && (
                      <div className="text-xs text-red-500">
                        {errors.phone_number}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-sm font-medium">Gender :</div>
                  <div>
                    <Field
                      as="select"
                      name="gender_id"
                      onChange={(e) => {
                        setFieldValue("gender_id", e.target.value);
                      }}
                      className="w-full h-8 border border-gray-200 focus:outline-none px-2 rounded-md text-sm"
                    >
                      <option value="" selected disabled>
                        Pilih jenis kelamin
                      </option>
                      {genderData?.data?.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Field>
                    {errors.gender_id && touched.gender_id && (
                      <div className="text-xs text-red-500">
                        {errors.gender_id}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-sm font-medium">Umur :</div>
                  <div>
                    <input
                      placeholder="Masukkan umur"
                      type="number"
                      className="w-full h-8 border border-gray-200 focus:outline-none px-2 rounded-md text-sm"
                      name="age"
                      value={values.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></input>
                    {errors.age && touched.age && (
                      <div className="text-xs text-red-500">{errors.age}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-sm font-medium">Alamat :</div>
                  <div>
                    <textarea
                      type="text"
                      placeholder="Masukkan alamat"
                      className="w-full h-12 border border-gray-200 focus:outline-none px-2 rounded-md text-sm pt-2"
                      name="full_address"
                      value={values.full_address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                    {errors.full_address && touched.full_address && (
                      <div className="text-xs text-red-500">
                        {errors.full_address}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-sm font-medium">Deskripsi :</div>
                  <div>
                    <textarea
                      type="text"
                      placeholder="Masukkan deskripsi"
                      className="w-full h-12 border border-gray-200 focus:outline-none px-2 rounded-md text-sm pt-2"
                      name="content"
                      value={values.content}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                    {errors.content && touched.content && (
                      <div className="text-xs text-red-500">
                        {errors.content}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-end pt-5">
                  <button
                    type="submit"
                    className="rounded-md p-1 flex justify-center items-center gap-5 bg-primary border-none text-white normal-case"
                  >
                    <FaTelegramPlane />
                    Kirim
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
      <button
        onClick={() => {
          setOpenFeedback(!openFeedback);
        }}
        className="fixed bottom-24 right-6  hover:scale-[1.3] duration-300"
      >
        <div className="bg-blue-500 rounded-full w-14 h-14 flex justify-center items-center">
          <FaHeadset size={35} color="white" />
        </div>
      </button>
      <Link
        href={`https://wa.me/${contactsData?.[0]?.phone}`}
        target="_blank"
        className="fixed bottom-6 right-6 hover:scale-[1.3] duration-300"
      >
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
          <FaWhatsapp size={35} color="white" />
        </div>
      </Link>
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
      {loading && <HomeLoading />}
    </div>
  );
}
