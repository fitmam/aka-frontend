"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useRef } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaDownload, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import http from "@/helpers/http.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Formik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Image from "next/image";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import * as Yup from "yup";
import { getCookie } from "cookies-next";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  Image as PDFImage,
  Font,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import WithAuth from "@/components/isauth";

function InputService() {
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [pictureURI, setPictureURI] = useState([]);
  const [regencyValue, setRegencyData] = useState([]);
  const [districtValue, setDistrictData] = useState([]);
  const [villageValue, setVillageData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [openPDFModal, setOpenPDFModal] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const styles = StyleSheet.create({
    addressText: {
      fontSize: 15,
      paddingTop: 5,
    },
    headerText: {
      fontSize: 15,
      fontWeight: "bold",
    },
    companyLogo: {
      width: 80,
      height: 80,
    },
    companyName: {
      paddingBottom: 8,
      borderBottom: 1,
      borderColor: "#B4B4B3",
    },
    nib: {
      paddingTop: 8,
      paddingBottom: 8,
      borderBottom: 1,
      borderColor: "#B4B4B3",
    },
    businessType: {
      paddingTop: 8,
      paddingBottom: 8,
      borderBottom: 1,
      borderColor: "#B4B4B3",
    },
    npwp: {
      paddingTop: 8,
      paddingBottom: 8,
      borderBottom: 1,
      borderColor: "#B4B4B3",
    },
    companyDescription: {
      border: 1,
      padding: 5,
      fontSize: 10,
      backgroundColor: "#F5F7F8",
      borderColor: "#D0D4CA",
    },
    title: {
      fontSize: 25,
    },
    page: {
      fontFamily: "Open Sans",
    },
  });

  Font.register({
    family: "Open Sans",
    src: "https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf",
  });

  const MyDocument = ({ data }) => (
    <Document>
      {data.map((item, index) => {
        return (
          <Page size="A4" style={styles.page} key={index}>
            <View style={styles.companyDescription}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#F5F7F8",
                  padding: "0 10px",
                }}
              >
                <PDFImage
                  style={styles.companyLogo}
                  alt=""
                  src={`/ak.png`}
                ></PDFImage>
                <Text style={styles.title}>Informasi Klien</Text>
              </View>
              <Text style={styles.headerText}>Informasi Perusahaan</Text>
              <View style={styles.leftRow}>
                <PDFImage
                  style={{ width: 200, height: 100 }}
                  src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item?.company_logo}`}
                ></PDFImage>
                <Text style={styles.companyName}>
                  Nama Perusahaan : {item?.company_name}
                </Text>
                <Text style={styles.nib}>NIB: {item?.nib}</Text>
                <Text style={styles.npwp}>NPWP: {item?.npwp}</Text>
                <Text style={styles.businessType}>
                  Tipe Bisnis: {item?.business_type?.name}
                </Text>
                <Text style={styles.businessType}>
                  Email Perusahaan: {item?.company_email}
                </Text>
                <Text style={styles.businessType}>
                  Nomor Telepon Perusahaan : {item?.company_phone}
                </Text>
                <Text style={styles.businessType}>
                  Nama PIC: {item?.pic_name}
                </Text>
                <Text style={styles.businessType}>
                  Posisi PIC: {item?.pic_position}
                </Text>
                <Text style={styles.businessType}>
                  Email PIC: {item?.pic_email}
                </Text>
                <Text style={styles.businessType}>
                  Nomor Telepon PIC: {item?.pic_phone}
                </Text>
              </View>
              <Text style={styles.addressText}>Alamat</Text>
              <Text style={styles.businessType}>
                Provinsi: {item?.province?.name}
              </Text>
              <Text style={styles.businessType}>
                Kabupaten: {item?.regency?.name}
              </Text>
              <Text style={styles.businessType}>
                Kecamatan: {item?.district?.name}
              </Text>
              <Text style={styles.businessType}>
                Kelurahan: {item?.village?.name}
              </Text>
              <Text style={styles.businessType}>
                Kode POS: {item?.postal_code}
              </Text>
              <Text style={styles.businessType}>
                Alamat Lengkap: {item?.full_address}
              </Text>
              <Text style={styles.businessType}>
                Nama Service: {item?.service?.title}
              </Text>
              <Text style={styles.businessType}>
                Deskripsi: {item?.description}
              </Text>
              <Text style={styles.businessType}>
                Kebutuhan: {item?.requirements}
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );

  const [selectedData, setSelectedData] = useState([]);

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setSelectedData([...selectedData, item]);
    } else {
      setSelectedData(selectedData.filter((data) => data !== item));
    }
  };

  const ExportToExcel = ({ data }) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToExcel = () => {
      const formattedData = selectedData.map((row, index) => ({
        No: index + 1,
        "Nama Perusahaan": row?.company_name,
        NIB: row?.nib,
        NPWP: row?.npwp,
        "Tipe Bisnis": row?.business_type.name,
        "Email Perusahaan": row?.company_email,
        "Nomor Telepon Perusahaan": row?.company_phone,
        "Nama PIC": row?.pic_name,
        "Posisi PIC": row?.pic_position,
        "Email PIC": row?.pic_email,
        "Nomor Telepon PIC": row?.pic_phone,
        Provinsi: row?.province.name,
        Kabupaten: row?.district.name,
        Kecamatan: row?.regency.name,
        Kelurahan: row?.village.name,
        "Kode POS": row?.postal_code,
        "Alamat Lengkap": row?.full_address,
        "Nama Service": row?.service.title,
        Description: row?.description,
        Requirements: row?.requirements,
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      saveAs(data, "data" + fileExtension);
    };

    return (
      <div>
        <button
          onClick={exportToExcel}
          className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
        >
          Export to Excel
        </button>
      </div>
    );
  };

  const dispatch = useDispatch();
  const companyRequestService = useRef();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const token = getCookie("token");

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

  const queryClient = useQueryClient();

  async function fetchCompanyRequestProductById(id) {
    try {
      const { data } = await http(token).get(`/company-request-service/${id}`);
      setCompanyData(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchProvince(pageData = page, search = searchData) {
    const { data } = await http(token).get(
      "/province?page=" + pageData + "&search=" + search + "&limit="
    );
    return data.results;
  }

  async function fetchBusinessType() {
    const { data } = await http(token).get("/business-type");
    return data.results;
  }

  async function fetchServices() {
    const { data } = await http(token).get("/service");
    return data.results;
  }

  const { data: provinceData } = useQuery({
    queryKey: ["province"],
    queryFn: () => fetchProvince(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: businessType } = useQuery({
    queryKey: ["business-type"],
    queryFn: () => fetchBusinessType(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: serviceList } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
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

  async function fetchCompanyRequestProduct(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/company-request-service/list-all?page=" +
        pageData +
        "&search=" +
        search +
        "&limit=" +
        limitData
    );
    return data.results;
  }

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setCompanyId(updatedId);
  };

  const showDetailModal = (itemId) => {
    const updatedId = itemId;
    setOpenDetail(!openDetail);
    setCompanyId(updatedId);
  };

  function resetFile() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".file");
      file.value = "";
    }
  }

  const { data: companyRequestProduct } = useQuery({
    queryKey: ["company-request-service", page, searchData, limit],
    queryFn: () => fetchCompanyRequestProduct(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const validateStatus = Yup.object({
    status_id: Yup.string().required("Harap diisi"),
  });

  const updateStatus = useMutation({
    mutationFn: (values) => {
      return http(token).patch(
        `/company-request-service/status/${companyId}`,
        values
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company-request-service"] });
      setLoading(false);
      toast.success("Berhasil mengupdate status");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const postCompanyRequestService = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("company_logo", selectedPicture);
      }
      form.append("company_name", values.company_name);
      form.append("nib", values.nib);
      form.append("npwp", values.npwp);
      form.append("business_type_id", values.business_type_id);
      form.append("company_email", values.company_email);
      form.append("company_phone", values.company_phone);
      form.append("pic_name", values.pic_name);
      form.append("pic_position", values.pic_position);
      form.append("pic_email", values.pic_email);
      form.append("pic_phone", values.pic_phone);
      form.append("province_id", values.province_id);
      form.append("district_id", values.district_id);
      form.append("regency_id", values.regency_id);
      form.append("village_id", values.village_id);
      form.append("postal_code", values.postal_code);
      form.append("full_address", values.full_address);
      form.append("service_id", values.service_id);
      form.append("status_id", 1);
      form.append("description", values.description);
      form.append("requirements", values.requirements);
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();

      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Foto profil harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }
      return http(token).post("/company-request-service", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-request-service"] });
      setLoading(false);
      toast.success("Berhasil menambah request service perusahaan");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateCompanyRequestProduct = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("company_logo", selectedPicture);
      }
      form.append("company_name", values.company_name);
      form.append("nib", values.nib);
      form.append("npwp", values.npwp);
      form.append("business_type_id", values.business_type_id);
      form.append("company_email", values.company_email);
      form.append("company_phone", values.company_phone);
      form.append("pic_name", values.pic_name);
      form.append("pic_position", values.pic_position);
      form.append("pic_email", values.pic_email);
      form.append("pic_phone", values.pic_phone);
      form.append("province_id", values.province_id);
      form.append("district_id", values.district_id);
      form.append("regency_id", values.regency_id);
      form.append("village_id", values.village_id);
      form.append("postal_code", values.postal_code);
      form.append("full_address", values.full_address);
      form.append("service_id", values.service_id);
      form.append("description", values.description);
      form.append("requirements", values.requirements);
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();

      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Foto profil harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }
      return http(token).patch(`/company-request-service/${companyId}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-request-service"] });
      setLoading(false);
      toast.success("Berhasil mengupdate perusahaan");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/company-request-service/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-request-service"] });
      setLoading(false);
      toast.success("Berhasil menghapus request service perusahaan");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const fileToDataUrl = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPictureURI(reader.result);
    });
    reader.readAsDataURL(file);
  };

  const changePicture = (e) => {
    const file = e.target.files[0];
    setSelectedPicture(file);
    fileToDataUrl(file);
  };

  const validateCompanyRequestProduct = Yup.object({
    company_name: Yup.string().required("Harap diisi"),
    nib: Yup.string().required("Harap diisi"),
    npwp: Yup.string().required("Harap diisi"),
    business_type_id: Yup.string().required("Harap diisi"),
    company_email: Yup.string().required("Harap diisi"),
    company_phone: Yup.string().required("Harap diisi"),
    pic_name: Yup.string().required("Harap diisi"),
    pic_position: Yup.string().required("Harap diisi"),
    pic_email: Yup.string().required("Harap diisi"),
    pic_phone: Yup.string().required("Harap diisi"),
    province_id: Yup.string().required("Harap diisi"),
    district_id: Yup.string().required("Harap diisi"),
    regency_id: Yup.string().required("Harap diisi"),
    village_id: Yup.string().required("Harap diisi"),
    postal_code: Yup.string().required("Harap diisi"),
    full_address: Yup.string().required("Harap diisi"),
    service_id: Yup.string().required("Harap diisi"),
    description: Yup.string().required("Harap diisi"),
    requirements: Yup.string().required("Harap diisi"),
  });

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] flex gap-8 h-full overflow-y-scroll">
          <div className="w-full h-auto bg-white rounded-md overflow-auto">
            <div className="flex justify-between xl:px-10 xl:py-10 items-center w-full h-14 m-10 xl:m-0">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Laporan Request Service Perusahaan
              </div>
              <div className="flex gap-2">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (selectedData?.length >= 1) {
                        setOpenPDFModal(!openPDFModal);
                      } else {
                        toast.error("Silahkan ceklist data terlebih dahulu");
                      }
                    }}
                    className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                  >
                    <FaDownload />
                    Download Laporan
                  </button>
                </div>
                <div className="flex gap-5">
                  <button
                    onClick={() => {
                      setOpenAddModal(!openAddModal);
                      companyRequestService.current?.resetForm();
                      setRegencyData([]);
                      setDistrictData([]);
                      setVillageData([]);
                      resetFile();
                    }}
                    className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                  >
                    <FaPlus />
                    Tambah Request Service Perusahaan
                  </button>
                </div>
              </div>
            </div>
            <div className="flex px-10 w-full h-12 justify-between flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex gap-3">
                Show
                <select
                  className="border w-14 h-6 rounded-md"
                  onChange={(event) => {
                    setLimit(parseInt(event.target.value));
                    fetchCompanyRequestProduct();
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
                Entries
              </div>
              <div>
                Search :
                <input
                  type="text"
                  className="border border-gray-300 rounded-md ml-3 focus:outline-none px-2"
                  onChange={(event) => {
                    setSearchData(event.target.value);
                    fetchCompanyRequestProduct();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-10">No</th>
                  <th className="text-xs w-36">Logo</th>
                  <th className="text-xs w-36">Tipe Bisnis</th>
                  <th className="text-xs w-36">Alamat</th>
                  <th className="text-xs w-36">Status</th>
                  <th className="text-xs w-36">Aksi</th>
                </tr>
                {companyRequestProduct?.data?.map((item, index) => {
                  const isOddRow = index % 2 === 0;
                  return (
                    <tr
                      className={`h-12 text-center hover:bg-[#F3F3F3] cursor-pointer ${
                        isOddRow ? "bg-[#F3F3F3]" : ""
                      }`}
                      key={item.id}
                      onClick={(items) => {
                        showDetailModal(items.id);
                        fetchCompanyRequestProductById(item.id);
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
                      <td className="text-xs pl-3 text-center flex justify-center items-center gap-2 py-5">
                        <td>
                          <div className="flex flex-col justify-center items-center gap-4">
                            <div className="overflow-hidden flex justify-center items-center">
                              <Image
                                src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item?.company_logo}`}
                                width={100}
                                height={100}
                                className="max-w-24 max-h-10 w-auto h-auto"
                                alt=""
                                objectFit="contain"
                              ></Image>
                            </div>
                            <div className="font-bold text-sm">
                              {item?.company_name}
                            </div>
                          </div>
                        </td>
                      </td>
                      <td className="pl-4 text-xs">
                        {item.business_type?.name}
                      </td>
                      <td className="pl-4 text-xs">
                        <div className="flex flex-col">
                          <div>{item.province?.name}</div>
                          <div>{item?.district?.name}</div>
                        </div>
                      </td>
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
                          <button
                            onClick={() => {
                              showUpdateModal(item.id);
                              fetchCompanyRequestProductById(item.id);
                              fetchRegencyById(item.province_id);
                              fetchDistrictById(item.regency_id);
                              fetchVillageById(item.district_id);
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
                              setCompanyId(item.id);
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
                      </td>
                    </tr>
                  );
                })}
              </table>
              {companyRequestProduct?.data?.length === 0 && (
                <div className="w-full pt-5 text-xl flex justify-center items-center">
                  <div>No data found</div>
                </div>
              )}
            </div>
            <div className="w-full flex justify-between py-20 px-10">
              <div className="text-sm">
                Show {companyRequestProduct?.currentPage} of{" "}
                {companyRequestProduct?.totalPages} entries
              </div>
              <div className="flex">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={companyRequestProduct?.currentPage <= 1}
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
                    companyRequestProduct?.currentPage ===
                    companyRequestProduct?.totalPages
                  }
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
        id="addModal"
        className="modal-toggle"
        checked={openAddModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">
            Tambah Request Service Perusahaan
          </h3>
          <Formik
            initialValues={{
              company_name: "",
              nib: "",
              npwp: "",
              business_type_id: businessType?.data?.[0]?.id,
              company_email: "",
              company_phone: "",
              pic_name: "",
              pic_position: "",
              pic_email: "",
              pic_phone: "",
              province_id: provinceData?.data?.[0]?.id,
              district_id: districtValue?.data?.[0]?.id,
              regency_id: regencyValue?.data?.[0]?.id,
              village_id: villageValue?.[0]?.id,
              postal_code: "",
              full_address: "",
              service_id: serviceList?.data?.[0]?.id,
              description: "",
              requirements: "",
            }}
            onSubmit={(values) => {
              setOpenAddModal(!openAddModal);
              setLoading(true);
              postCompanyRequestService.mutate(values);
            }}
            innerRef={companyRequestService}
            validationSchema={validateCompanyRequestProduct}
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
                      <div className="text-sm pb-2">Gambar :</div>
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
                      <div className="text-sm pb-2">Nama Perusahaan :</div>
                      <input
                        type="text"
                        name="company_name"
                        placeholder="Masukkan Nama Perusahaan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.company_name && touched.company_name && (
                        <div className="text-red-500 pt-2">
                          {errors.company_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIB :</div>
                      <input
                        type="number"
                        name="nib"
                        placeholder="Masukkan NIB"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nib}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.nib && touched.nib && (
                        <div className="text-red-500 pt-2">{errors.nib}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NPWP :</div>
                      <input
                        type="number"
                        name="npwp"
                        placeholder="Masukkan NPWP"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.npwp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.npwp && touched.npwp && (
                        <div className="text-red-500 pt-2">{errors.npwp}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tipe Bisnis :</div>
                      <Field
                        as="select"
                        name="business_type_id"
                        onChange={(e) => {
                          setFieldValue("business_type_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih tipe bisnis
                        </option>
                        {businessType?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.business_type_id && touched.business_type_id && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.business_type_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email Perusahaan :</div>
                      <input
                        type="text"
                        name="company_email"
                        placeholder="Masukkan Email Perusahaan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.company_email && touched.company_email && (
                        <div className="text-red-500 pt-2">
                          {errors.company_email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Perusahaan:
                      </div>
                      <input
                        type="number"
                        name="company_phone"
                        placeholder="Masukkan Nomor Telepon Perusahaan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.company_phone && touched.company_phone && (
                        <div className="text-red-500 pt-2">
                          {errors.company_phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama PIC :</div>
                      <input
                        type="text"
                        name="pic_name"
                        placeholder="Masukkan Nama PIC"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_name && touched.pic_name && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi PIC :</div>
                      <input
                        type="text"
                        name="pic_position"
                        placeholder="Masukkan Posisi PIC"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_position && touched.pic_position && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_position}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email PIC :</div>
                      <input
                        type="text"
                        name="pic_email"
                        placeholder="Masukkan Email PIC"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_email && touched.pic_email && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon PIC :</div>
                      <input
                        type="number"
                        name="pic_phone"
                        placeholder="Masukkan Nomor Telepon PIC"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_phone && touched.pic_phone && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Provinsi :</div>
                      <Field
                        as="select"
                        name="province_id"
                        onChange={(e) => {
                          setFieldValue("province_id", e.target.value);
                          fetchRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi
                        </option>
                        {provinceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.province_id && touched.province_id && (
                        <div className="text-red-500 pt-2">
                          {errors.province_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kabupaten / Kota :</div>
                      <Field
                        as="select"
                        name="regency_id"
                        onChange={(e) => {
                          setFieldValue("regency_id", e.target.value);
                          fetchDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={regencyValue.length <= 0}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kabupaten / kota
                        </option>
                        {regencyValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.regency_id && touched.regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kecamatan :</div>
                      <Field
                        as="select"
                        name="district_id"
                        onChange={(e) => {
                          setFieldValue("district_id", e.target.value);
                          fetchVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={districtValue.length <= 0}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kecamatan
                        </option>
                        {districtValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.district_id && touched.district_id && (
                        <div className="text-red-500 pt-2">
                          {errors.district_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kelurahan :</div>
                      <Field
                        as="select"
                        name="village_id"
                        onChange={(e) => {
                          setFieldValue("village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                        disabled={villageValue.length <= 0}
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kelurahan
                        </option>
                        {villageValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.village_id && touched.village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="number"
                        name="postal_code"
                        placeholder="Masukkan Kode POS"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.postal_code && touched.postal_code && (
                        <div className="text-red-500 pt-2">
                          {errors.postal_code}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <input
                        type="text"
                        name="full_address"
                        placeholder="Masukkan Alamat Lengkap"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.full_address && touched.full_address && (
                        <div className="text-red-500 pt-2">
                          {errors.full_address}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Service :</div>
                      <Field
                        as="select"
                        name="service_id"
                        onChange={(e) => {
                          setFieldValue("service_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih service
                        </option>
                        {serviceList?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.title}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.service_id && touched.service_id && (
                        <div className="text-red-500 pt-2">
                          {errors.service_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <input
                        type="text"
                        name="description"
                        placeholder="Masukkan Deskripsi"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.description && touched.description && (
                        <div className="text-red-500 pt-2">
                          {errors.description}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Kebutuhan Anda :
                      </div>
                      <input
                        type="text"
                        name="requirements"
                        placeholder="Jelaskan kebutuhan anda"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.requirements}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.requirements && touched.requirements && (
                        <div className="text-red-500 pt-2">
                          {errors.requirements}
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
        id="editModal"
        className="modal-toggle"
        checked={openEditModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">
            Edit Request Service Perusahaan
          </h3>
          <Formik
            initialValues={{
              company_name: companyData?.[0]?.company_name,
              nib: companyData?.[0]?.nib,
              npwp: companyData?.[0]?.npwp,
              business_type_id: companyData?.[0]?.business_type_id,
              company_email: companyData?.[0]?.company_email,
              company_phone: companyData?.[0]?.company_phone,
              pic_name: companyData?.[0]?.pic_name,
              pic_position: companyData?.[0]?.pic_position,
              pic_email: companyData?.[0]?.pic_email,
              pic_phone: companyData?.[0]?.pic_phone,
              province_id: companyData?.[0]?.province_id,
              district_id: companyData?.[0]?.district_id,
              regency_id: companyData?.[0]?.regency_id,
              village_id: companyData?.[0]?.village_id,
              postal_code: companyData?.[0]?.postal_code,
              full_address: companyData?.[0]?.full_address,
              service_id: companyData?.[0]?.service_id,
              description: companyData?.[0]?.description,
              requirements: companyData?.[0]?.requirements,
            }}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              setLoading(true);
              updateCompanyRequestProduct.mutate(values);
            }}
            enableReinitialize={true}
            validationSchema={validateCompanyRequestProduct}
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
                  {selectedPicture ? (
                    <Image src={pictureURI} width={100} height={100} alt="" />
                  ) : (
                    <Image
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${companyData?.[0]?.company_logo}`}
                      width={100}
                      height={100}
                      alt=""
                    />
                  )}
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Gambar :</div>
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
                      <div className="text-sm pb-2">Nama Perusahaan :</div>
                      <input
                        type="text"
                        name="company_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.company_name && touched.company_name && (
                        <div className="text-red-500 pt-2">
                          {errors.company_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIB :</div>
                      <input
                        type="number"
                        name="nib"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nib}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.nib && touched.nib && (
                        <div className="text-red-500 pt-2">{errors.nib}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NPWP :</div>
                      <input
                        type="number"
                        name="npwp"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.npwp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.npwp && touched.npwp && (
                        <div className="text-red-500 pt-2">{errors.npwp}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tipe Bisnis :</div>
                      <Field
                        as="select"
                        name="business_type_id"
                        onChange={(e) => {
                          setFieldValue("business_type_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        {businessType?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.business_type_id && touched.business_type_id && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.business_type_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email Perusahaan :</div>
                      <input
                        type="text"
                        name="company_email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.company_email && touched.company_email && (
                        <div className="text-red-500 pt-2">
                          {errors.company_email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Perusahaan:
                      </div>
                      <input
                        type="number"
                        name="company_phone"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.company_phone && touched.company_phone && (
                        <div className="text-red-500 pt-2">
                          {errors.company_phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama PIC :</div>
                      <input
                        type="text"
                        name="pic_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_name && touched.pic_name && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi PIC :</div>
                      <input
                        type="text"
                        name="pic_position"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_position && touched.pic_position && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_position}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email PIC :</div>
                      <input
                        type="text"
                        name="pic_email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_email && touched.pic_email && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon PIC :</div>
                      <input
                        type="number"
                        name="pic_phone"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.pic_phone && touched.pic_phone && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Provinsi :</div>
                      <Field
                        as="select"
                        name="province_id"
                        value={values.province_id}
                        onChange={(e) => {
                          setFieldValue("province_id", e.target.value);
                          fetchRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi
                        </option>
                        {provinceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.province_id && touched.province_id && (
                        <div className="text-red-500 pt-2">
                          {errors.province_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kabupaten / Kota :</div>
                      <Field
                        as="select"
                        name="regency_id"
                        value={values.regency_id}
                        onChange={(e) => {
                          setFieldValue("regency_id", e.target.value);
                          fetchDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        {regencyValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.regency_id && touched.regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kecamatan :</div>
                      <Field
                        as="select"
                        name="district_id"
                        value={values?.district_id}
                        onChange={(e) => {
                          setFieldValue("district_id", e.target.value);
                          fetchVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        {districtValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.district_id && touched.district_id && (
                        <div className="text-red-500 pt-2">
                          {errors.district_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kelurahan :</div>
                      <Field
                        as="select"
                        name="village_id"
                        value={values.village_id}
                        onChange={(e) => {
                          setFieldValue("village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        {villageValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.village_id && touched.village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="number"
                        name="postal_code"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.postal_code && touched.postal_code && (
                        <div className="text-red-500 pt-2">
                          {errors.postal_code}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <textarea
                        type="text"
                        name="full_address"
                        className="w-full h-18 border focus:outline-none rounded-md px-4"
                        value={values.full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.full_address && touched.full_address && (
                        <div className="text-red-500 pt-2">
                          {errors.full_address}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Service :</div>
                      <Field
                        as="select"
                        name="service_id"
                        onChange={(e) => {
                          setFieldValue("service_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        {serviceList?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.title}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.service_id && touched.service_id && (
                        <div className="text-red-500 pt-2">
                          {errors.service_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <textarea
                        type="text"
                        name="description"
                        className="w-full h-18 border focus:outline-none rounded-md px-4"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.description && touched.description && (
                        <div className="text-red-500 pt-2">
                          {errors.description}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Kebutuhan Anda :
                      </div>
                      <textarea
                        type="text"
                        name="requirements"
                        className="w-full h-14 border focus:outline-none rounded-md px-4"
                        value={values.requirements}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.requirements && touched.requirements && (
                        <div className="text-red-500 pt-2">
                          {errors.requirements}
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
                      Simpan{" "}
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
        id="deleteModal"
        className="modal-toggle"
        checked={open}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">
            Hapus Request Service Perusahaan
          </h3>
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
                handleDelete.mutate(deletedData);
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
              onClick={() => {
                setOpenPDFModal(!openPDFModal);
              }}
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
        id="detailModal"
        className="modal-toggle"
        checked={openDetail}
      />
      <div className="modal">
        <div className="modal-box">
          <div className="w-full flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Detail Perusahaan</h3>
            <div
              className={
                companyData?.[0]?.status?.name === "Pending"
                  ? "font-bold text-lg bg-red-500 rounded-md text-white p-1.5"
                  : "font-bold text-lg bg-green-500 rounded-md text-white p-1.5"
              }
            >
              {companyData?.[0]?.status?.name}
            </div>
          </div>
          <Formik
            initialValues={{
              company_name: companyData?.[0]?.company_name,
              nib: companyData?.[0]?.nib,
              npwp: companyData?.[0]?.npwp,
              business_type_id: companyData?.[0]?.business_type?.name,
              company_email: companyData?.[0]?.company_email,
              company_phone: companyData?.[0]?.company_phone,
              pic_name: companyData?.[0]?.pic_name,
              pic_position: companyData?.[0]?.pic_position,
              pic_email: companyData?.[0]?.pic_email,
              pic_phone: companyData?.[0]?.pic_phone,
              province_id: companyData?.[0]?.province?.name,
              district_id: companyData?.[0]?.district?.name,
              regency_id: companyData?.[0]?.regency?.name,
              village_id: companyData?.[0]?.village?.name,
              postal_code: companyData?.[0]?.postal_code,
              full_address: companyData?.[0]?.full_address,
              service_id: companyData?.[0]?.service?.title,
              description: companyData?.[0]?.description,
              requirements: companyData?.[0]?.requirements,
            }}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              setLoading(true);
              updateCompanyRequestProduct.mutate(values);
            }}
            enableReinitialize={true}
            validationSchema={validateCompanyRequestProduct}
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
                  {selectedPicture ? (
                    <Image src={pictureURI} width={100} height={100} alt="" />
                  ) : (
                    <Image
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${companyData?.[0]?.company_logo}`}
                      width={100}
                      height={100}
                      alt=""
                    />
                  )}
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Nama Perusahaan :</div>
                      <input
                        type="text"
                        name="company_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.company_name && touched.company_name && (
                        <div className="text-red-500 pt-2">
                          {errors.company_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIB :</div>
                      <input
                        type="text"
                        name="nib"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nib}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.nib && touched.nib && (
                        <div className="text-red-500 pt-2">{errors.nib}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NPWP :</div>
                      <input
                        type="text"
                        name="npwp"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.npwp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.npwp && touched.npwp && (
                        <div className="text-red-500 pt-2">{errors.npwp}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tipe Bisnis :</div>
                      <input
                        type="text"
                        name="business_type_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.business_type_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.business_type_id && touched.business_type_id && (
                        <div className="text-red-500 pt-2">
                          {errors.business_type_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email Perusahaan :</div>
                      <input
                        type="text"
                        name="company_email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.company_email && touched.company_email && (
                        <div className="text-red-500 pt-2">
                          {errors.company_email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Perusahaan:
                      </div>
                      <input
                        type="text"
                        name="company_phone"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.company_phone && touched.company_phone && (
                        <div className="text-red-500 pt-2">
                          {errors.company_phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama PIC :</div>
                      <input
                        type="text"
                        name="pic_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.pic_name && touched.pic_name && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi PIC :</div>
                      <input
                        type="text"
                        name="pic_position"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_position}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.pic_position && touched.pic_position && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_position}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email PIC :</div>
                      <input
                        type="text"
                        name="pic_email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.pic_email && touched.pic_email && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon PIC :</div>
                      <input
                        type="text"
                        name="pic_phone"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.pic_phone && touched.pic_phone && (
                        <div className="text-red-500 pt-2">
                          {errors.pic_phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Provinsi :</div>
                      <input
                        type="text"
                        name="province_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.province_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.province_id && touched.province_id && (
                        <div className="text-red-500 pt-2">
                          {errors.province_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kabupaten / Kota :</div>
                      <input
                        type="text"
                        name="regency_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.regency_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.regency_id && touched.regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kecamatan :</div>
                      <input
                        type="text"
                        name="district_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.district_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.district_id && touched.district_id && (
                        <div className="text-red-500 pt-2">
                          {errors.district_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kelurahan :</div>
                      <input
                        type="text"
                        name="village_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.village_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.village_id && touched.village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="text"
                        name="postal_code"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.postal_code && touched.postal_code && (
                        <div className="text-red-500 pt-2">
                          {errors.postal_code}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <input
                        type="text"
                        name="full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.full_address && touched.full_address && (
                        <div className="text-red-500 pt-2">
                          {errors.full_address}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Service :</div>
                      <input
                        type="text"
                        name="service_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.service_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.service_id && touched.service_id && (
                        <div className="text-red-500 pt-2">
                          {errors.service_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <input
                        type="text"
                        name="description"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.description && touched.description && (
                        <div className="text-red-500 pt-2">
                          {errors.description}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Kebutuhan Anda :
                      </div>
                      <input
                        type="text"
                        name="requirements"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.requirements}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.requirements && touched.requirements && (
                        <div className="text-red-500 pt-2">
                          {errors.requirements}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full pt-5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setOpenDetail(!openDetail)}
                      className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                    >
                      Close
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

export default WithAuth(InputService);
