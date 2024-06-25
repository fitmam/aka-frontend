"use client";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useRef, useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import MobileNav from "@/components/mobilenav";
import http from "@/helpers/http.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Formik } from "formik";
import { toast } from "react-toastify";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import { getCookie } from "cookies-next";
import * as Yup from "yup";
import WithAuth from "@/components/isauth";

function Team() {
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedData, setDeletedData] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchData, setSearchData] = useState("");
  const [teamId, setTeamId] = useState("");
  const [selectedPicture, setSelectedPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [pictureURI, setPictureURI] = useState("");
  const [teamData, setTeamData] = useState([]);

  const addTeam = useRef();

  const dispatch = useDispatch();

  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const token = getCookie("token");

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

  async function fetchTeamById(id) {
    try {
      const { data } = await http(token).get(`/team/${id}`);
      setTeamData(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchTeam(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/team?page=" + pageData + "&search=" + search + "&limit=" + limitData
    );
    return data.results;
  }

  async function fetchDepartement(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/departement?page=" +
        pageData +
        "&search=" +
        search +
        "&limit=" +
        limitData
    );
    return data.results;
  }

  const { data: departementData } = useQuery({
    queryKey: ["departement", page, searchData, limit],
    queryFn: () => fetchDepartement(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchPosition(
    pageData = page,
    search = searchData,
    limitData = limit
  ) {
    const { data } = await http(token).get(
      "/position-of-work?page=" +
        pageData +
        "&search=" +
        search +
        "&limit=" +
        limitData
    );
    return data.results;
  }

  const { data: positionData } = useQuery({
    queryKey: ["position", page, searchData, limit],
    queryFn: () => fetchPosition(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setTeamId(updatedId);
  };

  const { data } = useQuery({
    queryKey: ["team", page, searchData, limit],
    queryFn: () => fetchTeam(page, searchData, limit),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const postTeam = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      form.append("name", values.name);
      form.append("position_id", values.position_id);
      form.append("departement_id", values.departement_id);
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
      return http(token).post("/team", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setLoading(false);
      toast.success("Berhasil menambah team");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateTeam = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      form.append("name", values.name);
      form.append("position_id", values.position_id);
      form.append("departement_id", values.departement_id);
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
      return http(token).patch(`/team/${teamId}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setLoading(false);
      toast.success("Berhasil mengupdate team");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: (id) => {
      return http(token).delete(`/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setLoading(false);
      toast.success("Berhasil menghapus team");
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

  const validateTeam = Yup.object({
    name: Yup.string().required("Harap diisi"),
    position_id: Yup.number().required("Harap diisi"),
    departement_id: Yup.number().required("Harap diisi"),
  });

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
                Data Team
              </div>
              <div>
                <button
                  onClick={() => {
                    setOpenAddModal(!openAddModal);
                    addTeam.current?.resetForm();
                    setSelectedPicture(false);
                    resetFile();
                  }}
                  className="bg-primary cursor-pointer text-white p-2.5 rounded-md text-xs flex justify-center items-center gap-2"
                >
                  <FaPlus />
                  Tambah Team
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
                    fetchTeam();
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
                    fetchTeam();
                  }}
                ></input>
              </div>
            </div>
            <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
              <table className="w-full">
                <tr className="h-16 bg-[#E0F4FF]">
                  <th className="text-xs w-12">No</th>
                  <th className="text-xs w-40">Gambar</th>
                  <th className="text-xs w-40">Nama</th>
                  <th className="text-xs w-40">Departemen</th>
                  <th className="text-xs w-40">Posisi</th>
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
                      <td className="text-xs pl-3 py-5">
                        <div className="flex justify-center items-center">
                          <Image
                            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.picture}`}
                            width={50}
                            height={50}
                            alt=""
                          ></Image>
                        </div>
                      </td>
                      <td className="text-xs pl-3">{item.name}</td>
                      <td className="pl-4 text-center text-xs">
                        {item.departement.name}
                      </td>
                      <td className="pl-4 text-xs">{item.position.name}</td>
                      <td className="m-auto">
                        <div className="flex gap-3 justify-center items-center">
                          <button
                            onClick={() => {
                              showUpdateModal(item.id);
                              fetchTeamById(item.id);
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
      <input
        type="checkbox"
        id="addModal"
        className="modal-toggle"
        checked={openAddModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Tambah Team</h3>
          <Formik
            innerRef={addTeam}
            initialValues={{ name: "", departement_id: "", position_id: "" }}
            validationSchema={validateTeam}
            onSubmit={(values, { resetForm }) => {
              setOpenAddModal(!openAddModal);
              postTeam.mutate(values);
              setLoading(true);
              resetForm();
            }}
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
                        className="file file-input-bordered file-input w-full"
                        onChange={changePicture}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Team :</div>
                      <input
                        type="text"
                        name="name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.name && touched.name && (
                        <div className="text-xs text-red-500 pt-1">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Departemen :</div>
                      <Field
                        as="select"
                        name="departement_id"
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="" selected disabled>
                          Pilih departemen
                        </option>
                        {departementData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.departement_id && touched.departement_id && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.departement_id}
                        </div>
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
          <h3 className="font-bold text-lg pb-5">Edit Team</h3>
          <Formik
            initialValues={{
              name: teamData.name,
              departement_id: teamData?.departement?.id,
              position_id: teamData?.position?.id,
            }}
            onSubmit={(values) => {
              setOpenEditModal(!openEditModal);
              updateTeam.mutate(values);
              setLoading(true);
            }}
            enableReinitialize={true}
            validationSchema={validateTeam}
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
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${teamData.picture}`}
                          width={100}
                          height={100}
                          alt=""
                        />
                      )}
                      <div className="text-sm pb-2">Gambar :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input-bordered file-input w-full"
                        onChange={changePicture}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Team :</div>
                      <input
                        type="text"
                        name="name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.name && touched.name && <div>{errors.name}</div>}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Departemen :</div>
                      <Field
                        as="select"
                        name="departement_id"
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value={""} disabled selected>
                          Silahkan Pilih Departemen
                        </option>
                        {departementData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.departement_id && touched.departement_id && (
                        <div className="text-sm pt-1 text-red-500">
                          {errors.departement_id}
                        </div>
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
                        <option value={""} disabled selected>
                          Silahkan Pilih Posisi
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
      <MobileNav />
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(Team);
