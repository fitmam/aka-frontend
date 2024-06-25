"use client";
import MobileNav from "@/components/mobilenav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import http from "@/helpers/http.helper";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import Loading from "@/components/loading";
import { useQueryClient } from "@tanstack/react-query";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCookie } from "cookies-next";
import WithAuth from "@/components/isauth";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function TambahArtikel() {
  const dispatch = useDispatch();
  const [value, setValue] = useState("Isi Artikel");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState("");
  const [pictureURI, setPictureURI] = useState("");

  const router = useRouter();

  const queryClient = useQueryClient();

  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const token = getCookie("token");

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

  async function fetchCategory() {
    const { data } = await http(token).get("/categories");
    return data.results;
  }

  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: () => fetchCategory(),
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

  const validateArticle = Yup.object({
    title: Yup.string().required("Harap diisi"),
  });

  const postArticle = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      if (selectedPicture) {
        form.append("picture", selectedPicture);
      }
      form.append("title", values.title);
      if (categoryId) {
        form.append("category_id", parseInt(categoryId));
      } else {
        form.append("category_id", 1);
      }
      form.append("source", values.source);
      form.append(
        "slug",
        slugify(values.title, {
          lower: true,
        })
      );
      form.append("content", value);
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
      return http(token).post("/article", form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article"] });
      setLoading(false);
      toast.success("Berhasil menambah artikel");
      router.push("/paneladmin/artikel");
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

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] p-8 flex gap-8 h-full overflow-y-scroll">
          <div className="w-full h-screen bg-white rounded-md overflow-auto">
            <div className="flex justify-between px-10 py-10 items-center w-full h-14">
              <div className="flex items-center gap-2">
                <BsPeopleFill size={25} color="#36404c" />
                Tambah Artikel
              </div>
            </div>
            <div className="px-10 pb-10">
              {selectedPicture && (
                <Image src={pictureURI} width={100} height={100} alt="" />
              )}
            </div>
            <div className="px-10">
              <Formik
                initialValues={{ title: "", source: "" }}
                validationSchema={validateArticle}
                onSubmit={(values) => {
                  postArticle.mutate(values);
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
                      <div className="flex flex-col gap-5">
                        <div>
                          <input
                            type="file"
                            name="picture"
                            className="file file-input file-input-bordered w-full"
                            onChange={changePicture}
                          ></input>
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            name="title"
                            value={values.title}
                            placeholder="Judul"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border w-full h-12 rounded-md border-gray-300 focus:outline-none px-5 focus:border-gray-400"
                          ></input>
                          {errors.title && touched.title && (
                            <div className="text-red-500">{errors.title}</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            name="source"
                            value={values.source}
                            placeholder="Sumber"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="border w-full h-12 rounded-md border-gray-300 focus:outline-none px-5 focus:border-gray-400"
                          ></input>
                          {errors.source && touched.source && (
                            <div className="text-red-500">{errors.source}</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <select
                            onChange={(event) => {
                              setCategoryId(event.target.value);
                            }}
                            className="border w-full h-12 rounded-md border-gray-300 focus:outline-none px-5 focus:border-gray-400"
                          >
                            <option disabled>Kategori</option>
                            {categoryData?.data?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div>
                          <MDEditor
                            value={value}
                            onChange={setValue}
                          ></MDEditor>
                        </div>
                      </div>
                      <div className="flex w-full justify-end pt-5">
                        <button
                          type="submit"
                          className="bg-primary text-white p-2 rounded-md"
                        >
                          Tambah Artikel
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
      <MobileNav />
      {loading && <Loading />}
    </div>
  );
}

export default WithAuth(TambahArtikel);
