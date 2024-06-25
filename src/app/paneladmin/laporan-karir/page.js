"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useRef } from "react";
import { BsPeopleFill } from "react-icons/bs";
import http from "@/helpers/http.helper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useCallback } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { getCookie } from "cookies-next";
import {
  Document,
  Page,
  Text,
  Image as PDFImage,
  View,
  Link as PDFLink,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import Link from "next/link";
import { Field, Formik } from "formik";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { FaDownload, FaPlus, FaTrash } from "react-icons/fa";
import * as Yup from "yup";
import { FaPencil } from "react-icons/fa6";
import Loading from "@/components/loading";
import { IoIosFemale, IoIosMale } from "react-icons/io";
import Select, { components } from "react-select";
import { IoMdArrowDropdown } from "react-icons/io";
import WithAuth from "@/components/isauth";

function LaporanKarir() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [vacancyValue, setVacancyValue] = useState([]);
  const [regencyValue, setRegencyData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [districtValue, setDistrictData] = useState([]);
  const [villageValue, setVillageData] = useState([]);
  const [domicileRegencyValue, setDomicileRegencyValue] = useState([]);
  const [deletedData, setDeletedData] = useState("");
  const [domicileDistrictValue, setDomicileDistrictValue] = useState([]);
  const [domicileVillageValue, setDomicileVillageValue] = useState([]);
  const [selectedKTP, setSelectedKTP] = useState("");
  const [vacancyId, setVacancyId] = useState("");
  const [selectedPicture, setSelectedPicture] = useState("");
  const vacancyForm = useRef();
  const [loading, setLoading] = useState(false);
  const [pictureURI, setPictureURI] = useState("");
  const [openPDFModal, setOpenPDFModal] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [selectedDriverLicense, setSelectedDriverLicense] = useState([]);
  const [cvName, setCvName] = useState("");
  const [otherDocumentName, setOtherDocumentName] = useState("");
  const user_id = useSelector((state) => state.user.user_id);
  const token = getCookie("token");
  const addVacancyForm = useRef();

  const validateStatus = Yup.object({
    status_id: Yup.string().required("Harap diisi"),
  });

  function resetFile() {
    if (typeof window !== "undefined") {
      const profilephoto = document.querySelector(".profilephoto");
      const ektp = document.querySelector(".ektp");
      const cv = document.querySelector(".cvvalue");
      const otherdocument = document.querySelector(".otherdocument");
      profilephoto.value = "";
      ektp.value = "";
      cv.value = "";
      otherdocument.value = "";
    }
  }

  const fetchUserById = useCallback(async () => {
    try {
      const { data } = await http(token).get(`/users/${user_id}`);
      setCurrentUser(data.results);
    } catch (err) {
      console.log(err);
    }
  }, [token, user_id]);

  useEffect(() => {
    fetchUserById();
  }, [fetchUserById]);

  const [educations, setEducations] = useState([
    { name: "", school_name: "", start_date: "", end_date: "" },
  ]);

  const [workHistory, setWorkHistory] = useState([
    { company_name: "", start_date: "", end_date: "" },
  ]);

  const addEducation = () => {
    setEducations([
      ...educations,
      { name: "", school_name: "", start_date: "", end_date: "" },
    ]);
  };

  const deleteEducation = (index) => {
    const updatedEducations = [...educations];
    updatedEducations.splice(index, 1);
    setEducations(updatedEducations);
  };

  const addWorkHistory = () => {
    setWorkHistory([
      ...workHistory,
      { company_name: "", start_date: "", end_date: "" },
    ]);
  };

  const deleteWorkHistory = (index) => {
    const updatedWorkHistory = [...workHistory];
    updatedWorkHistory.splice(index, 1);
    setWorkHistory(updatedWorkHistory);
  };

  const showDetailModal = (itemId) => {
    const updatedId = itemId;
    setOpenDetail(!openDetail);
    setVacancyId(updatedId);
  };

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setVacancyId(updatedId);
  };

  const fileToDataUrl = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPictureURI(reader.result);
    });
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const customDropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <IoMdArrowDropdown />
      </components.DropdownIndicator>
    );
  };

  async function fetchEducations() {
    const { data } = await http().get("/education?limit=20");
    return data.results;
  }

  const { data: educationsData } = useQuery({
    queryKey: ["educations"],
    queryFn: () => fetchEducations(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ddd",
      borderRadius: "10px",
      height: "48px",
      outline: "none",
      width: "100%",
      padding: "0 5px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#007bff" : null,
      color: state.isFocused ? "white" : null,
    }),
  };

  async function fetchVacancyById(id) {
    try {
      const { data } = await http(token).get(`/vacancy/${id}`);
      const educationData = data.results.education;
      const workHistoryData = data.results.work_experience_histories;
      const driverLicenseData = data.results.driver_license;
      const vehicleTypeData = data.results.vehicle_type;
      setEducations(educationData);
      setWorkHistory(workHistoryData);
      setSelectedDriverLicense(driverLicenseData);
      setSelectedVehicles(vehicleTypeData);
      setVacancyValue(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  Font.register({
    family: "Lato",
    src: "https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf",
  });

  Font.register({
    family: "Lato Bold",
    src: "https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf",
  });

  const MyDocument = ({ data }) => (
    <Document>
      <Page wrap style={{ fontFamily: "Lato" }} size={[595.28, 1190.55]}>
        {data?.map((item, index) => {
          const educationValue = item.education;
          const educationsData = educationValue;
          const workHistoryValue = item.work_experience_histories;
          const workHistoriesData = workHistoryValue;
          const driverLicenseValue = item.driver_license;
          const driverLicensesData = driverLicenseValue;
          const vehicleValue = item.vehicle_type;
          const vehicleTypesData = vehicleValue;
          return (
            <View key={index}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#F5F7F8",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    gap: 5,
                  }}
                >
                  <PDFImage
                    alt=""
                    src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1699097693/uploads/${item?.profile_photo?.replace(
                      /\s/g,
                      "%20"
                    )}.png`}
                    style={{ width: 50, height: 50 }}
                  ></PDFImage>
                  <Text style={{ fontSize: 10 }}>{item?.position?.name}</Text>
                </View>
                <Text style={{ fontSize: 15, textAlign: "center" }}>
                  Data Pelamar Kerja
                </Text>
                <PDFImage
                  alt=""
                  src={"/ak.png"}
                  style={{ width: 80, height: 80 }}
                ></PDFImage>
              </View>
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "13px",
                      fontFamily: "Lato Bold",
                      borderBottom: "1px solid black",
                      paddingLeft: "5px",
                    }}
                  >
                    Profil
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 30,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderRight: "1px solid black",
                        paddingLeft: "5px",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Nama Lengkap
                          {"                  "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.full_name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          NIK KTP{"                              "} :
                        </Text>
                        <Text style={{ fontSize: "13px" }}> {item?.nik}</Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Jenis Kelamin {"                   "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.gender?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Agama {"                                   "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.religion?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Status Menikah {"               "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.marital_status?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Tempat Tanggal Lahir {"   "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.birth_place}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Umur {"                                      "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.age} tahun
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "5px",
                        }}
                      >
                        <Text
                          style={{ fontSize: "13px", paddingBottom: "10px" }}
                        >
                          Tinggi Badan {"                      "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.height} cm
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          No Telp 1 {"                          "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.first_phone_number}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          No Telp 2 {"                          "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.second_phone_number}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Email {"                                   "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}> {item?.email}</Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Tanggal Melamar{"         "} :
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {dayjs().format("DD-MM-YYYY")}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Posisi Melamar {"             "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.position?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "5px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Gaji yang diharapkan :{" "}
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {item?.expected_salary}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    paddingLeft: "5px",
                  }}
                >
                  <Text style={{ fontSize: "13px" }}>
                    Jelaskan tentang diri anda :{" "}
                  </Text>
                  <Text style={{ fontSize: "13px" }}>
                    {item?.describe_yourself}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 30,
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    paddingLeft: "5px",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "13px",
                        paddingBottom: "10px",
                        fontFamily: "Lato Bold",
                        fontWeight: "30",
                      }}
                    >
                      Informasi
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Pengalaman Kerja {"              "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.work_experience?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Status Vaksin {"                        "}:{" "}
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {item?.vaccine?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Keahlian {"                                   "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}> {item?.skills}</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Kendaraan Yang Dimiliki :{" "}
                      </Text>
                      {vehicleTypesData?.map((item) => {
                        return (
                          <Text style={{ fontSize: "13px" }} key={item.id}>
                            {item.name},{" "}
                          </Text>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        SIM
                        {
                          "                                               "
                        }:{" "}
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {driverLicensesData?.map((item) => {
                          return (
                            <Text style={{ fontSize: "13px" }} key={item.id}>
                              {item.name},{" "}
                            </Text>
                          );
                        })}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "13px",
                        paddingBottom: "10px",
                        fontFamily: "Lato Bold",
                      }}
                    >
                      Sosial Media
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Facebook {"            "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.facebook}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Instagram {"            "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.instagram}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Twitter {"                  "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}> {item?.twitter}</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Line {"                         "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}> {item?.line}</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        LinkedIn {"               "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.linkedin}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    paddingLeft: "5px",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 30,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderRight: "1px solid black",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "13px",
                          paddingBottom: "10px",
                          fontWeight: "30",
                          fontFamily: "Lato Bold",
                        }}
                      >
                        Pengalaman Kerja
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          paddingBottom: "10px",
                        }}
                      >
                        {workHistoriesData?.map((item) => {
                          return (
                            <Text key={item.id} style={{ fontSize: "13px" }}>
                              {item?.company_name}
                            </Text>
                          );
                        })}
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        gap: 30,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "13px",
                            paddingBottom: "10px",
                            fontFamily: "Lato Bold",
                            fontWeight: "30",
                          }}
                        >
                          Waktu Mulai
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingBottom: "10px",
                          }}
                        >
                          {workHistoriesData?.map((item) => {
                            return (
                              <Text key={item.id} style={{ fontSize: "13px" }}>
                                {dayjs(item?.start_date).format("DD-MM-YYYY")}
                              </Text>
                            );
                          })}
                        </View>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "13px",
                            paddingBottom: "10px",
                            fontFamily: "Lato Bold",
                            fontWeight: "30",
                          }}
                        >
                          Waktu Selesai
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingBottom: "10px",
                          }}
                        >
                          {workHistoriesData?.map((item) => {
                            return (
                              <Text key={item.id} style={{ fontSize: "13px" }}>
                                {dayjs(item?.end_date).format("DD-MM-YYYY")}
                              </Text>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    paddingLeft: "5px",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 30,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderRight: "1px solid black",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "13px",
                          paddingBottom: "10px",
                          fontWeight: "30",
                          fontFamily: "Lato Bold",
                        }}
                      >
                        Pendidikan{"        "}
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          paddingBottom: "10px",
                        }}
                      >
                        {educationsData?.map((item) => {
                          return (
                            <Text key={item.id} style={{ fontSize: "13px" }}>
                              {item?.school_name}
                            </Text>
                          );
                        })}
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        gap: 30,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "13px",
                            paddingBottom: "10px",
                            fontFamily: "Lato Bold",
                            fontWeight: "30",
                          }}
                        >
                          Tahun Mulai
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingBottom: "10px",
                          }}
                        >
                          {educationsData?.map((item) => {
                            return (
                              <Text key={item.id} style={{ fontSize: "13px" }}>
                                {dayjs(item?.start_date).format("DD-MM-YYYY")}
                              </Text>
                            );
                          })}
                        </View>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "13px",
                            paddingBottom: "10px",
                            fontFamily: "Lato Bold",
                            fontWeight: "30",
                          }}
                        >
                          Tahun Selesai
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingBottom: "10px",
                          }}
                        >
                          {educationsData?.map((item) => {
                            return (
                              <Text key={item.id} style={{ fontSize: "13px" }}>
                                {dayjs(item?.end_date).format("DD-MM-YYYY")}
                              </Text>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    paddingLeft: "5px",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 30,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderRight: "1px solid black",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "13px",
                          paddingBottom: "10px",
                          fontWeight: "30",
                          fontFamily: "Lato Bold",
                        }}
                      >
                        Alamat KTP
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Provinsi {"                     "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.e_ktp_province?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kabupaten {"              "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.e_ktp_regency?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kecamatan {"             "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.e_ktp_district?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kelurahan {"               "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.e_ktp_village?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kode POS {"               "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.e_ktp_postal_code}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          paddingBottom: "30px",
                        }}
                      >
                        <Text
                          style={{ fontSize: "13px", paddingBottom: "10px" }}
                        >
                          Alamat Lengkap :
                        </Text>
                        <Text style={{ fontSize: "13px", maxWidth: "180px" }}>
                          {" "}
                          {item?.e_ktp_full_address}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "13px",
                          paddingBottom: "10px",
                          fontFamily: "Lato Bold",
                        }}
                      >
                        Alamat Domisili
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Provinsi {"                  "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.domicile_province?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kabupaten {"           "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.domicile_regency?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kecamatan {"          "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.domicile_district?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kelurahan {"             "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.domicile_village?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingBottom: "10px",
                        }}
                      >
                        <Text style={{ fontSize: "13px" }}>
                          Kode POS {"             "}:
                        </Text>
                        <Text style={{ fontSize: "13px" }}>
                          {" "}
                          {item?.domicile_postal_code}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          paddingBottom: "30px",
                        }}
                      >
                        <Text
                          style={{ fontSize: "13px", paddingBottom: "10px" }}
                        >
                          Alamat Lengkap :
                        </Text>
                        <Text style={{ fontSize: "13px", maxWidth: "180px" }}>
                          {" "}
                          {item?.domicile_full_address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: "auto",
                    display: "flex",
                    flexDirection: "row",
                    gap: 30,
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                    paddingLeft: "5px",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "13px",
                        paddingBottom: "10px",
                        fontWeight: "30",
                        fontFamily: "Lato Bold",
                      }}
                    >
                      Akun Bank
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Nama Pemilik Rekening :
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.account_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Nama Bank {"                            "}:{" "}
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {item?.bank?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Nomor Rekening {"                "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.account_number}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "13px",
                        paddingBottom: "10px",
                        fontFamily: "Lato Bold",
                      }}
                    >
                      Kontak Darurat
                    </Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Nama Lengkap {"                             "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.urgent_full_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        Hubungan Dengan Pelamar :
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.applicant_relationships}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text style={{ fontSize: "13px" }}>
                        No Telpon / Whatsapp {"            "}:
                      </Text>
                      <Text style={{ fontSize: "13px" }}>
                        {" "}
                        {item?.urgent_phone_number}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ border: "1px solid black", paddingLeft: "5px" }}>
                  <View>
                    <Text
                      style={{
                        fontSize: "13px",
                        fontFamily: "Lato Bold",
                      }}
                    >
                      Url Resume / CV
                    </Text>
                    <PDFLink
                      style={{
                        fontSize: "13px",
                        paddingTop: "10px",
                        color: "#0802A3",
                      }}
                      src={`https://res.cloudinary.com/dxnewldiy/raw/upload/v1699596725/cv/${item?.cv}`}
                    >
                      Link Resume
                    </PDFLink>
                  </View>
                  <View style={{ paddingTop: "30px" }}>
                    <Text style={{ fontSize: "13px", fontFamily: "Lato Bold" }}>
                      Url E-KTP
                    </Text>
                    <PDFLink
                      style={{
                        fontSize: "13px",
                        paddingTop: "10px",
                        color: "#0802A3",
                      }}
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1699267675/uploads/${item?.e_ktp}.png`}
                    >
                      Link E-KTP
                    </PDFLink>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );

  const updateStatus = useMutation({
    mutationFn: (values) => {
      return http(token).patch(`/vacancy/status/${vacancyId}`, values);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vacancy"] });
      setLoading(false);
      toast.success("Berhasil mengupdate status");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateVacancy = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      if (selectedPicture) {
        form.append("profile_photo", selectedPicture);
      }

      if (selectedKTP) {
        form.append("e_ktp", selectedKTP);
      }

      const filteredEducations = educations.filter((item) =>
        Object.values(item).every((value) => value !== "")
      );

      const filteredWorkHistory = workHistory.filter((item) =>
        Object.values(item).every((value) => value !== "")
      );

      form.append("education", JSON.stringify(filteredEducations));
      form.append(
        "work_experience_history",
        JSON.stringify(filteredWorkHistory)
      );
      form.append("vehicle_type", JSON.stringify(selectedVehicles));
      form.append("driver_license", JSON.stringify(selectedDriverLicense));
      form.append("full_name", values.full_name);
      form.append("birth_place", values.birth_place);
      form.append("nik", values.nik);
      form.append("birth_date", values.birth_date);
      form.append("age", values.age);
      form.append("gender_id", values.gender_id);
      form.append("religion_id", values.religion_id);
      form.append("skills", values.skills);
      form.append("work_experience_id", values.work_experience_id);
      form.append("marital_status_id", values.marital_status_id);
      form.append("vehicle_type_id", values.vehicle_type_id);
      form.append("driver_license_id", values.driver_license_id);
      form.append("vaccine_id", values.vaccine_id);
      form.append("first_phone_number", values.first_phone_number);
      form.append("second_phone_number", values.second_phone_number);
      form.append("email", values.email);
      form.append("facebook", values.facebook);
      form.append("instagram", values.instagram);
      form.append("line", values.line);
      form.append("twitter", values.twitter);
      form.append("linkedin", values.linkedin);
      form.append("e_ktp_province_id", values.e_ktp_province_id);
      form.append("e_ktp_regency_id", values.e_ktp_regency_id);
      form.append("e_ktp_district_id", values.e_ktp_district_id);
      form.append("e_ktp_village_id", values.e_ktp_village_id);
      form.append("e_ktp_postal_code", values.e_ktp_postal_code);
      form.append("e_ktp_full_address", values.e_ktp_full_address);
      form.append("domicile_province_id", values.domicile_province_id);
      form.append("domicile_regency_id", values.domicile_regency_id);
      form.append("domicile_district_id", values.domicile_district_id);
      form.append("domicile_village_id", values.domicile_village_id);
      form.append("domicile_postal_code", values.domicile_postal_code);
      form.append("domicile_full_address", values.domicile_full_address);
      form.append("account_name", values.account_name);
      form.append("account_number", values.account_number);
      form.append("bank_name_id", values.bank_name_id);
      form.append("urgent_full_name", values.urgent_full_name);
      form.append("urgent_phone_number", values.urgent_phone_number);
      form.append("applicant_relationsips", values.applicant_relationsips);
      form.append("expected_salary", values.expected_salary);
      form.append("position_id", values.position_id);
      form.append("describe_yourself", values.describe_yourself);
      form.append("cv", values.cv);
      form.append("other_document", values.other_document);
      form.append("status_id", 1);
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const ktpExtensions = selectedKTP?.name?.split(".").pop().toLowerCase();
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();

      if (selectedKTP) {
        if (!allowedExtensions.includes(ktpExtensions)) {
          toast.error("E-KTP harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Foto profil harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (cvName) {
        if (cvName?.split(".").pop() !== "pdf") {
          toast.error("CV harus berupa file pdf");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (otherDocumentName) {
        if (otherDocumentName?.split(".").pop() !== "pdf") {
          toast.error("Dokumen tambahan harus berupa file pdf");
          return http(token).put(`/vacancies`, form);
        }
      }
      return http(token).patch(`/vacancy/${vacancyId}`, form);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vacancy"] });
      setLoading(false);
      toast.success("Berhasil mengupdate kandidat");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const [selectedData, setSelectedData] = useState([]);

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setSelectedData((prevSelectedData) => [...prevSelectedData, item]);
    } else {
      setSelectedData((prevSelectedData) =>
        prevSelectedData.filter((data) => data !== item)
      );
    }
  };

  const ExportToExcel = ({ data }) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToExcel = () => {
      const formattedData = selectedData.map((row) => {
        const educationValue = row?.education;
        const educationsData = educationValue;
        const workHistoryValue = row?.work_experience_histories;
        const workHistoriesData = workHistoryValue;
        const driverLicenseValue = row?.driver_license;
        const driverLicensesData = driverLicenseValue;
        const vehicleValue = row?.vehicle_type;
        const vehicleTypesData = vehicleValue;
        return {
          "Nama Lengkap": row.full_name,
          "Tempat Lahir": row.birth_place,
          NIK: row.nik,
          "Tanggal Lahir": dayjs(row.birth_date).format("DD-MM-YYYY"),
          Umur: row.age,
          "Jenis Kelamin": row.gender?.name,
          Agama: row.religion?.name,
          Skill: row.skills,
          "Pernah Bekerja": row.work_experience?.name,
          Pendidikan: educationsData
            .map(
              (edu) =>
                `${edu.name} (${edu.school_name}) - ${dayjs(
                  edu.start_date
                ).format("DD-MM-YYYY")} sampai ${dayjs(edu.end_date).format(
                  "DD-MM-YYYY"
                )}`
            )
            .join(", "),
          "Pengalaman Kerja": workHistoriesData
            .map(
              (wx) =>
                `${wx.company_name} - ${dayjs(wx.start_date).format(
                  "DD-MM-YYYY"
                )} sampai ${dayjs(wx.end_date).format("DD-MM-YYYY")}`
            )
            .join(", "),
          "Status Menikah": row.marital_status?.name,
          "Jenis Kendaraan": vehicleTypesData
            .map((wx) => `${wx.name}`)
            .join(", "),
          SIM: driverLicensesData.map((wx) => `${wx.name}`).join(", "),
          Vaksin: row.vaccine.name,
          "Nomor Telepon Pertama": row.first_phone_number,
          "Nomor Telepon Kedua": row.second_phone_number,
          Email: row.email,
          Facebook: row.facebook,
          Instagram: row.instagram,
          Line: row.line,
          Twitter: row.twitter,
          LinkedIn: row.linkedin,
          "Provinsi KTP": row.e_ktp_province?.name,
          "Kabupaten KTP": row.e_ktp_district?.name,
          "Kelurahan KTP": row.e_ktp_regency?.name,
          "Kecamatan KTP": row.e_ktp_village?.name,
          "Kode POS": row.e_ktp_postal_code,
          "Alamat Lengkap": row.e_ktp_full_address,
          "Pronvinsi sesuai Domisili": row.domicile_province?.name,
          "Kabupaten sesuai Domisili": row.domicile_district?.name,
          "Kelurahan sesuai Domisili": row.domicile_regency?.name,
          "Kecamatan sesuai Domisili": row.domicile_village?.name,
          "Kode POS sesuai Domisili": row.domicile_postal_code,
          "Alamat Lengkap Domisili": row.domicile_full_address,
          "Nama Owner Bank": row.account_name,
          "Nomor Rekening": row.account_number,
          "Nama Bank": row.bank?.name,
          "Nama Lengkap": row.urgent_full_name,
          "Hubungan Dengan Pelamar": row.applicant_relationsips,
          "Nomor Telepon": row.urgent_phone_number,
          "Jelaskan Tentang Anda": row.describe_yourself,
          "Gaji yang diharapkan": row.expected_salary,
        };
      });

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      saveAs(data, "data" + fileExtension);
    };
    return (
      <button
        onClick={exportToExcel}
        className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
      >
        Download as Excel
      </button>
    );
  };

  const dispatch = useDispatch();

  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);

  async function fetchProvince() {
    const { data } = await http(token).get("/province");
    return data.results;
  }

  async function fetchVacancy() {
    const { data } = await http(token).get(`/vacancy/list-all-vacancy`);
    return data.results;
  }

  const { data } = useQuery({
    queryKey: ["vacancy"],
    queryFn: () => fetchVacancy(),
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

  async function fetchStatus() {
    const { data } = await http().get("/status");
    return data.results;
  }

  const { data: statusData } = useQuery({
    queryKey: ["status"],
    queryFn: () => fetchStatus(),
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

  const { data: provinceData } = useQuery({
    queryKey: ["province"],
    queryFn: () => fetchProvince(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchWorkPosition() {
    const { data } = await http(token).get(`/needed-position?limit=20`);
    return data.results;
  }

  const { data: positionOfWork } = useQuery({
    queryKey: ["needed-position"],
    queryFn: () => fetchWorkPosition(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchRegencyById(id) {
    const { data } = await http().get(`/regency/${id}`);
    setRegencyData(data.results);
    return data.results;
  }

  async function fetchDistrictById(id) {
    const { data } = await http().get(`/district/${id}`);
    setDistrictData(data.results);
    return data.results;
  }

  async function fetchVillageById(id) {
    const { data } = await http().get(`/village/${id}`);
    setVillageData(data.results);
    return data.results;
  }

  async function fetchDomicileRegencyById(id) {
    const { data } = await http().get(`/regency/${id}`);
    setDomicileRegencyValue(data.results);
    return data.results;
  }

  async function fetchDomicileDistrictById(id) {
    const { data } = await http().get(`/district/${id}`);
    setDomicileDistrictValue(data.results);
    return data.results;
  }

  async function fetchDomicileVillageById(id) {
    const { data } = await http().get(`/village/${id}`);
    setDomicileVillageValue(data.results);
    return data.results;
  }

  async function fetchGender() {
    const { data } = await http().get("/gender");
    return data.results;
  }

  const { data: genderData } = useQuery({
    queryKey: ["gender"],
    queryFn: () => fetchGender(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchReligion() {
    const { data } = await http().get("/religion");
    return data.results;
  }

  const { data: religionData } = useQuery({
    queryKey: ["religion"],
    queryFn: () => fetchReligion(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchMaritalStatus() {
    const { data } = await http().get("/maritalstatus");
    return data.results;
  }

  const { data: maritalStatusData } = useQuery({
    queryKey: ["marital-status"],
    queryFn: () => fetchMaritalStatus(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchWorkExperience() {
    const { data } = await http().get("/workexperience");
    return data.results;
  }

  const { data: workExperienceData } = useQuery({
    queryKey: ["work-experience"],
    queryFn: () => fetchWorkExperience(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVehicleType() {
    const { data } = await http().get("/vehicle-type-list");
    return data.results;
  }

  const { data: vehicleTypeData } = useQuery({
    queryKey: ["vehicle-type"],
    queryFn: () => fetchVehicleType(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchDriverLicense() {
    const { data } = await http().get("/driver-license-list");
    return data.results;
  }

  const { data: driverLicenseData } = useQuery({
    queryKey: ["driver-license"],
    queryFn: () => fetchDriverLicense(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVaccine() {
    const { data } = await http().get("/vaccine");
    return data.results;
  }

  async function fetchBank() {
    const { data } = await http().get("/bank?limit=150");
    return data.results;
  }

  const { data: bankData } = useQuery({
    queryKey: ["bank"],
    queryFn: () => fetchBank(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: vaccineData } = useQuery({
    queryKey: ["vaccine"],
    queryFn: () => fetchVaccine(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const changePicture = (e) => {
    const file = e.target.files[0];
    setSelectedPicture(file);
    fileToDataUrl(file);
  };

  const changeKTP = (e) => {
    const file = e.target.files[0];
    setSelectedKTP(file);
  };

  const queryClient = useQueryClient();

  const postVacancy = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      if (selectedPicture) {
        form.append("profile_photo", selectedPicture);
      }

      if (selectedKTP) {
        form.append("e_ktp", selectedKTP);
      }

      const filteredEducations = educations.filter((item) =>
        Object.values(item).every((value) => value !== "")
      );

      const filteredWorkHistory = workHistory.filter((item) =>
        Object.values(item).every((value) => value !== "")
      );

      form.append("education", JSON.stringify(filteredEducations));
      form.append(
        "work_experience_history",
        JSON.stringify(filteredWorkHistory)
      );
      form.append("vehicle_type", JSON.stringify(selectedVehicles));
      form.append("driver_license", JSON.stringify(selectedDriverLicense));
      form.append("full_name", values.full_name);
      form.append("birth_place", values.birth_place);
      form.append("nik", values.nik);
      form.append("birth_date", values.birth_date);
      form.append("age", values.age);
      form.append("height", values.height);
      form.append("gender_id", values.gender_id);
      form.append("religion_id", values.religion_id);
      form.append("skills", values.skills);
      form.append("work_experience_id", values.work_experience_id);
      form.append("marital_status_id", values.marital_status_id);
      form.append("vaccine_id", values.vaccine_id);
      form.append("first_phone_number", values.first_phone_number);
      form.append("second_phone_number", values.second_phone_number);
      form.append("email", values.email);
      form.append("facebook", values.facebook);
      form.append("instagram", values.instagram);
      form.append("line", values.line);
      form.append("twitter", values.twitter);
      form.append("linkedin", values.linkedin);
      form.append("e_ktp_province_id", values.e_ktp_province_id);
      form.append("e_ktp_regency_id", values.e_ktp_regency_id);
      form.append("e_ktp_district_id", values.e_ktp_district_id);
      form.append("e_ktp_village_id", values.e_ktp_village_id);
      form.append("e_ktp_postal_code", values.e_ktp_postal_code);
      form.append("e_ktp_full_address", values.e_ktp_full_address);
      form.append("domicile_province_id", values.domicile_province_id);
      form.append("domicile_regency_id", values.domicile_regency_id);
      form.append("domicile_district_id", values.domicile_district_id);
      form.append("domicile_village_id", values.domicile_village_id);
      form.append("domicile_postal_code", values.domicile_postal_code);
      form.append("domicile_full_address", values.domicile_full_address);
      form.append("account_name", values.account_name);
      form.append("account_number", values.account_number);
      form.append("bank_name_id", values.bank_name_id);
      form.append("urgent_full_name", values.urgent_full_name);
      form.append("urgent_phone_number", values.urgent_phone_number);
      form.append("applicant_relationsips", values.applicant_relationsips);
      form.append("position_id", values.position_id);
      form.append("expected_salary", values.expected_salary);
      form.append("describe_yourself", values.describe_yourself);
      form.append("cv", values.cv);
      form.append("other_document", values.other_document);
      form.append("status_id", 1);
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const ktpExtensions = selectedKTP.name.split(".").pop().toLowerCase();
      const pictureExtensions = selectedPicture.name
        .split(".")
        .pop()
        .toLowerCase();

      if (selectedKTP) {
        if (!allowedExtensions.includes(ktpExtensions)) {
          toast.error("E-KTP harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Foto profil harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (cvName) {
        if (cvName.split(".").pop() !== "pdf") {
          toast.error("CV harus berupa file pdf");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (otherDocumentName) {
        if (otherDocumentName.split(".").pop() !== "pdf") {
          toast.error("Dokumen tambahan harus berupa file pdf");
          return http(token).put(`/vacancies`, form);
        }
      }
      return http(token).post("/vacancy", form);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vacancy"] });
      setLoading(false);
      toast.success("Berhasil menambah kandidat");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleInputChange = (index, field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[index][field] = value;
    setEducations(updatedEducations);
  };

  const handleWorkHistoryChange = (index, field, value) => {
    const updatedWorkHistory = [...workHistory];
    updatedWorkHistory[index][field] = value;
    setWorkHistory(updatedWorkHistory);
  };

  const validateVacancy = Yup.object({
    full_name: Yup.string().required("Harap diisi"),
    birth_place: Yup.string().required("Harap diisi"),
    nik: Yup.number().required("Harap diisi").typeError("NIK tidak valid"),
    birth_date: Yup.string().required("Harap diisi"),
    age: Yup.number().required("Harap diisi").typeError("Umur tidak valid"),
    height: Yup.number()
      .required("Harap diisi")
      .typeError("Tinggi badan tidak valid"),
    gender_id: Yup.string().required("Harap diisi"),
    religion_id: Yup.string().required("Harap diisi"),
    skills: Yup.string().required("Harap diisi"),
    company_name: Yup.string().required("Harap diisi"),
    work_history_start_date: Yup.string().required("Harap diisi"),
    work_history_end_date: Yup.string().required("Harap diisi"),
    school_name: Yup.string().required("Harap diisi"),
    education_start_date: Yup.string().required("Harap diisi"),
    education_end_date: Yup.string().required("Harap diisi"),
    work_experience_id: Yup.string().required("Harap diisi"),
    marital_status_id: Yup.string().required("Harap diisi"),
    vaccine_id: Yup.string().required("Harap diisi"),
    first_phone_number: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa angka"),
    second_phone_number: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa angka"),
    email: Yup.string()
      .email("Email tidak valid")
      .required("Harap diisi")
      .matches(/@[^.]*\./, "Email tidak valid"),
    e_ktp_province_id: Yup.string().required("Harap diisi"),
    e_ktp_district_id: Yup.string().required("Harap diisi"),
    e_ktp_regency_id: Yup.string().required("Harap diisi"),
    e_ktp_village_id: Yup.string().required("Harap diisi"),
    e_ktp_postal_code: Yup.number()
      .required("Harap diisi")
      .typeError("Kode POS tidak valid"),
    e_ktp_full_address: Yup.string().required("Harap diisi"),
    domicile_province_id: Yup.string().required("Harap diisi"),
    domicile_district_id: Yup.string().required("Harap diisi"),
    domicile_regency_id: Yup.string().required("Harap diisi"),
    domicile_village_id: Yup.string().required("Harap diisi"),
    domicile_postal_code: Yup.string().required("Harap diisi"),
    domicile_full_address: Yup.string().required("Harap diisi"),
    account_name: Yup.string().required("Harap diisi"),
    account_number: Yup.number()
      .required("Harap diisi")
      .typeError("Nomor rekening tidak valid"),
    bank_name_id: Yup.string().required("Harap diisi"),
    urgent_full_name: Yup.string().required("Harap diisi"),
    applicant_relationsips: Yup.string().required("Harap diisi"),
    urgent_phone_number: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa angka"),
    describe_yourself: Yup.string().required("Harap diisi"),
    expected_salary: Yup.string().required("Harap diisi"),
    cv: Yup.string().required("Harap diisi"),
    other_document: Yup.string().required("Harap diisi"),
  });

  const handleDeleteVacancy = useMutation({
    mutationFn: async (id) => {
      const logData = new URLSearchParams({
        user_name: currentUser.first_name,
        role_id: currentUser.role_id,
        crud_activites: "Hapus Data Karir",
      }).toString();
      await http(token).post("/user-log", logData);
      return http(token).delete(`/vacancy/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancy"] });
      toast.success("Berhasil menghapus data karir");
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  useEffect(() => {
    setSelectedData([]);
  }, []);

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] flex gap-8 h-full overflow-y-scroll">
          <div className="w-full h-screen bg-white rounded-md overflow-auto">
            <div className="flex justify-between px-10 py-10 items-center w-full h-14">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Data Laporan Karir
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (selectedData?.length >= 1) {
                      setOpenPDFModal(!openPDFModal);
                    } else {
                      toast.error("Silahkan ceklis data terlebih dahulu");
                    }
                  }}
                  className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  <FaDownload />
                  Download Laporan
                </button>
                <div>
                  <button
                    onClick={() => {
                      setOpenAddModal(!openAddModal);
                      setRegencyData([]);
                      setDistrictData([]);
                      setVillageData([]);
                      setEducations([
                        {
                          name: "",
                          school_name: "",
                          start_date: "",
                          end_date: "",
                        },
                      ]);
                      setWorkHistory([
                        { company_name: "", start_date: "", end_date: "" },
                      ]);
                      setSelectedVehicles([]);
                      setSelectedDriverLicense([]);
                      addVacancyForm?.current?.resetForm();
                      resetFile();
                    }}
                    className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                  >
                    <FaPlus />
                    Tambah Kandidat
                  </button>
                </div>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-10">No</th>
                  <th className="text-xs w-36">Nama</th>
                  <th className="text-xs w-36">Jenis Kelamin</th>
                  <th className="text-xs w-36">Email</th>
                  <th className="text-xs w-36">No Telepon</th>
                  <th className="text-xs w-36">Alamat</th>
                  <th className="text-xs w-36">Posisi yang dilamar</th>
                  <th className="text-xs w-36">Status</th>
                  <th className="text-xs w-36">Aksi</th>
                </tr>
                {data?.data?.map((item, index) => {
                  const isOddRow = index % 2 !== 0;
                  return (
                    <tr
                      className={`h-12 text-center hover:bg-[#F3F3F3] cursor-pointer ${
                        isOddRow ? "bg-[#F3F3F3]" : ""
                      }`}
                      key={item.id}
                      onClick={(items) => {
                        showDetailModal(items.id);
                        fetchVacancyById(item.id);
                      }}
                    >
                      <td className="text-xs pl-3">
                        <div
                          className="flex gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <input
                            type="checkbox"
                            className="checkbox w-4 h-4"
                            onChange={(e) => handleCheckboxChange(e, item)}
                          />
                          <div>{index + 1}</div>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex flex-col justify-center items-center">
                          <div className="overflow-hidden flex justify-center items-center">
                            <Image
                              src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1699097693/uploads/${item?.profile_photo.replace(
                                /\s/g,
                                "%20"
                              )}.png`}
                              width={100}
                              height={100}
                              className="max-w-24 max-h-10 w-auto h-auto"
                              alt=""
                              objectFit="contain"
                            ></Image>
                          </div>
                          <div className="text-xs font-bold">
                            {item?.full_name}
                          </div>
                          <div className="text-xs font-bold">
                            {item?.age} Tahun
                          </div>
                        </div>
                      </td>
                      <td className="pl-4 text-xs ">
                        <div className="flex justify-center items-center">
                          {item?.gender_id === 1 ? (
                            <IoIosMale size={25} color="green" />
                          ) : (
                            <IoIosFemale size={25} color="green" />
                          )}
                        </div>
                      </td>
                      <td className="pl-4 text-xs">{item.email}</td>
                      <td className="pl-4 text-xs">
                        {item.first_phone_number}
                      </td>
                      <td className="text-xs pl-3">
                        <div className="flex flex-col">
                          <div>{item?.e_ktp_province?.name}</div>
                          <div>{item?.e_ktp_district?.name}</div>
                        </div>
                      </td>
                      <td className="pl-4 text-xs">{item?.position?.name}</td>
                      <td className="pl-4 text-xs">
                        <div className="w-20 m-auto">
                          {item?.status?.name === "Pending" ? (
                            <div className="bg-red-500 rounded-full text-white font-bold">
                              {item?.status?.name}
                            </div>
                          ) : (
                            <div className="bg-green-500 rounded-full text-white font-bold">
                              {item?.status?.name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        className="m-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex gap-3 justify-center items-center">
                          <div className="flex gap-3 justify-center items-center">
                            <button
                              onClick={() => {
                                showUpdateModal(item?.id);
                                fetchVacancyById(item?.id);
                                fetchRegencyById(item?.e_ktp_province_id);
                                fetchDistrictById(item?.e_ktp_regency_id);
                                fetchVillageById(item?.e_ktp_district_id);
                                fetchDomicileRegencyById(
                                  item?.domicile_province_id
                                );
                                fetchDomicileDistrictById(
                                  item?.domicile_regency_id
                                );
                                fetchDomicileVillageById(
                                  item?.domicile_district_id
                                );
                              }}
                              type="button"
                              className="cursor-pointer text-xs bg-orange-500 text-white rounded-md p-1 flex items-center gap-2"
                            >
                              <FaPencil size={10} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenUpdate(!openUpdate);
                                setVacancyId(item.id);
                              }}
                              className="cursor-pointer text-xs bg-green-500 text-white rounded-md p-1 flex items-center gap-2"
                            >
                              <FaPencil size={10} />
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpen(!open);
                                setDeletedData(item.id);
                              }}
                              className="cursor-pointer text-xs bg-red-500 text-white rounded-md p-1 flex items-center gap-2"
                            >
                              <FaTrash size={10} />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </table>
              {data?.data?.length === 0 && (
                <div className="w-full pt-5 text-xl flex justify-center items-center">
                  <div>No data found</div>
                </div>
              )}
            </div>
            <div className="w-full flex justify-between py-20 px-10">
              <div className="text-sm">
                Show {data?.currentPage} of {data?.totalPages} entries
              </div>
              <div className="flex">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={data?.currentPage <= 1}
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
                  disabled={data?.currentPage === data?.totalPages}
                  onClick={() => {
                    setPage((old) => old + 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
      <input
        type="checkbox"
        id="download_pdf"
        className="modal-toggle"
        checked={openPDFModal}
      />
      <div className="modal">
        <div className="modal-box">
          <div className="text-xl font-bold pb-10">Download Laporan</div>
          {isClient && (
            <div className="flex gap-8">
              <ExportToExcel />
              <div>
                <PDFDownloadLink
                  document={<MyDocument data={selectedData} />}
                  fileName="report.pdf"
                  className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Loading document..." : "Download PDF"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          )}
          <div className="w-full flex justify-end">
            <button
              onClick={() => setOpenPDFModal(!openPDFModal)}
              className="bg-red-500 max-w-xs cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2 mt-10"
            >
              Batal
            </button>
          </div>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addModal"
          onClick={() => {
            setOpenPDFModal(!openPDFModal);
          }}
        >
          Close
        </label>
      </div>
      <input
        type="checkbox"
        id="addModal"
        className="modal-toggle"
        checked={openAddModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Tambah Kandidat</h3>
          <Formik
            initialValues={{
              full_name: "",
              birth_place: "",
              nik: "",
              birth_date: "",
              age: "",
              gender_id: "",
              religion_id: "",
              skills: "",
              work_experience_id: "",
              marital_status_id: "",
              vaccine_id: "",
              first_phone_number: "",
              second_phone_number: "",
              email: "",
              facebook: "",
              instagram: "",
              line: "",
              twitter: "",
              linkedin: "",
              e_ktp_province_id: "",
              e_ktp_district_id: "",
              e_ktp_regency_id: "",
              e_ktp_village_id: "",
              e_ktp_postal_code: "",
              e_ktp_full_address: "",
              domicile_province_id: "",
              domicile_district_id: "",
              domicile_regency_id: "",
              domicile_village_id: "",
              domicile_postal_code: "",
              domicile_full_address: "",
              account_name: "",
              account_number: "",
              bank_name_id: "",
              urgent_full_name: "",
              applicant_relationsips: "",
              urgent_phone_number: "",
              describe_yourself: "",
              expected_salary: "",
              position_id: "",
              cv: "",
              other_document: "",
            }}
            onSubmit={(values) => {
              setOpenAddModal(!openAddModal);
              postVacancy.mutate(values);
              setLoading(true);
            }}
            validationSchema={validateVacancy}
            innerRef={addVacancyForm}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Foto Profil :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full profilephoto"
                        onChange={changePicture}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">E-KTP :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full ektp"
                        onChange={changeKTP}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap :</div>
                      <input
                        type="text"
                        name="full_name"
                        placeholder="Masukkan Nama Lengkap"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.full_name && touched.full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tempat Lahir :</div>
                      <input
                        type="text"
                        name="birth_place"
                        placeholder="Masukkan Tempat Lahir"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.birth_place}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.birth_place && touched.birth_place && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_place}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIK :</div>
                      <input
                        type="number"
                        name="nik"
                        placeholder="Masukkan NIK"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nik}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.nik && touched.nik && (
                        <div className="text-red-500 pt-2">{errors.nik}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tanggal Lahir :</div>
                      <input
                        type="date"
                        name="birth_date"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.birth_date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.birth_date && touched.birth_date && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_date}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="number"
                        name="age"
                        placeholder="Masukkan Umur"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500 pt-2">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tinggi Badan :</div>
                      <input
                        type="number"
                        name="height"
                        placeholder="Masukkan Tinggi Badan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.height}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.height && touched.height && (
                        <div className="text-red-500 pt-2">{errors.height}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin:</div>
                      <Field
                        as="select"
                        name="gender_id"
                        onChange={(e) => {
                          setFieldValue("gender_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih jenis kelamin
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
                        <div className="text-red-500 pt-2">
                          {errors.gender_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Agama :</div>
                      <Field
                        as="select"
                        name="religion_id"
                        onChange={(e) => {
                          setFieldValue("religion_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih agama
                        </option>
                        {religionData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.religion_id && touched.religion_id && (
                        <div className="text-red-500 pt-2">
                          {errors.religion_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kemampuan :</div>
                      <input
                        type="text"
                        name="skills"
                        placeholder="Masukkan Kemampuan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.skills}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.skills && touched.skills && (
                        <div className="text-red-500 pt-2">{errors.skills}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Pengalaman Kerja :</div>
                      <Field
                        as="select"
                        name="work_experience_id"
                        onChange={(e) => {
                          setFieldValue("work_experience_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih pengalaman kerja
                        </option>
                        {workExperienceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.work_experience_id &&
                        touched.work_experience_id && (
                          <div className="text-red-500 pt-2">
                            {errors.work_experience_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="flex w-full justify-between">
                        <div className="text-sm pb-2">Pendidikan :</div>
                        {educations.length >= 1 && (
                          <button
                            className="btn btn-primary normal-case text-white"
                            type="button"
                            onClick={() => {
                              addEducation();
                            }}
                          >
                            <FaPlus />
                          </button>
                        )}
                      </div>
                      {educations?.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center w-full"
                        >
                          <div className="flex w-full gap-5 flex-col">
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Jenjang :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <select
                                name="name"
                                onBlur={handleBlur}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                              >
                                <option disabled selected>
                                  Pilih pendidikan?
                                </option>
                                {educationsData?.data?.map((item) => {
                                  return (
                                    <option key={item.id}>{item.name}</option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Nama Sekolah :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="text"
                                placeholder="Masukkan nama sekolah"
                                name="school_name"
                                value={educations.school_name}
                                onBlur={handleBlur}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "school_name",
                                    e.target.value
                                  );
                                  setFieldValue("school_name", e.target.value);
                                }}
                              />
                              {errors.school_name && touched.school_name && (
                                <div className="text-sm text-red-500">
                                  {errors.school_name}
                                </div>
                              )}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Tahun Mulai :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="date"
                                placeholder="Type here"
                                name="education_start_date"
                                value={educations.start_date}
                                onBlur={handleBlur}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "start_date",
                                    e.target.value
                                  );
                                  setFieldValue(
                                    "education_start_date",
                                    e.target.value
                                  );
                                }}
                              />
                              {errors.education_start_date &&
                                touched.education_start_date && (
                                  <div className="text-sm text-red-500">
                                    {errors.education_start_date}
                                  </div>
                                )}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Tahun Lulus :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="date"
                                placeholder="Type here"
                                name="education_end_date"
                                onBlur={handleBlur}
                                value={educations.end_date}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "end_date",
                                    e.target.value
                                  );
                                  setFieldValue(
                                    "education_end_date",
                                    e.target.value
                                  );
                                }}
                              />
                              {errors.education_end_date &&
                                touched.education_end_date && (
                                  <div className="text-sm text-red-500">
                                    {errors.education_end_date}
                                  </div>
                                )}
                            </div>
                            {index === 0 && (
                              <div type="button" className="w-52"></div>
                            )}
                            {index > 0 && (
                              <button
                                type="button"
                                className="btn btn-primary normal-case text-white"
                                onClick={() => deleteEducation(index)}
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex w-full justify-between">
                        <div className="text-sm pb-2">
                          Riwayat Pengalaman Kerja :
                        </div>
                        {workHistory.length >= 1 && (
                          <button
                            className="btn btn-primary normal-case text-white"
                            type="button"
                            onClick={() => {
                              addWorkHistory();
                            }}
                          >
                            <FaPlus />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col pr-5">
                        <div className="flex">
                          <div className="flex flex-col w-full">
                            {workHistory?.map((item, index) => {
                              return (
                                <div
                                  className="w-full flex flex-col gap-5"
                                  key={index}
                                >
                                  <div className="pt-5">
                                    <div className="text-sm pb-2">
                                      Nama Perusahaan :{" "}
                                      <span className="text-red-500 font-bold">
                                        *
                                      </span>
                                    </div>
                                    <div className="w-full">
                                      <textarea
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Masukkan nama perusahaan"
                                        name="company_name"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                          handleWorkHistoryChange(
                                            index,
                                            "company_name",
                                            e.target.value
                                          );
                                          setFieldValue(
                                            "company_name",
                                            e.target.value
                                          );
                                        }}
                                      ></textarea>
                                      {errors.company_name &&
                                        touched.company_name && (
                                          <div className="text-sm text-red-500">
                                            {errors.company_name}
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex gap-5 flex-col">
                                      <div className="w-full flex flex-col">
                                        <div className="text-sm pb-2">
                                          Waktu Mulai :{" "}
                                          <span className="text-red-500 font-bold">
                                            *
                                          </span>
                                        </div>
                                        <input
                                          type="date"
                                          placeholder="Type here"
                                          name="work_history_start_date"
                                          onBlur={handleBlur}
                                          value={item.start_date}
                                          className="input input-bordered w-full"
                                          onChange={(e) => {
                                            handleWorkHistoryChange(
                                              index,
                                              "start_date",
                                              e.target.value
                                            );
                                            setFieldValue(
                                              "work_history_start_date",
                                              e.target.value
                                            );
                                          }}
                                        />
                                        {errors.work_history_start_date &&
                                          touched.work_history_start_date && (
                                            <div className="text-sm text-red-500">
                                              {errors.work_history_start_date}
                                            </div>
                                          )}
                                      </div>
                                      <div className="w-full flex flex-col">
                                        <div className="text-sm pb-2">
                                          Waktu Akhir :{" "}
                                          <span className="text-red-500 font-bold">
                                            *
                                          </span>
                                        </div>
                                        <input
                                          type="date"
                                          placeholder="Type here"
                                          name="work_history_end_date"
                                          onBlur={handleBlur}
                                          value={item.end_date}
                                          className="input input-bordered w-full"
                                          onChange={(e) => {
                                            handleWorkHistoryChange(
                                              index,
                                              "end_date",
                                              e.target.value
                                            );
                                            setFieldValue(
                                              "work_history_end_date",
                                              e.target.value
                                            );
                                          }}
                                        />
                                        {errors.work_history_end_date &&
                                          touched.work_history_end_date && (
                                            <div className="text-sm text-red-500">
                                              {errors.work_history_end_date}
                                            </div>
                                          )}
                                      </div>
                                      {index > 0 && (
                                        <button
                                          type="button"
                                          className="btn btn-primary normal-case text-white"
                                          onClick={() =>
                                            deleteWorkHistory(index)
                                          }
                                        >
                                          <FaTrash />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Status Pernikahan :</div>
                      <Field
                        as="select"
                        name="marital_status_id"
                        onChange={(e) => {
                          setFieldValue("marital_status_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih status pernikahan
                        </option>
                        {maritalStatusData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.marital_status_id &&
                        touched.marital_status_id && (
                          <div className="text-red-500 pt-2">
                            {errors.marital_status_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kendaraan yang dimiliki :
                      </div>
                      <Select
                        isMulti
                        onChange={(e) => {
                          const selectedVehicles = e.map((item) => ({
                            name: item.value,
                          }));
                          setSelectedVehicles(selectedVehicles);
                        }}
                        components={{
                          DropdownIndicator: customDropdownIndicator,
                          IndicatorSeparator: () => null,
                        }}
                        placeholder="Silahkan pilih jenis kendaraan"
                        className="text-sm focus:outline-none focus:border-black"
                        options={vehicleTypeData?.data?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        styles={customStyles}
                      />
                    </div>
                    <div>
                      <div className="text-sm pb-2">SIM yang dimiliki :</div>
                      <Select
                        isMulti
                        onChange={(e) => {
                          const selectedDriverLicense = e.map((item) => ({
                            name: item.value,
                          }));
                          setSelectedDriverLicense(selectedDriverLicense);
                        }}
                        components={{
                          DropdownIndicator: customDropdownIndicator,
                          IndicatorSeparator: () => null,
                        }}
                        placeholder="Silahkan pilih SIM yang dimiliki"
                        className="text-sm focus:outline-none focus:border-black"
                        options={driverLicenseData?.data?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        styles={customStyles}
                      />
                    </div>
                    <div>
                      <div className="text-sm pb-2">Vaksin :</div>
                      <Field
                        as="select"
                        name="vaccine_id"
                        onChange={(e) => {
                          setFieldValue("vaccine_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih vaksin
                        </option>

                        {vaccineData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.vaccine_id && touched.vaccine_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vaccine_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Pertama :
                      </div>
                      <input
                        type="number"
                        name="first_phone_number"
                        placeholder="Masukkan nomor telepon pertama"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.first_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.first_phone_number &&
                        touched.first_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.first_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon Kedua :</div>
                      <input
                        type="number"
                        name="second_phone_number"
                        placeholder="Masukkan nomor telepon kedua"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.second_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.second_phone_number &&
                        touched.second_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.second_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        placeholder="Masukkan email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500 pt-2">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Facebook :</div>
                      <input
                        type="text"
                        name="facebook"
                        placeholder="Masukkan Facebook"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.facebook}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.facebook && touched.facebook && (
                        <div className="text-red-500 pt-2">
                          {errors.facebook}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Instagram :</div>
                      <input
                        type="text"
                        name="instagram"
                        placeholder="Masukkan Instagram"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.instagram}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.instagram && touched.instagram && (
                        <div className="text-red-500 pt-2">
                          {errors.instagram}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Line :</div>
                      <input
                        type="text"
                        name="line"
                        placeholder="Masukkan Line"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.line}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.line && touched.line && (
                        <div className="text-red-500 pt-2">{errors.line}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Twitter :</div>
                      <input
                        type="text"
                        name="twitter"
                        placeholder="Masukkan Twitter"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.twitter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.twitter && touched.twitter && (
                        <div className="text-red-500 pt-2">
                          {errors.twitter}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">LinkedIn :</div>
                      <input
                        type="text"
                        name="linkedin"
                        placeholder="Masukkan LinkedIn"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.linkedin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.linkedin && touched.linkedin && (
                        <div className="text-red-500 pt-2">
                          {errors.linkedin}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_province_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_province_id", e.target.value);
                          fetchRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi sesuai E-KTP
                        </option>

                        {provinceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_province_id &&
                        touched.e_ktp_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_regency_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_regency_id", e.target.value);
                          fetchDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={regencyValue.length < 1}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kabupaten sesuai E-KTP
                        </option>
                        {regencyValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_regency_id && touched.e_ktp_regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_district_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_district_id", e.target.value);
                          fetchVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={districtValue.length < 1}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kecamatan Sesuai E-KTP
                        </option>

                        {districtValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_district_id &&
                        touched.e_ktp_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_village_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={villageValue.length < 1}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kelurahan sesuai E-KTP
                        </option>
                        {villageValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_village_id && touched.e_ktp_village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="number"
                        name="e_ktp_postal_code"
                        placeholder="Masukkan Kode POS"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.e_ktp_postal_code &&
                        touched.e_ktp_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <input
                        type="text"
                        placeholder="Masukkan Alamat Lengkap"
                        name="e_ktp_full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.e_ktp_full_address &&
                        touched.e_ktp_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_province_id"
                        onChange={(e) => {
                          setFieldValue("domicile_province_id", e.target.value);
                          fetchDomicileRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi sesuai domisili
                        </option>
                        {provinceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_province_id &&
                        touched.domicile_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_regency_id"
                        onChange={(e) => {
                          setFieldValue("domicile_regency_id", e.target.value);
                          fetchDomicileDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={domicileRegencyValue.length < 1}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kabupaten sesuai domisili
                        </option>
                        {domicileRegencyValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_regency_id &&
                        touched.domicile_regency_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_regency_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_district_id"
                        onChange={(e) => {
                          setFieldValue("domicile_district_id", e.target.value);
                          fetchDomicileVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={domicileDistrictValue.length < 1}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kecamatan sesuai domisili
                        </option>

                        {domicileDistrictValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_district_id &&
                        touched.domicile_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_village_id"
                        onChange={(e) => {
                          setFieldValue("domicile_village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={domicileVillageValue.length < 1}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kelurahan sesuai domisili
                        </option>

                        {domicileVillageValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_village_id &&
                        touched.domicile_village_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_village_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kode Pos sesuai Domisili :
                      </div>
                      <input
                        type="number"
                        name="domicile_postal_code"
                        placeholder="Masukkan Kode POS sesuai domisili"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.domicile_postal_code &&
                        touched.domicile_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Alamat Lengkap sesuai Domisili :
                      </div>
                      <textarea
                        name="domicile_full_address"
                        placeholder="Masukkan Alamat Lengkap"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.domicile_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.domicile_full_address &&
                        touched.domicile_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nama Pemilik Rekening :
                      </div>
                      <input
                        type="text"
                        name="account_name"
                        placeholder="Masukkan Nama Pemilik Rekening"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.account_name && touched.account_name && (
                        <div className="text-red-500 pt-2">
                          {errors.account_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Rekening :</div>
                      <input
                        type="number"
                        placeholder="Masukkan Nomor Rekening"
                        name="account_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.account_number && touched.account_number && (
                        <div className="text-red-500 pt-2">
                          {errors.account_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Bank :</div>
                      <Field
                        as="select"
                        name="bank_name_id"
                        onChange={(e) => {
                          setFieldValue("bank_name_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih nama bank
                        </option>
                        {bankData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.bank_name_id && touched.bank_name_id && (
                        <div className="text-red-500 pt-2">
                          {errors.bank_name_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap Darurat:</div>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap darurat"
                        name="urgent_full_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.urgent_full_name && touched.urgent_full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.urgent_full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Darurat :
                      </div>
                      <input
                        type="number"
                        placeholder="Masukkan Nomor Telepon Darurat"
                        name="urgent_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.urgent_phone_number &&
                        touched.urgent_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.urgent_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Hubungan dengan pelamar :
                      </div>
                      <input
                        type="text"
                        placeholder="Masukkan hubungan dengan pelamar"
                        name="applicant_relationsips"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.applicant_relationsips}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.applicant_relationsips &&
                        touched.applicant_relationsips && (
                          <div className="text-red-500 pt-2">
                            {errors.applicant_relationsips}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Tentang Diri Anda :
                      </div>
                      <textarea
                        name="describe_yourself"
                        placeholder="Jelaskan tentang diri anda"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.describe_yourself}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.describe_yourself &&
                        touched.describe_yourself && (
                          <div className="text-red-500 pt-2">
                            {errors.describe_yourself}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi yang dilamar :</div>
                      <Field
                        as="select"
                        name="position_id"
                        onChange={(e) => {
                          setFieldValue("position_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih posisi pekerjaan
                        </option>
                        {positionOfWork?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.position_id && touched.position_id && (
                        <div className="text-red-500 pt-2">
                          {errors.position_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Gaji yang diharapkan :</div>
                      <NumericFormat
                        placeholder="Gaji yang diharapkan"
                        value={values.expected_salary}
                        onChange={(e) => {
                          setFieldValue("expected_salary", e.target.value);
                        }}
                        onBlur={handleBlur}
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        allowNegative={false}
                        prefix="Rp"
                        thousandsGroupStyle="rupiah"
                        thousandSeparator=","
                      />
                      {errors.expected_salary && touched.expected_salary && (
                        <div className="text-red-500 pt-2">
                          {errors.expected_salary}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tambah CV :</div>
                      <input
                        type="file"
                        accept=".pdf"
                        className="file file-input bordered cvvalue"
                        onChange={(event) => {
                          setFieldValue("cv", event.target.files[0]);
                          setCvName(event.target.files[0].name);
                        }}
                      />
                      {errors.cv && touched.cv && (
                        <div className="text-red-500 pt-2">{errors.cv}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tambah Dokumen :</div>
                      <input
                        type="file"
                        accept=".pdf"
                        className="file file-input bordered otherdocument"
                        onChange={(event) => {
                          setFieldValue(
                            "other_document",
                            event.target.files[0]
                          );
                          setOtherDocumentName(event.target.files[0].name);
                        }}
                      />
                      {errors.other_document && touched.other_document && (
                        <div className="text-red-500 pt-2">
                          {errors.other_document}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full pt-5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setOpenAddModal(!openAddModal)}
                      className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addModal"
          onClick={() => {
            setOpenAddModal(!openAddModal);
          }}
        >
          Close
        </label>
      </div>
      <input
        type="checkbox"
        id="detailModal"
        className="modal-toggle"
        checked={openEditModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Edit Kandidat</h3>
          <Formik
            initialValues={{
              full_name: vacancyValue?.full_name,
              birth_place: vacancyValue?.birth_place,
              nik: vacancyValue?.nik,
              birth_date: vacancyValue?.birth_date,
              age: vacancyValue?.age,
              height: vacancyValue?.height,
              gender_id: vacancyValue?.gender?.id,
              religion_id: vacancyValue?.religion?.id,
              skills: vacancyValue?.skills,
              work_experience_id: vacancyValue?.work_experience?.id,
              marital_status_id: vacancyValue?.marital_status?.id,
              vaccine_id: vacancyValue?.vaccine?.id,
              first_phone_number: vacancyValue?.first_phone_number,
              second_phone_number: vacancyValue?.second_phone_number,
              email: vacancyValue?.email,
              facebook: vacancyValue?.facebook,
              instagram: vacancyValue?.instagram,
              line: vacancyValue?.line,
              twitter: vacancyValue?.twitter,
              linkedin: vacancyValue?.linkedin,
              e_ktp_province_id: vacancyValue?.e_ktp_province?.id,
              e_ktp_district_id: vacancyValue?.e_ktp_district?.id,
              e_ktp_regency_id: vacancyValue?.e_ktp_regency?.id,
              e_ktp_village_id: vacancyValue?.e_ktp_village?.id,
              e_ktp_postal_code: vacancyValue?.e_ktp_postal_code,
              e_ktp_full_address: vacancyValue?.e_ktp_full_address,
              domicile_province_id: vacancyValue?.domicile_province?.id,
              domicile_district_id: vacancyValue?.domicile_district?.id,
              domicile_regency_id: vacancyValue?.domicile_regency?.id,
              domicile_village_id: vacancyValue?.domicile_village?.id,
              domicile_postal_code: vacancyValue?.domicile_postal_code,
              domicile_full_address: vacancyValue?.domicile_full_address,
              account_name: vacancyValue?.account_name,
              account_number: vacancyValue?.account_number,
              bank_name_id: vacancyValue?.bank?.id,
              urgent_full_name: vacancyValue?.urgent_full_name,
              applicant_relationsips: vacancyValue?.applicant_relationsips,
              position_id: vacancyValue?.position?.id,
              urgent_phone_number: vacancyValue?.urgent_phone_number,
              describe_yourself: vacancyValue?.describe_yourself,
              expected_salary: vacancyValue?.expected_salary,
              cv: vacancyValue?.cv,
              other_document: vacancyValue?.other_document,
            }}
            innerRef={vacancyForm}
            enableReinitialize={true}
            onSubmit={(values) => {
              setLoading(true);
              setOpenEditModal(!openEditModal);
              updateVacancy.mutate(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              setFieldValue,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Foto Profil :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full"
                        onChange={changePicture}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">E-KTP :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full"
                        onChange={changeKTP}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap :</div>
                      <input
                        type="text"
                        name="full_name"
                        placeholder="Masukkan Nama Lengkap"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.full_name && touched.full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tempat Lahir :</div>
                      <input
                        type="text"
                        name="birth_place"
                        placeholder="Masukkan Tempat Lahir"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.birth_place}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.birth_place && touched.birth_place && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_place}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIK :</div>
                      <input
                        type="number"
                        name="nik"
                        placeholder="Masukkan NIK"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nik}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.nik && touched.nik && (
                        <div className="text-red-500 pt-2">{errors.nik}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tanggal Lahir :</div>
                      <input
                        type="date"
                        name="birth_date"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={dayjs(values.birth_date).format("YYYY-DD-MM")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.birth_date && touched.birth_date && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_date}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="number"
                        name="age"
                        placeholder="Masukkan Umur"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500 pt-2">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tinggi Badan :</div>
                      <input
                        type="number"
                        name="height"
                        placeholder="Masukkan Tinggi Badan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.height}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.height && touched.height && (
                        <div className="text-red-500 pt-2">{errors.height}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin:</div>
                      <Field
                        as="select"
                        name="gender_id"
                        onChange={(e) => {
                          setFieldValue("gender_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih jenis kelamin
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
                        <div className="text-red-500 pt-2">
                          {errors.gender_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Agama :</div>
                      <Field
                        as="select"
                        name="religion_id"
                        onChange={(e) => {
                          setFieldValue("religion_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih agama
                        </option>
                        {religionData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.religion_id && touched.religion_id && (
                        <div className="text-red-500 pt-2">
                          {errors.religion_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kemampuan :</div>
                      <input
                        type="text"
                        name="skills"
                        placeholder="Masukkan Kemampuan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.skills}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.skills && touched.skills && (
                        <div className="text-red-500 pt-2">{errors.skills}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Pengalaman Kerja :</div>
                      <Field
                        as="select"
                        name="work_experience_id"
                        onChange={(e) => {
                          setFieldValue("work_experience_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih pengalaman kerja
                        </option>
                        {workExperienceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.work_experience_id &&
                        touched.work_experience_id && (
                          <div className="text-red-500 pt-2">
                            {errors.work_experience_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="flex w-full justify-between">
                        <div className="text-sm pb-2">Pendidikan :</div>
                        <button
                          className="btn btn-primary normal-case text-white"
                          type="button"
                          onClick={() => {
                            addEducation();
                          }}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      {educations?.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center w-full"
                        >
                          <div className="flex w-full gap-5 flex-col">
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Jenjang :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <select
                                name="name"
                                onBlur={handleBlur}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                              >
                                <option disabled selected>
                                  Pilih pendidikan?
                                </option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                              </select>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Nama Sekolah :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="text"
                                placeholder="Masukkan nama sekolah"
                                name="school_name"
                                value={item.school_name}
                                onBlur={handleBlur}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "school_name",
                                    e.target.value
                                  );
                                  setFieldValue("school_name", e.target.value);
                                }}
                              />
                              {errors.school_name && touched.school_name && (
                                <div className="text-sm text-red-500">
                                  {errors.school_name}
                                </div>
                              )}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Tahun Mulai :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="date"
                                placeholder="Type here"
                                name="education_start_date"
                                value={item.start_date}
                                onBlur={handleBlur}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "start_date",
                                    e.target.value
                                  );
                                  setFieldValue(
                                    "education_start_date",
                                    e.target.value
                                  );
                                }}
                              />
                              {errors.education_start_date &&
                                touched.education_start_date && (
                                  <div className="text-sm text-red-500">
                                    {errors.education_start_date}
                                  </div>
                                )}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Tahun Lulus :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="date"
                                placeholder="Type here"
                                name="education_end_date"
                                onBlur={handleBlur}
                                value={item.end_date}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "end_date",
                                    e.target.value
                                  );
                                  setFieldValue(
                                    "education_end_date",
                                    e.target.value
                                  );
                                }}
                              />
                              {errors.education_end_date &&
                                touched.education_end_date && (
                                  <div className="text-sm text-red-500">
                                    {errors.education_end_date}
                                  </div>
                                )}
                            </div>
                            {index === 0 && (
                              <div type="button" className="w-52"></div>
                            )}

                            <button
                              type="button"
                              className="btn btn-primary normal-case text-white"
                              onClick={() => deleteEducation(index)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex w-full justify-between">
                        <div className="text-sm pb-2">
                          Riwayat Pengalaman Kerja :
                        </div>
                        <button
                          className="btn btn-primary normal-case text-white"
                          type="button"
                          onClick={() => {
                            addWorkHistory();
                          }}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <div className="flex flex-col pr-5">
                        <div className="flex">
                          <div className="flex flex-col w-full">
                            {workHistory?.map((item, index) => {
                              return (
                                <div
                                  className="w-full flex flex-col gap-5"
                                  key={index}
                                >
                                  <div className="pt-5">
                                    <div className="text-sm pb-2">
                                      Nama Perusahaan :{" "}
                                      <span className="text-red-500 font-bold">
                                        *
                                      </span>
                                    </div>
                                    <div className="w-full">
                                      <textarea
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Masukkan nama perusahaan"
                                        value={item.company_name}
                                        name="company_name"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                          handleWorkHistoryChange(
                                            index,
                                            "company_name",
                                            e.target.value
                                          );
                                          setFieldValue(
                                            "company_name",
                                            e.target.value
                                          );
                                        }}
                                      ></textarea>
                                      {errors.company_name &&
                                        touched.company_name && (
                                          <div className="text-sm text-red-500">
                                            {errors.company_name}
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex gap-5 flex-col">
                                      <div className="w-full flex flex-col">
                                        <div className="text-sm pb-2">
                                          Waktu Mulai :{" "}
                                          <span className="text-red-500 font-bold">
                                            *
                                          </span>
                                        </div>
                                        <input
                                          type="date"
                                          placeholder="Type here"
                                          name="work_history_start_date"
                                          onBlur={handleBlur}
                                          value={item.start_date}
                                          className="input input-bordered w-full"
                                          onChange={(e) => {
                                            handleWorkHistoryChange(
                                              index,
                                              "start_date",
                                              e.target.value
                                            );
                                            setFieldValue(
                                              "work_history_start_date",
                                              e.target.value
                                            );
                                          }}
                                        />
                                        {errors.work_history_start_date &&
                                          touched.work_history_start_date && (
                                            <div className="text-sm text-red-500">
                                              {errors.work_history_start_date}
                                            </div>
                                          )}
                                      </div>
                                      <div className="w-full flex flex-col">
                                        <div className="text-sm pb-2">
                                          Waktu Akhir :{" "}
                                          <span className="text-red-500 font-bold">
                                            *
                                          </span>
                                        </div>
                                        <input
                                          type="date"
                                          placeholder="Type here"
                                          name="work_history_end_date"
                                          onBlur={handleBlur}
                                          value={item.end_date}
                                          className="input input-bordered w-full"
                                          onChange={(e) => {
                                            handleWorkHistoryChange(
                                              index,
                                              "end_date",
                                              e.target.value
                                            );
                                            setFieldValue(
                                              "work_history_end_date",
                                              e.target.value
                                            );
                                          }}
                                        />
                                        {errors.work_history_end_date &&
                                          touched.work_history_end_date && (
                                            <div className="text-sm text-red-500">
                                              {errors.work_history_end_date}
                                            </div>
                                          )}
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-primary normal-case text-white"
                                        onClick={() => deleteWorkHistory(index)}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Status Pernikahan :</div>
                      <Field
                        as="select"
                        name="marital_status_id"
                        onChange={(e) => {
                          setFieldValue("marital_status_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih status pernikahan
                        </option>
                        {maritalStatusData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.marital_status_id &&
                        touched.marital_status_id && (
                          <div className="text-red-500 pt-2">
                            {errors.marital_status_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kendaraan yang dimiliki :
                      </div>
                      <Select
                        isMulti
                        onChange={(e) => {
                          const selectedVehicles = e.map((item) => ({
                            name: item.value,
                          }));
                          setSelectedVehicles(selectedVehicles);
                        }}
                        value={selectedVehicles?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        components={{
                          DropdownIndicator: customDropdownIndicator,
                          IndicatorSeparator: () => null,
                        }}
                        placeholder="Silahkan pilih jenis kendaraan"
                        className="text-sm focus:outline-none focus:border-black"
                        options={vehicleTypeData?.data?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        styles={customStyles}
                      />
                      {errors.vehicle_type_id && touched.vehicle_type_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vehicle_type_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">SIM yang dimiliki :</div>
                      <Select
                        isMulti
                        onChange={(e) => {
                          const selectedDriverLicense = e.map((item) => ({
                            name: item.value,
                          }));
                          setSelectedDriverLicense(selectedDriverLicense);
                        }}
                        value={selectedDriverLicense.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        components={{
                          DropdownIndicator: customDropdownIndicator,
                          IndicatorSeparator: () => null,
                        }}
                        placeholder="Silahkan pilih SIM yang dimiliki"
                        className="text-sm focus:outline-none focus:border-black"
                        options={driverLicenseData?.data?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        styles={customStyles}
                      />
                      {errors.driver_license_id &&
                        touched.driver_license_id && (
                          <div className="text-red-500 pt-2">
                            {errors.driver_license_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Vaksin :</div>
                      <Field
                        as="select"
                        name="vaccine_id"
                        onChange={(e) => {
                          setFieldValue("vaccine_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih vaksin
                        </option>

                        {vaccineData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.vaccine_id && touched.vaccine_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vaccine_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Pertama :
                      </div>
                      <input
                        type="number"
                        name="first_phone_number"
                        placeholder="Masukkan nomor telepon pertama"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.first_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.first_phone_number &&
                        touched.first_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.first_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon Kedua :</div>
                      <input
                        type="number"
                        name="second_phone_number"
                        placeholder="Masukkan nomor telepon kedua"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.second_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.second_phone_number &&
                        touched.second_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.second_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        placeholder="Masukkan email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500 pt-2">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Facebook :</div>
                      <input
                        type="text"
                        name="facebook"
                        placeholder="Masukkan Facebook"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.facebook}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.facebook && touched.facebook && (
                        <div className="text-red-500 pt-2">
                          {errors.facebook}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Instagram :</div>
                      <input
                        type="text"
                        name="instagram"
                        placeholder="Masukkan Instagram"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.instagram}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.instagram && touched.instagram && (
                        <div className="text-red-500 pt-2">
                          {errors.instagram}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Line :</div>
                      <input
                        type="text"
                        name="line"
                        placeholder="Masukkan Line"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.line}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.line && touched.line && (
                        <div className="text-red-500 pt-2">{errors.line}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Twitter :</div>
                      <input
                        type="text"
                        name="twitter"
                        placeholder="Masukkan Twitter"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.twitter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.twitter && touched.twitter && (
                        <div className="text-red-500 pt-2">
                          {errors.twitter}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">LinkedIn :</div>
                      <input
                        type="text"
                        name="linkedin"
                        placeholder="Masukkan LinkedIn"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.linkedin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.linkedin && touched.linkedin && (
                        <div className="text-red-500 pt-2">
                          {errors.linkedin}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_province_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_province_id", e.target.value);
                          fetchRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi sesuai E-KTP
                        </option>
                        {provinceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_province_id &&
                        touched.e_ktp_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_regency_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_regency_id", e.target.value);
                          fetchDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kabupaten sesuai E-KTP
                        </option>
                        {regencyValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_regency_id && touched.e_ktp_regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_district_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_district_id", e.target.value);
                          fetchVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kecamatan Sesuai E-KTP
                        </option>

                        {districtValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_district_id &&
                        touched.e_ktp_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_village_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kelurahan sesuai E-KTP
                        </option>
                        {villageValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_village_id && touched.e_ktp_village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="number"
                        name="e_ktp_postal_code"
                        placeholder="Masukkan Kode POS"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.e_ktp_postal_code &&
                        touched.e_ktp_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <input
                        type="text"
                        placeholder="Masukkan Alamat Lengkap"
                        name="e_ktp_full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.e_ktp_full_address &&
                        touched.e_ktp_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_province_id"
                        onChange={(e) => {
                          setFieldValue("domicile_province_id", e.target.value);
                          fetchDomicileRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi sesuai domisili
                        </option>
                        {provinceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_province_id &&
                        touched.domicile_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_regency_id"
                        onChange={(e) => {
                          setFieldValue("domicile_regency_id", e.target.value);
                          fetchDomicileDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kabupaten sesuai domisili
                        </option>
                        {domicileRegencyValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_regency_id &&
                        touched.domicile_regency_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_regency_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_district_id"
                        onChange={(e) => {
                          setFieldValue("domicile_district_id", e.target.value);
                          fetchDomicileVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kecamatan sesuai domisili
                        </option>

                        {domicileDistrictValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_district_id &&
                        touched.domicile_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_village_id"
                        onChange={(e) => {
                          setFieldValue("domicile_village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kelurahan sesuai domisili
                        </option>

                        {domicileVillageValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_village_id &&
                        touched.domicile_village_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_village_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kode Pos sesuai Domisili :
                      </div>
                      <textarea
                        name="domicile_postal_code"
                        placeholder="Masukkan Kode POS sesuai domisili"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.domicile_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.domicile_postal_code &&
                        touched.domicile_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Alamat Lengkap sesuai Domisili :
                      </div>
                      <textarea
                        name="domicile_full_address"
                        placeholder="Masukkan Alamat Lengkap"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.domicile_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.domicile_full_address &&
                        touched.domicile_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nama Pemilik Rekening :
                      </div>
                      <input
                        type="text"
                        name="account_name"
                        placeholder="Masukkan Nama Pemilik Rekening"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.account_name && touched.account_name && (
                        <div className="text-red-500 pt-2">
                          {errors.account_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Rekening :</div>
                      <input
                        type="number"
                        placeholder="Masukkan Nomor Rekening"
                        name="account_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.account_number && touched.account_number && (
                        <div className="text-red-500 pt-2">
                          {errors.account_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Bank :</div>
                      <Field
                        as="select"
                        name="bank_name_id"
                        onChange={(e) => {
                          setFieldValue("bank_name_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih nama bank
                        </option>
                        {bankData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.bank_name_id && touched.bank_name_id && (
                        <div className="text-red-500 pt-2">
                          {errors.bank_name_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap Darurat:</div>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap darurat"
                        name="urgent_full_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.urgent_full_name && touched.urgent_full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.urgent_full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Darurat :
                      </div>
                      <input
                        type="number"
                        placeholder="Masukkan Nomor Telepon Darurat"
                        name="urgent_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.urgent_phone_number &&
                        touched.urgent_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.urgent_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Hubungan dengan pelamar :
                      </div>
                      <input
                        type="text"
                        placeholder="Masukkan hubungan dengan pelamar"
                        name="applicant_relationsips"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.applicant_relationsips}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.applicant_relationsips &&
                        touched.applicant_relationsips && (
                          <div className="text-red-500 pt-2">
                            {errors.applicant_relationsips}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Tentang Diri Anda :
                      </div>
                      <textarea
                        name="describe_yourself"
                        placeholder="Jelaskan tentang diri anda"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.describe_yourself}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.describe_yourself &&
                        touched.describe_yourself && (
                          <div className="text-red-500 pt-2">
                            {errors.describe_yourself}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi yang dilamar :</div>
                      <Field
                        as="select"
                        name="position_id"
                        value={values.position_id}
                        onChange={(e) => {
                          setFieldValue("position_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih posisi pekerjaan
                        </option>
                        {positionOfWork?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.position_id && touched.position_id && (
                        <div className="text-red-500 pt-2">
                          {errors.position_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Gaji yang diharapkan :</div>
                      <NumericFormat
                        placeholder="Gaji yang diharapkan"
                        value={values.expected_salary}
                        onChange={(e) => {
                          setFieldValue("expected_salary", e.target.value);
                        }}
                        onBlur={handleBlur}
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        allowNegative={false}
                        prefix="Rp"
                        thousandsGroupStyle="rupiah"
                        thousandSeparator=","
                      />
                      {errors.expected_salary && touched.expected_salary && (
                        <div className="text-red-500 pt-2">
                          {errors.expected_salary}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Edit CV :</div>
                      <input
                        type="file"
                        accept=".pdf"
                        className="file file-input bordered"
                        onChange={(event) => {
                          setFieldValue("cv", event.target.files[0]);
                          setCvName(event.target.files[0].name);
                        }}
                      />
                      {errors.cv && touched.cv && (
                        <div className="text-red-500 pt-2">{errors.cv}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Edit Dokumen :</div>
                      <input
                        type="file"
                        accept=".pdf"
                        className="file file-input bordered"
                        onChange={(event) => {
                          setFieldValue(
                            "other_document",
                            event.target.files[0]
                          );
                          setOtherDocumentName(event.target.files[0].name);
                        }}
                      />
                      {errors.other_document && touched.other_document && (
                        <div className="text-red-500 pt-2">
                          {errors.other_document}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full pt-5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setOpenEditModal(!openEditModal)}
                      className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addModal"
          onClick={() => {
            setOpenEditModal(!openEditModal);
          }}
        >
          Close
        </label>
      </div>
      <input
        type="checkbox"
        id="detailModal"
        className="modal-toggle"
        checked={openDetail}
      />
      <div className="modal">
        <div className="modal-box">
          <div className="w-full flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Detail Kandidat</h3>
            <div
              className={
                vacancyValue?.status?.name === "Pending"
                  ? "font-bold text-lg bg-red-500 rounded-md text-white p-1.5"
                  : "font-bold text-lg bg-green-500 rounded-md text-white p-1.5"
              }
            >
              {vacancyValue?.status?.name}
            </div>
          </div>
          <Formik
            initialValues={{
              full_name: vacancyValue?.full_name,
              birth_place: vacancyValue?.birth_place,
              nik: vacancyValue?.nik,
              birth_date: vacancyValue?.birth_date,
              age: vacancyValue?.age,
              height: vacancyValue?.height,
              gender_id: vacancyValue?.gender?.name,
              religion_id: vacancyValue?.religion?.name,
              skills: vacancyValue?.skills,
              work_experience_id: vacancyValue?.work_experience?.name,
              marital_status_id: vacancyValue?.marital_status?.name,
              vehicle_type_id: vacancyValue?.vehicle_type?.name,
              driver_license_id: vacancyValue?.driver_license?.name,
              vaccine_id: vacancyValue?.vaccine?.name,
              first_phone_number: vacancyValue?.first_phone_number,
              second_phone_number: vacancyValue?.second_phone_number,
              email: vacancyValue?.email,
              facebook: vacancyValue?.facebook,
              instagram: vacancyValue?.instagram,
              line: vacancyValue?.line,
              twitter: vacancyValue?.twitter,
              linkedin: vacancyValue?.linkedin,
              e_ktp_province_id: vacancyValue?.e_ktp_province?.name,
              e_ktp_district_id: vacancyValue?.e_ktp_district?.name,
              e_ktp_regency_id: vacancyValue?.e_ktp_regency?.name,
              e_ktp_village_id: vacancyValue?.e_ktp_village?.name,
              e_ktp_postal_code: vacancyValue?.e_ktp_postal_code,
              e_ktp_full_address: vacancyValue?.e_ktp_full_address,
              domicile_province_id: vacancyValue?.domicile_province?.name,
              domicile_district_id: vacancyValue?.domicile_district?.name,
              domicile_regency_id: vacancyValue?.domicile_regency?.name,
              domicile_village_id: vacancyValue?.domicile_village?.name,
              domicile_postal_code: vacancyValue?.domicile_postal_code,
              domicile_full_address: vacancyValue?.domicile_full_address,
              account_name: vacancyValue?.account_name,
              account_number: vacancyValue?.account_number,
              bank_name_id: vacancyValue?.bank?.name,
              urgent_full_name: vacancyValue?.urgent_full_name,
              applicant_relationsips: vacancyValue?.applicant_relationships,
              urgent_phone_number: vacancyValue?.urgent_phone_number,
              position_id: vacancyValue?.position?.name,
              describe_yourself: vacancyValue?.describe_yourself,
              expected_salary: vacancyValue?.expected_salary,
              cv: vacancyValue?.cv,
              other_document: vacancyValue?.other_document,
            }}
            innerRef={vacancyForm}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5 pb-3">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Image
                        src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1699097693/uploads/${vacancyValue?.profile_photo?.replace(
                          /\s/g,
                          "%20"
                        )}.png`}
                        width={200}
                        height={200}
                        alt=""
                      ></Image>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap :</div>
                      <input
                        type="text"
                        name="full_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.full_name && touched.full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tempat Lahir :</div>
                      <input
                        type="text"
                        name="birth_place"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.birth_place}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.birth_place && touched.birth_place && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_place}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIK :</div>
                      <input
                        type="text"
                        name="nik"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nik}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.nik && touched.nik && (
                        <div className="text-red-500 pt-2">{errors.nik}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tanggal Lahir :</div>
                      <input
                        type="text"
                        name="birth_date"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={dayjs(values.birth_date).format("DD-MMMM-YYYY")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.birth_date && touched.birth_date && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_date}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="text"
                        name="age"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.age + " Tahun"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500 pt-2">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tinggi Badan :</div>
                      <input
                        type="text"
                        name="height"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.height + " cm"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.height && touched.height && (
                        <div className="text-red-500 pt-2">{errors.height}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin:</div>
                      <input
                        type="text"
                        name="gender_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.gender_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.gender_id && touched.gender_id && (
                        <div className="text-red-500 pt-2">
                          {errors.gender_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Agama :</div>
                      <input
                        type="text"
                        name="religion_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.religion_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.religion_id && touched.religion_id && (
                        <div className="text-red-500 pt-2">
                          {errors.religion_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kemampuan :</div>
                      <input
                        type="text"
                        name="skills"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.skills}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.skills && touched.skills && (
                        <div className="text-red-500 pt-2">{errors.skills}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Pendidikan :</div>
                      {educations?.map((item, index) => {
                        return (
                          <div key={item.id} className="w-full">
                            <div className="text-sm flex flex-col gap-4 bg-gray-100 rounded-xl p-5">
                              <div className="text-md font-bold">
                                Pendidikan {index + 1}
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Jenjang Pendidikan :</div>
                                {item.name}
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Nama Sekolah :</div>
                                <div>{item.school_name}</div>
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Mulai :</div>
                                <div>
                                  {dayjs(item.start_date).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </div>
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Selesai :</div>
                                <div>
                                  {dayjs(item.end_date).format("DD-MMMM-YYYY")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Pengalaman Kerja :</div>
                      <input
                        type="text"
                        name="work_experience_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.work_experience_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.work_experience_id &&
                        touched.work_experience_id && (
                          <div className="text-red-500 pt-2">
                            {errors.work_experience_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Daftar Pengalaman Kerja :
                      </div>
                      {workHistory?.map((item, index) => {
                        return (
                          <div key={item.id} className="w-full">
                            <div className="text-sm flex flex-col gap-4 bg-gray-100 p-5 rounded-md">
                              <div className="text-md font-bold">
                                Pengalaman Kerja {index + 1} :
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Nama Perusahaan :</div>
                                {item.company_name}
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Mulai :</div>
                                <div>
                                  {dayjs(item.start_date).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </div>
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Selesai :</div>
                                <div>
                                  {dayjs(item.end_date).format("DD-MMMM-YYYY")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Status Pernikahan :</div>
                      <input
                        type="text"
                        name="marital_status_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.marital_status_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.marital_status_id &&
                        touched.marital_status_id && (
                          <div className="text-red-500 pt-2">
                            {errors.marital_status_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kendaraan :</div>
                      <div className="flex flex-col gap-4">
                        {selectedVehicles?.map((item) => {
                          return (
                            <div key={item.id}>
                              <input
                                type="text"
                                value={item.name}
                                className="input input-bordered w-full"
                                disabled
                              ></input>
                            </div>
                          );
                        })}
                        {vacancyValue?.vehicle_types?.length <= 0 && (
                          <div className="text-sm">Kendaraan tidak ada</div>
                        )}
                      </div>
                      {errors.vehicle_type_id && touched.vehicle_type_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vehicle_type_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">SIM :</div>
                      <div className="flex flex-col gap-4">
                        {selectedDriverLicense?.map((item) => {
                          return (
                            <div key={item.id}>
                              <input
                                type="text"
                                value={item.name}
                                className="input input-bordered w-full"
                                disabled
                              ></input>
                            </div>
                          );
                        })}
                      </div>
                      {vacancyValue?.driver_licenses?.length <= 0 && (
                        <div className="text-sm">SIM tidak ada</div>
                      )}
                      {errors.driver_license_id &&
                        touched.driver_license_id && (
                          <div className="text-red-500 pt-2">
                            {errors.driver_license_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Vaksin :</div>
                      <input
                        type="text"
                        name="vaccine_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.vaccine_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.vaccine_id && touched.vaccine_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vaccine_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Pertama :
                      </div>
                      <input
                        type="text"
                        name="first_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.first_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.first_phone_number &&
                        touched.first_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.first_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon Kedua :</div>
                      <input
                        type="text"
                        name="second_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.second_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.second_phone_number &&
                        touched.second_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.second_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500 pt-2">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Facebook :</div>
                      <input
                        type="text"
                        name="facebook"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.facebook}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.facebook && touched.facebook && (
                        <div className="text-red-500 pt-2">
                          {errors.facebook}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Instagram :</div>
                      <input
                        type="text"
                        name="instagram"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.instagram}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.instagram && touched.instagram && (
                        <div className="text-red-500 pt-2">
                          {errors.instagram}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Line :</div>
                      <input
                        type="text"
                        name="line"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.line}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.line && touched.line && (
                        <div className="text-red-500 pt-2">{errors.line}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Twitter :</div>
                      <input
                        type="text"
                        name="twitter"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.twitter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.twitter && touched.twitter && (
                        <div className="text-red-500 pt-2">
                          {errors.twitter}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">LinkedIn :</div>
                      <input
                        type="text"
                        name="linkedin"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.linkedin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.linkedin && touched.linkedin && (
                        <div className="text-red-500 pt-2">
                          {errors.linkedin}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_province_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_province_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_province_id &&
                        touched.e_ktp_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_regency_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_regency_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_regency_id && touched.e_ktp_regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_district_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_district_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_district_id &&
                        touched.e_ktp_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_village_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_village_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_village_id && touched.e_ktp_village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="text"
                        name="e_ktp_postal_code"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_postal_code &&
                        touched.e_ktp_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <input
                        type="text"
                        name="e_ktp_full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_full_address &&
                        touched.e_ktp_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_province_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_province_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_province_id &&
                        touched.domicile_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_regency_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_regency_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_regency_id &&
                        touched.domicile_regency_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_regency_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_district_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_district_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_district_id &&
                        touched.domicile_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_village_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_village_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_village_id &&
                        touched.domicile_village_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_village_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Alamat Lengkap sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_full_address &&
                        touched.domicile_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nama Pemilik Rekening :
                      </div>
                      <input
                        type="text"
                        name="account_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.account_name && touched.account_name && (
                        <div className="text-red-500 pt-2">
                          {errors.account_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Rekening :</div>
                      <input
                        type="text"
                        name="account_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.account_number && touched.account_number && (
                        <div className="text-red-500 pt-2">
                          {errors.account_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Bank :</div>
                      <input
                        type="text"
                        name="bank_name_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.bank_name_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.bank_name_id && touched.bank_name_id && (
                        <div className="text-red-500 pt-2">
                          {errors.bank_name_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap :</div>
                      <input
                        type="text"
                        name="urgent_full_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.urgent_full_name && touched.urgent_full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.urgent_full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Darurat :</div>
                      <input
                        type="text"
                        name="urgent_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.urgent_phone_number &&
                        touched.urgent_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.urgent_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Tentang Diri Anda :
                      </div>
                      <input
                        type="text"
                        name="describe_yourself"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.describe_yourself}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.describe_yourself &&
                        touched.describe_yourself && (
                          <div className="text-red-500 pt-2">
                            {errors.describe_yourself}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi yang dilamar :</div>
                      <input
                        type="text"
                        name="position_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.position_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.position_id && touched.position_id && (
                        <div className="text-red-500 pt-2">
                          {errors.position_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Gaji yang diharapkan :</div>
                      <input
                        type="text"
                        name="expected_salary"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.expected_salary}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.expected_salary && touched.expected_salary && (
                        <div className="text-red-500 pt-2">
                          {errors.expected_salary}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">CV :</div>
                      <Link
                        href={`https://res.cloudinary.com/dxnewldiy/raw/upload/fl_attachment/v1/cv/${values?.cv?.replace(
                          /\s/g,
                          "%20"
                        )}`}
                        target="_blank"
                        className="btn btn-primary bg-primary border-none text-white normal-case"
                      >
                        Download CV
                      </Link>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Dokumen Tambahan :</div>
                      <Link
                        href={`https://res.cloudinary.com/dxnewldiy/raw/upload/fl_attachment/v1/other_document/${values?.other_document?.replace(
                          /\s/g,
                          "%20"
                        )}`}
                        target="_blank"
                        className="btn btn-primary bg-primary border-none text-white normal-case"
                      >
                        Download Dokumen Tambahan
                      </Link>
                    </div>
                  </div>
                  <div className="w-full pt-5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setOpenDetail(!openDetail)}
                      className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addModal"
          onClick={() => {
            setOpenDetail(!openDetail);
          }}
        >
          Close
        </label>
      </div>
      <input
        type="checkbox"
        id="deleteModal"
        className="modal-toggle"
        checked={open}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Hapus Laporan Karir ?</h3>
          <h3 className="font-bold text-lg pb-5">
            Apakah anda yakin ingin menghapusnya ?
          </h3>
          <div className="w-full pt-5 flex gap-4 justify-end">
            <button
              onClick={() => {
                setOpen(!open);
              }}
              type="button"
              className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
            >
              Tidak
            </button>
            <button
              onClick={() => {
                setOpen(!open);
                setLoading(true);
                handleDeleteVacancy.mutate(deletedData);
              }}
              type="button"
              className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
            >
              Ya
            </button>
          </div>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addModal"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Close
        </label>
      </div>
      <input
        type="checkbox"
        id="updateStatusModal"
        className="modal-toggle"
        checked={openUpdate}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Update Laporan Karir</h3>
          <div>
            <Formik
              initialValues={{ status_id: "" }}
              validationSchema={validateStatus}
              onSubmit={(values) => {
                setOpenUpdate(!openUpdate);
                setLoading(true);
                updateStatus.mutate(values);
              }}
            >
              {({ values, errors, touched, handleSubmit, setFieldValue }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <Field
                        as="select"
                        name="status_id"
                        value={values.status_id}
                        onChange={(e) => {
                          setFieldValue("status_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih status
                        </option>
                        {statusData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.status_id && touched.status_id && (
                        <div className="text-sm text-red-500">
                          {errors.status_id}
                        </div>
                      )}
                    </div>
                    <div className="w-full pt-5 flex gap-4 justify-end">
                      <button
                        onClick={() => {
                          setOpenUpdate(!openUpdate);
                        }}
                        type="button"
                        className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                      >
                        Tidak
                      </button>
                      <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
                      >
                        Ya
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addModal"
          onClick={() => {
            setOpenUpdate(!openUpdate);
          }}
        >
          Close
        </label>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(LaporanKarir);
