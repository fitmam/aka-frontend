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
import { useState } from "react";
import Image from "next/image";
import { Field, Formik } from "formik";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import * as Yup from "yup";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function Testimoni() {
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [testimonyId, setTestimonyId] = useState("");
  const [selectedPicture, setSelectedPicture] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [pictureURI, setPictureURI] = useState("");
  const [testimonyData, setTestimonyData] = useState([]);

  const addTestimony = useRef();

  const validateTestimony = Yup.object({
    name: Yup.string().required("Harap diisi"),
    description: Yup.string().required("Harap diisi"),
    position_id: Yup.string().required("Harap diisi"),
  });

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

  async function fetchPosition() {
    const { data } = await http(token).get("/position-of-work");
    return data.results;
  }

  const { data: positionData } = useQuery({
    queryKey: ["position"],
    queryFn: () => fetchPosition(),
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

  async function fetchTestimonyById(id) {
    try {
      const { data } = await http(token).get(`/testimony/${id}`);
      setTestimonyData(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  const queryClient = useQueryClient();

  async function fetchTestimony(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/testimony?page=" +
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
    setTestimonyId(updatedId);
  };

  const { data } = useQuery({
    queryKey: ["testimony", page, searchData, limit],
    queryFn: () => fetchTestimony(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  function resetFile() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".picture");
      const profilephoto = document.querySelector(".profilephoto");
      file.value = "";
      profilephoto.value = "";
    }
  }

  function resetUpdateFile() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".editpicture");
      const profilephoto = document.querySelector(".editprofilephoto");
      file.value = "";
      profilephoto.value = "";
    }
  }

  const postTestimony = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      if (profilePhoto) {
        form.append("profilephoto", profilePhoto);
      }
      form.append("name", values.name);
      form.append("position_id", values.position_id);
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
      return http(token).post("/testimony", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony"] });
      setLoading(false);
      toast.success("Berhasil menambah testimony");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateTestimony = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      if (profilePhoto) {
        form.append("profilephoto", profilePhoto);
      }
      form.append("name", values.name);
      form.append("position_id", values.position_id);
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
      return http(token).patch(`/testimony/${testimonyId}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony"] });
      setLoading(false);
      toast.success("Berhasil mengupdate testimony");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/testimony/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimony"] });
      setLoading(false);
      toast.success("Berhasil menghapus testimony");
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

  const changeProfilePhoto = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
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
                Data Testimoni
              </div>
              <div>
                <button
                  onClick={() => {
                    setOpenAddModal(!openAddModal);
                    resetFile();
                    addTestimony.current?.resetForm();
                    setSelectedPicture(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-primary text-white p-2.5 rounded-md text-xs"
                >
                  <FaPlus />
                  Tambah Testimoni
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
                    fetchTestimony();
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
                    fetchTestimony();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none overflow-hidden">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-12">Gambar</th>
                  <th className="text-xs w-40">Foto Profil</th>
                  <th className="text-xs w-40">Nama</th>
                  <th className="text-xs w-40">Jabatan</th>
                  <th className="text-xs w-40">Deskripsi</th>
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
                      <td className="pl-4 text-xs ">
                        <div className="w-full flex justify-center items-center">
                          <Image
                            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                            width={50}
                            height={50}
                            alt=""
                          ></Image>
                        </div>
                      </td>
                      <td className="pl-4 text-xs ">
                        <div className="w-full flex justify-center items-center">
                          <Image
                            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.profilephoto}`}
                            width={50}
                            height={50}
                            alt=""
                          ></Image>
                        </div>
                      </td>
                      <td className="text-xs pl-3">{item.name}</td>
                      <td className="text-xs pl-3">{item.position.name}</td>
                      <td className="text-xs pl-3">{item.description}</td>
                      <td className="m-auto">
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            onClick={() => {
                              showUpdateModal(item.id);
                              fetchTestimonyById(item.id);
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
          <h3 className="font-bold text-lg pb-5">Tambah Testimoni</h3>
          <Formik
            innerRef={addTestimony}
            initialValues={{
              name: "",
              position_id: "",
              description: "",
            }}
            onSubmit={(values) => {
              setLoading(true);
              postTestimony.mutate(values);
              setOpenAddModal(!openAddModal);
            }}
            validationSchema={validateTestimony}
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
                        className="picture file-input file-input-bordered w-full"
                        onChange={changePicture}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Foto Profil :</div>
                      <input
                        type="file"
                        name="profilephoto"
                        className="file file-input file-input-bordered w-full profilephoto"
                        onChange={changeProfilePhoto}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama:</div>
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
                      <div className="text-sm pb-2">Posisi :</div>
                      <Field
                        as="select"
                        name="position_id"
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="" selected disabled>
                          Pilih posisi
                        </option>
                        {positionData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.position_id && touched.position_id && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.position_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Deskripsi:</div>
                      <input
                        type="text"
                        name="description"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                      ></input>
                      {errors.description && touched.description && (
                        <div className="text-red-500">{errors.description}</div>
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
          <h3 className="font-bold text-lg pb-5">Edit Testimoni</h3>
          <Formik
            initialValues={{
              name: testimonyData.name,
              description: testimonyData.description,
              position_id: testimonyData.position,
            }}
            validationSchema={validateTestimony}
            onSubmit={(values) => {
              updateTestimony.mutate(values);
              setLoading(true);
              setOpenEditModal(!openEditModal);
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
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${testimonyData.picture}`}
                          width={100}
                          height={100}
                          alt=""
                        />
                      )}
                      <div className="text-sm pb-2">Gambar :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full editpicture"
                        onChange={changePicture}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                      <div>
                        <Image
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${testimonyData.profilephoto}`}
                          width={100}
                          height={100}
                          alt=""
                        />
                        <div className="text-sm pb-2">Foto Profil :</div>
                        <input
                          type="file"
                          name="profilephoto"
                          className="file file-input file-input-bordered w-full profilephoto"
                          onChange={changeProfilePhoto}
                        ></input>
                        <div className="text-red-500 text-xs pt-2">
                          Maks 1 MB *
                        </div>
                      </div>
                    </div>
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
                      <div className="text-sm pb-2">Posisi :</div>
                      <Field
                        as="select"
                        name="position_id"
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        {positionData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.position_id && touched.position_id && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.position_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Description :</div>
                      <input
                        type="text"
                        name="description"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.description && touched.description && (
                        <div className="text-red-500">{errors.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="w-full pt-5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenEditModal(!openEditModal);
                        resetUpdateFile();
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
      </div>
      <input
        type="checkbox"
        id="deleteModal"
        className="modal-toggle"
        checked={open}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Hapus Testimoni</h3>
          <h3 className="font-bold text-lg pb-5">
            Apakah anda yakin ingin menghapusnya ?
          </h3>
          <div className="w-full pt-5 flex gap-4 justify-end">
            <button
              onClick={() => {
                setOpen(!open);
                resetFile();
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
                setLoading(true);
              }}
              type="button"
              className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
            >
              Ya
            </button>
          </div>
        </div>
      </div>
      <MobileNav />
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(Testimoni);
