"use client";
import HomeNav from "@/components/homenav";
import http from "@/helpers/http.helper";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { setCompanyId } from "@/redux/reducer/id";

export default function VerifyIDService() {
  const [open, setOpen] = useState(false);
  const token = getCookie("token");
  const dispatch = useDispatch();
  const router = useRouter();

  const validateCompany = Yup.object({
    company_id: Yup.string().required("Harap diisi"),
  });

  return (
    <div>
      <div>
        <HomeNav />
      </div>
      <div className="w-full h-screen bg-[url('../../public/bg.jpg')] bg-cover">
        <div className="flex flex-col w-full justify-center items-center h-full pt-32 xl:pt-0">
          <div className="font-bold text-2xl pt-20">Verifikasi ID</div>
          <div className="w-full h-full justify-center items-center flex flex-col gap-10">
            <div className="">Apakah sudah pernah memiliki ID Number ? </div>
            <div className="flex gap-10 flex-col xl:flex-row">
              <button
                onClick={() => {
                  setOpen(!open);
                }}
                className="rounded-xl px-10 text-white flex justify-center items-center h-10 bg-primary"
              >
                Sudah Memiliki ID Number
              </button>
              <button
                onClick={() => {
                  router.push("/form-request-service");
                }}
                className="rounded-xl px-10 text-white flex justify-center items-center h-10 bg-primary cursor-pointer"
              >
                Belum Pernah Memiliki ID Number
              </button>
            </div>
          </div>
        </div>
      </div>
      <input
        type="checkbox"
        id="id_modal"
        className="modal-toggle"
        checked={open}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Silahkan Masukkan ID Number!</h3>
          <Formik
            initialValues={{ company_id: "" }}
            validationSchema={validateCompany}
            onSubmit={async (values, { setFieldError }) => {
              try {
                const { data } = await http(token).get(
                  `company-request-service/?search=${values.company_id}`
                );
                if (data.results.data.length <= 0) {
                  setFieldError(
                    "company_id",
                    "Data Perusahaan Tidak Ditemukan"
                  );
                }
                if (data.results.data.length >= 1) {
                  dispatch(setCompanyId(values.company_id));
                  router.push("/list-service-perusahaan");
                }
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              resetForm,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <input
                    type="number"
                    placeholder="Masukkan ID Number"
                    name="company_id"
                    className="input input-bordered w-full mt-5"
                    onChange={handleChange}
                    onInput={(event) => {
                      var maxLength = 8;
                      if (event.target.value.length > maxLength) {
                        event.target.value = event.target.value.slice(
                          0,
                          maxLength
                        );
                      }
                    }}
                    onBlur={handleBlur}
                    value={values.company_id}
                  />
                  {errors.company_id && touched.company_id && (
                    <div className="text-red-500 text-sm pt-2">
                      {errors.company_id}
                    </div>
                  )}
                  <div className="modal-action">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(!open);
                        resetForm();
                      }}
                      className="btn btn-primary bg-primary border-none normal-case text-white"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary bg-primary border-none normal-case text-white"
                    >
                      Cari ID
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
      <div className="w-full h-[80px] bg-[#42495b]">
        <div className="w-full h-full flex justify-center items-center text-white text-center px-10 md:px-0">
          © 2023 PT RADAR UTAMA NUSANTARA LAPAN
        </div>
      </div>
      <input type="checkbox" id="id_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Masukkan ID Number </h3>
          <p className="py-4">
            <input type="text" className="input input-bordered w-full"></input>
          </p>
          <div className="modal-action">
            <label
              htmlFor="id_modal"
              className="btn bg-red-500 text-white hover:bg-red-500"
            >
              Close!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
