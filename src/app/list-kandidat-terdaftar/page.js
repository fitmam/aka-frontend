"use client";
import HomeNav from "@/components/homenav";
import React, { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/helpers/http.helper";
import { useSelector } from "react-redux";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { Field, Formik } from "formik";
import { useState } from "react";
import Loading from "@/components/loading";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoIosMale, IoIosFemale } from "react-icons/io";
import Select, { components } from "react-select";
import { IoMdArrowDropdown } from "react-icons/io";
import CheckPosition from "@/components/checkposition";

function ListVacancy() {
  const [openDetail, setOpenDetail] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [vacancyValue, setVacancyValue] = useState([]);
  const [regencyValue, setRegencyData] = useState([]);
  const [districtValue, setDistrictData] = useState([]);
  const [villageValue, setVillageData] = useState([]);
  const [domicileRegencyValue, setDomicileRegencyValue] = useState([]);
  const [domicileDistrictValue, setDomicileDistrictValue] = useState([]);
  const [domicileVillageValue, setDomicileVillageValue] = useState([]);
  const [selectedKTP, setSelectedKTP] = useState("");
  const [vacancyId, setVacancyId] = useState("");
  const [selectedPicture, setSelectedPicture] = useState("");
  const vacancyForm = useRef();
  const [loading, setLoading] = useState(false);
  const vacancy_id = useSelector((state) => state.id.vacancy_id);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [pictureURI, setPictureURI] = useState("");
  const [selectedDriverLicense, setSelectedDriverLicense] = useState([]);
  const [cvName, setCvName] = useState("");
  const [otherDocumentName, setOtherDocumentName] = useState("");
  const token = getCookie("token");

  const [educations, setEducations] = useState([
    { name: "", school_name: "", start_date: "", end_date: "" },
  ]);

  const [workHistory, setWorkHistory] = useState([
    { company_name: "", start_date: "", end_date: "" },
  ]);

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

  const queryClient = useQueryClient();

  async function fetchVacancy() {
    const { data } = await http(token).get(`/vacancy?search=${vacancy_id}`);
    setVacancyValue(data?.results?.data?.[0]);
    return data.results;
  }

  async function fetchProvince() {
    const { data } = await http(token).get("/province");
    return data.results;
  }

  async function fetchVacancyById(id) {
    try {
      const { data } = await http(token).get(`/vacancy/${id}`);
      const educationData = data.results.education;
      const workHistoryData = data.results.work_experience_histories;
      const driverLicenseData = data.results.driver_license;
      const vehicleTypeData = data.results.vehicle_type;
      setEducations(educationData);
      setWorkHistory(workHistoryData);
      setSelectedDriverLicense(driverLicenseData);
      setSelectedVehicles(vehicleTypeData);
      setVacancyValue(data.results);
    } catch (err) {
      console.log(err);
    }
  }

  const { data: vacancyData } = useQuery({
    queryKey: ["vacancy"],
    queryFn: () => fetchVacancy(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchWorkPosition() {
    const { data } = await http(token).get(`/needed-position?limit=20`);
    return data.results;
  }

  const { data: positionOfWork } = useQuery({
    queryKey: ["needed-position"],
    queryFn: () => fetchWorkPosition(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const showUpdateModal = (itemId) => {
    const updatedId = itemId;
    setOpenEditModal(!openEditModal);
    setVacancyId(updatedId);
  };

  const showDetailModal = (itemId) => {
    const updatedId = itemId;
    setOpenDetail(!openDetail);
    setVacancyId(updatedId);
  };

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
    queryKey: ["vehicle-type"],
    queryFn: () => fetchVehicleType(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchDriverLicense() {
    const { data } = await http().get("/driver-license-list?limit=20");
    return data.results;
  }

  const { data: driverLicenseData } = useQuery({
    queryKey: ["driver-license"],
    queryFn: () => fetchDriverLicense(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchVaccine() {
    const { data } = await http().get("/vaccine?limit=20");
    return data.results;
  }

  async function fetchBank() {
    const { data } = await http().get("/bank?limit=20");
    return data.results;
  }

  const { data: bankData } = useQuery({
    queryKey: ["bank"],
    queryFn: () => fetchBank(),
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
  };

  const updateVacancy = useMutation({
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
      form.append("gender_id", values.gender_id);
      form.append("religion_id", values.religion_id);
      form.append("skills", values.skills);
      form.append("work_experience_id", values.work_experience_id);
      form.append("marital_status_id", values.marital_status_id);
      form.append("vehicle_type_id", values.vehicle_type_id);
      form.append("driver_license_id", values.driver_license_id);
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
      form.append("position_id", values.position_id);
      form.append("describe_yourself", values.describe_yourself);
      form.append("cv", values.cv);
      form.append("other_document", values.other_document);
      form.append("status_id", 1);

      const allowedExtensions = ["png", "jpg", "jpeg"];
      const ktpExtensions = selectedKTP?.name?.split(".").pop().toLowerCase();
      const pictureExtensions = selectedPicture?.name
        ?.split(".")
        .pop()
        .toLowerCase();

      if (selectedKTP) {
        if (!allowedExtensions.includes(ktpExtensions)) {
          toast.error("E-KTP harus berupa file gambar");
          return http(token).put(`/vacancy/${vacancyId}`, form);
        }
      }

      if (selectedPicture) {
        if (!allowedExtensions.includes(pictureExtensions)) {
          toast.error("Foto profil harus berupa file gambar");
          return http(token).put(`/vacancy/${vacancyId}`, form);
        }
      }

      if (cvName) {
        if (cvName.split(".").pop() !== "pdf") {
          toast.error("CV harus berupa file pdf");
          return http(token).put(`/vacancy/${vacancyId}`, form);
        }
      }

      if (otherDocumentName) {
        if (otherDocumentName.split(".").pop() !== "pdf") {
          toast.error("Dokumen tambahan harus berupa file pdf");
          return http(token).put(`/vacancy/${vacancyId}`, form);
        }
      }
      return http(token).patch(`/vacancy/${vacancyId}`, form);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vacancy"] });
      setLoading(false);
      toast.success("Berhasil mengupdate kandidat");
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

  const changeKTP = (e) => {
    const file = e.target.files[0];
    setSelectedKTP(file);
  };

  return (
    <div>
      <div>
        <HomeNav />
      </div>
      <div className="w-full h-screen pt-40 xl:pt-0">
        <div className="flex flex-col w-full items-center h-full overflow-auto">
          <div className="font-bold text-2xl xl:pt-32">Data Pelamar</div>
          <div className="text-green-500 font-bold">
            Simpan ID Kandidat Anda : <br />
            <div className="text-center">{vacancy_id}</div>
          </div>
          <div className="max-w-[300px] xl:max-w-full xl:w-full overflow-auto px-20">
            <table className="w-full mt-20">
              <tr className="h-16 bg-[#E0F4FF]">
                <th className=" text-xs w-10">No</th>
                <th className=" text-xs w-64">Foto Profil</th>
                <th className=" text-xs w-64">Nama Lengkap</th>
                <th className=" text-xs w-64">Tempat Tanggal Lahir</th>
                <th className=" text-xs w-64">NIK</th>
                <th className=" text-xs w-64">Tanggal Lahir</th>
                <th className=" text-xs w-64">Umur</th>
                <th className=" text-xs w-64">Agama</th>
                <th className=" text-xs w-64">Posisi Yang Dilamar</th>
                <th className=" text-xs w-64">Status</th>
                <th className=" text-xs w-64">Aksi</th>
              </tr>
              {vacancyData?.data?.map((item, index) => {
                return (
                  <tr
                    className="h-12 hover:bg-[#F3F3F3] cursor-pointer text-center"
                    key={item.id}
                    onClick={(item) => {
                      showDetailModal(item.id);
                      fetchVacancyById(vacancy_id);
                    }}
                  >
                    <td className=" pl-4 text-xs">{index + 1}</td>
                    <td className=" pl-4 text-xs w-16 h-16 overflow-hidden py-5">
                      <div className="flex flex-col justify-center items-center gap-2">
                        <Image
                          src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1699097693/uploads/${item?.profile_photo.replace(
                            /\s/g,
                            "%20"
                          )}.png`}
                          width={50}
                          height={50}
                          alt=""
                        ></Image>
                        {item?.gender_id === 1 ? (
                          <IoIosMale size={30} color="green" />
                        ) : (
                          <IoIosFemale size={30} color="green" />
                        )}
                      </div>
                    </td>
                    <td className=" pl-4 text-xs">{item.full_name}</td>
                    <td className=" pl-4 text-xs">{item.birth_place}</td>
                    <td className=" pl-4 text-xs">{item.nik}</td>
                    <td className=" pl-4 text-xs">
                      {dayjs(item.birth_date).format("DD-MM-YYYY")}
                    </td>
                    <td className=" pl-4 text-xs">{item.age}</td>
                    <td className=" pl-4 text-xs">{item.religion.name}</td>
                    <td className=" pl-4 text-xs">{item.position.name}</td>
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
                    <td className=" m-auto">
                      <div className="flex gap-3 justify-center items-center">
                        <button
                          onClick={(e) => {
                            showUpdateModal(item?.id);
                            fetchVacancyById(item?.id);
                            fetchRegencyById(item?.e_ktp_province_id);
                            fetchDistrictById(item?.e_ktp_regency_id);
                            fetchVillageById(item?.e_ktp_district_id);
                            fetchDomicileRegencyById(
                              item?.domicile_province_id
                            );
                            fetchDomicileDistrictById(
                              item?.domicile_regency_id
                            );
                            fetchDomicileVillageById(
                              item?.domicile_district_id
                            );
                            e.stopPropagation();
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
      </div>
      <input
        type="checkbox"
        id="editModal"
        className="modal-toggle"
        checked={openEditModal}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Edit Kandidat</h3>
          <Formik
            initialValues={{
              full_name: vacancyValue?.full_name,
              birth_place: vacancyValue?.birth_place,
              nik: vacancyValue?.nik,
              birth_date: vacancyValue?.birth_date,
              age: vacancyValue?.age,
              height: vacancyValue?.height,
              gender_id: vacancyValue?.gender?.id,
              religion_id: vacancyValue?.religion?.id,
              skills: vacancyValue?.skills,
              work_experience_id: vacancyValue?.work_experience?.id,
              marital_status_id: vacancyValue?.marital_status?.id,
              vaccine_id: vacancyValue?.vaccine?.id,
              first_phone_number: vacancyValue?.first_phone_number,
              second_phone_number: vacancyValue?.second_phone_number,
              email: vacancyValue?.email,
              facebook: vacancyValue?.facebook,
              instagram: vacancyValue?.instagram,
              line: vacancyValue?.line,
              twitter: vacancyValue?.twitter,
              linkedin: vacancyValue?.linkedin,
              e_ktp_province_id: vacancyValue?.e_ktp_province?.id,
              e_ktp_district_id: vacancyValue?.e_ktp_district?.id,
              e_ktp_regency_id: vacancyValue?.e_ktp_regency?.id,
              e_ktp_village_id: vacancyValue?.e_ktp_village?.id,
              e_ktp_postal_code: vacancyValue?.e_ktp_postal_code,
              e_ktp_full_address: vacancyValue?.e_ktp_full_address,
              domicile_province_id: vacancyValue?.domicile_province?.id,
              domicile_district_id: vacancyValue?.domicile_district?.id,
              domicile_regency_id: vacancyValue?.domicile_regency?.id,
              domicile_village_id: vacancyValue?.domicile_village?.id,
              domicile_postal_code: vacancyValue?.domicile_postal_code,
              domicile_full_address: vacancyValue?.domicile_full_address,
              account_name: vacancyValue?.account_name,
              account_number: vacancyValue?.account_number,
              bank_name_id: vacancyValue?.bank?.id,
              urgent_full_name: vacancyValue?.urgent_full_name,
              applicant_relationships: vacancyValue?.applicant_relationships,
              position_id: vacancyValue?.position?.id,
              urgent_phone_number: vacancyValue?.urgent_phone_number,
              describe_yourself: vacancyValue?.describe_yourself,
              expected_salary: vacancyValue?.expected_salary,
              cv: vacancyValue?.cv,
              other_document: vacancyValue?.other_document,
            }}
            innerRef={vacancyForm}
            enableReinitialize={true}
            onSubmit={(values) => {
              setLoading(true);
              setOpenEditModal(!openEditModal);
              updateVacancy.mutate(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              setFieldValue,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5 pb-3">
                    <div>
                      <div className="text-sm pb-2">Foto Profil :</div>
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
                      <div className="text-sm pb-2">E-KTP :</div>
                      <input
                        type="file"
                        name="picture"
                        className="file file-input file-input-bordered w-full"
                        onChange={changeKTP}
                      ></input>
                      <div className="text-red-500 text-xs pt-2">
                        Maks 1 MB *
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap :</div>
                      <input
                        type="text"
                        name="full_name"
                        placeholder="Masukkan Nama Lengkap"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.full_name && touched.full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tempat Lahir :</div>
                      <input
                        type="text"
                        name="birth_place"
                        placeholder="Masukkan Tempat Lahir"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.birth_place}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.birth_place && touched.birth_place && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_place}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIK :</div>
                      <input
                        type="number"
                        name="nik"
                        placeholder="Masukkan NIK"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nik}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.nik && touched.nik && (
                        <div className="text-red-500 pt-2">{errors.nik}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tanggal Lahir :</div>
                      <input
                        type="date"
                        name="birth_date"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.birth_date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.birth_date && touched.birth_date && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_date}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="number"
                        name="age"
                        placeholder="Masukkan Umur"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500 pt-2">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tinggi Badan :</div>
                      <input
                        type="number"
                        name="height"
                        placeholder="Masukkan Tinggi Badan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.height}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.height && touched.height && (
                        <div className="text-red-500 pt-2">{errors.height}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin:</div>
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
                        <div className="text-red-500 pt-2">
                          {errors.gender_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Agama :</div>
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
                        <div className="text-red-500 pt-2">
                          {errors.religion_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kemampuan :</div>
                      <input
                        type="text"
                        name="skills"
                        placeholder="Masukkan Kemampuan"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.skills}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.skills && touched.skills && (
                        <div className="text-red-500 pt-2">{errors.skills}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Pengalaman Kerja :</div>
                      <Field
                        as="select"
                        name="work_experience_id"
                        onChange={(e) => {
                          setFieldValue("work_experience_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih pengalaman kerja
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
                          <div className="text-red-500 pt-2">
                            {errors.work_experience_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="flex w-full justify-between">
                        <div className="text-sm pb-2">Pendidikan :</div>
                        <button
                          className="btn btn-primary normal-case text-white"
                          type="button"
                          onClick={() => {
                            addEducation();
                          }}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      {educations?.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center w-full"
                        >
                          <div className="flex w-full gap-5 flex-col">
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Jenjang :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <select
                                name="name"
                                onBlur={handleBlur}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                              >
                                <option disabled selected>
                                  Pilih pendidikan?
                                </option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                              </select>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Nama Sekolah :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="text"
                                placeholder="Masukkan nama sekolah"
                                name="school_name"
                                value={item.school_name}
                                onBlur={handleBlur}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    "school_name",
                                    e.target.value
                                  );
                                  setFieldValue("school_name", e.target.value);
                                }}
                              />
                              {errors.school_name && touched.school_name && (
                                <div className="text-sm text-red-500">
                                  {errors.school_name}
                                </div>
                              )}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                              <div className="text-sm">
                                Tahun Mulai :{" "}
                                <span className="text-red-500 font-bold">
                                  *
                                </span>
                              </div>
                              <input
                                type="date"
                                placeholder="Type here"
                                name="education_start_date"
                                value={item.start_date}
                                onBlur={handleBlur}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
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
                              <div className="text-sm">
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
                                value={item.end_date}
                                className="w-full h-10 border focus:outline-none rounded-md px-4"
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
                            {index === 0 && (
                              <div type="button" className="w-52"></div>
                            )}

                            <button
                              type="button"
                              className="btn btn-primary normal-case text-white"
                              onClick={() => deleteEducation(index)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex w-full justify-between">
                        <div className="text-sm pb-2">
                          Riwayat Pengalaman Kerja :
                        </div>
                        <button
                          className="btn btn-primary normal-case text-white"
                          type="button"
                          onClick={() => {
                            addWorkHistory();
                          }}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <div className="flex flex-col pr-5">
                        <div className="flex">
                          <div className="flex flex-col w-full">
                            {workHistory?.map((item, index) => {
                              return (
                                <div
                                  className="w-full flex flex-col gap-5"
                                  key={index}
                                >
                                  <div className="pt-5">
                                    <div className="text-sm pb-2">
                                      Nama Perusahaan :{" "}
                                      <span className="text-red-500 font-bold">
                                        *
                                      </span>
                                    </div>
                                    <div className="w-full">
                                      <textarea
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Masukkan nama perusahaan"
                                        value={item.company_name}
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
                                    <div className="flex gap-5 flex-col">
                                      <div className="w-full flex flex-col">
                                        <div className="text-sm pb-2">
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
                                          value={item.start_date}
                                          className="input input-bordered w-full"
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
                                      <div className="w-full flex flex-col">
                                        <div className="text-sm pb-2">
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
                                          value={item.end_date}
                                          className="input input-bordered w-full"
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
                                      <button
                                        type="button"
                                        className="btn btn-primary normal-case text-white"
                                        onClick={() => deleteWorkHistory(index)}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Status Pernikahan :</div>
                      <Field
                        as="select"
                        name="marital_status_id"
                        onChange={(e) => {
                          setFieldValue("marital_status_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih status pernikahan
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
                          <div className="text-red-500 pt-2">
                            {errors.marital_status_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kendaraan yang dimiliki :{" "}
                      </div>
                      <Select
                        isMulti
                        onChange={(e) => {
                          const selectedVehicles = e.map((item) => ({
                            name: item.value,
                          }));
                          setSelectedVehicles(selectedVehicles);
                        }}
                        components={{
                          DropdownIndicator: customDropdownIndicator,
                          IndicatorSeparator: () => null,
                        }}
                        value={selectedVehicles?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        placeholder="Silahkan pilih jenis kendaraan"
                        className="text-sm focus:outline-none focus:border-black"
                        options={vehicleTypeData?.data?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        styles={customStyles}
                      />
                      {errors.vehicle_type_id && touched.vehicle_type_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vehicle_type_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">SIM yang dimiliki :</div>
                      <Select
                        isMulti
                        onChange={(e) => {
                          const selectedDriverLicense = e.map((item) => ({
                            name: item.value,
                          }));
                          setSelectedDriverLicense(selectedDriverLicense);
                        }}
                        value={selectedDriverLicense.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
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
                          <div className="text-red-500 pt-2">
                            {errors.driver_license_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Vaksin :</div>
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

                        {vaccineData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.vaccine_id && touched.vaccine_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vaccine_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Pertama :
                      </div>
                      <input
                        type="number"
                        name="first_phone_number"
                        placeholder="Masukkan nomor telepon pertama"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.first_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.first_phone_number &&
                        touched.first_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.first_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon Kedua :</div>
                      <input
                        type="number"
                        name="second_phone_number"
                        placeholder="Masukkan nomor telepon kedua"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.second_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.second_phone_number &&
                        touched.second_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.second_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        placeholder="Masukkan email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500 pt-2">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Facebook :</div>
                      <input
                        type="text"
                        name="facebook"
                        placeholder="Masukkan Facebook"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.facebook}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.facebook && touched.facebook && (
                        <div className="text-red-500 pt-2">
                          {errors.facebook}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Instagram :</div>
                      <input
                        type="text"
                        name="instagram"
                        placeholder="Masukkan Instagram"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.instagram}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.instagram && touched.instagram && (
                        <div className="text-red-500 pt-2">
                          {errors.instagram}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Line :</div>
                      <input
                        type="text"
                        name="line"
                        placeholder="Masukkan Line"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.line}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.line && touched.line && (
                        <div className="text-red-500 pt-2">{errors.line}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Twitter :</div>
                      <input
                        type="text"
                        name="twitter"
                        placeholder="Masukkan Twitter"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.twitter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.twitter && touched.twitter && (
                        <div className="text-red-500 pt-2">
                          {errors.twitter}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">LinkedIn :</div>
                      <input
                        type="text"
                        name="linkedin"
                        placeholder="Masukkan LinkedIn"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.linkedin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.linkedin && touched.linkedin && (
                        <div className="text-red-500 pt-2">
                          {errors.linkedin}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_province_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_province_id", e.target.value);
                          fetchRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi sesuai E-KTP
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
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_regency_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_regency_id", e.target.value);
                          fetchDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kabupaten sesuai E-KTP
                        </option>
                        {regencyValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_regency_id && touched.e_ktp_regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_district_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_district_id", e.target.value);
                          fetchVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kecamatan Sesuai E-KTP
                        </option>

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
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai E-KTP :
                      </div>
                      <Field
                        as="select"
                        name="e_ktp_village_id"
                        onChange={(e) => {
                          setFieldValue("e_ktp_village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kelurahan sesuai E-KTP
                        </option>
                        {villageValue?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.e_ktp_village_id && touched.e_ktp_village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="number"
                        name="e_ktp_postal_code"
                        placeholder="Masukkan Kode POS"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.e_ktp_postal_code &&
                        touched.e_ktp_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <input
                        type="text"
                        placeholder="Masukkan Alamat Lengkap"
                        name="e_ktp_full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.e_ktp_full_address &&
                        touched.e_ktp_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_province_id"
                        onChange={(e) => {
                          setFieldValue("domicile_province_id", e.target.value);
                          fetchDomicileRegencyById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih provinsi sesuai domisili
                        </option>
                        {provinceData?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.domicile_province_id &&
                        touched.domicile_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_regency_id"
                        onChange={(e) => {
                          setFieldValue("domicile_regency_id", e.target.value);
                          fetchDomicileDistrictById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kabupaten sesuai domisili
                        </option>
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
                          <div className="text-red-500 pt-2">
                            {errors.domicile_regency_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_district_id"
                        onChange={(e) => {
                          setFieldValue("domicile_district_id", e.target.value);
                          fetchDomicileVillageById(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kecamatan sesuai domisili
                        </option>

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
                          <div className="text-red-500 pt-2">
                            {errors.domicile_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai Domisili :
                      </div>
                      <Field
                        as="select"
                        name="domicile_village_id"
                        onChange={(e) => {
                          setFieldValue("domicile_village_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih kelurahan sesuai domisili
                        </option>

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
                          <div className="text-red-500 pt-2">
                            {errors.domicile_village_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kode Pos sesuai Domisili :
                      </div>
                      <textarea
                        name="domicile_postal_code"
                        placeholder="Masukkan Kode POS sesuai domisili"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.domicile_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.domicile_postal_code &&
                        touched.domicile_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Alamat Lengkap sesuai Domisili :
                      </div>
                      <textarea
                        name="domicile_full_address"
                        placeholder="Masukkan Alamat Lengkap"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.domicile_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.domicile_full_address &&
                        touched.domicile_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nama Pemilik Rekening :
                      </div>
                      <input
                        type="text"
                        name="account_name"
                        placeholder="Masukkan Nama Pemilik Rekening"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.account_name && touched.account_name && (
                        <div className="text-red-500 pt-2">
                          {errors.account_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Rekening :</div>
                      <input
                        type="number"
                        placeholder="Masukkan Nomor Rekening"
                        name="account_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.account_number && touched.account_number && (
                        <div className="text-red-500 pt-2">
                          {errors.account_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Bank :</div>
                      <Field
                        as="select"
                        name="bank_name_id"
                        onChange={(e) => {
                          setFieldValue("bank_name_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
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
                        <div className="text-red-500 pt-2">
                          {errors.bank_name_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap Darurat:</div>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap darurat"
                        name="urgent_full_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.urgent_full_name && touched.urgent_full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.urgent_full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Darurat :
                      </div>
                      <input
                        type="number"
                        placeholder="Masukkan Nomor Telepon Darurat"
                        name="urgent_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.urgent_phone_number &&
                        touched.urgent_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.urgent_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Hubungan dengan pelamar :
                      </div>
                      <input
                        type="text"
                        placeholder="Masukkan hubungan dengan pelamar"
                        name="applicant_relationships"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.applicant_relationships}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      {errors.applicant_relationships &&
                        touched.applicant_relationships && (
                          <div className="text-red-500 pt-2">
                            {errors.applicant_relationships}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Tentang Diri Anda :
                      </div>
                      <textarea
                        name="describe_yourself"
                        placeholder="Jelaskan tentang diri anda"
                        className="w-full h-10 border focus:outline-none rounded-md px-4 pt-2"
                        value={values.describe_yourself}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {errors.describe_yourself &&
                        touched.describe_yourself && (
                          <div className="text-red-500 pt-2">
                            {errors.describe_yourself}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi yang dilamar :</div>
                      <Field
                        as="select"
                        name="position_id"
                        onChange={(e) => {
                          setFieldValue("position_id", e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option value="" disabled selected>
                          Silahkan pilih posisi pekerjaan
                        </option>
                        {positionOfWork?.data?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.position_id && touched.position_id && (
                        <div className="text-red-500 pt-2">
                          {errors.position_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Gaji yang diharapkan :</div>
                      <NumericFormat
                        placeholder="Gaji yang diharapkan"
                        value={values.expected_salary}
                        onChange={(e) => {
                          setFieldValue("expected_salary", e.target.value);
                        }}
                        onBlur={handleBlur}
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        allowNegative={false}
                        prefix="Rp"
                        thousandsGroupStyle="rupiah"
                        thousandSeparator=","
                      />
                      {errors.expected_salary && touched.expected_salary && (
                        <div className="text-red-500 pt-2">
                          {errors.expected_salary}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Edit CV :</div>
                      <input
                        type="file"
                        accept=".pdf"
                        className="file file-input bordered"
                        onChange={(event) => {
                          setFieldValue("cv", event.target.files[0]);
                          setCvName(event.target.files[0].name);
                        }}
                      />
                      {errors.cv && touched.cv && (
                        <div className="text-red-500 pt-2">{errors.cv}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Edit Dokumen :</div>
                      <input
                        type="file"
                        accept=".pdf"
                        className="file file-input bordered"
                        onChange={(event) => {
                          setFieldValue(
                            "other_document",
                            event.target.files[0]
                          );
                          setOtherDocumentName(event.target.files[0].name);
                        }}
                      />
                      {errors.other_document && touched.other_document && (
                        <div className="text-red-500 pt-2">
                          {errors.other_document}
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
                      Simpan
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
      <input
        type="checkbox"
        id="detailModal"
        className="modal-toggle"
        checked={openDetail}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-5">Detail Kandidat</h3>
          <Formik
            initialValues={{
              full_name: vacancyValue?.full_name,
              birth_place: vacancyValue?.birth_place,
              nik: vacancyValue?.nik,
              birth_date: vacancyValue?.birth_date,
              age: vacancyValue?.age,
              height: vacancyValue?.height,
              gender_id: vacancyValue?.gender?.name,
              religion_id: vacancyValue?.religion?.name,
              skills: vacancyValue?.skills,
              work_experience_id: vacancyValue?.work_experience?.name,
              marital_status_id: vacancyValue?.marital_status?.name,
              vehicle_type_id: vacancyValue?.vehicle_type?.name,
              driver_license_id: vacancyValue?.driver_license?.name,
              vaccine_id: vacancyValue?.vaccine?.name,
              first_phone_number: vacancyValue?.first_phone_number,
              second_phone_number: vacancyValue?.second_phone_number,
              email: vacancyValue?.email,
              facebook: vacancyValue?.facebook,
              instagram: vacancyValue?.instagram,
              line: vacancyValue?.line,
              twitter: vacancyValue?.twitter,
              linkedin: vacancyValue?.linkedin,
              e_ktp_province_id: vacancyValue?.e_ktp_province?.name,
              e_ktp_district_id: vacancyValue?.e_ktp_district?.name,
              e_ktp_regency_id: vacancyValue?.e_ktp_regency?.name,
              e_ktp_village_id: vacancyValue?.e_ktp_village?.name,
              e_ktp_postal_code: vacancyValue?.e_ktp_postal_code,
              e_ktp_full_address: vacancyValue?.e_ktp_full_address,
              domicile_province_id: vacancyValue?.domicile_province?.name,
              domicile_district_id: vacancyValue?.domicile_district?.name,
              domicile_regency_id: vacancyValue?.domicile_regency?.name,
              domicile_village_id: vacancyValue?.domicile_village?.name,
              domicile_postal_code: vacancyValue?.domicile_postal_code,
              domicile_full_address: vacancyValue?.domicile_full_address,
              account_name: vacancyValue?.account_name,
              account_number: vacancyValue?.account_number,
              bank_name_id: vacancyValue?.bank?.name,
              urgent_full_name: vacancyValue?.urgent_full_name,
              position_id: vacancyValue?.position?.name,
              applicant_relationships: vacancyValue?.applicant_relationships,
              urgent_phone_number: vacancyValue?.urgent_phone_number,
              describe_yourself: vacancyValue?.describe_yourself,
              expected_salary: vacancyValue?.expected_salary,
              cv: vacancyValue?.cv,
              other_document: vacancyValue?.other_document,
            }}
            innerRef={vacancyForm}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5 pb-3">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Image
                        src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1699097693/uploads/${vacancyValue?.profile_photo?.replace(
                          /\s/g,
                          "%20"
                        )}.png`}
                        width={200}
                        height={200}
                        alt=""
                      ></Image>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap :</div>
                      <input
                        type="text"
                        name="full_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.full_name && touched.full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tempat Lahir :</div>
                      <input
                        type="text"
                        name="birth_place"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.birth_place}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.birth_place && touched.birth_place && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_place}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">NIK :</div>
                      <input
                        type="text"
                        name="nik"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.nik}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.nik && touched.nik && (
                        <div className="text-red-500 pt-2">{errors.nik}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tanggal Lahir :</div>
                      <input
                        type="text"
                        name="birth_date"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={dayjs(values.birth_date).format("YYYY-DD-MM")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.birth_date && touched.birth_date && (
                        <div className="text-red-500 pt-2">
                          {errors.birth_date}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Umur :</div>
                      <input
                        type="text"
                        name="age"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.age + " Tahun"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.age && touched.age && (
                        <div className="text-red-500 pt-2">{errors.age}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Tinggi Badan :</div>
                      <input
                        type="text"
                        name="height"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.height + " cm"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.height && touched.height && (
                        <div className="text-red-500 pt-2">{errors.height}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kelamin:</div>
                      <input
                        type="text"
                        name="gender_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.gender_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.gender_id && touched.gender_id && (
                        <div className="text-red-500 pt-2">
                          {errors.gender_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Agama :</div>
                      <input
                        type="text"
                        name="religion_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.religion_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.religion_id && touched.religion_id && (
                        <div className="text-red-500 pt-2">
                          {errors.religion_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kemampuan :</div>
                      <input
                        type="text"
                        name="skills"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.skills}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.skills && touched.skills && (
                        <div className="text-red-500 pt-2">{errors.skills}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Pendidikan :</div>
                      {educations?.map((item, index) => {
                        return (
                          <div key={item.id} className="w-full">
                            <div className="text-sm flex flex-col gap-4 bg-gray-100 rounded-xl p-5">
                              <div className="text-md font-bold">
                                Pendidikan {index + 1}
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Jenjang Pendidikan :</div>
                                {item.name}
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Nama Sekolah :</div>
                                <div>{item.school_name}</div>
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Mulai :</div>
                                <div>
                                  {dayjs(item.start_date).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </div>
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Selesai :</div>
                                <div>
                                  {dayjs(item.end_date).format("DD-MMMM-YYYY")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Pengalaman Kerja :</div>
                      <input
                        type="text"
                        name="work_experience_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.work_experience_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.work_experience_id &&
                        touched.work_experience_id && (
                          <div className="text-red-500 pt-2">
                            {errors.work_experience_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Daftar Pengalaman Kerja :
                      </div>
                      {workHistory?.map((item, index) => {
                        return (
                          <div key={item.id} className="w-full">
                            <div className="text-sm flex flex-col gap-4 bg-gray-100 p-5 rounded-md">
                              <div className="text-md font-bold">
                                Pengalaman Kerja {index + 1} :
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Nama Perusahaan :</div>
                                {item.company_name}
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Mulai :</div>
                                <div>
                                  {dayjs(item.start_date).format(
                                    "DD-MMMM-YYYY"
                                  )}
                                </div>
                              </div>
                              <div className="flex w-full justify-between">
                                <div>Tanggal Selesai :</div>
                                <div>
                                  {dayjs(item.end_date).format("DD-MMMM-YYYY")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Status Pernikahan :</div>
                      <input
                        type="text"
                        name="marital_status_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.marital_status_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.marital_status_id &&
                        touched.marital_status_id && (
                          <div className="text-red-500 pt-2">
                            {errors.marital_status_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Jenis Kendaraan :</div>
                      <div className="flex flex-col gap-4">
                        {selectedVehicles?.map((item) => {
                          return (
                            <div key={item.id}>
                              <input
                                type="text"
                                value={item.name}
                                className="input input-bordered w-full"
                                disabled
                              ></input>
                            </div>
                          );
                        })}
                        {vacancyValue?.vehicle_types?.length <= 0 && (
                          <div className="text-sm">Kendaraan tidak ada</div>
                        )}
                      </div>
                      {errors.vehicle_type_id && touched.vehicle_type_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vehicle_type_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">SIM :</div>
                      <div className="flex flex-col gap-4">
                        {selectedDriverLicense?.map((item) => {
                          return (
                            <div key={item.id}>
                              <input
                                type="text"
                                value={item.name}
                                className="input input-bordered w-full"
                                disabled
                              ></input>
                            </div>
                          );
                        })}
                      </div>
                      {vacancyValue?.driver_licenses?.length <= 0 && (
                        <div className="text-sm">SIM tidak ada</div>
                      )}
                      {errors.driver_license_id &&
                        touched.driver_license_id && (
                          <div className="text-red-500 pt-2">
                            {errors.driver_license_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Vaksin :</div>
                      <input
                        type="text"
                        name="vaccine_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.vaccine_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.vaccine_id && touched.vaccine_id && (
                        <div className="text-red-500 pt-2">
                          {errors.vaccine_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Pertama :
                      </div>
                      <input
                        type="text"
                        name="first_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.first_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.first_phone_number &&
                        touched.first_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.first_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Telepon Kedua :</div>
                      <input
                        type="text"
                        name="second_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.second_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.second_phone_number &&
                        touched.second_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.second_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Email :</div>
                      <input
                        type="text"
                        name="email"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.email && touched.email && (
                        <div className="text-red-500 pt-2">{errors.email}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Facebook :</div>
                      <input
                        type="text"
                        name="facebook"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.facebook}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.facebook && touched.facebook && (
                        <div className="text-red-500 pt-2">
                          {errors.facebook}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Instagram :</div>
                      <input
                        type="text"
                        name="instagram"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.instagram}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.instagram && touched.instagram && (
                        <div className="text-red-500 pt-2">
                          {errors.instagram}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Line :</div>
                      <input
                        type="text"
                        name="line"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.line}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.line && touched.line && (
                        <div className="text-red-500 pt-2">{errors.line}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Twitter :</div>
                      <input
                        type="text"
                        name="twitter"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.twitter}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.twitter && touched.twitter && (
                        <div className="text-red-500 pt-2">
                          {errors.twitter}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">LinkedIn :</div>
                      <input
                        type="text"
                        name="linkedin"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.linkedin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.linkedin && touched.linkedin && (
                        <div className="text-red-500 pt-2">
                          {errors.linkedin}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_province_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_province_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_province_id &&
                        touched.e_ktp_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_regency_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_regency_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_regency_id && touched.e_ktp_regency_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_regency_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_district_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_district_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_district_id &&
                        touched.e_ktp_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai E-KTP :
                      </div>
                      <input
                        type="text"
                        name="e_ktp_village_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_village_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_village_id && touched.e_ktp_village_id && (
                        <div className="text-red-500 pt-2">
                          {errors.e_ktp_village_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Kode POS :</div>
                      <input
                        type="text"
                        name="e_ktp_postal_code"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_postal_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_postal_code &&
                        touched.e_ktp_postal_code && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_postal_code}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Alamat Lengkap :</div>
                      <input
                        type="text"
                        name="e_ktp_full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.e_ktp_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.e_ktp_full_address &&
                        touched.e_ktp_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.e_ktp_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Provinsi sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_province_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_province_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_province_id &&
                        touched.domicile_province_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_province_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kabupaten sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_regency_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_regency_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_regency_id &&
                        touched.domicile_regency_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_regency_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kecamatan sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_district_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_district_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_district_id &&
                        touched.domicile_district_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_district_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Kelurahan sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_village_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_village_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_village_id &&
                        touched.domicile_village_id && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_village_id}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Alamat Lengkap sesuai Domisili :
                      </div>
                      <input
                        type="text"
                        name="domicile_full_address"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.domicile_full_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.domicile_full_address &&
                        touched.domicile_full_address && (
                          <div className="text-red-500 pt-2">
                            {errors.domicile_full_address}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nama Pemilik Rekening :
                      </div>
                      <input
                        type="text"
                        name="account_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.account_name && touched.account_name && (
                        <div className="text-red-500 pt-2">
                          {errors.account_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nomor Rekening :</div>
                      <input
                        type="text"
                        name="account_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.account_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.account_number && touched.account_number && (
                        <div className="text-red-500 pt-2">
                          {errors.account_number}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Bank :</div>
                      <input
                        type="text"
                        name="bank_name_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.bank_name_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.bank_name_id && touched.bank_name_id && (
                        <div className="text-red-500 pt-2">
                          {errors.bank_name_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Nama Lengkap Darurat:</div>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap darurat"
                        name="urgent_full_name"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.urgent_full_name && touched.urgent_full_name && (
                        <div className="text-red-500 pt-2">
                          {errors.urgent_full_name}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Nomor Telepon Darurat :
                      </div>
                      <input
                        type="number"
                        placeholder="Masukkan Nomor Telepon Darurat"
                        name="urgent_phone_number"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.urgent_phone_number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.urgent_phone_number &&
                        touched.urgent_phone_number && (
                          <div className="text-red-500 pt-2">
                            {errors.urgent_phone_number}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Hubungan dengan pelamar :
                      </div>
                      <input
                        type="text"
                        placeholder="Masukkan hubungan dengan pelamar"
                        name="applicant_relationships"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.applicant_relationships}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.applicant_relationships &&
                        touched.applicant_relationships && (
                          <div className="text-red-500 pt-2">
                            {errors.applicant_relationships}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">
                        Jelaskan Tentang Diri Anda :
                      </div>
                      <input
                        type="text"
                        name="describe_yourself"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.describe_yourself}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.describe_yourself &&
                        touched.describe_yourself && (
                          <div className="text-red-500 pt-2">
                            {errors.describe_yourself}
                          </div>
                        )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Posisi yang dilamar :</div>
                      <input
                        type="text"
                        name="position_id"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.position_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.position_id && touched.position_id && (
                        <div className="text-red-500 pt-2">
                          {errors.position_id}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">Gaji yang diharapkan :</div>
                      <input
                        type="text"
                        name="expected_salary"
                        className="w-full h-10 border focus:outline-none rounded-md px-4"
                        value={values.expected_salary}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      ></input>
                      {errors.expected_salary && touched.expected_salary && (
                        <div className="text-red-500 pt-2">
                          {errors.expected_salary}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm pb-2">CV :</div>
                      <Link
                        href={`https://res.cloudinary.com/dxnewldiy/raw/upload/fl_attachment/v1/cv/${values?.cv?.replace(
                          /\s/g,
                          "%20"
                        )}`}
                        target="_blank"
                        className="btn btn-primary bg-primary border-none text-white normal-case"
                      >
                        Download CV
                      </Link>
                    </div>
                    <div>
                      <div className="text-sm pb-2">Dokumen Tambahan :</div>
                      <Link
                        href={`https://res.cloudinary.com/dxnewldiy/raw/upload/fl_attachment/v1/other_document/${values?.other_document?.replace(
                          /\s/g,
                          "%20"
                        )}`}
                        target="_blank"
                        className="btn btn-primary bg-primary border-none text-white normal-case"
                      >
                        Download Dokumen Tambahan
                      </Link>
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
      <div className="w-full h-[80px] bg-[#42495b]">
        <div className="w-full h-full flex justify-center items-center text-white text-center px-10 md:px-0">
          © 2023 PT ARYA KEMUNING ABADI
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default CheckPosition(ListVacancy);
