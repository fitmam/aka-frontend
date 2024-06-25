"use client";
import HomeNav from "@/components/homenav";
import { Field, Formik } from "formik";
import React, { useRef } from "react";
import http from "@/helpers/http.helper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { getCookie } from "cookies-next";
import { FaTrash } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { setVacancyId } from "@/redux/reducer/id";
import Select, { components } from "react-select";
import dayjs from "dayjs";
import { IoMdArrowDropdown } from "react-icons/io";
import CheckPosition from "@/components/checkposition";

function FormPelamarKerja() {
  const token = getCookie("token");
  const positionId = useSelector((state) => state.id.position_id);
  const [regencyValue, setRegencyData] = useState([]);
  const [districtValue, setDistrictData] = useState([]);
  const [villageValue, setVillageData] = useState([]);
  const [domicileRegencyValue, setDomicileRegencyValue] = useState([]);
  const [domicileDistrictValue, setDomicileDistrictValue] = useState([]);
  const [domicileVillageValue, setDomicileVillageValue] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState(false);
  const [selectedKTP, setSelectedKTP] = useState("");
  const [pictureURI, setPictureURI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedDriverLicense, setSelectedDriverLicense] = useState([]);
  const [cvName, setCvName] = useState("");
  const [otherDocumentName, setOtherDocumentName] = useState("");
  const vacancyForm = useRef();
  const dispatch = useDispatch();
  const [educations, setEducations] = useState([
    { name: "", school_name: "", start_date: "", end_date: "" },
  ]);

  const [workHistory, setWorkHistory] = useState([
    { company_name: "", start_date: "", end_date: "" },
  ]);

  const addEducation = () => {
    setEducations([
      ...educations,
      { name: "", school_name: "", start_date: "", end_date: "" },
    ]);
  };

  const deleteEducation = (index) => {
    const updatedEducations = [...educations];
    updatedEducations.splice(index, 1);
    setEducations(updatedEducations);
  };

  const customDropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <IoMdArrowDropdown />
      </components.DropdownIndicator>
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ddd",
      borderRadius: "10px",
      height: "48px",
      outline: "none",
      width: "100%",
      padding: "0 5px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#007bff" : null,
      color: state.isFocused ? "white" : null,
    }),
  };

  const addWorkHistory = () => {
    setWorkHistory([
      ...workHistory,
      { company_name: "", start_date: "", end_date: "" },
    ]);
  };

  const deleteWorkHistory = (index) => {
    const updatedWorkHistory = [...workHistory];
    updatedWorkHistory.splice(index, 1);
    setWorkHistory(updatedWorkHistory);
  };

  async function fetchProvince() {
    const { data } = await http(token).get("/province");
    return data.results;
  }

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

  async function fetchProvinceDomicile() {
    const { data } = await http(token).get("/province");
    return data.results;
  }

  const { data: provinceDomicileData } = useQuery({
    queryKey: ["province"],
    queryFn: () => fetchProvinceDomicile(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchDomicileRegencyById(id) {
    const { data } = await http().get(`/regency/${id}`);
    setDomicileRegencyValue(data.results);
    return data.results;
  }

  async function fetchDomicileDistrictById(id) {
    const { data } = await http().get(`/district/${id}`);
    setDomicileDistrictValue(data.results);
    return data.results;
  }

  async function fetchDomicileVillageById(id) {
    const { data } = await http().get(`/village/${id}`);
    setDomicileVillageValue(data.results);
    return data.results;
  }

  async function fetchGender() {
    const { data } = await http().get("/gender?limit=20");
    return data.results;
  }

  const { data: genderData } = useQuery({
    queryKey: ["gender"],
    queryFn: () => fetchGender(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchReligion() {
    const { data } = await http().get("/religion?limit=20");
    return data.results;
  }

  const { data: religionData } = useQuery({
    queryKey: ["religion"],
    queryFn: () => fetchReligion(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchMaritalStatus() {
    const { data } = await http().get("/maritalstatus?limit=20");
    return data.results;
  }

  const { data: maritalStatusData } = useQuery({
    queryKey: ["marital-status"],
    queryFn: () => fetchMaritalStatus(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchWorkExperience() {
    const { data } = await http().get("/workexperience?limit=20");
    return data.results;
  }

  const { data: workExperienceData } = useQuery({
    queryKey: ["work-experience"],
    queryFn: () => fetchWorkExperience(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVehicleType() {
    const { data } = await http().get("/vehicle-type-list?limit=20");
    return data.results;
  }

  const { data: vehicleTypeData } = useQuery({
    queryKey: ["vehicle-type-list"],
    queryFn: () => fetchVehicleType(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchDriverLicense() {
    const { data } = await http().get("/driver-license-list?limit=20");
    return data.results;
  }

  const { data: driverLicenseData } = useQuery({
    queryKey: ["driver-license-list"],
    queryFn: () => fetchDriverLicense(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVaccine() {
    const { data } = await http().get("/vaccine?limit=20");
    return data.results;
  }

  async function fetchBank() {
    const { data } = await http().get("/bank?limit=150");
    return data.results;
  }

  const { data: bankData } = useQuery({
    queryKey: ["bank"],
    queryFn: () => fetchBank(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchEducations() {
    const { data } = await http().get("/education?limit=20");
    return data.results;
  }

  const { data: educationsData } = useQuery({
    queryKey: ["educations"],
    queryFn: () => fetchEducations(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: vaccineData } = useQuery({
    queryKey: ["vaccine"],
    queryFn: () => fetchVaccine(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
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
    vacancyForm?.current?.setFieldValue("picture", "Has a value");
  };

  const changeKTP = (e) => {
    const file = e.target.files[0];
    setSelectedKTP(file);
    vacancyForm?.current?.setFieldValue("e_ktp", "Has a value");
  };

  const validateVacancy = Yup.object({
    full_name: Yup.string().required("Harap diisi"),
    picture: Yup.string().required("Harap diisi"),
    e_ktp: Yup.string().required("Harap diisi"),
    birth_place: Yup.string().required("Harap diisi"),
    nik: Yup.number().required("Harap diisi").typeError("NIK tidak valid"),
    birth_date: Yup.string().required("Harap diisi"),
    age: Yup.number().required("Harap diisi").typeError("Umur tidak valid"),
    height: Yup.number()
      .required("Harap diisi")
      .typeError("Tinggi badan tidak valid"),
    gender_id: Yup.string().required("Harap diisi"),
    educations_id: Yup.string().required("Harap diisi"),
    driver_license_id: Yup.string().required("Harap diisi"),
    vehicle_type_id: Yup.string().required("Harap diisi"),
    religion_id: Yup.string().required("Harap diisi"),
    skills: Yup.string().required("Harap diisi"),
    company_name: Yup.string().required("Harap diisi"),
    work_history_start_date: Yup.string().required("Harap diisi"),
    work_history_end_date: Yup.string().required("Harap diisi"),
    school_name: Yup.string().required("Harap diisi"),
    education_start_date: Yup.string().required("Harap diisi"),
    education_end_date: Yup.string().required("Harap diisi"),
    work_experience_id: Yup.string().required("Harap diisi"),
    marital_status_id: Yup.string().required("Harap diisi"),
    vaccine_id: Yup.string().required("Harap diisi"),
    first_phone_number: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa angka"),
    second_phone_number: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa angka"),
    email: Yup.string()
      .email("Email tidak valid")
      .required("Harap diisi")
      .matches(/@[^.]*\./, "Email tidak valid"),
    e_ktp_province_id: Yup.string().required("Harap diisi"),
    e_ktp_district_id: Yup.string().required("Harap diisi"),
    e_ktp_regency_id: Yup.string().required("Harap diisi"),
    e_ktp_village_id: Yup.string().required("Harap diisi"),
    e_ktp_postal_code: Yup.number()
      .required("Harap diisi")
      .typeError("Kode POS tidak valid"),
    e_ktp_full_address: Yup.string().required("Harap diisi"),
    domicile_province_id: Yup.string().required("Harap diisi"),
    domicile_district_id: Yup.string().required("Harap diisi"),
    domicile_regency_id: Yup.string().required("Harap diisi"),
    domicile_village_id: Yup.string().required("Harap diisi"),
    domicile_postal_code: Yup.string().required("Harap diisi"),
    domicile_full_address: Yup.string().required("Harap diisi"),
    account_name: Yup.string().required("Harap diisi"),
    account_number: Yup.number()
      .required("Harap diisi")
      .typeError("Nomor rekening tidak valid"),
    bank_name_id: Yup.string().required("Harap diisi"),
    urgent_full_name: Yup.string().required("Harap diisi"),
    applicant_relationships: Yup.string().required("Harap diisi"),
    urgent_phone_number: Yup.number()
      .required("Harap diisi")
      .typeError("Harus berupa angka"),
    describe_yourself: Yup.string().required("Harap diisi"),
    expected_salary: Yup.string().required("Harap diisi"),
    cv: Yup.string().required("Harap diisi"),
    other_document: Yup.string().required("Harap diisi"),
  });

  const queryClient = useQueryClient();

  const router = useRouter();

  const sendMail = useMutation({
    mutationFn: async (values) => {
      const data = new URLSearchParams({
        from: "testing@runlapan.com",
        to: values.email,
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

  const postVacancy = useMutation({
    mutationFn: (values) => {
      const form = new FormData();
      if (selectedPicture) {
        form.append("profile_photo", selectedPicture);
      }

      if (selectedKTP) {
        form.append("e_ktp", selectedKTP);
      }

      const filteredEducations = educations.filter((item) =>
        Object.values(item).every((value) => value !== "")
      );

      const filteredWorkHistory = workHistory.filter((item) =>
        Object.values(item).every((value) => value !== "")
      );

      form.append("education", JSON.stringify(filteredEducations));
      form.append(
        "work_experience_history",
        JSON.stringify(filteredWorkHistory)
      );
      form.append("vehicle_type", JSON.stringify(selectedVehicles));
      form.append("driver_license", JSON.stringify(selectedDriverLicense));
      form.append("full_name", values.full_name);
      form.append("birth_place", values.birth_place);
      form.append("nik", values.nik);
      form.append("birth_date", values.birth_date);
      form.append("age", values.age);
      form.append("height", values.height);
      form.append("gender_id", values.gender_id);
      form.append("religion_id", values.religion_id);
      form.append("skills", values.skills);
      form.append("work_experience_id", values.work_experience_id);
      form.append("marital_status_id", values.marital_status_id);
      form.append("vaccine_id", values.vaccine_id);
      form.append("first_phone_number", values.first_phone_number);
      form.append("second_phone_number", values.second_phone_number);
      form.append("email", values.email);
      form.append("facebook", values.facebook);
      form.append("instagram", values.instagram);
      form.append("line", values.line);
      form.append("twitter", values.twitter);
      form.append("linkedin", values.linkedin);
      form.append("e_ktp_province_id", values.e_ktp_province_id);
      form.append("e_ktp_regency_id", values.e_ktp_regency_id);
      form.append("e_ktp_district_id", values.e_ktp_district_id);
      form.append("e_ktp_village_id", values.e_ktp_village_id);
      form.append("e_ktp_postal_code", values.e_ktp_postal_code);
      form.append("e_ktp_full_address", values.e_ktp_full_address);
      form.append("domicile_province_id", values.domicile_province_id);
      form.append("domicile_regency_id", values.domicile_regency_id);
      form.append("domicile_district_id", values.domicile_district_id);
      form.append("domicile_village_id", values.domicile_village_id);
      form.append("domicile_postal_code", values.domicile_postal_code);
      form.append("domicile_full_address", values.domicile_full_address);
      form.append("account_name", values.account_name);
      form.append("account_number", values.account_number);
      form.append("bank_name_id", values.bank_name_id);
      form.append("urgent_full_name", values.urgent_full_name);
      form.append("urgent_phone_number", values.urgent_phone_number);
      form.append("applicant_relationships", values.applicant_relationships);
      form.append("expected_salary", values.expected_salary);
      form.append("describe_yourself", values.describe_yourself);
      form.append("cv", values.cv);
      form.append("other_document", values.other_document);
      form.append("status_id", 1);
      form.append("position_id", positionId);
      form.append("applied_date", dayjs().format("MM-DD-YYYY"));

      const allowedExtensions = ["png", "jpg", "jpeg"];
      const ktpExtensions = selectedKTP?.name?.split(".").pop().toLowerCase();
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();

      if (selectedKTP) {
        if (!allowedExtensions.includes(ktpExtensions)) {
          toast.error("E-KTP harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Foto profil harus berupa file gambar");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (cvName) {
        if (cvName?.split(".").pop() !== "pdf") {
          toast.error("CV harus berupa file pdf");
          return http(token).put(`/vacancies`, form);
        }
      }

      if (otherDocumentName) {
        if (otherDocumentName?.split(".").pop() !== "pdf") {
          toast.error("Dokumen tambahan harus berupa file pdf");
          return http(token).put(`/vacancies`, form);
        }
      }
      return http(token).post("/vacancy", form);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vacancy"] });
      setLoading(false);
      sendMail.mutate(data?.data?.results);
      dispatch(setVacancyId(data?.data?.results?.id));
      router.push("/list-kandidat-terdaftar");
      toast.success("Berhasil mangapply karir");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleInputChange = (index, field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[index][field] = value;
    setEducations(updatedEducations);
  };

  const handleWorkHistoryChange = (index, field, value) => {
    const updatedWorkHistory = [...workHistory];
    updatedWorkHistory[index][field] = value;
    setWorkHistory(updatedWorkHistory);
  };

  return (
    <div>
      <div>
        <HomeNav />
      </div>
      <div className="xl:pt-32 pt-40 xl:px-10">
        <div className="font-bold text-3xl text-center pb-10">
          Form Pelamar Kerja
        </div>
        <div className="max-w-[900px] h-auto bg-[#F5F7F8] border-2 mt-5 rounded-md m-auto">
          <div className="font-bold text-xl w-full bg-[#ddd] px-5 py-5">
            Informasi Pribadi
          </div>
          <div>
            <Formik
              initialValues={{
                full_name: "",
                birth_place: "",
                nik: "",
                e_ktp: "",
                picture: "",
                birth_date: "",
                age: "",
                height: "",
                gender_id: "",
                religion_id: "",
                skills: "",
                work_experience_id: "",
                driver_license_id: "",
                marital_status_id: "",
                vaccine_id: "",
                educations_id: "",
                first_phone_number: "",
                second_phone_number: "",
                company_name: "",
                school_name: "",
                education_start_date: "",
                education_end_date: "",
                work_history_start_date: "",
                work_history_end_date: "",
                email: "",
                facebook: "",
                instagram: "",
                line: "",
                twitter: "",
                linkedin: "",
                e_ktp_province_id: "",
                e_ktp_district_id: "",
                e_ktp_regency_id: "",
                e_ktp_village_id: "",
                e_ktp_postal_code: "",
                e_ktp_full_address: "",
                domicile_province_id: "",
                domicile_district_id: "",
                domicile_regency_id: "",
                domicile_village_id: "",
                domicile_postal_code: "",
                domicile_full_address: "",
                account_name: "",
                account_number: "",
                bank_name_id: "",
                urgent_full_name: "",
                applicant_relationships: "",
                urgent_phone_number: "",
                vehicle_type_id: "",
                describe_yourself: "",
                expected_salary: "",
                cv: "",
                other_document: "",
              }}
              onSubmit={(values) => {
                setLoading(true);
                postVacancy.mutate(values);
              }}
              validationSchema={validateVacancy}
              innerRef={vacancyForm}
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
                  <form onSubmit={handleSubmit} className="py-10">
                    <div className="w-full flex justify-between px-5 gap-8 flex-col-reverse xl:flex-row">
                      <div className="w-full flex flex-col gap-5 pb-10">
                        <div className="flex flex-col gap-2">
                          <div className="font-bold">
                            Nama Lengkap :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Masukkan nama lengkap"
                            className="input input-bordered w-full text-sm"
                            name="full_name"
                            value={values.full_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.full_name && touched.full_name && (
                            <div className="text-sm text-red-500">
                              {errors.full_name}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-bold">
                            Tempat Lahir :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Masukkan tempat lahir"
                            className="input input-bordered w-full text-sm"
                            name="birth_place"
                            value={values.birth_place}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.birth_place && touched.birth_place && (
                            <div className="text-sm text-red-500">
                              {errors.birth_place}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-bold">
                            NIK KTP :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <input
                            type="number"
                            placeholder="Masukkan NIK KTP"
                            className="input input-bordered w-full text-sm"
                            name="nik"
                            value={values.nik}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.nik && touched.nik && (
                            <div className="text-sm text-red-500">
                              {errors.nik}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-bold">
                            Upload E - KTP:{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <input
                            type="file"
                            name="e_ktp"
                            className="file-input file-input-bordered w-full max-w-xs text-sm"
                            onChange={changeKTP}
                          ></input>
                          {errors.e_ktp && touched.e_ktp && (
                            <div className="text-red-500 text-sm">
                              {errors.e_ktp}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="max-w-md flex flex-col gap-5 pt-8">
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
                            <div className="text-sm pb-2">
                              Gambar :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="file"
                              name="picture"
                              className="file-input file-input-bordered w-full max-w-xs text-sm"
                              onChange={changePicture}
                            ></input>
                            {errors.picture && touched.picture && (
                              <div className="text-red-500 text-sm">
                                {errors.picture}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-between gap-10 px-5 flex-col xl:flex-row">
                      <div className="w-full flex flex-col gap-2">
                        <div className="font-bold">
                          Tanggal Lahir :{" "}
                          <span className="text-red-500 font-bold">*</span>
                        </div>
                        <input
                          type="date"
                          placeholder="Type here"
                          className="input input-bordered w-full text-sm"
                          name="birth_date"
                          value={values.birth_date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.birth_date && touched.birth_date && (
                          <div className="text-sm text-red-500">
                            {errors.birth_date}
                          </div>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <div className="font-bold">
                          Umur :{" "}
                          <span className="text-red-500 font-bold">*</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Masukkan umur"
                          className="input input-bordered w-full text-sm"
                          name="age"
                          value={values.age}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.age && touched.age && (
                          <div className="text-sm text-red-500">
                            {errors.age}
                          </div>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <div className="font-bold">
                          Tinggi Badan :{" "}
                          <span className="text-red-500 font-bold">*</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Masukkan tinggi badan"
                          className="input input-bordered w-full text-sm"
                          name="height"
                          value={values.height}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.height && touched.height && (
                          <div className="text-sm text-red-500">
                            {errors.height}
                          </div>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <div className="font-bold">
                          Jenis Kelamin :{" "}
                          <span className="text-red-500 font-bold">*</span>
                        </div>
                        <Field
                          as="select"
                          name="gender_id"
                          onChange={(e) => {
                            setFieldValue("gender_id", e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
                          <option value="" disabled selected>
                            Silahkan pilih jenis kelamin
                          </option>
                          {genderData?.data?.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </Field>
                        {errors.gender_id && touched.gender_id && (
                          <div className="text-sm text-red-500">
                            {errors.gender_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-full px-5 pt-5 flex flex-col gap-2">
                        <div className="font-bold">
                          Agama :{" "}
                          <span className="text-red-500 font-bold">*</span>
                        </div>
                        <Field
                          as="select"
                          name="religion_id"
                          onChange={(e) => {
                            setFieldValue("religion_id", e.target.value);
                          }}
                          className="select select-bordered w-full"
                        >
                          <option value="" disabled selected>
                            Silahkan pilih agama
                          </option>
                          {religionData?.data?.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </Field>
                        {errors.religion_id && touched.religion_id && (
                          <div className="text-sm text-red-500">
                            {errors.religion_id}
                          </div>
                        )}
                      </div>
                      <div className="w-full hidden xl:flex"></div>
                    </div>
                    <div className="font-bold px-5 py-5 text-xl flex w-full justify-between">
                      Riwayat Pendidikan :{" "}
                      {educations.length >= 1 && (
                        <button
                          className="btn btn-primary normal-case text-white"
                          type="button"
                          onClick={() => {
                            addEducation();
                          }}
                        >
                          <FaPlus />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex w-full gap-6 pt-5">
                        <div className="flex flex-col gap-5 w-full">
                          {educations?.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-center items-center w-full"
                            >
                              <div className="px-5 flex w-full gap-10 flex-col xl:flex-row">
                                <div className="w-full flex flex-col gap-2">
                                  <div className="font-bold">
                                    Jenjang :{" "}
                                    <span className="text-red-500 font-bold">
                                      *
                                    </span>
                                  </div>
                                  <Field
                                    as="select"
                                    name="name"
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "name",
                                        e.target.value
                                      );
                                    }}
                                    className="select select-bordered w-full"
                                  >
                                    <option value="" disabled selected>
                                      Silahkan pilih jenjang pendidikan
                                    </option>
                                    {educationsData?.data?.map((item) => {
                                      return (
                                        <option key={item.id}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </Field>
                                  {errors.educations_id &&
                                    touched.educations_id && (
                                      <div className="text-red-500 text-sm">
                                        {errors.educations_id}
                                      </div>
                                    )}
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                  <div className="font-bold">
                                    Nama Sekolah :{" "}
                                    <span className="text-red-500 font-bold">
                                      *
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Masukkan nama sekolah"
                                    name="school_name"
                                    value={educations.school_name}
                                    onBlur={handleBlur}
                                    className="input input-bordered w-full text-sm"
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "school_name",
                                        e.target.value
                                      );
                                      setFieldValue(
                                        "school_name",
                                        e.target.value
                                      );
                                    }}
                                  />
                                  {errors.school_name &&
                                    touched.school_name && (
                                      <div className="text-sm text-red-500">
                                        {errors.school_name}
                                      </div>
                                    )}
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                  <div className="font-bold">
                                    Tahun Mulai :{" "}
                                    <span className="text-red-500 font-bold">
                                      *
                                    </span>
                                  </div>
                                  <input
                                    type="date"
                                    placeholder="Type here"
                                    name="education_start_date"
                                    value={educations.start_date}
                                    onBlur={handleBlur}
                                    className="input input-bordered w-full text-sm"
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "start_date",
                                        e.target.value
                                      );
                                      setFieldValue(
                                        "education_start_date",
                                        e.target.value
                                      );
                                    }}
                                  />
                                  {errors.education_start_date &&
                                    touched.education_start_date && (
                                      <div className="text-sm text-red-500">
                                        {errors.education_start_date}
                                      </div>
                                    )}
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                  <div className="font-bold">
                                    Tahun Lulus :{" "}
                                    <span className="text-red-500 font-bold">
                                      *
                                    </span>
                                  </div>
                                  <input
                                    type="date"
                                    placeholder="Type here"
                                    name="education_end_date"
                                    onBlur={handleBlur}
                                    value={educations.end_date}
                                    className="input input-bordered w-full text-sm"
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        "end_date",
                                        e.target.value
                                      );
                                      setFieldValue(
                                        "education_end_date",
                                        e.target.value
                                      );
                                    }}
                                  />
                                  {errors.education_end_date &&
                                    touched.education_end_date && (
                                      <div className="text-sm text-red-500">
                                        {errors.education_end_date}
                                      </div>
                                    )}
                                </div>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-primary normal-case text-white mt-8"
                                    onClick={() => deleteEducation(index)}
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold px-5 py-5 text-xl flex justify-between w-full">
                      Riwayat Pengalaman Kerja :{" "}
                      <button
                        type="button"
                        onClick={addWorkHistory}
                        className="btn btn-primary text-white"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex">
                        <div className="px-5 flex flex-col w-full gap-10">
                          {workHistory?.map((item, index) => {
                            return (
                              <div
                                className="w-full flex flex-col gap-4"
                                key={index}
                              >
                                <div>
                                  <div className="font-bold pb-2">
                                    Nama Perusahaan :{" "}
                                    <span className="text-red-500 font-bold">
                                      *
                                    </span>
                                  </div>
                                  <div className="w-full">
                                    <textarea
                                      className="textarea textarea-bordered w-full text-sm"
                                      placeholder="Masukkan nama perusahaan"
                                      name="company_name"
                                      onBlur={handleBlur}
                                      onChange={(e) => {
                                        handleWorkHistoryChange(
                                          index,
                                          "company_name",
                                          e.target.value
                                        );
                                        setFieldValue(
                                          "company_name",
                                          e.target.value
                                        );
                                      }}
                                    ></textarea>
                                    {errors.company_name &&
                                      touched.company_name && (
                                        <div className="text-sm text-red-500">
                                          {errors.company_name}
                                        </div>
                                      )}
                                  </div>
                                  <div className="flex gap-10 pt-5 flex-col xl:flex-row">
                                    <div className="w-full flex flex-col gap-2">
                                      <div className="font-bold">
                                        Waktu Mulai :{" "}
                                        <span className="text-red-500 font-bold">
                                          *
                                        </span>
                                      </div>
                                      <input
                                        type="date"
                                        placeholder="Type here"
                                        name="work_history_start_date"
                                        onBlur={handleBlur}
                                        value={
                                          workHistory.work_history_start_date
                                        }
                                        className="input input-bordered w-full text-sm"
                                        onChange={(e) => {
                                          handleWorkHistoryChange(
                                            index,
                                            "start_date",
                                            e.target.value
                                          );
                                          setFieldValue(
                                            "work_history_start_date",
                                            e.target.value
                                          );
                                        }}
                                      />
                                      {errors.work_history_start_date &&
                                        touched.work_history_start_date && (
                                          <div className="text-sm text-red-500">
                                            {errors.work_history_start_date}
                                          </div>
                                        )}
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                      <div className="font-bold">
                                        Waktu Akhir :{" "}
                                        <span className="text-red-500 font-bold">
                                          *
                                        </span>
                                      </div>
                                      <input
                                        type="date"
                                        placeholder="Type here"
                                        name="work_history_end_date"
                                        onBlur={handleBlur}
                                        value={
                                          workHistory.work_history_end_date
                                        }
                                        className="input input-bordered w-full text-sm"
                                        onChange={(e) => {
                                          handleWorkHistoryChange(
                                            index,
                                            "end_date",
                                            e.target.value
                                          );
                                          setFieldValue(
                                            "work_history_end_date",
                                            e.target.value
                                          );
                                        }}
                                      />
                                      {errors.work_history_end_date &&
                                        touched.work_history_end_date && (
                                          <div className="text-sm text-red-500">
                                            {errors.work_history_end_date}
                                          </div>
                                        )}
                                    </div>
                                    {index > 0 && (
                                      <button
                                        type="button"
                                        className="btn btn-primary normal-case text-white mt-8"
                                        onClick={() => deleteWorkHistory(index)}
                                      >
                                        <FaTrash />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="px-5 flex flex-col w-full gap-5 pt-8">
                      <div className="flex gap-10 flex-col xl:flex-row">
                        <div className="flex flex-col gap-2 w-full">
                          <div className="font-bold">
                            Keahlian :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Masukkan keahlian"
                            className="input input-bordered w-full text-sm"
                            name="skills"
                            value={values.skills}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.skills && touched.skills && (
                            <div className="text-sm text-red-500">
                              {errors.skills}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="font-bold">
                            Pengalaman Kerja (Pada posisi yang dilamar) :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <Field
                            as="select"
                            name="work_experience_id"
                            onChange={(e) => {
                              setFieldValue(
                                "work_experience_id",
                                e.target.value
                              );
                            }}
                            className="select select-bordered w-full"
                          >
                            <option value="" disabled selected>
                              Silahkan pilih pengalaman bekerja
                            </option>
                            {workExperienceData?.data?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Field>
                          {errors.work_experience_id &&
                            touched.work_experience_id && (
                              <div className="text-sm text-red-500">
                                {errors.work_experience_id}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex gap-10 flex-col xl:flex-row">
                        <div className="flex flex-col gap-2 w-full">
                          <div className="font-bold">
                            Status Nikah :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <Field
                            as="select"
                            name="marital_status_id"
                            onChange={(e) => {
                              setFieldValue(
                                "marital_status_id",
                                e.target.value
                              );
                            }}
                            className="select select-bordered w-full"
                          >
                            <option value="" disabled selected>
                              Silahkan pilih status menikah
                            </option>
                            {maritalStatusData?.data?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Field>
                          {errors.marital_status_id &&
                            touched.marital_status_id && (
                              <div className="text-sm text-red-500">
                                {errors.marital_status_id}
                              </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="font-bold">
                            Kendaraan Yang Dimiliki :
                          </div>
                          <Select
                            isMulti
                            name="vehicle_type_id"
                            onChange={(e) => {
                              const selectedVehicles = e.map((item) => ({
                                name: item.value,
                              }));
                              setSelectedVehicles(selectedVehicles);
                              setFieldValue("vehicle_type_id", "Has a value");
                            }}
                            components={{
                              DropdownIndicator: customDropdownIndicator,
                              IndicatorSeparator: () => null,
                            }}
                            placeholder="Silahkan pilih jenis kendaraan"
                            className="text-sm focus:outline-none focus:border-black"
                            options={vehicleTypeData?.data?.map((item) => ({
                              value: item.name,
                              label: item.name,
                            }))}
                            styles={customStyles}
                          />
                          {errors.vehicle_type_id &&
                            touched.vehicle_type_id && (
                              <div className="text-sm text-red-500">
                                {errors.vehicle_type_id}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex gap-10 flex-col xl:flex-row">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="font-bold">SIM Yang Dimiliki :</div>
                          <Select
                            isMulti
                            name="driver_license_id"
                            onChange={(e) => {
                              const selectedDriverLicense = e.map((item) => ({
                                name: item.value,
                              }));
                              setSelectedDriverLicense(selectedDriverLicense);
                              setFieldValue("driver_license_id", "Has a value");
                            }}
                            components={{
                              DropdownIndicator: customDropdownIndicator,
                              IndicatorSeparator: () => null,
                            }}
                            placeholder="Silahkan pilih SIM yang dimiliki"
                            className="text-sm focus:outline-none focus:border-black"
                            options={driverLicenseData?.data?.map((item) => ({
                              value: item.name,
                              label: item.name,
                            }))}
                            styles={customStyles}
                          />
                          {errors.driver_license_id &&
                            touched.driver_license_id && (
                              <div className="text-sm text-red-500">
                                {errors.driver_license_id}
                              </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="font-bold">
                            Vaksin :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <Field
                            as="select"
                            name="vaccine_id"
                            onChange={(e) => {
                              setFieldValue("vaccine_id", e.target.value);
                            }}
                            className="select select-bordered w-full"
                          >
                            <option value="" disabled selected>
                              Silahkan pilih vaksin
                            </option>
                            ;
                            {vaccineData?.data?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Field>
                          {errors.vaccine_id && touched.vaccine_id && (
                            <div className="text-sm text-red-500">
                              {errors.vaccine_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xl px-5 pt-5">
                        Kontak dan Sosial Media
                      </div>
                      <div className="flex w-full px-5 pt-5 gap-10 flex-col xl:flex-row">
                        <div className="flex flex-col gap-4 flex-auto w-full">
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              No Telpon 1 :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="number"
                              placeholder="Masukkan no telpon"
                              className="input input-bordered w-full text-sm"
                              name="first_phone_number"
                              value={values.first_phone_number}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.first_phone_number &&
                              touched.first_phone_number && (
                                <div className="text-sm text-red-500">
                                  {errors.first_phone_number}
                                </div>
                              )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              Email :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Masukkan email"
                              className="input input-bordered w-full text-sm"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.email && touched.email && (
                              <div className="text-sm text-red-500">
                                {errors.email}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">Instagram : </div>
                            <input
                              type="text"
                              placeholder="Masukkan link instagram"
                              className="input input-bordered w-full text-sm"
                              name="instagram"
                              value={values.instagram}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.instagram && touched.instagram && (
                              <div className="text-sm text-red-500">
                                {errors.instagram}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">Twitter : </div>
                            <input
                              type="text"
                              placeholder="Masukkan link twitter"
                              className="input input-bordered w-full text-sm"
                              name="twitter"
                              value={values.twitter}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.twitter && touched.twitter && (
                              <div className="text-sm text-red-500">
                                {errors.twitter}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-auto gap-4 w-full flex-col">
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              No Telpon 2 :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="number"
                              placeholder="Masukkan no telpon 2"
                              className="input input-bordered w-full text-sm"
                              name="second_phone_number"
                              value={values.second_phone_number}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.second_phone_number &&
                              touched.second_phone_number && (
                                <div className="text-sm text-red-500">
                                  {errors.second_phone_number}
                                </div>
                              )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">Facebook : </div>
                            <input
                              type="text"
                              placeholder="Masukkan link facebook"
                              className="input input-bordered w-full text-sm"
                              name="facebook"
                              value={values.facebook}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.facebook && touched.facebook && (
                              <div className="text-sm text-red-500">
                                {errors.facebook}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">Line : </div>
                            <input
                              type="text"
                              placeholder="Masukkan link line"
                              className="input input-bordered w-full text-sm"
                              name="line"
                              value={values.line}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.line && touched.line && (
                              <div className="text-sm text-red-500">
                                {errors.line}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">LinkedIn : </div>
                            <input
                              type="text"
                              placeholder="Masukkan link linkedin"
                              className="input input-bordered w-full text-sm"
                              name="linkedin"
                              value={values.linkedin}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.linkedin && touched.linkedin && (
                              <div className="text-sm text-red-500">
                                {errors.linkedin}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xl px-5 pt-5">
                        Informasi Kontak Darurat
                      </div>
                      <div className="flex w-full px-5 pt-5 gap-10 flex-col xl:flex-row">
                        <div className="flex flex-col gap-4 flex-auto w-full">
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              Nama Lengkap :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Masukkan nama lengkap"
                              className="input input-bordered w-full text-sm"
                              name="urgent_full_name"
                              value={values.urgent_full_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.urgent_full_name &&
                              touched.urgent_full_name && (
                                <div className="text-sm text-red-500">
                                  {errors.urgent_full_name}
                                </div>
                              )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              No Telpon / Whatsapp :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="number"
                              placeholder="Masukkan nomor telepon"
                              className="input input-bordered w-full text-sm"
                              name="urgent_phone_number"
                              value={values.urgent_phone_number}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.urgent_phone_number &&
                              touched.urgent_phone_number && (
                                <div className="text-sm text-red-500">
                                  {errors.urgent_phone_number}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-auto gap-4 w-full flex-col">
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              Hubungan Dengan Pelamar :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Hubungan dengan pelamar"
                              className="input input-bordered w-full text-sm"
                              name="applicant_relationships"
                              value={values.applicant_relationships}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.applicant_relationships &&
                              touched.applicant_relationships && (
                                <div className="text-sm text-red-500">
                                  {errors.applicant_relationships}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xl px-5 pt-5">
                        Informasi Akun Bank
                      </div>
                      <div className="flex w-full px-5 pt-5 gap-10 flex-col xl:flex-row">
                        <div className="flex flex-col gap-4 flex-auto w-full">
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              Nama Owner Bank :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Masukkan nama owner bank"
                              className="input input-bordered w-full text-sm"
                              name="account_name"
                              value={values.account_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.account_name && touched.account_name && (
                              <div className="text-sm text-red-500">
                                {errors.account_name}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              Nomor Rekening :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="number"
                              placeholder="Masukkan nomor rekening"
                              className="input input-bordered w-full text-sm"
                              name="account_number"
                              value={values.account_number}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.account_number &&
                              touched.account_number && (
                                <div className="text-sm text-red-500">
                                  {errors.account_number}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-auto gap-4 w-full flex-col">
                          <div className="flex flex-col gap-2">
                            <div className="font-bold">
                              Nama Bank :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <Field
                              as="select"
                              name="bank_name_id"
                              onChange={(e) => {
                                setFieldValue("bank_name_id", e.target.value);
                              }}
                              className="select select-bordered w-full"
                            >
                              <option value="" selected disabled>
                                Silahkan pilih nama bank
                              </option>
                              {bankData?.data?.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                            </Field>
                            {errors.bank_name_id && touched.bank_name_id && (
                              <div className="text-sm text-red-500">
                                {errors.bank_name_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className="font-bold text-xl px-5 pt-5">
                          Informasi Alamat Sesuai E-KTP
                        </div>
                        <div className="flex w-full px-5 pt-5 gap-10 flex-col xl:flex-row">
                          <div className="flex flex-col gap-4 flex-auto w-full">
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Provinsi :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="e_ktp_province_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "e_ktp_province_id",
                                    e.target.value
                                  );
                                  fetchRegencyById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih provinsi
                                </option>
                                {provinceData?.data?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.e_ktp_province_id &&
                                touched.e_ktp_province_id && (
                                  <div className="text-red-500 pt-2 text-sm">
                                    {errors.e_ktp_province_id}
                                  </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Kota / Kabupaten :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="e_ktp_regency_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "e_ktp_regency_id",
                                    e.target.value
                                  );
                                  fetchDistrictById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                                disabled={regencyValue.length < 1}
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih kota/kabupaten
                                </option>
                                ;
                                {regencyValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.e_ktp_regency_id &&
                                touched.e_ktp_regency_id && (
                                  <div className="text-red-500 pt-2 text-sm">
                                    {errors.e_ktp_regency_id}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex flex-auto gap-4 w-full flex-col">
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Kecamatan :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="e_ktp_district_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "e_ktp_district_id",
                                    e.target.value
                                  );
                                  fetchVillageById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                                disabled={districtValue.length < 1}
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih kecamatan
                                </option>
                                ;
                                {districtValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.e_ktp_district_id &&
                                touched.e_ktp_district_id && (
                                  <div className="text-red-500 pt-2 text-sm">
                                    {errors.e_ktp_district_id}
                                  </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Kelurahan :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="e_ktp_village_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "e_ktp_village_id",
                                    e.target.value
                                  );
                                }}
                                className="select select-bordered w-full"
                                disabled={villageValue.length < 1}
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih kelurahan
                                </option>
                                ;
                                {villageValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.e_ktp_village_id &&
                                touched.e_ktp_village_id && (
                                  <div className="text-red-500 pt-2 text-sm">
                                    {errors.e_ktp_village_id}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-10 px-5 pt-4">
                          <div className="w-full flex flex-col gap-2">
                            <div className="font-bold">
                              Kode POS :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="number"
                              placeholder="Masukkan Kode POS"
                              className="input input-bordered w-full text-sm"
                              name="e_ktp_postal_code"
                              value={values.e_ktp_postal_code}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.e_ktp_postal_code &&
                              touched.e_ktp_postal_code && (
                                <div className="text-sm text-red-500">
                                  {errors.e_ktp_postal_code}
                                </div>
                              )}
                          </div>
                          <div className="w-full hidden xl:flex"></div>
                        </div>
                      </div>
                      <div className="px-5 pt-5">
                        <div className="flex flex-col gap-2">
                          <div className="font-bold">
                            Alamat Lengkap :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <textarea
                            className="textarea textarea-bordered h-32 text-sm"
                            placeholder="Silahkan masukkan alamat lengkap"
                            name="e_ktp_full_address"
                            value={values.e_ktp_full_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></textarea>
                          {errors.e_ktp_full_address &&
                            touched.e_ktp_full_address && (
                              <div className="text-sm text-red-500">
                                {errors.e_ktp_full_address}
                              </div>
                            )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-xl px-5 pt-5">
                          Informasi Alamat Sesuai Domisili
                        </div>
                        <div className="flex w-full px-5 pt-5 gap-10 flex-col xl:flex-row">
                          <div className="flex flex-col gap-4 flex-auto w-full">
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Provinsi :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="domicile_province_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "domicile_province_id",
                                    e.target.value
                                  );
                                  fetchDomicileRegencyById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih provinsi
                                </option>
                                ;
                                {provinceDomicileData?.data?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.domicile_province_id &&
                                touched.domicile_province_id && (
                                  <div className="text-red-500 text-sm">
                                    {errors.domicile_province_id}
                                  </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Kota / Kabupaten :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="domicile_regency_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "domicile_regency_id",
                                    e.target.value
                                  );
                                  fetchDomicileDistrictById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                                disabled={domicileRegencyValue.length < 1}
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih kota / kabupaten
                                </option>
                                ;
                                {domicileRegencyValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.domicile_regency_id &&
                                touched.domicile_regency_id && (
                                  <div className="text-red-500 text-sm">
                                    {errors.domicile_regency_id}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex flex-auto gap-4 w-full flex-col">
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Kecamatan :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="domicile_district_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "domicile_district_id",
                                    e.target.value
                                  );
                                  fetchDomicileVillageById(e.target.value);
                                }}
                                className="select select-bordered w-full"
                                disabled={domicileDistrictValue.length < 1}
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih kecamatan
                                </option>
                                ;
                                {domicileDistrictValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.domicile_district_id &&
                                touched.domicile_district_id && (
                                  <div className="text-red-500 text-sm">
                                    {errors.domicile_district_id}
                                  </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="font-bold">
                                Kelurahan :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <Field
                                as="select"
                                name="domicile_village_id"
                                onChange={(e) => {
                                  setFieldValue(
                                    "domicile_village_id",
                                    e.target.value
                                  );
                                }}
                                className="select select-bordered w-full"
                                disabled={domicileVillageValue.length < 1}
                              >
                                <option value="" disabled selected>
                                  Silahkan pilih kelurahan
                                </option>
                                ;
                                {domicileVillageValue?.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.domicile_village_id &&
                                touched.domicile_village_id && (
                                  <div className="text-red-500 text-sm">
                                    {errors.domicile_village_id}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-10 px-5 pt-4">
                          <div className="w-full flex flex-col gap-2">
                            <div className="font-bold">
                              Kode POS :{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <input
                              type="number"
                              placeholder="Masukkan Kode POS"
                              className="input input-bordered w-full text-sm"
                              name="domicile_postal_code"
                              value={values.domicile_postal_code}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.domicile_postal_code &&
                              touched.domicile_postal_code && (
                                <div className="text-sm text-red-500">
                                  {errors.domicile_postal_code}
                                </div>
                              )}
                          </div>
                          <div className="w-full hidden xl:flex"></div>
                        </div>
                      </div>
                      <div className="px-5 pt-5">
                        <div className="flex flex-col gap-2">
                          <div className="font-bold">
                            Alamat Lengkap :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <textarea
                            className="textarea textarea-bordered h-32 text-sm"
                            placeholder="Silahkan masukkan alamat lengkap"
                            name="domicile_full_address"
                            value={values.domicile_full_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></textarea>
                          {errors.domicile_full_address &&
                            touched.domicile_full_address && (
                              <div className="text-sm text-red-500">
                                {errors.domicile_full_address}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="w-full px-5">
                        <div className="text-xl font-bold py-5">
                          Informasi Tambahan dan Lampiran
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="font-bold">
                            Jelaskan tentang diri anda :{" "}
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <textarea
                            className="textarea textarea-bordered h-40 w-full text-sm"
                            placeholder="Jelaskan tentang diri anda"
                            name="describe_yourself"
                            value={values.describe_yourself}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></textarea>
                          {errors.describe_yourself &&
                            touched.describe_yourself && (
                              <div className="text-sm text-red-500">
                                {errors.describe_yourself}
                              </div>
                            )}
                        </div>
                        <div className="flex">
                          <div className="w-full flex flex-col gap-3 pt-5">
                            <div className="font-bold">
                              Gaji yang diharapkan{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <div className="w-full">
                              <NumericFormat
                                placeholder="Gaji yang diharapkan"
                                value={values.expected_salary}
                                onChange={(e) => {
                                  setFieldValue(
                                    "expected_salary",
                                    e.target.value
                                  );
                                }}
                                onBlur={handleBlur}
                                className="input input-bordered w-full text-sm"
                                allowNegative={false}
                                prefix="Rp"
                                thousandsGroupStyle="rupiah"
                                thousandSeparator=","
                              />
                              {errors.expected_salary &&
                                touched.expected_salary && (
                                  <div className="text-sm text-red-500">
                                    {errors.expected_salary}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="w-full hidden xl:flex"></div>
                        </div>
                        <div className="flex w-full gap-5 pt-5 flex-col xl:flex-row">
                          <div className="w-full flex flex-col gap-3">
                            <div className="font-bold">
                              Upload Resume / CV{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <div className="w-full">
                              <input
                                type="file"
                                accept=".pdf"
                                className="file file-input bordered max-w-xs text-sm"
                                onChange={(event) => {
                                  setFieldValue("cv", event.target.files[0]);
                                  setCvName(event.target.files[0].name);
                                }}
                              />
                            </div>
                            {errors.cv && touched.cv && (
                              <div className="text-red-500 text-sm">
                                {errors.cv}
                              </div>
                            )}
                          </div>
                          <div className="w-full flex flex-col gap-3">
                            <div className="font-bold">
                              Upload Dokumen{" "}
                              <span className="text-red-500 font-bold">*</span>
                            </div>
                            <div className="w-full">
                              <input
                                type="file"
                                accept=".pdf"
                                className="file file-input bordered max-w-xs text-sm"
                                onChange={(event) => {
                                  setFieldValue(
                                    "other_document",
                                    event.target.files[0]
                                  );
                                  setOtherDocumentName(
                                    event.target.files[0].name
                                  );
                                }}
                              />
                            </div>
                            {errors.other_document &&
                              touched.other_document && (
                                <div className="text-red-500 text-sm">
                                  {errors.other_document}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="w-full flex justify-end pt-8">
                          <button
                            type="submit"
                            className="btn bg-green-500 text-white normal-case"
                          >
                            Kirim
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default CheckPosition(FormPelamarKerja);
