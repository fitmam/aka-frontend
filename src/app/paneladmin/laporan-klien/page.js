"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useRef } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaDownload, FaPencil } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import http from "@/helpers/http.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Formik } from "formik";
import { toast } from "react-toastify";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import * as Yup from "yup";
import { getCookie } from "cookies-next";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Font,
  Image as PDFImage,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import WithAuth from "@/components/isauth";

function LaporanKlien() {
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientData, setClientData] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [pictureURI, setPictureURI] = useState([]);
  const [regencyValue, setRegencyData] = useState([]);
  const [districtValue, setDistrictData] = useState([]);
  const [villageValue, setVillageData] = useState([]);
  const [openPDFModal, setOpenPDFModal] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showDetailModal = (itemId) => {
    const updatedId = itemId;
    setOpenDetail(!openDetail);
    setClientId(updatedId);
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 10,
      fontFamily: "Open Sans",
    },
    section: {
      marginLeft: 10,
      marginRight: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 15,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 10,
    },
  });

  Font.register({
    family: "Open Sans",
    src: "https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf",
  });

  const MyDocument = ({ data }) => {
    return (
      <Document>
        {data.map((item, index) => {
          return (
            <Page style={styles.page} key={index}>
              <View style={styles.section}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    backgroundColor: "#F5F7F8",
                    padding: "0 10px",
                  }}
                >
                  <PDFImage
                    alt=""
                    src={"/ak.png"}
                    style={{ width: 80, height: 80 }}
                  ></PDFImage>
                  <Text style={styles.title}>Informasi Klien</Text>
                </View>
                <View style={{ display: "flex", width: "100%" }}>
                  <PDFImage
                    alt=""
                    src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1699207236/${item.picture}`}
                    style={{ width: 100, height: 50 }}
                  ></PDFImage>
                </View>
                <Text style={styles.subtitle}>Informasi Perusahaan</Text>
                <Text style={styles.text}>
                  Nama Perusahaan{"      "} : {item?.company_name}
                </Text>
                <Text style={styles.text}>
                  Nama Brand{"                 "} : {item?.brand_name}
                </Text>
                <Text style={styles.text}>
                  Tipe Bisnis{"                    "} :{" "}
                  {item?.business_type?.name}
                </Text>
                <Text style={styles.text}>
                  Phone Number{"           "} : {item?.phone_number}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Informasi PIC:</Text>
                <Text style={styles.text}>
                  Nama{"                            "} : {item?.pic_name}
                </Text>
                <Text style={styles.text}>
                  Posisi PIC{"                     "} : {item?.pic_position}
                </Text>
                <Text style={styles.text}>
                  Email PIC{"                     "} : {item?.pic_email}
                </Text>
                <Text style={styles.text}>
                  Nomor Telepon PIC{"   "} : {item?.pic_phone}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Informasi Lokasi:</Text>
                <Text style={styles.text}>
                  Provinsi{"                        "} : {item?.province?.name}
                </Text>
                <Text style={styles.text}>
                  Kabupaten{"                   "} : {item?.regency?.name}
                </Text>
                <Text style={styles.text}>
                  Kecamatan{"                  "} : {item?.district?.name}
                </Text>
                <Text style={styles.text}>
                  Kelurahan{"                    "} : {item?.village?.name}
                </Text>
                <Text style={styles.text}>
                  Kode POS{"                     "} : {item?.postal_code}
                </Text>
                <Text style={styles.text}>
                  Alamat Lengkap{"          "} : {item?.full_address}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Deskripsi:</Text>
                <Text style={styles.text}>{item?.description}</Text>
              </View>
            </Page>
          );
        })}
      </Document>
    );
  };

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
      const formattedData = selectedData.map((row) => ({
        "Nama Perusahaan": row.company_name,
        "Nama Brand": row.brand_name,
        "Tipe Bisnis": row.business_type_id,
        "Email Perusahaan": row.company_email,
        "Nomor Telepon": row.phone_number,
        "Nama PIC": row.pic_name,
        "Posisi PIC": row.pic_position,
        "Email PIC": row.pic_email,
        "Nomor PIC": row.pic_phone,
        "Nama Provinsi": row.province?.name,
        "Nama Kabupaten": row.district?.name,
        "Nama Kecamatan": row.regency?.name,
        "Nama Kelurahan": row.village?.name,
        "Kode POS": row.postal_code,
        "Alamat Lengkap": row.full_address,
        Deskripsi: row.description,
      }));

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
  const addClient = useRef();
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

  async function fetchClientById(id) {
    try {
      const { data } = await http(token).get(`/client/${id}`);
      setClientData(data.results);
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

  const { data: businessType } = useQuery({
    queryKey: ["business-type"],
    queryFn: () => fetchBusinessType(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: provinceData } = useQuery({
    queryKey: ["province"],
    queryFn: () => fetchProvince(),
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

  async function fetchClient(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/client?page=" + pageData + "&search=" + search + "&limit=" + limitData
    );
    return data.results;
  }

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setClientId(updatedId);
  };

  async function fetchClientById(id) {
    try {
      const { data } = await http(token).get(`/client/${id}`);
      setClientData(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  function resetFile() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".file");
      file.value = "";
    }
  }

  const { data } = useQuery({
    queryKey: ["client", page, searchData, limit],
    queryFn: () => fetchClient(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const postClient = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      form.append("company_name", values.company_name);
      form.append("brand_name", values.brand_name);
      form.append("business_type_id", values.business_type_id);
      form.append("company_email", values.company_email);
      form.append("phone_number", values.phone_number);
      form.append("pic_name", values.pic_name);
      form.append("pic_position", values.pic_position);
      form.append("pic_email", values.pic_email);
      form.append("pic_phone", values.pic_position);
      form.append("province_id", values.province_id);
      form.append("district_id", values.district_id);
      form.append("regency_id", values.regency_id);
      form.append("village_id", values.village_id);
      form.append("postal_code", values.postal_code);
      form.append("full_address", values.full_address);
      form.append("description", values.description);
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
      return http(token).post("/client", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client"] });
      setLoading(false);
      toast.success("Berhasil menambah client");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateClient = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      form.append("company_name", values.company_name);
      form.append("brand_name", values.brand_name);
      form.append("business_type_id", values.business_type_id);
      form.append("company_email", values.company_email);
      form.append("phone_number", values.phone_number);
      form.append("pic_name", values.pic_name);
      form.append("pic_position", values.pic_position);
      form.append("pic_email", values.pic_email);
      form.append("pic_phone", values.pic_position);
      form.append("province_id", values.province_id);
      form.append("district_id", values.district_id);
      form.append("regency_id", values.regency_id);
      form.append("village_id", values.village_id);
      form.append("postal_code", values.postal_code);
      form.append("full_address", values.full_address);
      form.append("description", values.description);
      return http(token).patch(`/client/${clientId}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client"] });
      setLoading(false);
      toast.success("Berhasil mengupdate client");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/client/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client"] });
      setLoading(false);
      toast.success("Berhasil menghapus client");
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

  const validateClient = Yup.object({
    company_name: Yup.string().required("Harap diisi"),
    brand_name: Yup.string().required("Harap diisi"),
    business_type_id: Yup.string().required("Harap diisi"),
    company_email: Yup.string().required("Harap diisi"),
    phone_number: Yup.string().required("Harap diisi"),
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
    description: Yup.string().required("Harap diisi"),
  });

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] flex gap-8 h-full overflow-y-auto">
          <div className="w-full h-screen bg-white rounded-md overflow-auto">
            <div className="flex justify-between px-10 py-10 items-center w-full h-14">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Laporan Klien
              </div>
              <div className="flex gap-2">
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
                </div>
                <div>
                  <button
                    onClick={() => {
                      setOpenAddModal(!openAddModal);
                      addClient.current?.resetForm();
                      setRegencyData([]);
                      setDistrictData([]);
                      setVillageData([]);
                      resetFile();
                    }}
                    className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                  >
                    <FaPlus />
                    Tambah Client
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
                    fetchClient();
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
                    fetchClient();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none overflow-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-40">Logo Perusahaan</th>
                  <th className="text-xs w-40">Tipe Bisnis</th>
                  <th className="text-xs w-40">Alamat</th>
                  <th className="text-xs w-40">Email</th>
                  <th className="text-xs w-40">Alamat</th>
                  <th className="text-xs w-40">Aksi</th>
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
                        fetchClientById(item.id);
                      }}
                    >
                      <td
                        className="text-xs pl-3"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex gap-2">
                          <input
                            type="checkbox"
                            className="checkbox w-4 h-4"
                            onChange={(e) => handleCheckboxChange(e, item)}
                          />
                          <div>{index + 1}</div>
                        </div>
                      </td>
                      <td className="text-xs py-5">
                        <div className="flex flex-col justify-center items-center gap-3">
                          <div className="overflow-hidden flex justify-center items-center">
                            <Image
                              src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
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
                      <td className="text-xs pl-3">
                        {item.business_type?.name}
                      </td>
                      <td className="text-xs pl-3">
                        <div className="flex flex-col">
                          <div>{item.province?.name}</div>
                          <div>{item?.district?.name}</div>
                        </div>
                      </td>
                      <td className="text-xs pl-3">{item?.company_email}</td>
                      <td className="text-xs pl-3">{item?.full_address}</td>
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
                              fetchClientById(item.id);
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
        id="addModal"
        className="modal-toggle"
        checked={openAddModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Tambah Klien</h3>
          <Formik
            initialValues={{
              company_name: "",
              brand_name: "",
              business_type_id: "",
              company_email: "",
              phone_number: "",
              pic_name: "",
              pic_position: "",
              pic_email: "",
              pic_phone: "",
              province_id: "",
              district_id: "",
              regency_id: "",
              village_id: "",
              postal_code: "",
              full_address: "",
              description: "",
            }}
            onSubmit={(values) => {
              setOpenAddModal(!openAddModal);
              setLoading(true);
              postClient.mutate(values);
            }}
            innerRef={addClient}
            validationSchema={validateClient}
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
                      <div className="text-sm pb-2">Picture :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full"
                        onChange={changePicture}
                      ></input>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Perusahaan :</div>
                      <input
                        type="text"
                        name="company_name"
                        placeholder="Masukkan nama Perusahaan"
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
                      <div className="text-sm pb-2">Nama Brand :</div>
                      <input
                        type="text"
                        name="brand_name"
                        placeholder="Masukkan nama Brand"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.brand_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.brand_name && touched.brand_name && (
                        <div className="text-red-500 pt-2">
                          {errors.brand_name}
                        </div>
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
                        placeholder="Masukkan email perusahaan"
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
                        Nomor telepon perusahaan:
                      </div>
                      <input
                        type="text"
                        name="phone_number"
                        placeholder="Masukkan nomor telepon perusahaan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-red-500 pt-2">
                          {errors.phone_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama PIC :</div>
                      <input
                        type="text"
                        name="pic_name"
                        placeholder="Masukkan nama PIC"
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
                        placeholder="Masukkan posisi PIC"
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
                        placeholder="Masukkan email PIC"
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
                      <div className="text-sm pb-2">Nomor telepon PIC :</div>
                      <input
                        type="text"
                        name="pic_phone"
                        placeholder="Masukkan nomor telepon PIC"
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
                          Silahkan pilih kabupaten
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
                        type="text"
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
                      <textarea
                        type="text"
                        placeholder="Masukkan Alamat Lengkap"
                        name="full_address"
                        className="w-full h-24 border focus:outline-none rounded-md px-4 pt-2"
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
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <textarea
                        type="text"
                        name="description"
                        placeholder="Masukkan Deskripsi"
                        className="w-full h-24 border focus:outline-none rounded-md px-4 pt-2"
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
          <h3 className="font-bold text-lg pb-5">Edit Klien</h3>
          <Formik
            initialValues={{
              company_name: clientData?.company_name,
              brand_name: clientData?.brand_name,
              business_type_id: clientData?.business_type_id,
              company_email: clientData?.company_email,
              phone_number: clientData?.phone_number,
              pic_name: clientData?.pic_name,
              pic_position: clientData?.pic_position,
              pic_email: clientData?.pic_email,
              pic_phone: clientData?.pic_phone,
              province_id: clientData?.province?.id,
              district_id: clientData?.district?.id,
              regency_id: clientData?.regency?.id,
              village_id: clientData?.village?.id,
              postal_code: clientData?.postal_code,
              full_address: clientData?.full_address,
              description: clientData?.description,
            }}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              setLoading(true);
              updateClient.mutate(values);
            }}
            enableReinitialize={true}
            validationSchema={validateClient}
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
                  {selectedPicture ? (
                    <Image src={pictureURI} width={100} height={100} alt="" />
                  ) : (
                    <Image
                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${clientData.picture}`}
                      width={100}
                      height={100}
                      alt=""
                    />
                  )}
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Picture :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full"
                        onChange={changePicture}
                      ></input>
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
                      <div className="text-sm pb-2">Nama Brand :</div>
                      <input
                        type="text"
                        name="brand_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.brand_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.brand_name && touched.brand_name && (
                        <div className="text-red-500 pt-2">
                          {errors.brand_name}
                        </div>
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
                        type="text"
                        name="phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-red-500 pt-2">
                          {errors.phone_number}
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
                      <div className="text-sm pb-2">Nomor telepon PIC :</div>
                      <input
                        type="text"
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
                        onChange={(e) => {
                          setFieldValue("province_id", e.target.value);
                          fetchRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
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
                        type="text"
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
                      <input
                        type="text"
                        name="full_address"
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
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <input
                        type="text"
                        name="description"
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
          <h3 className="font-bold text-lg pb-5">Detail Klien</h3>
          <Formik
            initialValues={{
              company_name: clientData?.company_name,
              brand_name: clientData?.brand_name,
              business_type_id: clientData?.business_type?.name,
              company_email: clientData?.company_email,
              phone_number: clientData?.phone_number,
              pic_name: clientData?.pic_name,
              pic_position: clientData?.pic_position,
              pic_email: clientData?.pic_email,
              pic_phone: clientData?.pic_phone,
              province_id: clientData?.province?.name,
              district_id: clientData?.district?.name,
              regency_id: clientData?.regency?.name,
              village_id: clientData?.village?.name,
              postal_code: clientData?.postal_code,
              full_address: clientData?.full_address,
              description: clientData?.description,
            }}
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
                  <Image
                    src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${clientData.picture}`}
                    width={100}
                    height={100}
                    alt=""
                  />
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
                      <div className="text-sm pb-2">Nama Brand :</div>
                      <input
                        type="text"
                        name="brand_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.brand_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.brand_name && touched.brand_name && (
                        <div className="text-red-500 pt-2">
                          {errors.brand_name}
                        </div>
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
                        name="phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-red-500 pt-2">
                          {errors.phone_number}
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
                      <div className="text-sm pb-2">Nomor telepon PIC :</div>
                      <input
                        type="text"
                        name="pic_phone"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.pic_phone}
                        onChange={handleChange}
                        disabled
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
                        disabled
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
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <input
                        type="text"
                        disabled
                        name="description"
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
          <h3 className="font-bold text-lg pb-5">Hapus Klien</h3>
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
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(LaporanKlien);
