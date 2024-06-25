"use client";
import HomeNav from "@/components/homenav";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/helpers/http.helper";
import { useSelector } from "react-redux";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { FaPencil } from "react-icons/fa6";
import { Field, Formik } from "formik";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import Loading from "@/components/loading";
import { toast } from "react-toastify";
import CheckService from "@/components/checkserviceid";

function ListCompanyProduct() {
  const [openDetail, setOpenDetail] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [regencyValue, setRegencyData] = useState([]);
  const [districtValue, setDistrictData] = useState([]);
  const [villageValue, setVillageData] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState("");
  const [pictureURI, setPictureURI] = useState("");
  const company_id = useSelector((state) => state.id.company_id);
  const token = getCookie("token");

  const queryClient = useQueryClient();

  async function fetchCompanyRequestService() {
    const { data } = await http(token).get(
      `/company-request-service/${company_id}`
    );
    setCompanyData(data.results);
    return data.results;
  }

  async function fetchProvince() {
    const { data } = await http(token).get("/province");
    return data.results;
  }

  const { data: productData } = useQuery({
    queryKey: ["company-request-service"],
    queryFn: () => fetchCompanyRequestService(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setCompanyId(updatedId);
  };

  const showDetailModal = (itemId) => {
    const updatedId = itemId;
    setOpenDetail(!openDetail);
    setCompanyId(updatedId);
  };

  async function fetchBusinessType() {
    const { data } = await http(token).get("/business-type?limit=20");
    return data.results;
  }

  async function fetchServices() {
    const { data } = await http(token).get("/service?limit=20");
    return data.results;
  }

  const { data: provinceData } = useQuery({
    queryKey: ["province"],
    queryFn: () => fetchProvince(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: businessType } = useQuery({
    queryKey: ["business-type"],
    queryFn: () => fetchBusinessType(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: serviceList } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
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

  async function fetchCompanyRequestServiceById(id) {
    try {
      const { data } = await http(token).get(`/company-request-service/${id}`);
      setCompanyData(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  const updateCompanyRequestProduct = useMutation({
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
      form.append("service_id", values.service_id);
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
      return http(token).patch(`/company-request-service/${companyId}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-request-service"] });
      setLoading(false);
      toast.success("Berhasil mengupdate perusahaan");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const validateCompanyRequestProduct = Yup.object({
    company_name: Yup.string().required("Harap diisi"),
    nib: Yup.string().required("Harap diisi"),
    npwp: Yup.string().required("Harap diisi"),
    business_type_id: Yup.string().required("Harap diisi"),
    company_email: Yup.string().required("Harap diisi"),
    company_phone: Yup.string().required("Harap diisi"),
    pic_name: Yup.string().required("Harap diisi"),
    pic_position: Yup.string().required("Harap diisi"),
    pic_email: Yup.string().required("Harap diisi"),
    pic_phone: Yup.string().required("Harap diisi"),
    province_id: Yup.string().required("Harap diisi"),
    district_id: Yup.string().required("Harap diisi"),
    regency_id: Yup.string().required("Harap diisi"),
    village_id: Yup.string().required("Harap diisi"),
    postal_code: Yup.string().required("Harap diisi"),
    full_address: Yup.string().required("Harap diisi"),
    service_id: Yup.string().required("Harap diisi"),
    description: Yup.string().required("Harap diisi"),
    requirements: Yup.string().required("Harap diisi"),
  });

  return (
    <div>
      <div>
        <HomeNav />
      </div>
      <div className="w-full h-screen pt-40 xl:pt-0">
        <div className="flex flex-col w-full items-center h-full overflow-auto">
          <div className="font-bold text-2xl xl:pt-32">
            List Service Perusahaan
          </div>
          <div className="w-full flex justify-center items-center pt-5">
            <div className="text-green-500 font-bold">
              Simpan ID Perusahaan Anda : <br />
              <div className="text-center">{company_id}</div>
            </div>
          </div>
          <div className="max-w-[300px] xl:max-w-full xl:w-full overflow-auto px-20">
            <table className="w-full mt-20 px-20">
              <tr className="h-16 bg-[#E0F4FF]">
                <th className="text-xs w-10">No</th>
                <th className="text-xs w-36">Logo</th>
                <th className="text-xs w-36">Perusahaan</th>
                <th className="text-xs w-36">NIB</th>
                <th className="text-xs w-36">NPWP</th>
                <th className="text-xs w-36">Tipe Bisnis</th>
                <th className="text-xs w-36">Nama PIC</th>
                <th className="text-xs w-36">Email Perusahaan</th>
                <th className="text-xs w-36">No Telepon Perusahaan</th>
                <th className="text-xs w-36">Service</th>
                <th className="text-xs w-36">Status</th>
                <th className="text-xs w-36">Aksi</th>
              </tr>
              {productData?.map((item, index) => {
                return (
                  <tr
                    className="h-12 cursor-pointer hover:bg-[#F3F3F3] text-center"
                    key={item.id}
                    onClick={(item) => {
                      showDetailModal(item.id);
                      fetchCompanyRequestServiceById(company_id);
                    }}
                  >
                    <td className="pl-4 text-xs">{index + 1}</td>
                    <td className="pl-4 text-xs w-16 h-16 overflow-hidden py-5">
                      <div className="flex flex-col justify-center items-center gap-2">
                        <Image
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${item.company_logo}`}
                          width={50}
                          height={50}
                          alt=""
                        ></Image>
                        <div className="font-bold text-green-500 text-md">
                          ID: {item.id}
                        </div>
                      </div>
                    </td>
                    <td className="pl-4 text-xs">{item.company_name}</td>
                    <td className="pl-4 text-xs">{item.nib}</td>
                    <td className="pl-4 text-xs">{item.npwp}</td>
                    <td className="pl-4 text-xs">{item.business_type.name}</td>
                    <td className="pl-4 text-xs">{item.pic_name}</td>
                    <td className="pl-4 text-xs">{item.company_email}</td>
                    <td className="pl-4 text-xs">{item.company_phone}</td>
                    <td className="pl-4 text-xs">{item.service.title}</td>
                    <td className="pl-4 text-xs">
                      <div className="w-20 m-auto">
                        {item?.status?.name === "Pending" ? (
                          <div className="bg-red-500 rounded-full text-white font-bold">
                            {item?.status?.name}
                          </div>
                        ) : (
                          <div className="bg-green-500 rounded-full text-white font-bold">
                            {item?.status?.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className="m-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="flex gap-3 justify-center items-center">
                        <button
                          onClick={() => {
                            showUpdateModal(item.id);
                            fetchCompanyRequestServiceById(item.id);
                            fetchRegencyById(item.province_id);
                            fetchDistrictById(item.regency_id);
                            fetchVillageById(item.district_id);
                          }}
                          type="button"
                          className="cursor-pointer text-xs bg-orange-500 text-white rounded-md p-1 flex items-center gap-2"
                        >
                          <FaPencil size={10} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
        <input
          type="checkbox"
          id="detailModal"
          className="modal-toggle"
          checked={openDetail}
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg pb-5">Detail Perusahaan</h3>
            <Formik
              initialValues={{
                company_name: companyData?.[0]?.company_name,
                nib: companyData?.[0]?.nib,
                npwp: companyData?.[0]?.npwp,
                business_type_id: companyData?.[0]?.business_type?.name,
                company_email: companyData?.[0]?.company_email,
                company_phone: companyData?.[0]?.company_phone,
                pic_name: companyData?.[0]?.pic_name,
                pic_position: companyData?.[0]?.pic_position,
                pic_email: companyData?.[0]?.pic_email,
                pic_phone: companyData?.[0]?.pic_phone,
                province_id: companyData?.[0]?.province?.name,
                district_id: companyData?.[0]?.district?.name,
                regency_id: companyData?.[0]?.regency?.name,
                village_id: companyData?.[0]?.village?.name,
                postal_code: companyData?.[0]?.postal_code,
                full_address: companyData?.[0]?.full_address,
                service_id: companyData?.[0]?.service?.title,
                description: companyData?.[0]?.description,
                requirements: companyData?.[0]?.requirements,
              }}
              onSubmit={(values) => {
                setOpenEditModal(!openEditModal);
                setLoading(true);
                updateCompanyRequestProduct.mutate(values);
              }}
              enableReinitialize={true}
              validationSchema={validateCompanyRequestProduct}
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
                    {selectedPicture ? (
                      <Image src={pictureURI} width={100} height={100} alt="" />
                    ) : (
                      <Image
                        src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${companyData?.[0]?.company_logo}`}
                        width={100}
                        height={100}
                        alt=""
                      />
                    )}
                    <div className="flex flex-col gap-5 pb-3">
                      <div>
                        <div className="text-sm pb-2">Nama Perusahaan :</div>
                        <input
                          type="text"
                          name="company_name"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.company_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.company_name && touched.company_name && (
                          <div className="text-red-500 pt-2">
                            {errors.company_name}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">NIB :</div>
                        <input
                          type="text"
                          name="nib"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.nib}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.nib && touched.nib && (
                          <div className="text-red-500 pt-2">{errors.nib}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">NPWP :</div>
                        <input
                          type="text"
                          name="npwp"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.npwp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.npwp && touched.npwp && (
                          <div className="text-red-500 pt-2">{errors.npwp}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Tipe Bisnis :</div>
                        <input
                          type="text"
                          name="business_type_id"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.business_type_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.business_type_id &&
                          touched.business_type_id && (
                            <div className="text-red-500 pt-2">
                              {errors.business_type_id}
                            </div>
                          )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Email Perusahaan :</div>
                        <input
                          type="text"
                          name="company_email"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.company_email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.company_email && touched.company_email && (
                          <div className="text-red-500 pt-2">
                            {errors.company_email}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">
                          Nomor Telepon Perusahaan:
                        </div>
                        <input
                          type="text"
                          name="company_phone"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.company_phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.company_phone && touched.company_phone && (
                          <div className="text-red-500 pt-2">
                            {errors.company_phone}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Nama PIC :</div>
                        <input
                          type="text"
                          name="pic_name"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.pic_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.pic_name && touched.pic_name && (
                          <div className="text-red-500 pt-2">
                            {errors.pic_name}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Posisi PIC :</div>
                        <input
                          type="text"
                          name="pic_position"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.pic_position}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.pic_position && touched.pic_position && (
                          <div className="text-red-500 pt-2">
                            {errors.pic_position}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Email PIC :</div>
                        <input
                          type="text"
                          name="pic_email"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.pic_email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.pic_email && touched.pic_email && (
                          <div className="text-red-500 pt-2">
                            {errors.pic_email}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Nomor Telepon PIC :</div>
                        <input
                          type="text"
                          name="pic_phone"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.pic_phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.pic_phone && touched.pic_phone && (
                          <div className="text-red-500 pt-2">
                            {errors.pic_phone}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Provinsi :</div>
                        <input
                          type="text"
                          name="province_id"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.province_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.province_id && touched.province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.province_id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Kabupaten / Kota :</div>
                        <input
                          type="text"
                          name="regency_id"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.regency_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.regency_id && touched.regency_id && (
                          <div className="text-red-500 pt-2">
                            {errors.regency_id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Kecamatan :</div>
                        <input
                          type="text"
                          name="district_id"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.district_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.district_id && touched.district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.district_id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Kelurahan :</div>
                        <input
                          type="text"
                          name="village_id"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.village_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.village_id && touched.village_id && (
                          <div className="text-red-500 pt-2">
                            {errors.village_id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Kode POS :</div>
                        <input
                          type="text"
                          name="postal_code"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.postal_code}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.postal_code && touched.postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.postal_code}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Alamat Lengkap :</div>
                        <input
                          type="text"
                          name="full_address"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.full_address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.full_address && touched.full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.full_address}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Nama Service :</div>
                        <input
                          type="text"
                          name="service_id"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.service_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.service_id && touched.service_id && (
                          <div className="text-red-500 pt-2">
                            {errors.service_id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Deskripsi :</div>
                        <input
                          type="text"
                          name="description"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.description && touched.description && (
                          <div className="text-red-500 pt-2">
                            {errors.description}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">
                          Jelaskan Kebutuhan Anda :
                        </div>
                        <input
                          type="text"
                          name="requirements"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.requirements}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        ></input>
                        {errors.requirements && touched.requirements && (
                          <div className="text-red-500 pt-2">
                            {errors.requirements}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full pt-5 flex gap-4 justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenDetail(!openDetail)}
                        className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
          <label
            className="modal-backdrop"
            htmlFor="detailModal"
            onClick={() => {
              setOpenDetail(!openDetail);
            }}
          >
            Close
          </label>
        </div>
        <input
          type="checkbox"
          id="editModal"
          className="modal-toggle"
          checked={openEditModal}
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg pb-5">
              Edit Request Service Perusahaan
            </h3>
            <Formik
              initialValues={{
                company_name: companyData?.[0]?.company_name,
                nib: companyData?.[0]?.nib,
                npwp: companyData?.[0]?.npwp,
                business_type_id: companyData?.[0]?.business_type_id,
                company_email: companyData?.[0]?.company_email,
                company_phone: companyData?.[0]?.company_phone,
                pic_name: companyData?.[0]?.pic_name,
                pic_position: companyData?.[0]?.pic_position,
                pic_email: companyData?.[0]?.pic_email,
                pic_phone: companyData?.[0]?.pic_phone,
                province_id: companyData?.[0]?.province_id,
                district_id: companyData?.[0]?.district_id,
                regency_id: companyData?.[0]?.regency_id,
                village_id: companyData?.[0]?.village_id,
                postal_code: companyData?.[0]?.postal_code,
                full_address: companyData?.[0]?.full_address,
                service_id: companyData?.[0]?.service_id,
                description: companyData?.[0]?.description,
                requirements: companyData?.[0]?.requirements,
              }}
              onSubmit={(values) => {
                setOpenEditModal(!openEditModal);
                setLoading(true);
                updateCompanyRequestProduct.mutate(values);
              }}
              enableReinitialize={true}
              validationSchema={validateCompanyRequestProduct}
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
                    {selectedPicture ? (
                      <Image src={pictureURI} width={100} height={100} alt="" />
                    ) : (
                      <Image
                        src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${companyData?.[0]?.company_logo}`}
                        width={100}
                        height={100}
                        alt=""
                      />
                    )}
                    <div className="flex flex-col gap-5 pb-3">
                      <div>
                        <div className="text-sm pb-2">Picture :</div>
                        <input
                          type="file"
                          name="picture"
                          className="file file-input file-input-bordered w-full"
                          onChange={changePicture}
                        ></input>
                        <div className="text-red-500 text-xs pt-2">
                          Maks 1 MB *
                        </div>
                      </div>
                      <div>
                        <div className="text-sm pb-2">Nama Perusahaan :</div>
                        <input
                          type="text"
                          name="company_name"
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
                      <div>
                        <div className="text-sm pb-2">NIB :</div>
                        <input
                          type="number"
                          name="nib"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.nib}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></input>
                        {errors.nib && touched.nib && (
                          <div className="text-red-500 pt-2">{errors.nib}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">NPWP :</div>
                        <input
                          type="number"
                          name="npwp"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.npwp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></input>
                        {errors.npwp && touched.npwp && (
                          <div className="text-red-500 pt-2">{errors.npwp}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Tipe Bisnis :</div>
                        <Field
                          as="select"
                          name="business_type_id"
                          onChange={(e) => {
                            setFieldValue("business_type_id", e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
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
                            <div className="text-sm pt-1 text-red-500">
                              {errors.business_type_id}
                            </div>
                          )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Email Perusahaan :</div>
                        <input
                          type="text"
                          name="company_email"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.company_email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></input>
                        {errors.company_email && touched.company_email && (
                          <div className="text-red-500 pt-2">
                            {errors.company_email}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Nomor Perusahaan:</div>
                        <input
                          type="number"
                          name="company_phone"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.company_phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></input>
                        {errors.company_phone && touched.company_phone && (
                          <div className="text-red-500 pt-2">
                            {errors.company_phone}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Nama PIC :</div>
                        <input
                          type="text"
                          name="pic_name"
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
                      <div>
                        <div className="text-sm pb-2">Posisi PIC :</div>
                        <input
                          type="text"
                          name="pic_position"
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
                      <div>
                        <div className="text-sm pb-2">Email PIC :</div>
                        <input
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
                      <div>
                        <div className="text-sm pb-2">Nomor PIC :</div>
                        <input
                          type="number"
                          name="pic_phone"
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
                      <div>
                        <div className="text-sm pb-2">Provinsi :</div>
                        <Field
                          as="select"
                          name="province_id"
                          onChange={(e) => {
                            setFieldValue("province_id", e.target.value);
                            fetchRegencyById(e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
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
                      <div>
                        <div className="text-sm pb-2">Kabupaten / Kota :</div>
                        <Field
                          as="select"
                          name="regency_id"
                          value={companyData?.regency_id}
                          onChange={(e) => {
                            setFieldValue("regency_id", e.target.value);
                            fetchDistrictById(e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
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
                      <div>
                        <div className="text-sm pb-2">Kecamatan :</div>
                        <Field
                          as="select"
                          name="district_id"
                          value={companyData?.district_id}
                          onChange={(e) => {
                            setFieldValue("district_id", e.target.value);
                            fetchVillageById(e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
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
                      <div>
                        <div className="text-sm pb-2">Kelurahan :</div>
                        <Field
                          as="select"
                          name="village_id"
                          onChange={(e) => {
                            setFieldValue("village_id", e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
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
                      <div>
                        <div className="text-sm pb-2">Kode POS :</div>
                        <input
                          type="number"
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
                      <div>
                        <div className="text-sm pb-2">Alamat Lengkap :</div>
                        <input
                          type="text"
                          name="full_address"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.full_address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></input>
                        {errors.full_address && touched.full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.full_address}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Nama Service :</div>
                        <Field
                          as="select"
                          name="service_id"
                          onChange={(e) => {
                            setFieldValue("service_id", e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
                          {serviceList?.data?.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.title}
                              </option>
                            );
                          })}
                        </Field>
                        {errors.service_id && touched.service_id && (
                          <div className="text-red-500 pt-2">
                            {errors.service_id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">Deskripsi :</div>
                        <input
                          type="text"
                          name="description"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></input>
                        {errors.description && touched.description && (
                          <div className="text-red-500 pt-2">
                            {errors.description}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm pb-2">
                          Jelaskan Kebutuhan Anda :
                        </div>
                        <input
                          type="text"
                          name="requirements"
                          className="w-full h-10 border focus:outline-none rounded-md px-4"
                          value={values.requirements}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></input>
                        {errors.requirements && touched.requirements && (
                          <div className="text-red-500 pt-2">
                            {errors.requirements}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full pt-5 flex gap-4 justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenEditModal(!openEditModal)}
                        className="bg-red-500 text-white p-2 rounded-md cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded-md cursor-pointer"
                      >
                        Simpan{" "}
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
          <label
            className="modal-backdrop"
            htmlFor="editModal"
            onClick={() => {
              setOpenEditModal(!openEditModal);
            }}
          >
            Close
          </label>
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

export default CheckService(ListCompanyProduct);
