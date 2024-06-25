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
import { HexColorPicker } from "react-colorful";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

function Warna() {
  const token = getCookie("token");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const contrast =
      (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return contrast;
  }

  function getLuminance(color) {
    const [r, g, b] = hexToRgb(color);
    const rgb = [r / 255, g / 255, b / 255];

    for (let i = 0; i < rgb.length; i++) {
      rgb[i] =
        rgb[i] <= 0.03928
          ? rgb[i] / 12.92
          : Math.pow((rgb[i] + 0.055) / 1.055, 2.4);
    }

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  function getTextColor(background) {
    const contrastThreshold = 4.5;
    const textColor =
      getContrastRatio(background, "#ffffff") >= contrastThreshold
        ? "#ffffff"
        : "#000000";
    return textColor;
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

  const validateColor = Yup.object({
    primary: Yup.string().required("Harap diisi"),
    secondary: Yup.string().required("Harap diisi"),
  });

  const updateColor = useMutation({
    mutationFn: (values) => {
      const data = new URLSearchParams({
        primary: values.primary,
        secondary: values.secondary,
        text: getTextColor(values.secondary),
      }).toString();
      return http(token).patch("/color/1", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warna"] });
      toast.success("Berhasil mengupdate warna");
      if (typeof window !== "undefined") {
        document.documentElement.style.setProperty(
          "--primary-color",
          colorData?.[0]?.primary
        );
        document.documentElement.style.setProperty(
          "--secondary-color",
          colorData?.[0]?.secondary
        );
        document.documentElement.style.setProperty(
          "--text-color",
          colorData?.[0]?.text
        );
      }
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
                <div className="uppercase font-medium text-[#36404c]">
                  Warna
                </div>
              </div>
              <div>
                <div className="flex-col p-4 gap-3">
                  <Formik
                    initialValues={{
                      primary: colorData?.[0]?.primary,
                      secondary: colorData?.[0]?.secondary,
                    }}
                    validationSchema={validateColor}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                      updateColor.mutate(values);
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
                      setFieldValue,
                    }) => {
                      return (
                        <form onSubmit={handleSubmit}>
                          <div className="flex flex-wrap w-full gap-10 p-5">
                            <div>
                              <div className="pb-5">Warna Primary</div>
                              <HexColorPicker
                                color={primary}
                                onChange={(color) => {
                                  setFieldValue("primary", color);
                                }}
                              />
                            </div>
                            <div>
                              <div className="pb-5">Warna Secondary</div>
                              <HexColorPicker
                                color={secondary}
                                onChange={(color) => {
                                  setFieldValue("secondary", color);
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-[#797979] font-bold">
                              Primary
                            </div>
                            <div>
                              <input
                                type="text"
                                name="primary"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.primary}
                                className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                              ></input>
                              {errors.primary && touched.primary && (
                                <div className="text-sm pt-1 text-red-500">
                                  {errors.primary}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-[#797979] font-bold">
                              Secondary
                            </div>
                            <div>
                              <input
                                type="text"
                                name="secondary"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.secondary}
                                className="w-full h-10 border border-[#ccc] px-4 rounded-md mt-2 focus:outline-none"
                              ></input>
                              {errors.secondary && touched.secondary && (
                                <div className="text-sm pt-1 text-red-500">
                                  {errors.secondary}
                                </div>
                              )}
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

export default WithAuth(Warna);
