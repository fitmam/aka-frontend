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

function Maps() {
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

  async function fetchMaps() {
    const { data } = await http(token).get("/maps?limit=20");
    return data.results;
  }

  const { data: mapsData } = useQuery({
    queryKey: ["maps"],
    queryFn: () => fetchMaps(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const validateMaps = Yup.object({
    url: Yup.string().required("Harap diisi"),
  });

  const updateMaps = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams(values).toString();
      console.log(values.url);
      return http(token).patch("/maps/1", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
      toast.success("Berhasil mengupdate maps");
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
          <div className="w-full h-[950px] bg-white shadow-xl">
            <div className="w-full h-auto">
              <div className="flex items-center gap-2 h-16 bg-[#fafafa] px-5">
                <BsGearFill color="#36404c" />
                <div className="uppercase font-medium text-[#36404c]">Umum</div>
              </div>
              <div>
                <div className="flex-col p-4 gap-3">
                  <div className="text-sm">
                    <div className="text-[#797979] font-bold">
                      Link Google Maps
                    </div>
                    <Formik
                      initialValues={{ url: mapsData?.[0]?.url }}
                      validationSchema={validateMaps}
                      enableReinitialize={true}
                      onSubmit={(values) => {
                        updateMaps.mutate(values);
                        setLoading(true);
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
                            <div>
                              <textarea
                                name="url"
                                value={values.url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="w-full h-14 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none pt-2.5"
                              ></textarea>
                              {errors.url && touched.url && (
                                <div className="text-sm pt-1 text-red-500">
                                  {errors.url}
                                </div>
                              )}
                            </div>
                            <div className="pt-5">
                              <iframe
                                src={mapsData?.[0]?.url}
                                width="550"
                                height="350"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                className="w-full aspect-video hover:aspect-square"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
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
      </div>
      <MobileNav />
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(Maps);
