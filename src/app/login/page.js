"use client";
import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import http from "@/helpers/http.helper";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function Admin() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
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

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required !"),
    password: Yup.string().required("Password is required !"),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const body = JSON.stringify(values);
      const { data } = await axios.post("api/login", body);

      if (data?.results?.token) {
        router.push("/paneladmin");
        router.refresh();
      } else {
        toast.error("Kata sandi salah");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <div className="w-full h-screen bg-[#edf0f0] flex justify-center">
        <div className="w-[500px] h-[420px] bg-white shadow-xl mt-20">
          <div className="font-medium text-2xl text-center text-[#36404c] pt-6">
            PT ARYA KEMUNING ABADI
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                  className="px-10 pt-10 flex flex-col gap-4"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-md">Username :</div>
                    <div>
                      <input
                        type="text"
                        name="email"
                        className={`w-full h-10 border border-gray-400 rounded-sm px-4 text-sm ${
                          errors.email && touched.email && "border-red-500"
                        }`}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-sm text-red-500 pt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-md">Password :</div>
                    <div>
                      <input
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full h-10 border border-gray-400 rounded-sm px-4 text-sm ${
                          errors.password &&
                          touched.password &&
                          "border-red-500"
                        }`}
                        placeholder="Password"
                      ></input>
                      {errors.password && touched.password && (
                        <div className="text-sm text-red-500 pt-1">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-10">
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center p-2.5 text-white rounded-sm shadow-xl bg-primary"
                      >
                        <div className="text-center">
                          {loading && (
                            <div role="status">
                              <svg
                                aria-hidden="true"
                                className="inline w-4 h-4 mr-2 text-gray-200 animate-spin fill-white"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </div>
                          )}
                        </div>
                        Login Admin
                      </button>
                    </div>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </React.Fragment>
  );
}
