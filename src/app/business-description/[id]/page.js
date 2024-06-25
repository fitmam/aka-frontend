"use client";
import HomeNav from "@/components/homenav";
import React from "react";
import http from "@/helpers/http.helper";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";

export default function Bisnis() {
  const [businessData, setBusinessData] = useState([]);
  const idParams = useSearchParams();
  const id = idParams.get("id");
  const token = getCookie("token");

  const fetchBusinessData = useCallback(async () => {
    const { data } = await http(token).get(`/business/${id}`);
    setBusinessData(data.results);
  }, [id, token]);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  return (
    <div>
      <div>
        <HomeNav />
      </div>
      <div className="flex w-full pt-32 h-screen px-5 xl:px-20 flex-col-reverse xl:flex-row">
        <div className="flex flex-1 h-full items-center z-0">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold">{businessData?.title}</div>
              <div className="text-xl">{businessData?.description}</div>
            </div>
            <div>
              <Link
                href={"/bisnis"}
                as={"/bisnis"}
                className="btn btn-primary bg-primary normal-case border-color-primary text-white"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-1 h-full justify-center items-center z-0">
          <Image
            src={`https://res.cloudinary.com/dxnewldiy/image/upload/v1695634913/${businessData?.picture}`}
            alt=""
            width={300}
            height={300}
            className="z-10 shadow-xl rounded-md"
          />
        </div>
      </div>
      <div className="w-full h-[80px] bg-[#42495b]">
        <div className="w-full h-full flex justify-center items-center text-white text-center px-10 md:px-0">
          © 2023 PT ARYA KEMUNING ABADI
        </div>
      </div>
    </div>
  );
}
