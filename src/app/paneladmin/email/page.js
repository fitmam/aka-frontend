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
import { MdEmail } from "react-icons/md";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function Email() {
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

  async function fetchEmail() {
    const { data } = await http(token).get("/email?limit=20");
    return data.results;
  }

  const { data: emailData } = useQuery({
    queryKey: ["email"],
    queryFn: () => fetchEmail(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const validateEmail = Yup.object({
    to: Yup.string().required("Harap diisi"),
    subject: Yup.string().required("Harap diisi"),
    text: Yup.string().required("Harap diisi"),
  });

  const validateEmailConfig = Yup.object({
    email_behalf: Yup.string().required("Harap diisi"),
    email: Yup.string().required("Harap diisi"),
    protocol: Yup.string().required("Harap diisi"),
    smtp_host: Yup.string().required("Harap diisi"),
    smtp_user: Yup.string().required("Harap diisi"),
    smtp_pass: Yup.string().required("Harap diisi"),
    smtp_port: Yup.string().required("Harap diisi"),
  });

  const updateEmail = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams(values).toString();
      return http(token).patch("/email/1", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email"] });
      toast.success("Berhasil mengupdate email");
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const sendMail = useMutation({
    mutationFn: async (values) => {
      const data = new URLSearchParams(values).toString();
      return http(token).post("/sendmail", data);
    },
    onSuccess: () => {
      toast.success("Email berhasil terkirim");
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
    <div className="flex w-full relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] xl:p-8 flex gap-8 h-full overflow-y-scroll flex-col xl:flex-row">
          <div className="w-full h-full bg-white shadow-xl">
            <div className="w-full h-auto">
              <div className="flex items-center gap-2 h-16 bg-[#fafafa] px-5">
                <BsGearFill color="#36404c" />
                <div className="uppercase font-medium text-[#36404c]">
                  Email
                </div>
              </div>
              <div>
                <div className="flex-col p-4 gap-3">
                  <Formik
                    initialValues={{
                      email_behalf: emailData?.[0]?.email_behalf,
                      email: emailData?.[0]?.email,
                      protocol: emailData?.[0]?.protocol,
                      smtp_host: emailData?.[0]?.smtp_host,
                      smtp_user: emailData?.[0]?.smtp_user,
                      smtp_pass: emailData?.[0]?.smtp_pass,
                      smtp_port: emailData?.[0]?.smtp_port,
                    }}
                    enableReinitialize={true}
                    validationSchema={validateEmailConfig}
                    onSubmit={(values) => {
                      updateEmail.mutate(values), setLoading(true);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    }) => {
                      return (
                        <form
                          onSubmit={handleSubmit}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex w-full gap-10">
                            <div className="text-sm w-full">
                              <div className="text-[#797979] font-bold">
                                Atas Nama Email
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="email_behalf"
                                  value={values.email_behalf}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                ></input>
                                {errors.email_behalf &&
                                  touched.email_behalf && (
                                    <div className="text-sm pt-1 text-red-500">
                                      {errors.email_behalf}
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="text-sm w-full">
                              <div className="text-[#797979] font-bold">
                                Alamat Email
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="email"
                                  value={values.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
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
                          <div className="flex w-full gap-10">
                            <div className="text-sm w-full">
                              <div className="text-[#797979] font-bold">
                                Protocol
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="protocol"
                                  value={values.protocol}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                ></input>
                                {errors.protocol && touched.protocol && (
                                  <div className="text-sm pt-1 text-red-500">
                                    {errors.protocol}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-sm w-full">
                              <div className="text-[#797979] font-bold">
                                SMTP Host
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="smtp_host"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.smtp_host}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                ></input>
                                {errors.smtp_host && touched.smtp_host && (
                                  <div className="text-sm pt-1 text-red-500">
                                    {errors.smtp_host}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-10 w-full">
                            <div className="text-sm w-full">
                              <div className="text-[#797979] font-bold">
                                SMTP User
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="smtp_user"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.smtp_user}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                ></input>
                                {errors.smtp_user && touched.smtp_user && (
                                  <div className="text-sm pt-1 text-red-500">
                                    {errors.smtp_user}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-sm w-full">
                              <div className="text-[#797979] font-bold">
                                SMTP Pass
                              </div>
                              <div>
                                <input
                                  type="password"
                                  name="smtp_pass"
                                  value={values.smtp_pass}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                ></input>
                                {errors.smtp_pass && touched.smtp_pass && (
                                  <div className="text-sm pt-1 text-red-500">
                                    {errors.smtp_pass}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex w-full gap-10">
                            <div className="w-full text-sm">
                              <div className="text-[#797979] font-bold">
                                SMTP Port
                              </div>
                              <div>
                                <input
                                  type="text"
                                  name="smtp_port"
                                  value={values.smtp_port}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                ></input>
                                {errors.smtp_port && touched.smtp_port && (
                                  <div className="text-sm pt-1 text-red-500">
                                    {errors.smtp_port}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-full"></div>
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
                <div className="w-full bg-white shadow-xl">
                  <Formik
                    validationSchema={validateEmail}
                    onSubmit={(values) => {
                      sendMail.mutate(values);
                      setLoading(true);
                      resetForm();
                    }}
                    initialValues={{
                      from: "testing@runlapan.com",
                      to: "",
                      subject: "",
                      text: "",
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    }) => {
                      return (
                        <form onSubmit={handleSubmit}>
                          <div className="flex items-center gap-2 h-16 bg-[#fafafa] px-5">
                            <MdEmail />
                            <div className="uppercase font-medium">
                              Testing Email
                            </div>
                          </div>
                          <div className="text-sm p-6 flex flex-col gap-3 w-full">
                            <div className="flex w-full gap-10">
                              <div className="w-full">
                                <div className="text-[#797979] font-bold">
                                  Masukkan Email Tujuan
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    name="to"
                                    value={values.to}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                  ></input>
                                  {errors.to && touched.to && (
                                    <div className="text-sm pt-1 text-red-500">
                                      {errors.to}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="w-full">
                                <div className="text-[#797979] font-bold">
                                  Subjek
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    name="subject"
                                    value={values.subject}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                                  ></input>
                                  {errors.subject && touched.subject && (
                                    <div className="text-sm pt-1 text-red-500">
                                      {errors.subject}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[#797979] font-bold">
                                Text Pesan
                              </div>
                              <textarea
                                name="text"
                                value={values.text}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full h-14 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none pt-2.5"
                              ></textarea>
                              {errors.text && touched.text && (
                                <div className="text-sm pt-1 text-red-500">
                                  {errors.text}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-full flex justify-end p-8">
                            <button
                              type="submit"
                              className="bg-primary py-2 px-1.5 text-white text-sm flex justify-center items-center rounded-md"
                            >
                              <BsCheck size={20} />
                              Kirim Email
                            </button>
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

export default WithAuth(Email);
