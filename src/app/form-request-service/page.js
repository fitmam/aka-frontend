"use client";
import HomeNav from "@/components/homenav";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/helpers/http.helper";
import { useDispatch, useSelector } from "react-redux";
import { Field, Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import Loading from "@/components/loading";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useRef } from "react";
import { setCompanyId } from "@/redux/reducer/id";
import { IoMdCheckmark } from "react-icons/io";
import { HiOutlineDotsHorizontal, HiOutlinePencil } from "react-icons/hi";
import CheckService from "@/components/checkserviceid";

function FormRequestService() {
  const token = getCookie("token");
  const serviceId = useSelector((state) => state.id.service_id);
  const [showCompany, setShowCompany] = useState(true);
  const [regencyValue, setRegencyData] = useState([]);
  const [districtValue, setDistrictData] = useState([]);
  const [villageValue, setVillageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState("");
  const [pictureURI, setPictureURI] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const serviceRef = useRef();

  useEffect(() => {
    setShowCompany(true);
  }, []);

  async function fetchProvince() {
    const { data } = await http(token).get("/province");
    return data.results;
  }

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

  const { data: provinceData } = useQuery({
    queryKey: ["province"],
    queryFn: () => fetchProvince(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchRegencyById(id) {
    const { data } = await http().get(`/regency/${id}`);
    setRegencyData(data.results);
    return data.results;
  }

  async function fetchDistrictById(id) {
    const { data } = await http().get(`/district/${id}`);
    setDistrictData(data.results);
    return data.results;
  }

  async function fetchVillageById(id) {
    const { data } = await http().get(`/village/${id}`);
    setVillageData(data.results);
    return data.results;
  }

  const queryClient = useQueryClient();

  const sendMail = useMutation({
    mutationFn: async (values) => {
      const data = new URLSearchParams({
        from: "testing@runlapan.com",
        to: values.company_email,
        subject: "ID Number",
        text: values.id,
      }).toString();
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

  const postRequestService = useMutation({
    mutationFn: (values) => {
      const form = new FormData();

      if (selectedPicture) {
        form.append("company_logo", selectedPicture);
      }
      form.append("company_name", values.company_name);
      form.append("nib", values.nib);
      form.append("npwp", values.npwp);
      form.append("business_type_id", values.business_type_id);
      form.append("company_email", values.company_email);
      form.append("company_phone", values.company_phone);
      form.append("pic_name", values.pic_name);
      form.append("pic_position", values.pic_position);
      form.append("pic_email", values.pic_email);
      form.append("pic_phone", values.pic_phone);
      form.append("province_id", values.province_id);
      form.append("district_id", values.district_id);
      form.append("regency_id", values.regency_id);
      form.append("village_id", values.village_id);
      form.append("postal_code", values.postal_code);
      form.append("full_address", values.full_address);
      form.append("service_id", serviceId);
      form.append("status_id", 1);
      form.append("description", values.description);
      form.append("requirements", values.requirements);

      const allowedExtensions = ["png", "jpg", "jpeg"];
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();
      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Format gambar tidak valid");
          return http(token).put(`/clients`, form);
        }
      }

      return http(token).post("/company-request-service", form);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["company"],
      });
      setLoading(false);
      toast.success("Berhasil menambah request service");
      dispatch(setCompanyId(data?.data?.results?.id));
      sendMail.mutate(data?.data?.results);
      router.push("/list-service-perusahaan");
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

  const validateRequestService = Yup.object({
    company_name: Yup.string().required("Harap diisi"),
    nib: Yup.number().required("Harap diisi").typeError("NIB tidak valid"),
    npwp: Yup.number().required("Harap diisi").typeError("NPWP tidak valid"),
    business_type_id: Yup.string().required("Harap diisi"),
    company_email: Yup.string()
      .email("Email tidak valid")
      .required("Harap diisi")
      .matches(/@[^.]*\./, "Email tidak valid"),
    company_phone: Yup.number()
      .required("Harap diisi")
      .typeError("Nomor telepon tidak valid"),
    pic_name: Yup.string().required("Harap diisi"),
    pic_position: Yup.string().required("Harap diisi"),
    pic_email: Yup.string()
      .email("Email tidak valid")
      .required("Harap diisi")
      .matches(/@[^.]*\./, "Email tidak valid"),
    pic_phone: Yup.number()
      .required("Harap diisi")
      .typeError("NIB tidak valid"),
    province_id: Yup.string().required("Harap diisi"),
    district_id: Yup.string().required("Harap diisi"),
    regency_id: Yup.string().required("Harap diisi"),
    village_id: Yup.string().required("Harap diisi"),
    postal_code: Yup.number()
      .required("Harap diisi")
      .typeError("NIB tidak valid"),
    full_address: Yup.string().required("Harap diisi"),
    description: Yup.string().required("Harap diisi"),
    requirements: Yup.string().required("Harap diisi"),
  });

  return (
    <div>
      <div>
        <HomeNav />
      </div>
      <div className="py-28">
        <div className="flex pt-10 h-auto">
          <div className="w-full px-0 xl:px-20">
            <div className="font-bold text-3xl text-center pb-10">
              Form Input Perusahaan
            </div>
            {showCompany && (
              <div className="max-w-[900px] h-auto m-auto bg-[#F5F7F8] p-5 rounded-xl">
                <div className="w-full font-bold flex justify-between"></div>
                <Formik
                  initialValues={{
                    company_name: "",
                    nib: "",
                    npwp: "",
                    business_type_id: "",
                    company_email: "",
                    company_phone: "",
                    pic_name: "",
                    pic_position: "",
                    pic_email: "",
                    pic_phone: "",
                    province_id: "",
                    district_id: "",
                    regency_id: "",
                    village_id: "",
                    postal_code: "",
                    full_address: "",
                    service_id: "",
                    description: "",
                    requirements: "",
                  }}
                  onSubmit={(values) => {
                    setLoading(true);
                    postRequestService.mutate(values);
                  }}
                  validationSchema={validateRequestService}
                  innerRef={serviceRef}
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
                          <div className="flex items-center justify-between gap-20">
                            <div className="flex flex-col gap-5">
                              <div className="font-bold">Foto Perusahaan :</div>
                              <div className="max-w-xs flex flex-col gap-5 pt-5">
                                <div className="h-48 border border-color-primary flex justify-center items-center rounded-md overflow-hidden">
                                  {selectedPicture ? (
                                    <Image
                                      alt=""
                                      src={pictureURI}
                                      width={500}
                                      height={500}
                                    ></Image>
                                  ) : (
                                    <div className="font-bold text-2xl">
                                      500 x 500
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <input
                                    type="file"
                                    onChange={changePicture}
                                    className="file-input file-input-bordered w-full bg-primary text-white"
                                  ></input>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-10 justify-center items-center flex-wrap xl:flex-nowrap">
                            <div className="flex w-full gap-5 flex-wrap">
                              <div className="w-full">
                                <div className=" pb-2 font-bold">
                                  Nama Perusahaan :{"  "}
                                  <span className="text-red-500 font-bold">
                                    *
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  name="company_name"
                                  placeholder="Masukkan nama perusahaan"
                                  className="w-full h-10 border focus:outline-none rounded-md px-4"
                                  value={values.company_name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                ></input>
                                {errors.company_name &&
                                  touched.company_name && (
                                    <div className="text-red-500 pt-2">
                                      {errors.company_name}
                                    </div>
                                  )}
                              </div>
                              <div className="w-full">
                                <div className="font-bold pb-2">
                                  NIB :{" "}
                                  <span className="text-red-500 font-bold">
                                    *
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  name="nib"
                                  placeholder="Masukkan NIB"
                                  className="w-full h-10 border focus:outline-none rounded-md px-4"
                                  value={values.nib}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                ></input>
                                {errors.nib && touched.nib && (
                                  <div className="text-red-500 pt-2">
                                    {errors.nib}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex w-full gap-5 flex-wrap">
                              <div className="w-full">
                                <div className="font-bold pb-2">
                                  NPWP :{" "}
                                  <span className="text-red-500 font-bold">
                                    *
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  name="npwp"
                                  placeholder="Masukkan NPWP"
                                  className="w-full h-10 border focus:outline-none rounded-md px-4"
                                  value={values.npwp}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                ></input>
                                {errors.npwp && touched.npwp && (
                                  <div className="text-red-500 pt-2">
                                    {errors.npwp}
                                  </div>
                                )}
                              </div>
                              <div className="w-full">
                                <div className="font-bold pb-2">
                                  Tipe Bisnis :{" "}
                                  <span className="text-red-500 font-bold">
                                    *
                                  </span>
                                </div>
                                <Field
                                  as="select"
                                  name="business_type_id"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "business_type_id",
                                      e.target.value
                                    );
                                  }}
                                  className="w-full h-10 border focus:outline-none rounded-md px-4"
                                >
                                  <option value={""} disabled selected>
                                    Silahkan Pilih Tipe Bisnis
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
                                    <div className="pt-1 text-red-500">
                                      {errors.business_type_id}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="flex w-full gap-10 flex-wrap xl:flex-nowrap">
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Email Perusahaan :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="text"
                                placeholder="Masukkan email perusahaan"
                                name="company_email"
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                value={values.company_email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></input>
                              {errors.company_email &&
                                touched.company_email && (
                                  <div className="text-red-500 pt-2">
                                    {errors.company_email}
                                  </div>
                                )}
                            </div>
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Nomor Telepon Perusahaan:{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                placeholder="Masukkan nomor telepon perusahaan"
                                type="number"
                                name="company_phone"
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                value={values.company_phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></input>
                              {errors.company_phone &&
                                touched.company_phone && (
                                  <div className="text-red-500 pt-2">
                                    {errors.company_phone}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex w-full gap-10 flex-wrap xl:flex-nowrap">
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Nama PIC :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="text"
                                name="pic_name"
                                placeholder="Masukkan nama pic"
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                value={values.pic_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></input>
                              {errors.pic_name && touched.pic_name && (
                                <div className="text-red-500 pt-2">
                                  {errors.pic_name}
                                </div>
                              )}
                            </div>
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Posisi PIC :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="text"
                                name="pic_position"
                                placeholder="Masukkan posisi pic"
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                value={values.pic_position}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></input>
                              {errors.pic_position && touched.pic_position && (
                                <div className="text-red-500 pt-2">
                                  {errors.pic_position}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex w-full gap-10 flex-wrap xl:flex-nowrap">
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Email PIC :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                placeholder="Masukkan email pic"
                                type="text"
                                name="pic_email"
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                value={values.pic_email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></input>
                              {errors.pic_email && touched.pic_email && (
                                <div className="text-red-500 pt-2">
                                  {errors.pic_email}
                                </div>
                              )}
                            </div>
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Nomor Telepon PIC :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="number"
                                name="pic_phone"
                                placeholder="Masukkan nomor telepon pic"
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                value={values.pic_phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></input>
                              {errors.pic_phone && touched.pic_phone && (
                                <div className="text-red-500 pt-2">
                                  {errors.pic_phone}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="font-medium text-xl">
                            Informasi Alamat
                          </div>
                          <div className="w-full flex gap-10 flex-wrap xl:flex-nowrap">
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Provinsi :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="province_id"
                                onChange={(e) => {
                                  setFieldValue("province_id", e.target.value);
                                  fetchRegencyById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                              >
                                <option value={""} disabled selected>
                                  Silahkan Pilih Provinsi
                                </option>
                                {provinceData?.data?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.province_id && touched.province_id && (
                                <div className="text-red-500 pt-2">
                                  {errors.province_id}
                                </div>
                              )}
                            </div>
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Kabupaten / Kota :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="regency_id"
                                onChange={(e) => {
                                  setFieldValue("regency_id", e.target.value);
                                  fetchDistrictById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                                disabled={regencyValue.length <= 0}
                              >
                                <option value={""} disabled>
                                  Silahkan Pilih Kabupaten / Kota
                                </option>
                                {regencyValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.regency_id && touched.regency_id && (
                                <div className="text-red-500 pt-2">
                                  {errors.regency_id}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex w-full gap-10 flex-wrap xl:flex-nowrap">
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Kecamatan :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="district_id"
                                onChange={(e) => {
                                  setFieldValue("district_id", e.target.value);
                                  fetchVillageById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                                disabled={districtValue.length <= 0}
                              >
                                <option value={""} disabled selected>
                                  Silahkan Pilih Kecamatan
                                </option>
                                {districtValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.district_id && touched.district_id && (
                                <div className="text-red-500 pt-2">
                                  {errors.district_id}
                                </div>
                              )}
                            </div>
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Kelurahan :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="village_id"
                                onChange={(e) => {
                                  setFieldValue("village_id", e.target.value);
                                }}
                                className="select select-bordered w-full"
                                disabled={villageValue.length <= 0}
                              >
                                <option value={""} disabled selected>
                                  Silahkan Pilih Kelurahan
                                </option>
                                {villageValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.village_id && touched.village_id && (
                                <div className="text-red-500 pt-2">
                                  {errors.village_id}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-full flex gap-10">
                            <div className="w-full">
                              <div className="font-bold pb-2">
                                Kode POS :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="number"
                                placeholder="Masukkan kode pos"
                                name="postal_code"
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                value={values.postal_code}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></input>
                              {errors.postal_code && touched.postal_code && (
                                <div className="text-red-500 pt-2">
                                  {errors.postal_code}
                                </div>
                              )}
                            </div>
                            <div className="w-full hidden xl:inline-block"></div>
                          </div>
                          <div>
                            <div className="font-bold pb-2">
                              Alamat Lengkap :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <textarea
                              name="full_address"
                              placeholder="Masukkan alamat lengkap
                              "
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
                          <div className="font-bold text-xl">
                            Informasi Service
                          </div>
                          <div>
                            <div className="font-bold pb-2">
                              Deskripsi :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <textarea
                              name="description"
                              placeholder="Masukkan deskripsi"
                              className="w-full h-32 border focus:outline-none rounded-md px-4"
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
                          <div>
                            <div className="font-bold pb-2">
                              Jelaskan Kebutuhan Anda :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <textarea
                              name="requirements"
                              placeholder="Jelaskan kebutuhan anda"
                              className="w-full h-32 border focus:outline-none rounded-md px-4"
                              value={values.requirements}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            ></textarea>
                            {errors.requirements && touched.requirements && (
                              <div className="text-red-500 pt-2">
                                {errors.requirements}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full pt-5 flex gap-4 justify-end">
                          <Link
                            href="/"
                            className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                          >
                            Kembali
                          </Link>
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
            )}
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

export default CheckService(FormRequestService);
