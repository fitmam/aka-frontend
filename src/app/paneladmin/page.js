"use client";
import React, { useState } from "react";
import Navbar from "../../components/navbar";
import CountUp from "react-countup";
import MobileNav from "@/components/mobilenav";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import http from "@/helpers/http.helper";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { Sidebar } from "@/components/sidebar";
import WithAuth from "@/components/isauth";
import HomeLoading from "@/components/homeloading";
import { getCookie } from "cookies-next";

function Dashboard() {
  const dispatch = useDispatch();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const [loading, setLoading] = useState(true);
  const [showModalVisitor, setShowModalVisitor] = useState(false);
  const [showModalCandidate, setShowModalCandidate] = useState(false);
  const [showModalClient, setShowModalClient] = useState(false);
  const [showModalFeedback, setShowModalFeedback] = useState(false);
  const [showModalContact, setShowModalContact] = useState(false);
  const [showModalService, setShowModalService] = useState(false);
  const [page, setPage] = useState(1);
  const token = getCookie("token");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

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

  async function fetchClient() {
    const { data } = await http().get("/client");
    return data.results;
  }

  const { data: clientData } = useQuery({
    queryKey: ["client"],
    queryFn: () => fetchClient(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchService() {
    const { data } = await http().get("/company-request-service/list-all");
    return data.results;
  }

  const { data: serviceData } = useQuery({
    queryKey: ["service"],
    queryFn: () => fetchService(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVacancy() {
    const { data } = await http().get("/vacancy/list-all-vacancy");
    return data.results;
  }

  async function fetchFeedback() {
    const { data } = await http().get("/feedback");
    return data.results;
  }

  const { data: feedbackData } = useQuery({
    queryKey: ["feedback"],
    queryFn: () => fetchFeedback(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVacancy() {
    const { data } = await http().get("/vacancy/list-all-vacancy");
    return data.results;
  }

  const { data: vacancyData } = useQuery({
    queryKey: ["vacancy"],
    queryFn: () => fetchVacancy(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVisitorData(pageData = page) {
    const { data } = await http(token).get(
      "/visitor/count" + "?page" + pageData
    );
    return data.results;
  }

  const { data: visitorCountData } = useQuery({
    queryKey: ["visitor-count", page],
    queryFn: () => fetchVisitorData(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchContactData() {
    const { data } = await http().get("/contact-me");
    return data.results;
  }

  const { data: contactData } = useQuery({
    queryKey: ["contact-me"],
    queryFn: () => fetchContactData(),
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

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-8 flex flex-col gap-8 overflow-auto">
          <div className="flex gap-10">
            <div className="flex flex-col gap-3 bg-[#33b0e0] rounded-md h-32 shadow-md p-5 w-full">
              <div className="text-white text-xl uppercase">
                Jumlah pengunjung
              </div>
              <div className="flex w-full justify-between">
                <div className="text-white text-5xl">
                  <CountUp end={visitorCountData?.data?.length} />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      setShowModalVisitor(!showModalVisitor);
                    }}
                    className="bg-white p-2 rounded-md bg-primary-hover hover:text-white"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-[#FFC436] rounded-md h-32 shadow-md p-5 w-full">
              <div className="text-white text-xl uppercase">
                Jumlah Kandidat
              </div>
              <div className="flex w-full justify-between">
                <div className="text-white text-5xl">
                  <CountUp end={vacancyData?.data?.length} />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      setShowModalCandidate(!showModalCandidate);
                    }}
                    className="bg-white p-2 rounded-md bg-primary-hover hover:text-white"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-[#BE3144] rounded-md h-32 shadow-md p-5 w-full">
              <div className="text-white text-xl uppercase">Jumlah Klien</div>
              <div className="flex w-full justify-between">
                <div className="text-white text-5xl">
                  <CountUp end={clientData?.data?.length} />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      setShowModalClient(!showModalClient);
                    }}
                    className="bg-white p-2 rounded-md bg-primary-hover hover:text-white"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-3 bg-[#FFA33C] rounded-md h-32 shadow-md p-5 w-full">
              <div className="text-white text-xl uppercase">
                Jumlah Kritik & Saran
              </div>
              <div className="flex w-full justify-between">
                <div className="text-white text-5xl">
                  <CountUp end={feedbackData?.data?.length} />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      setShowModalFeedback(!showModalFeedback);
                    }}
                    className="bg-white p-2 rounded-md bg-primary-hover hover:text-white"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-[#B4BDFF] rounded-md h-32 shadow-md p-5 w-full">
              <div className="text-white text-xl uppercase">
                Jumlah Laporan Kontak
              </div>
              <div className="flex w-full justify-between">
                <div className="text-white text-5xl">
                  <CountUp end={contactData?.data?.length} />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      setShowModalContact(!showModalContact);
                    }}
                    className="bg-white p-2 rounded-md bg-primary-hover hover:text-white"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-[#C5E898] rounded-md h-32 shadow-md p-5 w-full">
              <div className="text-white text-xl uppercase">
                Jumlah Laporan Service
              </div>
              <div className="flex w-full justify-between">
                <div className="text-white text-5xl">
                  <CountUp end={serviceData?.data?.length} />
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      setShowModalService(!showModalService);
                    }}
                    className="bg-white p-2 rounded-md bg-primary-hover hover:text-white"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
      <div
        className={
          showModalVisitor
            ? "w-full h-full bg-gray-800 bg-opacity-50 absolute top-0 z-20 px-28 py-10 flex justify-center items-center"
            : "hidden"
        }
      >
        <div
          className={
            showModalVisitor
              ? "w-full h-full bg-white rounded-xl opacity-1 scale-up-center"
              : "w-full h-full bg-white rounded-xl opacity-0"
          }
        >
          <div className="p-10 overflow-auto">
            <div className="font-bold text-2xl">Detail Pengunjung</div>
            <div className="h-full">
              <div className="w-full h-[450px] bg-white rounded-xl shadow-xl mb-10 p-5 border mt-5 overflow-auto flex flex-col gap-5">
                {visitorCountData?.data?.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className="flex gap-2 w-full justify-between items-center"
                    >
                      <div className="flex gap-3">
                        <div className="font-bold text-xl">{index + 1}.</div>
                        <div className="flex flex-col gap-2">
                          <div className="font-medium text-md">
                            IP Address : {item.ipAddress}
                          </div>
                          <div className="font-medium text-md">
                            Alamat : {item.country}, {item.region}, {item.city}
                          </div>
                          <div className="font-medium text-md">
                            Latitude & Longitude : {item.loc}
                          </div>
                          <div className="font-medium text-md">
                            Tanggal Kunjungan : {item.visitDate}
                          </div>
                          <div className="font-medium text-md">
                            Waktu Visit : {item.time}
                          </div>
                        </div>
                      </div>
                      <iframe
                        className="w-1/2"
                        src={`//maps.google.com/maps?q=${item.loc}&z=15&output=embed`}
                      ></iframe>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between">
                <div className="flex">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={visitorCountData?.currentPage <= 1}
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                  >
                    Previous
                  </button>
                  <button
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white "
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  <button
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                    disabled={
                      visitorCountData?.currentPage ===
                      visitorCountData?.totalPages
                    }
                    onClick={() => {
                      setPage((old) => old + 1);
                    }}
                  >
                    Next
                  </button>
                </div>
                <div onClick={() => setShowModalVisitor(!showModalVisitor)}>
                  <button className="bg-primary text-white p-2.5 rounded-xl">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showModalCandidate
            ? "w-full h-full bg-gray-800 bg-opacity-50 absolute top-0 z-20 p-10 flex justify-center items-center"
            : "hidden"
        }
      >
        <div
          className={
            showModalCandidate
              ? "w-full h-full bg-white rounded-xl opacity-1 scale-up-center"
              : "w-full h-full bg-white rounded-xl opacity-0"
          }
        >
          <div className="p-10 overflow-auto">
            <div className="font-bold text-2xl">Detail Kandidat</div>
            <div className="h-full">
              <div className="w-full h-[450px] bg-white rounded-xl shadow-xl mb-10 p-5 border mt-5 overflow-auto flex flex-col gap-5">
                {vacancyData?.data?.map((item, index) => {
                  return (
                    <div key={item.id} className="flex gap-2">
                      <div className="flex gap-3">
                        <div className="font-bold text-xl">{index + 1}.</div>
                        <div className="flex flex-col gap-2">
                          <div className="font-medium text-md">
                            Nama : {item.full_name}
                          </div>
                          <div className="font-medium text-md">
                            Nomor Telepon : {item.first_phone_number}
                          </div>
                          <div className="font-medium text-md">
                            Alamat Lengkap sesuai Domisili :{" "}
                            {item.domicile_full_address}
                          </div>
                          <div className="font-medium text-md">
                            Alamat Lengkap Sesuai E-KTP :{" "}
                            {item.e_ktp_full_address}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between">
                <div className="flex">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={vacancyData?.currentPage <= 1}
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                  >
                    Previous
                  </button>
                  <button
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white "
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setPage(2)}
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white"
                  >
                    2
                  </button>
                  <button
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                    disabled={
                      vacancyData?.currentPage === vacancyData?.totalPages
                    }
                    onClick={() => {
                      setPage((old) => old + 1);
                    }}
                  >
                    Next
                  </button>
                </div>
                <div onClick={() => setShowModalCandidate(!showModalCandidate)}>
                  <button className="bg-primary text-white p-2.5 rounded-xl">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showModalClient
            ? "w-full h-full bg-gray-800 bg-opacity-50 absolute top-0 z-20 p-10 flex justify-center items-center"
            : "hidden"
        }
      >
        <div
          className={
            showModalClient
              ? "w-full h-full bg-white rounded-xl opacity-1 scale-up-center"
              : "w-full h-full bg-white rounded-xl opacity-0"
          }
        >
          <div className="p-10 overflow-auto">
            <div className="font-bold text-2xl">Detail Klien</div>
            <div className="h-full">
              <div className="w-full h-[450px] bg-white rounded-xl shadow-xl mb-10 p-5 border mt-5 overflow-auto flex flex-col gap-5">
                {clientData?.data?.map((item, index) => {
                  return (
                    <div key={item.id} className="flex gap-2">
                      <div className="flex gap-3">
                        <div className="font-bold text-xl">{index + 1}.</div>
                        <div className="flex flex-col gap-2">
                          <div className="font-medium text-md">
                            Nama Perusahaan: {item.company_name}
                          </div>
                          <div className="font-medium text-md">
                            Nomor Telepon: {item.phone_number}
                          </div>
                          <div className="font-medium text-md">
                            Alamat Lengkap :{" "}
                            {`${item.province.name},
                            ${item.regency.name}, ${item.district.name}, ${item.village.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between">
                <div className="flex">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={clientData?.currentPage <= 1}
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                  >
                    Previous
                  </button>
                  <button
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white "
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setPage(2)}
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white"
                  >
                    2
                  </button>
                  <button
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                    disabled={
                      clientData?.currentPage === clientData?.totalPages
                    }
                    onClick={() => {
                      setPage((old) => old + 1);
                    }}
                  >
                    Next
                  </button>
                </div>
                <div onClick={() => setShowModalClient(!showModalClient)}>
                  <button className="bg-primary text-white p-2.5 rounded-xl">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showModalFeedback
            ? "w-full h-full bg-gray-800 bg-opacity-50 absolute top-0 z-20 p-10 flex justify-center items-center"
            : "hidden"
        }
      >
        <div
          className={
            showModalFeedback
              ? "w-full h-full bg-white rounded-xl opacity-1 scale-up-center"
              : "w-full h-full bg-white rounded-xl opacity-0"
          }
        >
          <div className="p-10 overflow-auto">
            <div className="font-bold text-2xl">Detail Kritik & Saran</div>
            <div className="h-full">
              <div className="w-full h-[450px] bg-white rounded-xl shadow-xl mb-10 p-5 border mt-5 overflow-auto flex flex-col gap-5">
                {feedbackData?.data?.map((item, index) => {
                  return (
                    <div key={item.id} className="flex gap-2">
                      <div className="flex gap-3">
                        <div className="font-bold text-xl">{index + 1}.</div>
                        <div className="flex flex-col gap-2">
                          <div className="font-medium text-md">
                            Nama Perusahaan: {item.name}
                          </div>
                          <div className="font-medium text-md">
                            Nomor Telepon: {item.phone_number}
                          </div>
                          <div className="font-medium text-md">
                            Alamat Lengkap : {`${item.full_address}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between">
                <div className="flex">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={feedbackData?.currentPage <= 1}
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                  >
                    Previous
                  </button>
                  <button
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white "
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setPage(2)}
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white"
                  >
                    2
                  </button>
                  <button
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                    disabled={
                      feedbackData?.currentPage === feedbackData?.totalPages
                    }
                    onClick={() => {
                      setPage((old) => old + 1);
                    }}
                  >
                    Next
                  </button>
                </div>
                <div onClick={() => setShowModalFeedback(!showModalFeedback)}>
                  <button className="bg-primary text-white p-2.5 rounded-xl">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showModalContact
            ? "w-full h-full bg-gray-800 bg-opacity-50 absolute top-0 z-20 p-10 flex justify-center items-center"
            : "hidden"
        }
      >
        <div
          className={
            showModalContact
              ? "w-full h-full bg-white rounded-xl opacity-1 scale-up-center"
              : "w-full h-full bg-white rounded-xl opacity-0"
          }
        >
          <div className="p-10 overflow-auto">
            <div className="font-bold text-2xl">Detail Laporan Kontak</div>
            <div className="h-full">
              <div className="w-full h-[450px] bg-white rounded-xl shadow-xl mb-10 p-5 border mt-5 overflow-auto flex flex-col gap-5">
                {clientData?.data?.map((item, index) => {
                  return (
                    <div key={item.id} className="flex gap-2">
                      <div className="flex gap-3">
                        <div className="font-bold text-xl">{index + 1}.</div>
                        <div className="flex flex-col gap-2">
                          <div className="font-medium text-md">
                            Nama Perusahaan: {item.company_name}
                          </div>
                          <div className="font-medium text-md">
                            Nomor Telepon: {item.phone_number}
                          </div>
                          <div className="font-medium text-md">
                            Alamat Lengkap :{" "}
                            {`${item.province.name},
                            ${item.regency.name}, ${item.district.name}, ${item.village.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between">
                <div className="flex">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={clientData?.currentPage <= 1}
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                  >
                    Previous
                  </button>
                  <button
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white "
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setPage(2)}
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white"
                  >
                    2
                  </button>
                  <button
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                    disabled={
                      clientData?.currentPage === clientData?.totalPages
                    }
                    onClick={() => {
                      setPage((old) => old + 1);
                    }}
                  >
                    Next
                  </button>
                </div>
                <div onClick={() => setShowModalContact(!showModalContact)}>
                  <button className="bg-primary text-white p-2.5 rounded-xl">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showModalService
            ? "w-full h-full bg-gray-800 bg-opacity-50 absolute top-0 z-20 p-10 flex justify-center items-center"
            : "hidden"
        }
      >
        <div
          className={
            showModalService
              ? "w-full h-full bg-white rounded-xl opacity-1 scale-up-center"
              : "w-full h-full bg-white rounded-xl opacity-0"
          }
        >
          <div className="p-10 overflow-auto">
            <div className="font-bold text-2xl">Detail Laporan Service</div>
            <div className="h-full">
              <div className="w-full h-[450px] bg-white rounded-xl shadow-xl mb-10 p-5 border mt-5 overflow-auto flex flex-col gap-5">
                {serviceData?.data?.map((item, index) => {
                  return (
                    <div key={item.id} className="flex gap-2">
                      <div className="flex gap-3">
                        <div className="font-bold text-xl">{index + 1}.</div>
                        <div className="flex flex-col gap-2">
                          <div className="font-medium text-md">
                            Nama Perusahaan: {item.company_name}
                          </div>
                          <div className="font-medium text-md">
                            Nomor Telepon: {item.company_phone}
                          </div>
                          <div className="font-medium text-md">
                            Alamat Lengkap :{" "}
                            {`${item.province.name},
                            ${item.regency.name}, ${item.district.name}, ${item.village.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between">
                <div className="flex">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={serviceData?.currentPage <= 1}
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                  >
                    Previous
                  </button>
                  <button
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white "
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setPage(2)}
                    className="border px-4 py-2 text-sm hover:bg-primary hover:text-white"
                  >
                    2
                  </button>
                  <button
                    className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                    disabled={
                      serviceData?.currentPage === serviceData?.totalPages
                    }
                    onClick={() => {
                      setPage((old) => old + 1);
                    }}
                  >
                    Next
                  </button>
                </div>
                <div onClick={() => setShowModalService(!showModalService)}>
                  <button className="bg-primary text-white p-2.5 rounded-xl">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <HomeLoading />}
    </div>
  );
}

export default WithAuth(Dashboard);
