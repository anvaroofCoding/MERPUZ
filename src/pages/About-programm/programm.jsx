import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Programm() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center gap-4 flex-col w-full h-screen text-center">
      <h1 className="font-bold text-3xl">Yaqinda bu sahifa qo'shiladi</h1>
      <Button
        onClick={() => {
          navigate(-1);
        }}
      >
        Ortga qaytish
      </Button>
    </div>
  );
}
