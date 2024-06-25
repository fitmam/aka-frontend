"use client";
import React, { useRef, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { BsPeopleFill } from "react-icons/bs";
import MobileNav from "@/components/mobilenav";
import http from "@/helpers/http.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { setColor } from "@/redux/reducer/colorscheme";
import Loading from "@/components/loading";
import { toast } from "react-toastify";
import { setUserId } from "@/redux/reducer/user";
import { useCallback } from "react";
import { Formik } from "formik";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { getCookie } from "cookies-next";
import * as Yup from "yup";
import WithAuth from "@/components/isauth";

function Pengguna() {
  const dispatch = useDispatch();
  const primary = useSelector((state) => state.color.color.primary);
  const secondary = useSelector((state) => state.color.color.secondary);
  const token = getCookie("token");
  const user_id = useSelector((state) => state.user.user_id);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    user_roles_create: false,
    user_roles_read: false,
    user_roles_update: false,
    user_roles_delete: false,
    business_type_create: false,
    business_type_read: false,
    business_type_update: false,
    business_type_delete: false,
    departement_create: false,
    departement_read: false,
    departement_update: false,
    departement_delete: false,
    position_create: false,
    position_read: false,
    position_update: false,
    position_delete: false,
    field_of_work_create: false,
    field_of_work_read: false,
    field_of_work_update: false,
    field_of_work_delete: false,
    needed_position_create: false,
    needed_position_read: false,
    needed_position_update: false,
    needed_position_delete: false,
    salary_count_create: false,
    salary_count_read: false,
    salary_count_update: false,
    salary_count_delete: false,
    employee_status_create: false,
    employee_status_read: false,
    employee_status_update: false,
    employee_status_delete: false,
    gender_create: false,
    gender_read: false,
    gender_update: false,
    gender_delete: false,
    religion_create: false,
    religion_read: false,
    religion_update: false,
    religion_delete: false,
    vaccine_create: false,
    vaccine_read: false,
    vaccine_update: false,
    vaccine_delete: false,
    education_create: false,
    education_read: false,
    education_update: false,
    education_delete: false,
    work_experience_create: false,
    work_experience_read: false,
    work_experience_update: false,
    work_experience_delete: false,
    marital_status_create: false,
    marital_status_read: false,
    marital_status_update: false,
    marital_status_delete: false,
    driver_license_create: false,
    driver_license_read: false,
    driver_license_update: false,
    driver_license_delete: false,
    vehicle_type_create: false,
    vehicle_type_read: false,
    vehicle_type_update: false,
    vehicle_type_delete: false,
  });
  const ModuleList = useRef();

  const validateUser = Yup.object({
    first_name: Yup.string().required("Harap diisi"),
    password: Yup.string().required("Harap diisi"),
  });

  function scrollRight() {
    ModuleList.current.scrollLeft += 200;
  }

  function scrollLeft() {
    ModuleList.current.scrollLeft -= 200;
  }

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  async function fetchUsers() {
    const { data } = await http().get("/users?limit=20");
    return data.results;
  }

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  async function fetchRole() {
    const { data } = await http().get("/role");
    return data.results;
  }

  const { data: roleData } = useQuery({
    queryKey: ["role"],
    queryFn: () => fetchRole(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

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

  const queryClient = useQueryClient();

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

  const updateEmployee = useMutation({
    mutationFn: () => {
      return http(token).patch(`/users/permissions/${user_id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setLoading(false);
      toast.success("Berhasil mengupdate hak akses");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const updateEmployeeCredential = useMutation({
    mutationFn: (values) => {
      const form = new URLSearchParams({
        first_name: values.first_name,
        password: values.password,
        role_id: userRole,
      }).toString();
      return http(token).patch(`/users/${currentUser.id}`, form);
    },
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Berhasil mengupdate kredensial pengguna");
    },
    onError: (err) => {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    },
  });

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const { data } = await http(token).get(`/users/${user_id}`);
        setCurrentUser(data.results);
        setUserRole(data?.results?.role_id);
        setFormData(data?.results?.permissions_allowed);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserById();
  }, [token, user_id]);

  useEffect(() => {
    dispatch(setUserId(usersData?.data?.[0].id));
  }, [dispatch, usersData?.data]);

  return (
    <div className="flex w-full h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="w-full bg-[#edf0f0] flex gap-8 h-full overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar">
          <div className="w-full">
            <div className="w-full h-auto bg-white rounded-md">
              <div className="w-full p-8">
                <div className="flex gap-5">
                  <BsPeopleFill size={25} />
                  <div>Tambah Data Pengguna</div>
                </div>
              </div>
              <div className="w-full flex gap-10 h-80 p-8">
                <div className="flex flex-auto w-1/5">
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <div className="font-medium">Nama Karyawan</div>
                        <select
                          onChange={(event) => {
                            dispatch(setUserId(event.target.value));
                            fetchUserById();
                          }}
                          className="select select-bordered w-full max-w-xs"
                        >
                          {usersData?.data?.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.first_name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="font-medium">Peran Pengguna</div>
                        <select
                          onChange={(event) => {
                            setUserRole(event.target.value);
                          }}
                          className="select select-bordered w-full max-w-xs"
                        >
                          {roleData?.data?.map((item) => {
                            return (
                              <option
                                key={item.id}
                                value={item.id}
                                selected={currentUser.role_id - 1}
                              >
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Formik
                          initialValues={{
                            first_name: currentUser?.first_name,
                            password: "",
                          }}
                          onSubmit={(values) => {
                            setLoading(true);
                            updateEmployeeCredential.mutate(values);
                          }}
                          validationSchema={validateUser}
                          enableReinitialize={true}
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
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-2"
                              >
                                <div>
                                  <input
                                    type="text"
                                    name="first_name"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Username"
                                    className="input input-bordered w-full max-w-xs"
                                  />
                                  {errors.first_name && touched.first_name && (
                                    <div className="text-red-500 pt-2">
                                      {errors.first_name}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    placeholder="Password"
                                    className="input input-bordered w-full max-w-xs"
                                  />
                                  {errors.password && touched.password && (
                                    <div className="text-red-500 pt-2">
                                      {errors.password}
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-primary normal-case text-white bg-primary border-none"
                                >
                                  Update
                                </button>
                              </form>
                            );
                          }}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-auto flex-col gap-10 w-4/5">
                  <div
                    className="flex flex-col gap-2 max-w-[850px] overflow-x-auto no-scrollbar"
                    ref={ModuleList}
                  >
                    <div className="font-medium">
                      <div>Nama Modul</div>
                    </div>
                    <div className="flex gap-10">
                      <div className="flex flex-col">
                        <div className="text-md w-32">Master Data</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                name="user_roles_create"
                                checked={formData?.user_roles_create}
                                onChange={() => {
                                  setFormData({
                                    ...formData,
                                    user_roles_create:
                                      !formData.user_roles_create,
                                    business_type_create:
                                      !formData.business_type_create,
                                    departement_create:
                                      !formData.departement_create,
                                    position_create:
                                      !formData.departement_create,
                                    field_of_work_create:
                                      !formData.field_of_work_create,
                                    needed_position_create:
                                      !formData.needed_position_create,
                                    salary_count_create:
                                      !formData.salary_count_create,
                                    employee_status_create:
                                      !formData.employee_status_create,
                                    gender_create: !formData.gender_create,
                                    religion_create: !formData.religion_create,
                                    vaccine_create: !formData.vaccine_create,
                                    education_create:
                                      !formData.education_create,
                                    work_experience_create:
                                      !formData.work_experience_create,
                                    marital_status_create:
                                      !formData.marital_status_create,
                                    driver_license_create:
                                      !formData.driver_license_create,
                                    vehicle_type_create:
                                      !formData.vehicle_type_create,
                                  });
                                }}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                name="user_roles_read"
                                checked={formData?.user_roles_read}
                                onChange={() => {
                                  setFormData({
                                    ...formData,
                                    user_roles_read: !formData.user_roles_read,
                                    business_type_read:
                                      !formData.business_type_read,
                                    departement_read:
                                      !formData.departement_read,
                                    position_read: !formData.position_read,
                                    field_of_work_read:
                                      !formData.field_of_work_read,
                                    needed_position_read:
                                      !formData.needed_position_read,
                                    salary_count_read:
                                      !formData.salary_count_read,
                                    employee_status_read:
                                      !formData.employee_status_read,
                                    gender_read: !formData.gender_read,
                                    religion_read: !formData.religion_read,
                                    vaccine_read: !formData.vaccine_read,
                                    education_read: !formData.education_read,
                                    work_experience_read:
                                      !formData.work_experience_read,
                                    marital_status_read:
                                      !formData.marital_status_read,
                                    driver_license_read:
                                      !formData.driver_license_read,
                                    vehicle_type_read:
                                      !formData.vehicle_type_read,
                                  });
                                }}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                name="user_roles_update"
                                checked={formData?.user_roles_update}
                                onChange={() => {
                                  setFormData({
                                    ...formData,
                                    user_roles_update:
                                      !formData.user_roles_update,
                                    business_type_update:
                                      !formData.business_type_update,
                                    departement_update:
                                      !formData.departement_update,
                                    position_update: !formData.position_update,
                                    field_of_work_update:
                                      !formData.field_of_work_update,
                                    needed_position_update:
                                      !formData.needed_position_update,
                                    salary_count_update:
                                      !formData.salary_count_update,
                                    employee_status_update:
                                      !formData.employee_status_update,
                                    gender_update: !formData.gender_update,
                                    religion_update: !formData.religion_update,
                                    vaccine_update: !formData.vaccine_update,
                                    education_update:
                                      !formData.education_update,
                                    work_experience_update:
                                      !formData.work_experience_update,
                                    marital_status_update:
                                      !formData.marital_status_update,
                                    driver_license_update:
                                      !formData.driver_license_update,
                                    vehicle_type_update:
                                      !formData.vehicle_type_update,
                                  });
                                }}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData?.user_roles_delete}
                                name="user_roles_delete"
                                onChange={() => {
                                  setFormData({
                                    ...formData,
                                    user_roles_delete:
                                      !formData.user_roles_delete,
                                    business_type_delete:
                                      !formData.business_type_delete,
                                    departement_delete:
                                      !formData.departement_delete,
                                    position_delete: !formData.position_delete,
                                    field_of_work_delete:
                                      !formData.field_of_work_delete,
                                    needed_position_delete:
                                      !formData.needed_position_delete,
                                    salary_count_delete:
                                      !formData.salary_count_delete,
                                    employee_status_delete:
                                      !formData.employee_status_delete,
                                    gender_delete: !formData.gender_delete,
                                    religion_delete: !formData.religion_delete,
                                    vaccine_delete: !formData.vaccine_delete,
                                    education_delete:
                                      !formData.education_delete,
                                    work_experience_delete:
                                      !formData.work_experience_delete,
                                    marital_status_delete:
                                      !formData.marital_status_delete,
                                    driver_license_delete:
                                      !formData.driver_license_delete,
                                    vehicle_type_delete:
                                      !formData.vehicle_type_delete,
                                  });
                                }}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-32">Tipe Bisnis</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                name="business_type_create"
                                checked={formData?.business_type_create}
                                onChange={handleChange}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                name="business_type_read"
                                onChange={handleChange}
                                checked={formData?.business_type_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                name="business_type_update"
                                onChange={handleChange}
                                checked={formData?.business_type_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData?.business_type_delete}
                                name="business_type_delete"
                                onChange={handleChange}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-32">Departemen</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData?.departement_create}
                                name="departement_create"
                                onChange={handleChange}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="departement_read"
                                checked={formData?.departement_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="departement_update"
                                checked={formData?.departement_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="departement_delete"
                                checked={formData?.departement_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-32">Jabatan</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="position_create"
                                checked={formData?.position_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="position_read"
                                checked={formData?.position_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="position_update"
                                checked={formData?.position_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="position_delete"
                                checked={formData?.position_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-40">Bidang Pekerjaan</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="field_of_work_create"
                                checked={formData?.field_of_work_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="field_of_work_read"
                                checked={formData?.field_of_work_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="field_of_work_update"
                                checked={formData?.field_of_work_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="field_of_work_delete"
                                checked={formData?.field_of_work_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-40">Posisi Dibutuhkan</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="needed_position_create"
                                checked={formData?.needed_position_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="needed_position_read"
                                checked={formData?.needed_position_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="needed_position_update"
                                checked={formData?.needed_position_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="needed_position_delete"
                                checked={formData?.needed_position_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Hitungan Gaji Pokok</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="salary_count_create"
                                checked={formData?.salary_count_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="salary_count_read"
                                checked={formData?.salary_count_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="salary_count_update"
                                checked={formData?.salary_count_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="salary_count_delete"
                                checked={formData?.salary_count_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Status Karyawan</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="employee_status_create"
                                checked={formData?.employee_status_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="employee_status_read"
                                checked={formData?.employee_status_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="employee_status_update"
                                checked={formData?.employee_status_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="employee_status_delete"
                                checked={formData?.employee_status_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Jenis Kelamin</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="gender_create"
                                checked={formData?.gender_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="gender_read"
                                checked={formData?.gender_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="gender_update"
                                checked={formData?.gender_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="gender_delete"
                                checked={formData?.gender_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Agama</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="religion_create"
                                checked={formData?.religion_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="religion_read"
                                checked={formData?.religion_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="religion_update"
                                checked={formData?.religion_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="religion_delete"
                                checked={formData?.religion_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Vaksin</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vaccine_create"
                                checked={formData?.vaccine_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vaccine_read"
                                checked={formData?.vaccine_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vaccine_update"
                                checked={formData?.vaccine_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vaccine_delete"
                                checked={formData?.vaccine_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Pendidikan</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="education_create"
                                checked={formData?.education_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="education_read"
                                checked={formData?.education_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="education_update"
                                checked={formData?.education_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="education_delete"
                                checked={formData?.education_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Pengalaman Kerja</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="work_experience_create"
                                checked={formData?.work_experience_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="work_experience_read"
                                checked={formData?.work_experience_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="work_experience_update"
                                checked={formData?.work_experience_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="work_experience_delete"
                                checked={formData?.work_experience_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Status Pernikahan</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="marital_status_create"
                                checked={formData?.marital_status_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="marital_status_read"
                                checked={formData?.marital_status_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="marital_status_update"
                                checked={formData?.marital_status_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="marital_status_delete"
                                checked={formData?.marital_status_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Surat Izin Mengemudi</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="driver_license_create"
                                checked={formData?.driver_license_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="driver_license_read"
                                checked={formData?.driver_license_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="driver_license_update"
                                checked={formData?.driver_license_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="driver_license_delete"
                                checked={formData?.driver_license_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-md w-48">Kendaraan</div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vehicle_type_create"
                                checked={formData?.vehicle_type_create}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Create
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vehicle_type_read"
                                checked={formData?.vehicle_type_read}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Read
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vehicle_type_update"
                                checked={formData?.vehicle_type_update}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Update
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={handleChange}
                                name="vehicle_type_delete"
                                checked={formData?.vehicle_type_delete}
                                className="checkbox w-5 h-5"
                              />
                              <span className="label-text text-left w-full pl-4">
                                Delete
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-end hover:text-black -mt-5 gap-3">
                    <div>
                      <IoIosArrowDropleft
                        size={35}
                        color="gray"
                        onClick={scrollLeft}
                        className="cursor-pointer hover:text-black"
                      />
                    </div>
                    <div>
                      <IoIosArrowDropright
                        size={35}
                        color="gray"
                        onClick={scrollRight}
                        className="cursor-pointer hover:text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex gap-5 justify-end bg-white px-10">
              <div className="flex gap-5">
                <button className="btn btn-primary bg-red-500 border-none normal-case text-white">
                  Batal
                </button>
                <button
                  onClick={() => {
                    setLoading(true);
                    updateEmployee.mutate();
                    setLoading(false);
                  }}
                  className="btn btn-primary bg-green-500 normal-case border-none text-white"
                >
                  Simpan
                </button>
              </div>
            </div>
            <div className="w-full h-auto bg-white rounded-md pt-20">
              <div className="flex justify-between px-10 py-10 items-center w-full h-14">
                <div className="flex items-center gap-2">
                  <BsPeopleFill size={25} color="#36404c" />
                  Data Karyawan
                </div>
              </div>
              <div className="px-10 py-10 max-w-xs md:max-w-none md:overflow-visible overflow-x-auto">
                <table className="w-full">
                  <tr className="h-10">
                    <th className="border text-xs w-12">No</th>
                    <th className="border text-xs w-40">Nama Karyawan</th>
                    <th className="border text-xs w-40">Peran Pengguna</th>
                    <th className="border text-xs w-40">Username</th>
                    <th className="border text-xs w-40">Daftar Modul</th>
                  </tr>
                  {usersData?.data?.map((item, index) => {
                    const isOddRow = index % 2 !== 0;
                    return (
                      <tr
                        className={`h-12 text-center hover:bg-[#F3F3F3] cursor-pointer ${
                          isOddRow ? "bg-[#F3F3F3]" : ""
                        }`}
                        key={item.id}
                      >
                        <td className="border text-xs pl-3">{index + 1}</td>
                        <td className="border pl-4 text-xs">
                          {item.first_name}
                        </td>
                        <td className="border pl-4 text-xs">
                          {item.role.name}
                        </td>
                        <td className="border pl-4 text-xs">{item.email}</td>
                        <td className="border pl-4 text-xs py-5">
                          <div className="max-h-[80px] overflow-auto font-bold">
                            {item.permissions_allowed.business_type_create &&
                              "- Tambah Tipe Bisnis "}
                            <br />
                            {item.permissions_allowed.business_type_read &&
                              "- Baca Tipe Bisnis "}
                            <br />
                            {item.permissions_allowed.business_type_update &&
                              "- Update Tipe Bisnis "}
                            <br />
                            {item.permissions_allowed.business_type_delete &&
                              "- Hapus Tipe Bisnis "}
                            <br />
                            {item.permissions_allowed.departement_create &&
                              "- Tambah Departemen "}
                            <br />
                            {item.permissions_allowed.departement_read &&
                              "- Baca Departemen "}
                            <br />
                            {item.permissions_allowed.departement_update &&
                              "- Update Departemen "}
                            <br />
                            {item.permissions_allowed.departement_delete &&
                              "- Hapus Departemen "}
                            <br />
                            {item.permissions_allowed.position_create &&
                              "- Tambah Jabatan "}
                            <br />
                            {item.permissions_allowed.position_read &&
                              "- Baca Jabatan "}
                            <br />
                            {item.permissions_allowed.position_update &&
                              "- Update Jabatan "}
                            <br />
                            {item.permissions_allowed.position_delete &&
                              "- Hapus Jabatan "}
                            <br />
                            {item.permissions_allowed.field_of_work_create &&
                              "- Tambah Bidang Pekerjaan "}
                            <br />
                            {item.permissions_allowed.field_of_work_read &&
                              "- Baca Bidang Pekerjaan "}
                            <br />
                            {item.permissions_allowed.field_of_work_update &&
                              "- Update Bidang Pekerjaan "}
                            <br />
                            {item.permissions_allowed.field_of_work_delete &&
                              "- Hapus Bidang Pekerjaan "}
                            <br />
                            {item.permissions_allowed.needed_position_create &&
                              "- Tambah Posisi Dibutuhkan "}
                            <br />
                            {item.permissions_allowed.needed_position_read &&
                              "- Baca Posisi Dibutuhkan "}
                            <br />
                            {item.permissions_allowed.needed_position_update &&
                              "- Update Posisi Dibutuhkan "}
                            <br />
                            {item.permissions_allowed.needed_position_delete &&
                              "- Hapus Posisi Dibutuhkan "}
                            <br />
                            {item.permissions_allowed.salary_count_create &&
                              "- Tambah Hitungan Gaji Pokok "}
                            <br />
                            {item.permissions_allowed.salary_count_read &&
                              "- Baca Hitungan Gaji Pokok "}
                            <br />
                            {item.permissions_allowed.salary_count_update &&
                              "- Update Hitungan Gaji Pokok "}
                            <br />
                            {item.permissions_allowed.salary_count_delete &&
                              "- Hapus Hitungan Gaji Pokok "}
                            <br />
                            {item.permissions_allowed.employee_status_create &&
                              "- Tambah Status Karyawan "}
                            <br />
                            {item.permissions_allowed.employee_status_read &&
                              "- Baca Status Karyawan "}
                            <br />
                            {item.permissions_allowed.employee_status_update &&
                              "- Update Status Karyawan "}
                            <br />
                            {item.permissions_allowed.employee_status_delete &&
                              "- Hapus Status Karyawan "}
                            <br />
                            {item.permissions_allowed.gender_create &&
                              "- Tambah Jenis Kelamin "}
                            <br />
                            {item.permissions_allowed.gender_read &&
                              "- Baca Jenis Kelamin "}
                            <br />
                            {item.permissions_allowed.gender_update &&
                              "- Update Jenis Kelamin "}
                            <br />
                            {item.permissions_allowed.gender_delete &&
                              "- Hapus Jenis Kelamin "}
                            <br />
                            {item.permissions_allowed.religion_create &&
                              "- Tambah Agama "}
                            <br />
                            {item.permissions_allowed.religion_read &&
                              "- Baca Agama "}
                            <br />
                            {item.permissions_allowed.religion_update &&
                              "- Update Agama "}
                            <br />
                            {item.permissions_allowed.religion_delete &&
                              "- Hapus Agama "}
                            <br />
                            {item.permissions_allowed.vaccine_create &&
                              "- Tambah Vaksin "}
                            <br />
                            {item.permissions_allowed.vaccine_read &&
                              "- Baca Vaksin "}
                            <br />
                            {item.permissions_allowed.vaccine_update &&
                              "- Update Vaksin "}
                            <br />
                            {item.permissions_allowed.vaccine_delete &&
                              "- Hapus Vaksin "}
                            <br />
                            {item.permissions_allowed.education_create &&
                              "- Tambah Edukasi "}
                            <br />
                            {item.permissions_allowed.education_read &&
                              "- Baca Edukasi "}
                            <br />
                            {item.permissions_allowed.education_update &&
                              "- Update Edukasi "}
                            <br />
                            {item.permissions_allowed.education_delete &&
                              "- Hapus Edukasi "}
                            <br />
                            {item.permissions_allowed.work_experience_create &&
                              "- Tambah Pengalaman Kerja "}
                            <br />
                            {item.permissions_allowed.work_experience_read &&
                              "- Baca Pengalaman Kerja "}
                            <br />
                            {item.permissions_allowed.work_experience_update &&
                              "- Update Pengalaman Kerja "}
                            <br />
                            {item.permissions_allowed.work_experience_delete &&
                              "- Hapus Pengalaman Kerja "}
                            <br />
                            {item.permissions_allowed.marital_status_create &&
                              "- Tambah Status Pernikahan "}
                            <br />
                            {item.permissions_allowed.marital_status_read &&
                              "- Baca Status Pernikahan "}
                            <br />
                            {item.permissions_allowed.marital_status_update &&
                              "- Update Status Pernikahan "}
                            <br />
                            {item.permissions_allowed.marital_status_delete &&
                              "- Hapus Status Pernikahan "}
                            <br />
                            {item.permissions_allowed.driver_license_create &&
                              "- Tambah SIM "}
                            <br />
                            {item.permissions_allowed.driver_license_read &&
                              "- Baca SIM "}
                            <br />
                            {item.permissions_allowed.driver_license_update &&
                              "- Update SIM "}
                            <br />
                            {item.permissions_allowed.driver_license_delete &&
                              "- Hapus SIM "}
                            <br />
                            {item.permissions_allowed.vehicle_type_create &&
                              "- Tambah Jenis Kendaraan "}
                            <br />
                            {item.permissions_allowed.vehicle_type_read &&
                              "- Baca Jenis Kendaraan "}
                            <br />
                            {item.permissions_allowed.vehicle_type_update &&
                              "- Update Jenis Kendaraan "}
                            <br />
                            {item.permissions_allowed.vehicle_type_delete &&
                              "- Hapus Jenis Kendaraan "}
                          </div>
                          <br />
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
              <div className="w-full flex justify-between py-20 px-10">
                <div className="text-sm">Show entries</div>
                <div className="flex">
                  <button className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black">
                    Previous
                  </button>
                  <button className="border px-4 py-2 text-sm hover:bg-primary hover:text-white ">
                    1
                  </button>
                  <button className="border px-4 py-2 text-sm hover:bg-primary hover:text-white">
                    2
                  </button>
                  <button className="border px-2 py-2 text-sm hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-black">
                    Next
                  </button>
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

export default WithAuth(Pengguna);
