"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useRef } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import http from "@/helpers/http.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Formik } from "formik";
import Loading from "@/components/loading";
import { useState } from "react";
import * as Yup from "yup";
import Image from "next/image";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function Acara() {
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventContent, setEventContent] = useState([]);
  const [pictureURI, setPictureURI] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState([]);
  const addEvent = useRef();

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

  async function fetchEventsById(id) {
    try {
      const { data } = await http(token).get(`/events/${id}`);
      setEventContent(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  const queryClient = useQueryClient();

  async function fetchEvents(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/events?page=" + pageData + "&search=" + search + "&limit=" + limitData
    );
    return data.results;
  }

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setEventId(updatedId);
  };

  const { data } = useQuery({
    queryKey: ["events", page, searchData, limit],
    queryFn: () => fetchEvents(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const postEvents = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }

      form.append("title", values.title);
      form.append("slug", values.slug);
      form.append("date", values.date);
      form.append("place", values.place);
      form.append("start_time", values.start_time);
      form.append("end_time", values.end_time);
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
      return http(token).post("/events", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setLoading(false);
      toast.success("Berhasil menambah acara");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateEvents = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }

      form.append("title", values.title);
      form.append("slug", values.slug);
      form.append("date", values.date);
      form.append("place", values.place);
      form.append("start_time", values.start_time);
      form.append("end_time", values.end_time);
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
      return http(token).patch(`/events/${eventId}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setLoading(false);
      toast.success("Berhasil mengupdate acara");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setLoading(false);
      toast.success("Berhasil menghapus acara");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const validateEvents = Yup.object({
    title: Yup.string().required("Harap diisi"),
    slug: Yup.string().required("Harap diisi"),
    date: Yup.date().required("Harap diisi"),
    start_time: Yup.string().required("Harap diisi"),
    end_time: Yup.string().required("Harap diisi"),
    place: Yup.string().required("Harap diisi"),
  });

  function resetFile() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".file");
      file.value = "";
    }
  }

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
                Data Acara
              </div>
              <div>
                <button
                  onClick={() => {
                    setOpenAddModal(!openAddModal);
                    resetFile();
                    addEvent.current?.resetForm();
                    setSelectedPicture(false);
                  }}
                  className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  <FaPlus />
                  Tambah Acara
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
                    fetchEvents();
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
                    fetchEvents();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-40">Gambar</th>
                  <th className="text-xs w-40">Judul</th>
                  <th className="text-xs w-40">Url</th>
                  <th className="text-xs w-40">Tanggal</th>
                  <th className="text-xs w-40">Tempat</th>
                  <th className="text-xs w-40">Mulai</th>
                  <th className="text-xs w-40">Selesai</th>
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
                      <td className="pl-4 text-xs">
                        <div className="flex justify-center items-center py-3">
                          <Image
                            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                            width={50}
                            height={50}
                            alt=""
                          ></Image>
                        </div>
                      </td>
                      <td className="pl-4 text-xs">{item.title}</td>
                      <td className="pl-4 text-xs">{item.slug}</td>
                      <td className="pl-4 text-xs">
                        {dayjs(item.date).format("DD-MM-YYYY")}
                      </td>
                      <td className="pl-4 text-xs">{item.place}</td>
                      <td className="pl-4 text-xs">{item.start_time}</td>
                      <td className="pl-4 text-xs">{item.end_time}</td>
                      <td className="m-auto">
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            onClick={() => {
                              showUpdateModal(item.id);
                              fetchEventsById(item.id);
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
        id="addModal"
        className="modal-toggle"
        checked={openAddModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Tambah Acara</h3>
          <Formik
            initialValues={{
              title: "",
              slug: "",
              date: "",
              start_time: "",
              end_time: "",
              place: "",
            }}
            validationSchema={validateEvents}
            onSubmit={(values) => {
              setOpenAddModal(!openAddModal);
              postEvents.mutate(values);
              setLoading(true);
            }}
            innerRef={addEvent}
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
                        <div className="text-red-500">{errors.title}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Url :</div>
                      <input
                        type="text"
                        name="slug"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.slug}
                      ></input>
                      {errors.slug && touched.slug && (
                        <div className="text-red-500">{errors.slug}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tanggal :</div>
                      <input
                        type="date"
                        name="date"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.date}
                      ></input>
                      {errors.date && touched.date && (
                        <div className="text-red-500">{errors.date}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Mulai :</div>
                      <input
                        type="text"
                        name="start_time"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.start_time}
                      ></input>
                      {errors.start_time && touched.start_time && (
                        <div className="text-red-500">{errors.start_time}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Selesai :</div>
                      <input
                        type="text"
                        name="end_time"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.end_time}
                      ></input>
                      {errors.end_time && touched.end_time && (
                        <div className="text-red-500">{errors.end_time}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tempat :</div>
                      <input
                        type="text"
                        name="place"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.place}
                      ></input>
                      {errors.place && touched.place && (
                        <div className="text-red-500">{errors.place}</div>
                      )}
                    </div>
                  </div>
                  <div className="w-full pt-5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenAddModal(!openAddModal);
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
          <h3 className="font-bold text-lg pb-5">Edit Acara</h3>
          <Formik
            initialValues={{
              title: eventContent.title,
              slug: eventContent.slug,
              date: eventContent.date,
              start_time: eventContent.start_time,
              end_time: eventContent.end_time,
              place: eventContent.place,
            }}
            validationSchema={validateEvents}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              updateEvents.mutate(values);
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
                    {selectedPicture ? (
                      <Image src={pictureURI} width={100} height={100} alt="" />
                    ) : (
                      <Image
                        src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${eventContent.picture}`}
                        width={100}
                        height={100}
                        alt=""
                      />
                    )}
                    <div>
                      <div className="text-sm pb-2">Gambar :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full"
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
                        <div className="text-red-500">{errors.title}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Slug :</div>
                      <input
                        type="text"
                        name="slug"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.slug}
                      ></input>
                      {errors.slug && touched.slug && (
                        <div className="text-red-500">{errors.slug}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tanggal :</div>
                      <input
                        type="date"
                        name="date"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.date}
                      ></input>
                      {errors.date && touched.date && (
                        <div className="text-red-500">{errors.date}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Mulai :</div>
                      <input
                        type="text"
                        name="start_time"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.start_time}
                      ></input>
                      {errors.start_time && touched.start_time && (
                        <div className="text-red-500">
                          {errors.start_timetime}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Selesai :</div>
                      <input
                        type="text"
                        name="end_time"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.end_time}
                      ></input>
                      {errors.end_time && touched.end_time && (
                        <div className="text-red-500">
                          {errors.end_timetime}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tempat :</div>
                      <input
                        type="text"
                        name="place"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.place}
                      ></input>
                      {errors.place && touched.place && (
                        <div className="text-red-500">{errors.place}</div>
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
          <h3 className="font-bold text-lg pb-5">Hapus Acara</h3>
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

export default WithAuth(Acara);
