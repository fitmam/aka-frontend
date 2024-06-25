"use client";
import HomeNav from "@/components/homenav";
import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/helpers/http.helper";
import { Field, Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { useState } from "react";
import Loading from "@/components/loading";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useRef } from "react";
import dayjs from "dayjs";

export default function KontakKami() {
  const token = getCookie("token");
  const [loading, setLoading] = useState(false);
  const contactMeForm = useRef();

  async function fetchBusinessType() {
    const { data } = await http(token).get("/business-type?limit=20");
    return data.results;
  }

  const { data: businessType } = useQuery({
    queryKey: ["business-type"],
    queryFn: () => fetchBusinessType(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const postContactMe = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams(values).toString();
      return http().post("/contact-me", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-me"] });
      setLoading(false);
      toast.success("Data berhasil terkirim");
      router.push("/");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const validateContactMe = Yup.object({
    name: Yup.string().required("Harap diisi"),
    email: Yup.string()
      .email("Email tidak valid")
      .required("Harap diisi")
      .matches(/@[^.]*\./, "Email tidak valid"),
    phone_number: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa angka"),
    company_name: Yup.string().required("Harap diisi"),
    business_type_id: Yup.string().required("Harap diisi"),
    full_address: Yup.string().required("Harap diisi"),
    description: Yup.string().required("Harap diisi"),
  });

  return (
    <div>
      <div>
        <HomeNav />
      </div>
      <div className="py-14 bg-[url('../../public/bg-client.jpg')] bg-cover bg-no-repeat">
        <div className="flex pt-10 h-auto">
          <div className="w-full xl:px-20 flex justify-center items-center">
            <div className="max-w-xl w-full h-auto bg-[#F5F7F8] p-5 rounded-xl">
              <div className="w-full font-medium text-sm flex justify-between"></div>
              <div className="py-5 text-xl font-medium">Hubungi Kami</div>
              <Formik
                initialValues={{
                  date: dayjs().format("DD-MM-YYYY"),
                  name: "",
                  email: "",
                  phone_number: "",
                  company_name: "",
                  business_type_id: "",
                  full_address: "",
                  description: "",
                }}
                onSubmit={(values) => {
                  setLoading(true);
                  postContactMe.mutate(values);
                }}
                validationSchema={validateContactMe}
                innerRef={contactMeForm}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col gap-5 pb-3">
                        <div className="flex w-full gap-10">
                          <div className="w-full">
                            <div className="text-sm pb-2">Nama Lengkap :</div>
                            <input
                              type="text"
                              name="name"
                              placeholder="Masukkan nama lengkap"
                              className="w-full h-10 border focus:outline-none rounded-md px-4"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            ></input>
                            {errors.name && touched.name && (
                              <div className="text-red-500 pt-2">
                                {errors.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="text-sm pb-2">Nama Perusahaan :</div>
                          <input
                            type="text"
                            name="company_name"
                            placeholder="Masukkan nama perusahaan"
                            className="w-full h-10 border focus:outline-none rounded-md px-4"
                            value={values.company_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></input>
                          {errors.company_name && touched.company_name && (
                            <div className="text-red-500 pt-2">
                              {errors.company_name}
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="text-sm pb-2">Email Perusahaan :</div>
                          <input
                            type="text"
                            placeholder="Masukkan email perusahaan"
                            name="email"
                            className="w-full h-10 border focus:outline-none rounded-md px-4"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></input>
                          {errors.email && touched.email && (
                            <div className="text-red-500 pt-2">
                              {errors.email}
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="text-sm pb-2">Nomor Telepon :</div>
                          <input
                            type="number"
                            name="phone_number"
                            placeholder="Masukkan nomor telepon"
                            className="w-full h-10 border focus:outline-none rounded-md px-4"
                            value={values.phone_number}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></input>
                          {errors.phone_number && touched.phone_number && (
                            <div className="pt-2 text-red-500">
                              {errors.phone_number}
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="text-sm pb-2">Tipe Bisnis:</div>
                          <Field
                            as="select"
                            name="business_type_id"
                            onChange={(e) => {
                              setFieldValue("business_type_id", e.target.value);
                            }}
                            className="select select-bordered w-full"
                          >
                            <option value="" disabled selected>
                              Silahkan pilih tipe bisnis
                            </option>
                            {businessType?.data?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Field>
                          {errors.business_type_id &&
                            touched.business_type_id && (
                              <div className="text-red-500 pt-2">
                                {errors.business_type_id}
                              </div>
                            )}
                        </div>
                        <div className="w-full">
                          <div className="text-sm pb-2">Alamat Lengkap :</div>
                          <textarea
                            type="text"
                            placeholder="Masukkan alamat lengkap"
                            name="full_address"
                            className="w-full h-24 border focus:outline-none rounded-md px-4"
                            value={values.full_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></textarea>
                          {errors.full_address && touched.full_address && (
                            <div className="text-red-500 pt-2">
                              {errors.full_address}
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <div className="text-sm pb-2">Deskripsi :</div>
                          <textarea
                            type="text"
                            name="description"
                            placeholder="Masukkan deskripsi"
                            className="w-full h-24 border focus:outline-none rounded-md px-4"
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></textarea>
                          {errors.description && touched.description && (
                            <div className="text-red-500 pt-2">
                              {errors.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full pt-5 flex gap-4 justify-end">
                        <button
                          type="submit"
                          className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
                        >
                          Kirim
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
      <div className="w-full h-[80px] bg-[#42495b]">
        <div className="w-full h-full flex justify-center items-center text-white text-center px-10 md:px-0">
          © 2023 PT ARYA KEMUNING ABADI
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
}
