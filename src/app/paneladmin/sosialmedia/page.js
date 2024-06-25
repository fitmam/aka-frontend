"use client";
import React, { useEffect, useRef } from "react";
import Navbar from "../../../components/navbar";
import MobileNav from "@/components/mobilenav";
import http from "@/helpers/http.helper";
import Loading from "@/components/loading";
import * as Yup from "yup";
import Image from "next/image";
import { Field, Formik } from "formik";
import { Sidebar } from "../../../components/sidebar";
import { BsGearFill } from "react-icons/bs";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setColor } from "@/redux/reducer/colorscheme";
import { HiOutlineTrash } from "react-icons/hi";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function SosialMedia() {
  const token = getCookie("token");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAppLink, setOpenAppLink] = useState(false);
  const [openAppLinkModal, setOpenAppLinkModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState("");
  const [deletedData, setDeletedData] = useState("");
  const [pictureURI, setPictureURI] = useState("");
  const addSocialMedia = useRef();

  const queryClient = useQueryClient();

  async function fetchColor() {
    const { data } = await http().get("/color");
    return data.results;
  }

  function resetFile() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".file");
      file.value = "";
    }
  }

  function resetAppLink() {
    if (typeof window !== "undefined") {
      const file = document.querySelector(".applink");
      file.value = "";
    }
  }

  const { data: colorData } = useQuery({
    queryKey: ["color"],
    queryFn: () => fetchColor(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchSocialMedia() {
    const { data } = await http(token).get("/socialmedia?limit=100");
    return data.results;
  }

  const { data: socialMediaData } = useQuery({
    queryKey: ["socialmedia"],
    queryFn: () => fetchSocialMedia(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchAppLink() {
    const { data } = await http(token).get("/applink?limit=100");
    return data.results;
  }

  const { data: appLinkData } = useQuery({
    queryKey: ["applink"],
    queryFn: () => fetchAppLink(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const validateSocialMedia = Yup.object({
    name: Yup.string().required("Harap diisi"),
    url: Yup.string().required("Harap diisi"),
  });

  const postSocialMedia = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      form.append("name", values.name);
      form.append("url", values.url);
      return http(token).post(`/socialmedia`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialmedia"] });
      toast.success("Berhasil menambah socialmedia");
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/socialmedia/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialmedia"] });
      setLoading(false);
      toast.success("Berhasil menghapus sosial media");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const postAppLink = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      form.append("picture", values);
      if (!values) {
        toast.error("Harap diisi");
        return http(token).post(`/applinks`, form);
      } else {
        return http(token).post(`/applink`, form);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applink"] });
      toast.success("Berhasil menambah link aplikasi");
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDeleteAppLink = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/applink/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applink"] });
      setLoading(false);
      toast.success("Berhasil menghapus link aplikasi");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const dispatch = useDispatch();

  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);

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
        <div className="w-full bg-[#edf0f0] xl:p-8 flex gap-8 h-full overflow-y-scroll flex-col xl:flex-row">
          <div className="w-full h-screen bg-white shadow-xl">
            <div className="w-full h-auto">
              <div className="flex items-center gap-2 h-16 bg-[#fafafa] px-5">
                <BsGearFill color="#36404c" />
                <div className="uppercase font-medium text-[#36404c]">
                  Sosial Media
                </div>
              </div>
              <div className="flex w-full">
                <div className="flex-col p-4 gap-3 w-full justify-center items-center">
                  <div className="font-bold text-md mb-5">
                    Link Sosial Media
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="w-full max-w-xs">
                      {socialMediaData?.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className="flex gap-5 mb-5 rounded-xl bg-gray-200 p-5"
                          >
                            <div className="flex w-full items-center gap-5">
                              <Image
                                src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                                width={30}
                                height={30}
                                alt=""
                              ></Image>
                              <div className="w-full">
                                <div>{item.name}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setOpen(!open);
                                setDeletedData(item.id);
                              }}
                            >
                              <HiOutlineTrash size={20} color="red" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex-col p-4 gap-3 w-full justify-center items-center">
                  <div className="font-bold text-md mb-5">Link Aplikasi</div>
                  <div className="flex flex-col gap-5">
                    <div className="w-full max-w-xs">
                      {appLinkData?.data?.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className="flex gap-5 mb-5 rounded-xl bg-gray-200 p-5"
                          >
                            <div className="flex w-full items-center gap-5">
                              <Image
                                src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                                width={100}
                                height={100}
                                alt=""
                              ></Image>
                            </div>
                            <button
                              onClick={() => {
                                setOpenAppLink(!openAppLink);
                                setDeletedData(item.id);
                              }}
                            >
                              <HiOutlineTrash size={20} color="red" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-full">
                <button
                  onClick={() => {
                    setOpenModal(!openModal);
                    addSocialMedia?.current?.resetForm();
                    resetFile();
                  }}
                  className="btn btn-primary text-white bg-primary normal-case border-none mx-5 w-full max-w-xs"
                >
                  Tambah Sosial Media
                </button>
              </div>
              <div className="w-full">
                <button
                  onClick={() => {
                    setOpenAppLinkModal(!openAppLinkModal);
                    resetAppLink();
                    setSelectedPicture(false);
                  }}
                  className="btn btn-primary text-white bg-primary normal-case border-none mx-5 w-full max-w-xs"
                >
                  Tambah Link Aplikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
      {loading && <Loading />}
      <input
        type="checkbox"
        id="openModal"
        className="modal-toggle"
        checked={openModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Tambah Social Media</h3>
          <Formik
            initialValues={{
              url: "",
              name: "",
            }}
            onSubmit={(values) => {
              setOpenModal(!openModal);
              postSocialMedia.mutate(values);
              setLoading(true);
            }}
            innerRef={addSocialMedia}
            validationSchema={validateSocialMedia}
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
                      {selectedPicture && (
                        <Image
                          src={pictureURI}
                          width={100}
                          height={100}
                          alt=""
                        />
                      )}
                      <div className="text-sm pb-2">Picture :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full"
                        onChange={changePicture}
                      ></input>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama :</div>
                      <input
                        type="text"
                        name="name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                      ></input>
                      {errors.name && touched.name && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.name}
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
                  </div>
                  <div className="w-full pt-5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setOpenModal(!openModal)}
                      className="bg-red-500 text-white p-2 rounded-md cursor-pointer w-24"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 rounded-md cursor-pointer w-24"
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
            setOpenModal(!openModal);
          }}
        >
          Close
        </label>
      </div>
      <input
        type="checkbox"
        id="openModal"
        className="modal-toggle"
        checked={openAppLinkModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Tambah Link Aplikasi</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setOpenAppLinkModal(!openAppLinkModal);
              var fileInput = document.getElementById("applink");
              var selectedFile = fileInput.files[0];
              postAppLink.mutate(selectedFile);
            }}
          >
            <div className="flex flex-col gap-5 pb-3">
              <div>
                {selectedPicture && (
                  <Image src={pictureURI} width={100} height={100} alt="" />
                )}
                <div className="text-sm pb-2">Gambar :</div>
                <input
                  type="file"
                  id="applink"
                  name="picture"
                  className="applink file-input file-input-bordered w-full"
                  onChange={changePicture}
                ></input>
              </div>
            </div>
            <div className="w-full pt-5 flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setOpenAppLinkModal(!openAppLinkModal)}
                className="bg-red-500 text-white p-2 rounded-md cursor-pointer w-24"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded-md cursor-pointer w-24"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addAppLinkModal"
          onClick={() => {
            setOpenAppLinkModal(!openAppLinkModal);
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
          <h3 className="font-bold text-lg pb-5">Hapus Social Media</h3>
          <h3 className="font-bold text-lg pb-5">
            Apakah anda yakin ingin menghapusnya ?
          </h3>
          <div className="w-full pt-5 flex gap-4 justify-end">
            <button
              onClick={() => {
                setOpen(!open);
              }}
              type="button"
              className="bg-red-500 text-white p-2 rounded-md cursor-pointer w-24"
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
              className="bg-green-500 text-white p-2 rounded-md cursor-pointer w-24"
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
        id="deleteModal"
        className="modal-toggle"
        checked={openAppLink}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Hapus Link Aplikasi</h3>
          <h3 className="font-bold text-lg pb-5">
            Apakah anda yakin ingin menghapusnya ?
          </h3>
          <div className="w-full pt-5 flex gap-4 justify-end">
            <button
              onClick={() => {
                setOpenAppLink(!openAppLink);
              }}
              type="button"
              className="bg-red-500 text-white p-2 rounded-md cursor-pointer w-24"
            >
              Tidak
            </button>
            <button
              onClick={() => {
                setOpenAppLink(!openAppLink);
                setLoading(true);
                handleDeleteAppLink.mutate(deletedData);
              }}
              type="button"
              className="bg-green-500 text-white p-2 rounded-md cursor-pointer w-24"
            >
              Ya
            </button>
          </div>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="addModal"
          onClick={() => {
            setOpenAppLink(!openAppLink);
          }}
        >
          Close
        </label>
      </div>
    </div>
  );
}

export default WithAuth(SosialMedia);
