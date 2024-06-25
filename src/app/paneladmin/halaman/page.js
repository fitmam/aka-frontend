"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import http from "@/helpers/http.helper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { toast } from "react-toastify";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Loading from "@/components/loading";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function Halaman() {
  const [open, setOpen] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function fetchPages(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/pages?page=" + pageData + "&search=" + search + "&limit=" + limitData
    );
    return data.results;
  }

  const { data } = useQuery({
    queryKey: ["pages", page, searchData, limit],
    queryFn: () => fetchPages(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Berhasil menghapus halaman");
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] xl:p-8 flex gap-8 h-full overflow-y-scroll">
          <div className="w-full h-full bg-white rounded-md overflow-auto">
            <div className="flex justify-between px-10 py-10 items-center w-full h-14">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Data Halaman
              </div>
              <div>
                <Link
                  href="/paneladmin/tambah-halaman"
                  className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  <FaPlus />
                  Tambah Halaman
                </Link>
              </div>
            </div>
            <div className="flex px-10 w-full h-12 justify-between flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex gap-3">
                Show
                <select
                  className="border w-14 h-6 rounded-md"
                  onChange={(event) => {
                    setLimit(parseInt(event.target.value));
                    fetchPages();
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
                    fetchPages();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-12">Gambar</th>
                  <th className="text-xs w-40">Judul</th>
                  <th className="text-xs w-40">Kategori</th>
                  <th className="text-xs w-40">Tanggal</th>
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
                    >
                      <td className="text-xs pl-3 text-center">{index + 1}</td>
                      <td className="text-xs pl-3">
                        <Image
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                          width={50}
                          height={50}
                          alt=""
                        ></Image>
                      </td>
                      <td className="pl-4 text-xs">{item.title}</td>
                      <td className="pl-4 text-xs">{item.category.title}</td>
                      <td className="pl-4 text-xs">
                        {dayjs(item.createdAt).format("DD-MM-YYYY")}
                      </td>
                      <td className="m-auto">
                        <div className="flex gap-3 justify-center items-center">
                          <Link
                            href={`/halaman/${item.slug}`}
                            className="text-xs bg-green-500 text-white rounded-md p-1 flex items-center gap-2"
                          >
                            <FaEye size={15} />
                          </Link>
                          <Link
                            href={{
                              pathname: "/paneladmin/edit-halaman",
                              query: { id: item.id },
                            }}
                            className="cursor-pointer text-xs bg-orange-500 text-white rounded-md p-1 flex items-center gap-2"
                          >
                            <FaPencil size={10} />
                            Edit
                          </Link>
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
                  className="border px-2 py-2 text-sm disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
                >
                  Previous
                </button>
                <button
                  className="border px-4 py-2 text-sm"
                  onClick={() => setPage(1)}
                >
                  1
                </button>
                <button
                  onClick={() => setPage(2)}
                  className="border px-4 py-2 text-sm"
                >
                  2
                </button>
                <button
                  className="border px-2 py-2 text-sm disabled:cursor-not-allowed disabled:bg-white disabled:text-black"
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
          <h3 className="font-bold text-lg pb-5">Hapus Halaman</h3>
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
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(Halaman);
