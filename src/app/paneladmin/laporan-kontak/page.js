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
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import { useCallback } from "react";
import * as Yup from "yup";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import {
  Document,
  Page,
  Text,
  Image as PDFImage,
  StyleSheet,
  View,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import WithAuth from "@/components/isauth";

function LaporanKontak() {
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [contactMeId, setContactMeId] = useState("");
  const [contactMeData, setContactMeData] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [openPDFModal, setOpenPDFModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const user_id = useSelector((state) => state.user.user_id);
  const contactMeForm = useRef();
  const token = getCookie("token");
  const dispatch = useDispatch();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);

  const showDetailModal = (itemId) => {
    const updatedId = itemId;
    setOpenDetail(!openDetail);
    setContactMeId(updatedId);
  };

  async function fetchProfile() {
    const { data } = await http(token).get("/profile");
    return data;
  }

  const { data: permissions } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    setPermissionsData(permissions?.results?.user?.permissions_allowed);
  }, [permissions?.results?.user?.permissions_allowed]);

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
    setIsClient(true);
  }, []);

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

  const MyDocument = ({ data }) => (
    <Document>
      {data?.map((item, index) => {
        return (
          <Page style={styles.page} key={item.id}>
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
                  src={`/ak.png`}
                  style={{ width: 80, height: 80 }}
                ></PDFImage>
                <Text style={styles.title}>Informasi Kontak</Text>
              </View>
              <Text style={styles.subtitle}>Informasi Perusahaan</Text>
              <Text style={styles.text}>
                Tanggal{"                      "} :{" "}
                {dayjs(item?.date).format("DD-MM-YYYY")}
              </Text>
              <Text style={styles.text}>
                Nama Lengkap{"         "} : {item?.name}
              </Text>
              <Text style={styles.text}>
                Email{"                          "} :{item?.email}
              </Text>
              <Text style={styles.text}>
                No Telepon{"               "} : {item?.phone_number}
              </Text>
              <Text style={styles.text}>
                Nama Perusahaan{"   "} : {item?.company_name}
              </Text>
              <Text style={styles.text}>
                Tipe Bisnis{"                "} : {item?.business_type?.name}
              </Text>
              <Text style={styles.text}>
                Alamat Lengkap{"       "} : {item?.full_address}
              </Text>
              <Text style={styles.text}>
                Deskripsi{"                    "} : {item?.description}
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
      const formattedData = selectedData.map((row) => ({
        No: row.id,
        Tanggal: row.date,
        Nama: row.name,
        Email: row.email,
        "Nomor Telepon": row.phone_number,
        "Nama Perusahaan": row.company_name,
        "Tipe Bisnis": row.business_type.name,
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

  async function fetchContactMeById(id) {
    try {
      const { data } = await http(token).get(`/contact-me/${id}`);
      setContactMeData(data.results);
    } catch (err) {
      console.log(err);
    }
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

  async function fetchContactMe(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/contact-me?page=" +
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
    setContactMeId(updatedId);
  };

  const { data } = useQuery({
    queryKey: ["contact-me", page, searchData, limit],
    queryFn: () => fetchContactMe(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const postContactMe = useMutation({
    mutationFn: async (values) => {
      const logData = new URLSearchParams({
        user_name: currentUser.first_name,
        role_id: currentUser.role_id,
        crud_activites: "Tambah Kontak Kami",
      }).toString();
      await http(token).post("/user-log", logData);
      const data = new URLSearchParams(values).toString();
      return http(token).post("/contact-me", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-me"] });
      setLoading(false);
      toast.success("Berhasil menambah kontak kami");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateContactMe = useMutation({
    mutationFn: async (values) => {
      const logData = new URLSearchParams({
        user_name: currentUser.first_name,
        role_id: currentUser.role_id,
        crud_activites: "Update Kontak Kami",
      }).toString();
      await http(token).post("/user-log", logData);
      const data = new URLSearchParams(values).toString();
      return http(token).patch(`/contact-me/${contactMeId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-me"] });
      setLoading(false);
      toast.success("Berhasil mengupdate kontak kami");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: async (id) => {
      const logData = new URLSearchParams({
        user_name: currentUser.first_name,
        role_id: currentUser.role_id,
        crud_activites: "Hapus  Kontak Kami",
      }).toString();
      await http(token).post("/user-log", logData);
      return http(token).delete(`/contact-me/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-me"] });
      toast.success("Berhasil menghapus kontak kami");
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const validateContactMe = Yup.object({
    name: Yup.string().required("Harap diisi"),
    email: Yup.string().required("Harap diisi"),
    phone_number: Yup.string().required("Harap diisi"),
    company_name: Yup.string().required("Harap diisi"),
    business_type_id: Yup.string().required("Harap diisi"),
    full_address: Yup.string().required("Harap diisi"),
    description: Yup.string().required("Harap diisi"),
  });

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
                Laporan Kontak
              </div>
              <div className="flex items-center gap-2">
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
                <button
                  onClick={() => {
                    setOpenAddModal(!openAddModal);
                    contactMeForm.current?.resetForm();
                  }}
                  className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  <FaPlus />
                  Tambah Laporan Kontak
                </button>
              </div>
            </div>
            <div className="flex px-10 w-full h-12 justify-between flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex gap-3">
                Show
                <select
                  className="border w-14 h-6 rounded-md"
                  onChange={(event) => {
                    setLimit(parseInt(event.target.value));
                    fetchContactMe();
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
                    fetchContactMe();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-40">Nama Lengkap</th>
                  <th className="text-xs w-40">Nama Perusahaan</th>
                  <th className="text-xs w-40">Alamat Lengkap</th>
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
                      onClick={() => {
                        showDetailModal(item.id);
                        fetchContactMeById(item.id);
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
                      <td className="text-xs pl-3">{item?.name}</td>
                      <td className="text-xs pl-3">{item?.company_name}</td>
                      <td className="text-xs pl-3">{item.full_address}</td>
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
                              fetchContactMeById(item.id);
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
      <input
        type="checkbox"
        id="addModal"
        className="modal-toggle"
        checked={openAddModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Tambah Laporan Kontak</h3>
          <Formik
            initialValues={{
              date: dayjs().format(),
              name: "",
              email: "",
              phone_number: "",
              company_name: "",
              business_type_id: "",
              full_address: "",
              description: "",
            }}
            validationSchema={validateContactMe}
            onSubmit={(values) => {
              setOpenAddModal(!openAddModal);
              postContactMe.mutate(values);
              setLoading(true);
            }}
            innerRef={contactMeForm}
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
                      <div className="text-sm pb-2">Nama :</div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Masukkan nama"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.name && touched.name && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email Perusahaan :</div>
                      <input
                        type="text"
                        placeholder="Masukkan Email"
                        name="email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon :</div>
                      <input
                        type="number"
                        name="phone_number"
                        placeholder="Masukkan Nomor Telepon"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.phone_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Perusahaan :</div>
                      <input
                        type="text"
                        name="company_name"
                        placeholder="Masukkan Nama Perusaaan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.company_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.company_name && touched.company_name && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.company_name}
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
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <textarea
                        placeholder="Masukkan Alamat Lengkap"
                        name="full_address"
                        className="w-full h-24 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.full_address && touched.full_address && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.full_address}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <textarea
                        placeholder="Masukkan Deskripsi"
                        name="description"
                        className="w-full h-24 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.description && touched.description && (
                        <div className="text-sm pt-1 text-red-500">
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
          <h3 className="font-bold text-lg pb-5">Edit Laporan Kontak</h3>
          <Formik
            initialValues={{
              date: dayjs().format("MM-DD-YYYY"),
              name: contactMeData?.name,
              email: contactMeData?.email,
              phone_number: contactMeData?.phone_number,
              company_name: contactMeData?.company_name,
              business_type_id: contactMeData?.business_type_id,
              full_address: contactMeData?.full_address,
              description: contactMeData?.description,
            }}
            validationSchema={validateContactMe}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              updateContactMe.mutate(values);
              setLoading(true);
            }}
            innerRef={contactMeForm}
            enableReinitialize={true}
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
                      <div className="text-sm pb-2">Nama :</div>
                      <input
                        type="text"
                        name="name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.name && touched.name && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email Perusahaan :</div>
                      <input
                        type="text"
                        name="email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon :</div>
                      <input
                        type="text"
                        name="phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.phone_number}
                        </div>
                      )}
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
                        <div className="text-sm pt-1 text-red-500">
                          {errors.company_name}
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
                        <div className="text-sm pt-1 text-red-500">
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
                        <div className="text-sm pt-1 text-red-500">
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
          <h3 className="font-bold text-lg pb-5">Detail Laporan Kontak</h3>
          <Formik
            initialValues={{
              date: dayjs().format("DD-MM-YYYY"),
              name: contactMeData?.name,
              email: contactMeData?.email,
              phone_number: contactMeData?.phone_number,
              company_name: contactMeData?.company_name,
              business_type_id: contactMeData?.business_type?.name,
              full_address: contactMeData?.full_address,
              description: contactMeData?.description,
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
              setFieldValue,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Nama :</div>
                      <input
                        type="text"
                        name="name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.name && touched.name && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email Perusahaan :</div>
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
                        <div className="text-sm pt-1 text-red-500">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon :</div>
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
                        <div className="text-sm pt-1 text-red-500">
                          {errors.phone_number}
                        </div>
                      )}
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
                        disabled
                      ></input>
                      {errors.company_name && touched.company_name && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.company_name}
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
                        <div className="text-sm pt-1 text-red-500">
                          {errors.business_type_id}
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
                        <div className="text-sm pt-1 text-red-500">
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
                        disabled
                      ></input>
                      {errors.description && touched.description && (
                        <div className="text-sm pt-1 text-red-500">
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
          <h3 className="font-bold text-lg pb-5">Hapus Laporan Kontak</h3>
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
      <MobileNav />
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(LaporanKontak);
