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
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function KontakKami() {
  const token = getCookie("token");
  const [loading, setLoading] = useState(false);

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

  async function fetchContacts() {
    const { data } = await http(token).get("/contacts?limit=20");
    return data.results;
  }

  const { data: contactData } = useQuery({
    queryKey: ["contact"],
    queryFn: () => fetchContacts(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const validateContacts = Yup.object({
    name: Yup.string().required("Harap diisi"),
    phone: Yup.string().required("Harap diisi"),
  });

  const updateContact = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams(values).toString();
      return http(token).patch("/contacts/1", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Berhasil mengupdate contacts");
      setLoading(false);
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

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] xl:p-8 flex gap-8 h-full overflow-y-scroll flex-col xl:flex-row">
          <div className="w-full h-full bg-white shadow-xl">
            <div className="w-full h-auto">
              <div className="flex items-center gap-2 h-16 bg-[#fafafa] px-5">
                <BsGearFill color="#36404c" />
                <div className="uppercase font-medium text-[#36404c]">
                  Kontak
                </div>
              </div>
              <div>
                <div className="flex-col p-4 gap-3">
                  <Formik
                    initialValues={{
                      name: contactData?.[0]?.name,
                      phone: contactData?.[0]?.phone,
                    }}
                    validationSchema={validateContacts}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                      updateContact.mutate(values);
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
                          <div className="flex w-full gap-10">
                            <div className="text-sm w-full flex flex-col gap-2">
                              <div className="text-[#797979] font-bold">
                                Nama
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="name"
                                  value={values.name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md focus:outline-none"
                                ></input>
                                {errors.name && touched.name && (
                                  <div className="text-sm pt-1 text-red-500">
                                    {errors.name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-sm w-full flex flex-col gap-2">
                              <div className="text-[#797979] font-bold">
                                Nomor Telepon
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="phone"
                                  value={values.phone}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md focus:outline-none"
                                ></input>
                                {errors.phone && touched.phone && (
                                  <div className="text-sm pt-1 text-red-500">
                                    {errors.phone}
                                  </div>
                                )}
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

export default WithAuth(KontakKami);
