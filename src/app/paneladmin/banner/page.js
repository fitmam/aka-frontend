"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useRef } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import http from "@/helpers/http.helper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import Image from "next/image";
import Loading from "@/components/loading";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function Banner() {
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [sliderId, setSliderId] = useState("");
  const [selectedPicture, setSelectedPicture] = useState("");
  const [sliderContent, setSliderContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pictureURI, setPictureURI] = useState("");

  const validateSlider = Yup.object({
    title: Yup.string().required("Harap diisi"),
    url: Yup.string().required("Harap diisi"),
    content: Yup.string().required("Harap diisi"),
    order: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa number"),
  });

  const dispatch = useDispatch();
  const addSlider = useRef();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const token = getCookie("token");

  const queryClient = useQueryClient();

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
    if (typeof windows !== "undefined") {
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

  async function fetchSliderById(id) {
    try {
      const { data } = await http(token).get(`/slider/${id}`);
      setSliderContent(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchSlider(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/slider?page=" + pageData + "&search=" + search + "&limit=" + limitData
    );
    return data.results;
  }

  function resetFile() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".file");
      file.value = "";
    }
  }

  const { data: sliderData } = useQuery({
    queryKey: ["slider", page, searchData, limit],
    queryFn: () => fetchSlider(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const postSlider = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }

      form.append("title", values.title);
      form.append("content", values.content);
      form.append("url", values.url);
      form.append("order", values.order);
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();
      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Format gambar tidak valid");
          return http(token).put(`/clients`, form);
        }
      }
      return http(token).post("/slider", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider"] });
      setLoading(false);
      toast.success("Berhasil menambah slider");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateSlider = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }

      form.append("title", values.title);
      form.append("content", values.content);
      form.append("url", values.url);
      form.append("order", values.order);
      const allowedExtensions = ["png", "jpg", "jpeg"];
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();
      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Format gambar tidak valid");
          return http(token).put(`/clients`, form);
        }
      }
      return http(token).patch(`/slider/${sliderId}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider"] });
      setLoading(false);
      toast.success("Berhasil mengupdate slider");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/slider/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider"] });
      setLoading(false);
      toast.success("Berhasil menghapus slider");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setSliderId(updatedId);
  };

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

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] xl:p-8 flex gap-8 h-full overflow-y-scroll">
          <div className="w-full h-screen bg-white rounded-md overflow-auto">
            <div className="flex justify-between px-10 py-10 items-center w-full h-14">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Data Banner
              </div>
              <div>
                <button
                  onClick={() => {
                    setOpenAddModal(!openAddModal);
                    resetFile();
                    addSlider.current?.resetForm();
                    setSelectedPicture(false);
                  }}
                  className="bg-primary text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  <FaPlus />
                  Tambah Banner
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
                    fetchSlider();
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
                    fetchSlider();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs">Gambar</th>
                  <th className="text-xs">Judul</th>
                  <th className="text-xs">Deskripsi</th>
                  <th className="text-xs">Order</th>
                  <th className="text-xs">Aksi</th>
                </tr>
                {sliderData?.data?.map((item, index) => {
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
                      <td className="text-xs pl-3">{item.title}</td>
                      <td className="text-xs pl-3">{item.content}</td>
                      <td className="text-xs pl-3">{item.order}</td>
                      <td className="m-auto">
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            onClick={() => {
                              showUpdateModal(item.id);
                              fetchSliderById(item.id);
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
              {sliderData?.data?.length === 0 && (
                <div className="w-full pt-5 text-xl flex justify-center items-center">
                  <div>No data found</div>
                </div>
              )}
            </div>
            <div className="w-full flex justify-between py-20 px-10">
              <div className="text-sm">
                Show {sliderData?.currentPage} of {sliderData?.totalPages}{" "}
                entries
              </div>
              <div className="flex">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={sliderData?.currentPage <= 1}
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
                  disabled={sliderData?.currentPage === sliderData?.totalPages}
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
          <h3 className="font-bold text-lg pb-5">Tambah Banner</h3>
          <Formik
            initialValues={{ title: "", content: "", url: "", order: "" }}
            validationSchema={validateSlider}
            onSubmit={(values) => {
              setOpenAddModal(!openAddModal);
              postSlider.mutate(values);
              setLoading(true);
            }}
            innerRef={addSlider}
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
                      {selectedPicture && (
                        <Image
                          src={pictureURI}
                          width={100}
                          height={100}
                          alt=""
                        />
                      )}
                      <div className="text-sm pb-2">Gambar :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file-input file-input-bordered w-full file"
                        onChange={changePicture}
                      ></input>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Judul :</div>
                      <input
                        type="text"
                        name="title"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.title && touched.title && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.title}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deksripsi :</div>
                      <textarea
                        type="text"
                        name="content"
                        className="w-full h-14 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                      ></textarea>
                      {errors.content && touched.content && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.content}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">URL :</div>
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
                      <div className="text-sm pb-2">Order :</div>
                      <input
                        type="number"
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
          <h3 className="font-bold text-lg pb-5">Edit Banner</h3>
          <Formik
            initialValues={{
              title: sliderContent.title,
              content: sliderContent.content,
              url: sliderContent.url,
              order: sliderContent.order,
            }}
            validationSchema={validateSlider}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              updateSlider.mutate(values);
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
                      {selectedPicture ? (
                        <Image
                          src={pictureURI}
                          width={100}
                          height={100}
                          alt=""
                        />
                      ) : (
                        <Image
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${sliderContent.picture}`}
                          width={100}
                          height={100}
                          alt=""
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Gambar :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file-input file-input-bordered w-full"
                        onChange={changePicture}
                      ></input>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Judul :</div>
                      <input
                        type="text"
                        name="title"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.title && touched.title && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.title}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deskripsi :</div>
                      <textarea
                        type="text"
                        name="content"
                        className="w-full h-14 border focus:outline-none rounded-md px-4"
                        value={values.content}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.content && touched.content && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.content}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">URL :</div>
                      <input
                        type="text"
                        name="url"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.url && touched.url && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.url}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Order :</div>
                      <input
                        type="number"
                        name="order"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.order}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                      onClick={() => {
                        setOpenEditModal(!openEditModal);
                        setSelectedPicture(false);
                      }}
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
        id="deleteModal"
        className="modal-toggle"
        checked={open}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Hapus Banner</h3>
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

export default WithAuth(Banner);
