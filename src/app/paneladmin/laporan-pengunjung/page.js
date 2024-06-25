"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaDownload, FaTrash } from "react-icons/fa";
import http from "@/helpers/http.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import { getCookie } from "cookies-next";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  View,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import WithAuth from "@/components/isauth";

function LaporanPengunjung() {
  const [open, setOpen] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [openPDFModal, setOpenPDFModal] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30,
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
    headerCell: {
      width: "20%",
      margin: 5,
      fontSize: 12,
      fontWeight: "bold",
    },
    cell: {
      width: "20%",
      margin: 5,
      fontSize: 10,
    },
    headerText: {
      textAlign: "center",
      fontSize: 15,
      marginBottom: 20,
      fontWeight: "bold",
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
      <Page size="A4" style={styles.page}>
        <Text style={styles.headerText}>Data Laporan Pengunjung</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>No</Text>
            <Text style={styles.headerCell}>IP Address</Text>
            <Text style={styles.headerCell}>Tanggal </Text>
            <Text style={styles.headerCell}>Waktu </Text>
            <Text style={styles.headerCell}>User Agent</Text>
          </View>
          {data?.map((row, index) => (
            <View style={styles.row} key={row.id}>
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>{row.ipAddress}</Text>
              <Text style={styles.cell}>{row.visitDate}</Text>
              <Text style={styles.cell}>{row.time}</Text>
              <Text style={styles.cell}>{row.userAgent}</Text>
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

  const dispatch = useDispatch();
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

  async function fetchVisitor(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/visitor/count?page=" +
        pageData +
        "&search=" +
        search +
        "&limit=" +
        limitData
    );
    return data.results;
  }

  const { data } = useQuery({
    queryKey: ["visitor", page, searchData, limit],
    queryFn: () => fetchVisitor(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/visitor/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitor"] });
      setLoading(false);
      toast.success("Berhasil menghapus visitor");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const ExportToExcel = ({ data }) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToExcel = () => {
      const formattedData = selectedData.map((row) => ({
        No: row.id,
        "IP Address": row.ipAddress,
        "Tanggal Kunjungan": row.visitDate,
        "Waktu Kunjungan": row.time,
        "User Agent": row.userAgent,
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
                Laporan Pengunjung
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
              </div>
            </div>
            <div className="flex px-10 w-full h-12 justify-between flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex gap-3">
                Show
                <select
                  className="border w-14 h-6 rounded-md"
                  onChange={(event) => {
                    setLimit(parseInt(event.target.value));
                    fetchVisitor();
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
                    fetchVisitor();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-scroll">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-40">IP Address</th>
                  <th className="text-xs w-40">Tanggal Kunjungan</th>
                  <th className="text-xs w-40">Waktu Kunjungan</th>
                  <th className="text-xs w-40">User Agent</th>
                  <th className="text-xs w-40">Aksi</th>
                </tr>
                {data?.data?.map((row, index) => {
                  const isOddRow = index % 2 !== 0;
                  return (
                    <tr
                      className={`h-12 text-center hover:bg-[#F3F3F3] cursor-pointer ${
                        isOddRow ? "bg-[#F3F3F3]" : ""
                      }`}
                      key={row.id}
                    >
                      <td className="text-xs pl-3">
                        <div className="flex gap-2">
                          <input
                            type="checkbox"
                            className="checkbox w-4 h-4"
                            onChange={(e) => handleCheckboxChange(e, row)}
                          />
                          <div>{index + 1}</div>
                        </div>
                      </td>
                      <td className="text-xs pl-3">{row.ipAddress}</td>
                      <td className="text-xs pl-3">{row.visitDate}</td>
                      <td className="text-xs pl-3">{row.time}</td>
                      <td className="text-xs pl-3">{row.userAgent}</td>
                      <td className="m-auto">
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(!open);
                              setDeletedData(row.id);
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
        id="deleteModal"
        className="modal-toggle"
        checked={open}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Hapus Team</h3>
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
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(LaporanPengunjung);
