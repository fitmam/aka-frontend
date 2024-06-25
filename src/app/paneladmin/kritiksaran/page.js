"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useRef } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaDownload, FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import http from "@/helpers/http.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Formik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import * as Yup from "yup";
import Loading from "@/components/loading";
import { getCookie } from "cookies-next";
import {
  Document,
  Page,
  Text,
  Font,
  StyleSheet,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import WithAuth from "@/components/isauth";

function KritikSaran() {
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [feedbackId, setFeedbackId] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState();
  const [openPDFModal, setOpenPDFModal] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30,
      fontFamily: "Open Sans",
    },
    headerText: {
      textAlign: "center",
      fontSize: 20,
      marginBottom: 10,
    },
    table: {
      display: "table",
      width: "auto",
    },
    row: {
      flexDirection: "row",
      borderBottomColor: "#000000",
      borderBottomWidth: 1,
    },
    namaHeader: {
      width: "15%",
      margin: 5,
      fontSize: 8,
      fontWeight: "bold",
    },
    noHeader: {
      width: "5%",
      margin: 5,
      fontSize: 8,
      fontWeight: "bold",
    },
    headerCell: {
      width: "20%",
      margin: 5,
      fontSize: 8,
      fontWeight: "bold",
    },
    emailCell: {
      width: "40%",
      margin: 5,
      fontSize: 8,
      fontWeight: "bold",
    },
    noTelpCell: {
      width: "25%",
      margin: 5,
      fontSize: 8,
    },
    cell: {
      width: "20%",
      margin: 5,
      fontSize: 8,
    },
    headerText: {
      textAlign: "center",
      fontSize: 15,
      marginBottom: 20,
      fontWeight: "bold",
    },
  });

  Font.register({
    family: "Open Sans",
    src: "https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf",
  });

  const MyDocument = ({ data }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerText}>Data Laporan Kritik & Saran</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.noHeader}>No</Text>
            <Text style={styles.namaHeader}>Nama</Text>
            <Text style={styles.emailCell}>Email </Text>
            <Text style={styles.noTelpCell}>Nomor Telepon</Text>
            <Text style={styles.headerCell}>Jenis Kelamin</Text>
            <Text style={styles.headerCell}>Umur</Text>
            <Text style={styles.headerCell}>Alamat Lengkap</Text>
            <Text style={styles.headerCell}>Deskripsi</Text>
          </View>
          {data?.map((row, index) => (
            <View style={styles.row} key={row.id}>
              <Text style={styles.noHeader}>{index + 1}</Text>
              <Text style={styles.namaHeader}>{row.name}</Text>
              <Text style={styles.emailCell}>{row.email}</Text>
              <Text style={styles.noTelpCell}>{row.phone_number}</Text>
              <Text style={styles.noTelpCell}>{row.gender.name}</Text>
              <Text style={styles.cell}>{row.age}</Text>
              <Text style={styles.cell}>{row.full_address}</Text>
              <Text style={styles.cell}>{row.content}</Text>
            </View>
          ))}
        </View>
      </Page>
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
        Nama: row.name,
        Email: row.email,
        "Nomor Telepon": row.phone_number,
        "Jenis Kelamin": row.gender?.name,
        Umur: row.age,
        "Alamat Lengkap": row.full_address,
        Deskripsi: row.content,
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
  const addFeedback = useRef();

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

  async function fetchFeedback(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/feedback?page=" + pageData + "&search=" + search + "&limit=" + limitData
    );
    return data.results;
  }

  const showDetailModal = (itemId) => {
    const updatedId = itemId;
    setOpenDetail(!openDetail);
    setFeedbackId(updatedId);
  };

  async function fetchFeedbackById(id) {
    try {
      const { data } = await http(token).get(`/feedback/${id}`);
      setFeedbackData(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setFeedbackId(updatedId);
  };

  const { data } = useQuery({
    queryKey: ["feedback", page, searchData, limit],
    queryFn: () => fetchFeedback(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const postFeedback = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams(values).toString();
      return http(token).post("/feedback", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      setLoading(false);
      toast.success("Berhasil menambah feedback");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateFeedback = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams(values).toString();
      return http(token).patch(`/feedback/${feedbackId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      setLoading(false);
      toast.success("Berhasil mengupdate feedback");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/feedback/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      toast.success("Berhasil menghapus feedback");
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
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] flex gap-8 h-full overflow-y-scroll">
          <div className="w-full h-screen bg-white rounded-md overflow-auto">
            <div className="flex justify-between px-10 py-10 items-center w-full h-14">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Laporan Kritik & Saran
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (selectedData?.length >= 1) {
                        setOpenPDFModal(!openPDFModal);
                      } else {
                        toast.error("Silahkan ceklis data telebih dahulu");
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
                    addFeedback.current?.resetForm();
                  }}
                  className="bg-primary text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  <FaPlus />
                  Tambah Kritik & Saran
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
                    fetchFeedback();
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
                    fetchFeedback();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-40">Nama</th>
                  <th className="text-xs w-40">Email</th>
                  <th className="text-xs w-40">No Telpon</th>
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
                        fetchFeedbackById(item.id);
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
                      <td className="pl-4 text-xs">{item.name}</td>
                      <td className="pl-4 text-xs">{item.email}</td>
                      <td className="pl-4 text-xs">{item.phone_number}</td>
                      <td
                        className="m-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            onClick={() => {
                              fetchFeedbackById(item.id);
                              showUpdateModal(item.id);
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
          <h3 className="font-bold text-lg pb-5">Tambah Kritik & Saran</h3>
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
            validationSchema={validateFeedback}
            onSubmit={(values) => {
              postFeedback.mutate(values);
              setLoading(true);
              setOpenAddModal(!openAddModal);
            }}
            innerRef={addFeedback}
          >
            {({
              values,
              handleBlur,
              handleChange,
              errors,
              touched,
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
                        <div className="text-red-500">{errors.name}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        placeholder="Masukkan email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon :</div>
                      <input
                        type="text"
                        placeholder="Masukkan nomor telepon"
                        name="phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone_number}
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-red-500">
                          {errors.phone_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin :</div>
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
                      {errors.content && touched.content && (
                        <div className="text-red-500">{errors.content}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="text"
                        placeholder="Masukkan umur"
                        name="age"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.age}
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat :</div>
                      <textarea
                        type="text"
                        placeholder="Masukkan Alamat"
                        name="full_address"
                        className="w-full h-24 border focus:outline-none rounded-md px-4 pt-5"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.full_address}
                      ></textarea>
                      {errors.full_address && touched.full_address && (
                        <div className="text-red-500">
                          {errors.full_address}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <textarea
                        type="text"
                        placeholder="Masukkan Konten"
                        name="content"
                        className="w-full h-24 border focus:outline-none rounded-md px-4 pt-5"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                      ></textarea>
                      {errors.content && touched.content && (
                        <div className="text-red-500">{errors.content}</div>
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
          <h3 className="font-bold text-lg pb-5">Edit Kritik & Saran</h3>
          <Formik
            initialValues={{
              name: feedbackData?.name,
              email: feedbackData?.email,
              phone_number: feedbackData?.phone_number,
              gender_id: feedbackData?.gender_id,
              age: feedbackData?.age,
              full_address: feedbackData?.full_address,
              content: feedbackData?.content,
            }}
            validationSchema={validateFeedback}
            onSubmit={(values) => {
              updateFeedback.mutate(values);
              setLoading(true);
              setOpenEditModal(!openEditModal);
            }}
            enableReinitialize={true}
          >
            {({
              values,
              handleBlur,
              handleChange,
              errors,
              touched,
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
                        <div className="text-red-500">{errors.name}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon :</div>
                      <input
                        type="text"
                        name="phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone_number}
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-red-500">
                          {errors.phone_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin :</div>
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
                      {errors.content && touched.content && (
                        <div className="text-red-500">{errors.content}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="text"
                        name="age"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.age}
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat :</div>
                      <input
                        type="text"
                        name="full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.full_address}
                      ></input>
                      {errors.full_address && touched.full_address && (
                        <div className="text-red-500">
                          {errors.full_address}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Konten :</div>
                      <input
                        type="text"
                        name="content"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                      ></input>
                      {errors.content && touched.content && (
                        <div className="text-red-500">{errors.content}</div>
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
          <h3 className="font-bold text-lg pb-5">Detail Kritik & Saran</h3>
          <Formik
            initialValues={{
              name: feedbackData?.name,
              email: feedbackData?.email,
              phone_number: feedbackData?.phone_number,
              gender_id: feedbackData?.gender_id,
              age: feedbackData?.age,
              full_address: feedbackData?.full_address,
              content: feedbackData?.content,
            }}
            validationSchema={validateFeedback}
            onSubmit={(values) => {
              updateFeedback.mutate(values);
              setLoading(true);
              setOpenEditModal(!openEditModal);
            }}
            enableReinitialize={true}
          >
            {({
              values,
              handleBlur,
              handleChange,
              errors,
              touched,
              handleSubmit,
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
                        <div className="text-red-500">{errors.name}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        disabled
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon :</div>
                      <input
                        type="text"
                        name="phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone_number}
                        disabled
                      ></input>
                      {errors.phone_number && touched.phone_number && (
                        <div className="text-red-500">
                          {errors.phone_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin :</div>
                      <input
                        type="text"
                        name="gender_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.gender_id}
                        disabled
                      ></input>
                      {errors.gender_id && touched.gender_id && (
                        <div className="text-red-500">{errors.gender_id}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="text"
                        name="age"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.age}
                        disabled
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat :</div>
                      <input
                        type="text"
                        name="full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.full_address}
                        disabled
                      ></input>
                      {errors.full_address && touched.full_address && (
                        <div className="text-red-500">
                          {errors.full_address}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Konten :</div>
                      <input
                        type="text"
                        name="content"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                        disabled
                      ></input>
                      {errors.content && touched.content && (
                        <div className="text-red-500">{errors.content}</div>
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
          <h3 className="font-bold text-lg pb-5">Hapus Feedback</h3>
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

export default WithAuth(KritikSaran);
