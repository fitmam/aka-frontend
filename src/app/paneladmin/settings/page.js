"use client";
import React, { useEffect } from "react";
import Navbar from "../../../components/navbar";
import MobileNav from "@/components/mobilenav";
import http from "@/helpers/http.helper";
import { Sidebar } from "../../../components/sidebar";
import { BsGearFill } from "react-icons/bs";
import { BsCheck } from "react-icons/bs";
import { Formik } from "formik";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import * as Yup from "yup";
import Image from "next/image";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function Settings() {
  const token = getCookie("token");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedLogo, setSelectedLogo] = useState("");
  const [loading, setLoading] = useState(false);

  const validateAppInfo = Yup.object({
    name: Yup.string().required("Harap diisi"),
    description: Yup.string().required("Harap diisi"),
    phone: Yup.string().required("Harap diisi"),
    email: Yup.string().required("Harap diisi"),
    address: Yup.string().required("Harap diisi"),
    logo_width: Yup.string().required("Harap diisi"),
    logo_height: Yup.string().required("Harap diisi"),
  });

  const queryClient = useQueryClient();

  async function fetchAppInfo() {
    const { data } = await http(token).get("/appinfo");
    return data.results;
  }

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

  const { data } = useQuery({
    queryKey: ["appinfo"],
    queryFn: () => fetchAppInfo(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const updateAppInfo = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedIcon) {
        form.append("icon", selectedIcon);
      }

      if (selectedLogo) {
        form.append("logo", selectedLogo);
      }

      form.append("name", values.name);
      form.append("description", values.description);
      form.append("phone", values.phone);
      form.append("email", values.email);
      form.append("address", values.address);
      form.append("logo_width", values.logo_width);
      form.append("logo_height", values.logo_height);

      return http(token).patch(`/appinfo/1`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appinfo"] });
      toast.success("Berhasil mengupdate informasi aplikasi");
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const changeIcon = (e) => {
    const file = e.target.files[0];
    setSelectedIcon(file);
  };

  const changeLogo = (e) => {
    const file = e.target.files[0];
    setSelectedLogo(file);
  };

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

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] xl:p-8 flex gap-8 h-full overflow-y-scroll flex-col xl:flex-row">
          <div className="w-full h-screen bg-white shadow-xl overflow-auto">
            <div className="w-full h-auto">
              <div className="flex items-center gap-2 h-16 bg-[#fafafa] px-5">
                <BsGearFill color="#36404c" />
                <div className="uppercase font-medium text-[#36404c]">Umum</div>
              </div>
              <div>
                <div className="flex-col p-4 gap-3">
                  <Formik
                    initialValues={{
                      name: data?.[0]?.name,
                      description: data?.[0]?.description,
                      phone: data?.[0]?.phone,
                      email: data?.[0]?.email,
                      address: data?.[0]?.address,
                      logo_width: data?.[0]?.logo_width,
                      logo_height: data?.[0]?.logo_height,
                    }}
                    validationSchema={validateAppInfo}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                      updateAppInfo.mutate(values);
                      setLoading(true);
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
                          <div className="max-w-sm">
                            <div className="text-[#797979] font-bold text-sm">
                              Nama Aplikasi
                            </div>
                            <div>
                              <input
                                type="text"
                                className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                name="name"
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
                          </div>
                          <div className="flex gap-10">
                            <div className="flex flex-col">
                              <div className="flex w-full gap-10">
                                <div>
                                  <div>
                                    <Image
                                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${data?.[0]?.logo}`}
                                      width={100}
                                      height={100}
                                      alt=""
                                      unoptimized
                                    ></Image>
                                  </div>
                                  <div>
                                    <div>Upload Logo</div>
                                    <div>
                                      <input
                                        type="file"
                                        onChange={changeLogo}
                                        accept="image/jpg, image/jpeg, image/png, image/vnd.microsoft.icon"
                                        className="file file-input file-input-bordered"
                                      ></input>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div>
                                    <Image
                                      src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${data?.[0]?.icon}`}
                                      width={
                                        parseInt(data?.[0]?.logo_width) || 100
                                      }
                                      height={
                                        parseInt(data?.[0]?.logo_height) || 100
                                      }
                                      alt=""
                                      unoptimized
                                    ></Image>
                                  </div>
                                  <div>Upload Icon</div>
                                  <div>
                                    <input
                                      type="file"
                                      onChange={changeIcon}
                                      accept="image/jpg, image/jpeg, image/png, image/vnd.microsoft.icon"
                                      className="file file-input file-input-bordered"
                                    ></input>
                                  </div>
                                </div>
                              </div>
                              <div className="flex pt-2 w-full gap-10">
                                <div className="pt-2 w-full">
                                  <div className="text-sm text-[#797979] font-bold">
                                    Lebar Logo
                                  </div>
                                  <input
                                    type="text"
                                    name="logo_width"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.logo_width}
                                    className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                  ></input>
                                  {errors.logo_width && touched.logo_width && (
                                    <div className="text-sm pt-1 text-red-500">
                                      {errors.logo_width}
                                    </div>
                                  )}
                                </div>
                                <div className="pt-2 w-full">
                                  <div className="text-sm text-[#797979] font-bold">
                                    Tinggi Logo
                                  </div>
                                  <input
                                    type="text"
                                    name="logo_height"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.logo_height}
                                    className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                  ></input>
                                  {errors.logo_height &&
                                    touched.logo_height && (
                                      <div className="text-sm pt-1 text-red-500">
                                        {errors.logo_height}
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="flex pt-2 w-full gap-10">
                                <div className="text-sm w-full">
                                  <div className="text-[#797979] font-bold">
                                    No HP
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      name="phone"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.phone}
                                      className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                    ></input>
                                    {errors.phone && touched.phone && (
                                      <div className="text-sm pt-1 text-red-500">
                                        {errors.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm w-full">
                                  <div className="text-[#797979] font-bold">
                                    Email
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      name="email"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.email}
                                      className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                    ></input>
                                    {errors.email && touched.email && (
                                      <div className="text-sm pt-1 text-red-500">
                                        {errors.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm pt-2">
                                <div className="text-[#797979] font-bold">
                                  Deskripsi
                                </div>
                                <div>
                                  <textarea
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full h-14 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none pt-2.5"
                                  ></textarea>
                                  {errors.description &&
                                    touched.description && (
                                      <div className="text-sm pt-1 text-red-500">
                                        {errors.description}
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="text-sm">
                                <div className="text-[#797979] font-bold">
                                  Alamat
                                </div>
                                <div>
                                  <textarea
                                    name="address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                    className="w-full h-14 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none pt-2.5"
                                  ></textarea>
                                  {errors.address && touched.address && (
                                    <div className="text-sm pt-1 text-red-500">
                                      {errors.address}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm pt-4">
                            <div className="flex">
                              <button
                                type="submit"
                                className="bg-primary py-2 px-1.5 text-white rounded-md flex justify-center items-center gap-2"
                              >
                                <BsCheck size={20} />
                                Simpan Pengaturan
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(Settings);
