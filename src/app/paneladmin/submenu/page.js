"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useCallback } from "react";
import { useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Formik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import http from "@/helpers/http.helper";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import * as Yup from "yup";
import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function SubMenu() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [open, setOpen] = useState(false);
  const [menuId, setMenuId] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(false);

  const validateMenu = Yup.object({
    menu: Yup.string().required("Harap diisi"),
    url: Yup.string().required("Harap diisi"),
    target: Yup.string().required("Harap diisi"),
    order: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa number"),
  });

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

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

  async function fetchSubMenu(pageData = page, limitData = limit) {
    const { data } = await http(token).get(
      "/sub-menu?page=" + pageData + "&search=" + search + "&limit=" + limitData
    );
    return data.results;
  }

  const fetchSub = useCallback(async () => {
    const { data } = await http(token).get(`sub-menu?search=${search}`);
    setMenuData(data.results);
  }, [search, token]);

  useEffect(() => {
    fetchSub();
  }, [fetchSub]);

  const { data } = useQuery({
    queryKey: ["sub-menu", page, searchData, limit],
    queryFn: () => fetchSubMenu(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setMenuId(updatedId);
  };

  async function fetchSubMenuById(item) {
    const { data } = await http(token).get(`/sub-menu?id=${item}`);
    setMenuData(data.results);
  }

  const updateSubMenu = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams({
        menu: values.menu,
        url: values.url,
        target: values.target,
        order: values.order,
      }).toString();

      return http(token).patch(`/sub-menu/${menuId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-menu"] });
      setLoading(false);
      toast.success("Berhasil mengupdate sub menu");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/sub-menu/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-menu"] });
      setLoading(false);
      toast.success("Berhasil menghapus sub menu");
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
        <div className="w-full bg-[#edf0f0] p-8 flex gap-8 h-full overflow-y-scroll">
          <div className="w-full h-screen bg-white rounded-md overflow-auto">
            <div className="flex justify-between px-10 py-10 items-center w-full h-14">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Data Sub Menu
              </div>
            </div>
            <div className="flex px-10 w-full h-12 justify-between flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex gap-3">
                Show
                <select
                  className="border w-14 h-6 rounded-md"
                  onChange={(event) => {
                    setLimit(parseInt(event.target.value));
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
                    fetchSubMenu();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-[10%]">No</th>
                  <th className="text-xs w-[30%]">Menu</th>
                  <th className="text-xs w-[20%]">Url</th>
                  <th className="text-xs">Target</th>
                  <th className="text-xs">Order</th>
                  <th className="text-xs">Aksi</th>
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
                      <td className="text-xs pl-3">{index + 1}</td>
                      <td className="pl-4 text-xs">{item.menu}</td>
                      <td className="pl-4 text-xs">{item.url}</td>
                      <td className="pl-4 text-xs">{item.target}</td>
                      <td className="pl-4 text-xs">{item.order}</td>
                      <td className="m-auto">
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            onClick={() => {
                              showUpdateModal(item.id);
                              fetchSubMenuById(item.id);
                            }}
                            className="text-xs bg-orange-500 text-white rounded-md p-1 flex items-center gap-2"
                          >
                            <FaPencil size={10} />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setOpen(!open);
                              setDeletedData(item.id);
                            }}
                            className="text-xs bg-red-500 text-white rounded-md p-1 flex items-center gap-2"
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
        id="editModal"
        className="modal-toggle"
        checked={openEditModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Update Menu</h3>
          <Formik
            initialValues={{
              menu: menuData?.data?.[0]?.menu,
              url: menuData?.data?.[0]?.url,
              target: menuData?.data?.[0]?.target,
              order: menuData?.data?.[0]?.order,
            }}
            validationSchema={validateMenu}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              updateSubMenu.mutate(values);
              setLoading(true);
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
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Menu :</div>
                      <input
                        type="text"
                        name="menu"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.menu}
                      ></input>
                      {errors.menu && touched.menu && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.menu}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Url :</div>
                      <input
                        type="text"
                        name="url"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.url}
                      ></input>
                      {errors.url && touched.url && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.url}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Target :</div>
                      <input
                        type="text"
                        name="target"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.target}
                      ></input>
                      {errors.target && touched.target && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.target}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Order :</div>
                      <input
                        type="text"
                        name="order"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.order}
                      ></input>
                      {errors.order && touched.order && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.order}
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
                      Close
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
                    >
                      Update
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
          <h3 className="font-bold text-lg pb-5">Hapus Sub Menu</h3>
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

export default WithAuth(SubMenu);
