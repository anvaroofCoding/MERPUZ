import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEditRegisterPhotoMutation,
  useRegister_DetailQuery,
} from "@/services/api";
import {
  Briefcase,
  Calendar,
  Edit3,
  FileCheck,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { EditUserForm } from "./one_useful_person_edit";

export default function MensProfileCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const life = localStorage.getItem("life");
  const { id } = useParams();
  const { data, isLoading } = useRegister_DetailQuery(id);
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "",
    bekat_nomi: "",
    tuzilma_nomi: "",
    faoliyati: "",
    rahbari: "",
    passport_seriya: "",
    status: "",
    email: "",
    birth_date: "",
    photo: "",
  });
  useEffect(() => {
    if (data) {
      setUser({
        username: data?.username || "",
        password: life,
        role: data?.role || "",
        bekat_nomi: data?.bekat_nomi || "",
        tuzilma_nomi: data?.tarkibiy_tuzilma || "",
        faoliyati: data?.faoliyati || "",
        rahbari: data?.rahbari || "",
        passport_seriya: data?.passport_seriya || "",
        status: data?.status ?? true, // agar boolean bo‘lsa
        email: data?.email ?? "",
        birth_date: data?.birth_date || "",
        photo: data?.photo || "",
      });
    }
  }, [data, life]);
  const fileInputRef = useRef(null);
  const [uploadUserPhoto, { isLoading: mainLoading }] =
    useEditRegisterPhotoMutation();
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("username", user.username);
    formData.append("password", user.password);
    formData.append("role", user.role);
    formData.append("bekat_nomi", user.bekat_nomi);
    formData.append("tuzilma_nomi", user.tuzilma_nomi);
    formData.append("faoliyati", user.faoliyati);
    formData.append("rahbari", user.rahbari);
    formData.append("passport_seriya", user.passport_seriya);
    formData.append("status", user.status);
    formData.append("email", user.email);
    formData.append("birth_date", user.birth_date);

    try {
      await uploadUserPhoto({ id, body: formData }).unwrap();
      toast.success("Muvaffaqiyatli rasm yuklandi");
    } catch (err) {
      console.error(err);
      toast.error("Yuklashda xatolik yuz berdi!");
    }
  };
  console.log(data);

  return (
    <Card className="w-full shadow-2xl overflow-hidden">
      <FollowerPointerCard className={"xl:block hidden"} title={data?.username}>
        <CardContent className="p-4 md:p-8">
          {/* Header Section with Background Shading */}
          <section className=" rounded-lg p-4 md:p-8 mb-8 -mx-4 md:-mx-8 md:mx-0">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:items-start flex-shrink-0">
                <div className="relative">
                  {isLoading || mainLoading ? (
                    <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
                  ) : (
                    <div
                      className="relative cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg dark:border-slate-800">
                        <AvatarImage
                          src={data?.photo}
                          alt={data?.username || "Profile"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-slate-300 dark:bg-slate-700 text-xl md:text-2xl font-bold">
                          {data?.username?.charAt(0) || "AR"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <div className="bg-green-500 md:w-10 md:h-10 h-5 w-5 rounded-full shadow-lg  flex justify-center items-center">
                          ✔
                        </div>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleUpload}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info Section */}
              <article className="flex-1 flex flex-col justify-between w-full">
                {/* Name and Title */}
                <header className="mb-4 md:mb-0">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-32 h-7 md:h-8 mb-2" />
                      <Skeleton className="w-48 h-5" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
                        {data?.username}
                      </h1>
                      <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 my-2">
                        {data?.faoliyati}
                      </p>
                    </>
                  )}
                </header>

                {/* Quick Info */}
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-4/5 h-5" />
                  </div>
                ) : (
                  <div className="space-y-3 text-sm md:text-base">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-slate-500" />
                      <span>{data?.rahbari}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-slate-500" />
                      <span className="truncate">
                        {data?.email ? data?.email : "Mavjud emas"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-slate-500" />
                      <span>
                        {data?.birth_date ? data?.birth_date : "Mavjud emas"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Badges */}
                {!isLoading && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {data?.passport_seriya ? (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Passport Tastiqlangan
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300">
                        Passport ma'lumot yo'q
                      </Badge>
                    )}
                    {data?.email ? (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300">
                        Email bor
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300">
                        Email yo'q
                      </Badge>
                    )}
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300">
                      Premium
                    </Badge>
                  </div>
                )}
              </article>

              {/* Edit Button */}
              {!isLoading && (
                <div className="flex items-start w-full md:w-auto">
                  <Button onClick={() => setIsDialogOpen(true)} size={"sm"}>
                    <Edit3 size={12} className="mr-2" />
                    <span className="hidden sm:inline">Tahrirlash</span>
                    <span className="sm:hidden">Tahrirlash</span>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Details Section with Shading */}
          <section className=" rounded-lg p-4 md:p-6 mb-8">
            <header className="mb-6">
              {isLoading ? (
                <Skeleton className="w-20 h-5" />
              ) : (
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Tafsilotlar
                </h2>
              )}
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Rol */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-20 h-4 mb-2" />
                    <Skeleton className="w-32 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Roli
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
                      {data?.role}
                    </p>
                  </>
                )}
              </article>

              {/* Department */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-24 h-4 mb-2" />
                    <Skeleton className="w-40 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Tarkibiy tuzilmasi
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.tarkibiy_tuzilma
                        ? data?.tarkibiy_tuzilma
                        : "Mavjud emas"}
                    </p>
                  </>
                )}
              </article>

              {/* Location */}
              {data?.bolim_nomi ? (
                <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-16 h-4 mb-2" />
                      <Skeleton className="w-28 h-5" />
                    </>
                  ) : (
                    <>
                      <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        Bo'lim nomi
                      </p>
                      <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {data?.bolim_nomi ? data?.bolim_nomi : "Mavjud emas"}
                      </p>
                    </>
                  )}
                </article>
              ) : (
                <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-16 h-4 mb-2" />
                      <Skeleton className="w-28 h-5" />
                    </>
                  ) : (
                    <>
                      <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        Bekati
                      </p>
                      <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {data?.bekat_nomi ? data?.bekat_nomi : "Mavjud emas"}
                      </p>
                    </>
                  )}
                </article>
              )}

              {/* Status */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-16 h-4 mb-2" />
                    <Skeleton className="w-20 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Status
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.status == true ? "Faol" : "Faol emas"}
                    </p>
                  </>
                )}
              </article>

              {/* Passport */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-28 h-4 mb-2" />
                    <Skeleton className="w-32 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 md:w-4 md:h-4" />
                      Passport
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.passport_seriya
                        ? data?.passport_seriya
                        : "Mavjud emas"}
                    </p>
                  </>
                )}
              </article>

              {/* Date Created */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-24 h-4 mb-2" />
                    <Skeleton className="w-36 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      Yaratilgan sana
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.created_at}
                    </p>
                  </>
                )}
              </article>
            </div>
          </section>

          {/* Footer Info Section */}
          <footer className=" rounded-lg p-4 md:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {isLoading ? (
              <>
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-28 h-4" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Profil yaratuvchi:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {data?.created_by ? data?.created_by : "Admin"}
                    </span>
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  Profil kodi: Saqlanuvchan
                </span>
              </>
            )}
          </footer>
        </CardContent>
        <EditUserForm
          data={data}
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
        />
      </FollowerPointerCard>
      <div className="xl:hidden block">
        <CardContent className="p-4 md:p-8">
          {/* Header Section with Background Shading */}
          <section className=" rounded-lg p-4 md:p-8 mb-8 -mx-4 md:-mx-8 md:mx-0">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:items-start flex-shrink-0">
                <div className="relative">
                  {isLoading || mainLoading ? (
                    <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
                  ) : (
                    <div
                      className="relative cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg dark:border-slate-800">
                        <AvatarImage
                          src={data?.photo}
                          alt={data?.username || "Profile"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-slate-300 dark:bg-slate-700 text-xl md:text-2xl font-bold">
                          {data?.username?.charAt(0) || "AR"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <div className="bg-green-500 md:w-10 md:h-10 h-7 w-7 rounded-full shadow-lg border-2 border-white dark:border-slate-800 flex justify-center items-center text-white">
                          ✔
                        </div>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleUpload}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info Section */}
              <article className="flex-1 flex flex-col justify-between w-full">
                {/* Name and Title */}
                <header className="mb-4 md:mb-0">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-32 h-7 md:h-8 mb-2" />
                      <Skeleton className="w-48 h-5" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
                        {data?.username}
                      </h1>
                      <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 my-2">
                        {data?.faoliyati}
                      </p>
                    </>
                  )}
                </header>

                {/* Quick Info */}
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-4/5 h-5" />
                  </div>
                ) : (
                  <div className="space-y-3 text-sm md:text-base">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-slate-500" />
                      <span>{data?.rahbari}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-slate-500" />
                      <span className="truncate">
                        {data?.email ? data?.email : "Mavjud emas"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-slate-500" />
                      <span>
                        {data?.birth_date ? data?.birth_date : "Mavjud emas"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Badges */}
                {!isLoading && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {data?.passport_seriya ? (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Passport Tastiqlangan
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300">
                        Passport ma'lumot yo'q
                      </Badge>
                    )}
                    {data?.email ? (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300">
                        Email bor
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300">
                        Email yo'q
                      </Badge>
                    )}
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300">
                      Premium
                    </Badge>
                  </div>
                )}
              </article>

              {/* Edit Button */}
              {!isLoading && (
                <div className="flex items-start w-full md:w-auto">
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full md:w-auto text-white gap-2 h-10 md:h-8 px-4 md:px-6 rounded-lg  "
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Tahrirlash</span>
                    <span className="sm:hidden">Tahrirlash</span>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Details Section with Shading */}
          <section className="dark:bg-slate-900/20 rounded-lg p-4 md:p-6 mb-8">
            <header className="mb-6">
              {isLoading ? (
                <Skeleton className="w-20 h-5" />
              ) : (
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Tafsilotlar
                </h2>
              )}
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Rol */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-20 h-4 mb-2" />
                    <Skeleton className="w-32 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Roli
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.role}
                    </p>
                  </>
                )}
              </article>

              {/* Department */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-24 h-4 mb-2" />
                    <Skeleton className="w-40 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Tarkibiy tuzilmasi
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.tarkibiy_tuzilma
                        ? data?.tarkibiy_tuzilma
                        : "Mavjud emas"}
                    </p>
                  </>
                )}
              </article>

              {/* Location */}
              {data?.bolim_nomi ? (
                <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-16 h-4 mb-2" />
                      <Skeleton className="w-28 h-5" />
                    </>
                  ) : (
                    <>
                      <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        Bo'lim nomi
                      </p>
                      <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {data?.bolim_nomi ? data?.bolim_nomi : "Mavjud emas"}
                      </p>
                    </>
                  )}
                </article>
              ) : (
                <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-16 h-4 mb-2" />
                      <Skeleton className="w-28 h-5" />
                    </>
                  ) : (
                    <>
                      <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        Bekati
                      </p>
                      <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {data?.bekat_nomi ? data?.bekat_nomi : "Mavjud emas"}
                      </p>
                    </>
                  )}
                </article>
              )}

              {/* Status */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-16 h-4 mb-2" />
                    <Skeleton className="w-20 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Status
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.status == true ? "Faol" : "Faol emas"}
                    </p>
                  </>
                )}
              </article>

              {/* Passport */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-28 h-4 mb-2" />
                    <Skeleton className="w-32 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 md:w-4 md:h-4" />
                      Passport
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.passport_seriya
                        ? data?.passport_seriya
                        : "Mavjud emas"}
                    </p>
                  </>
                )}
              </article>

              {/* Date Created */}
              <article className="bg-white dark:bg-slate-800/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                {isLoading ? (
                  <>
                    <Skeleton className="w-24 h-4 mb-2" />
                    <Skeleton className="w-36 h-5" />
                  </>
                ) : (
                  <>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      Yaratilgan sana
                    </p>
                    <p className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {data?.created_at}
                    </p>
                  </>
                )}
              </article>
            </div>
          </section>

          {/* Footer Info Section */}
          <footer className="dark:bg-slate-900/30 rounded-lg p-4 md:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {isLoading ? (
              <>
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-28 h-4" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Profil yaratuvchi:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {data?.created_by ? data?.created_by : "Admin"}
                    </span>
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  Profil kodi: Saqlanuvchan
                </span>
              </>
            )}
          </footer>
        </CardContent>
        <EditUserForm
          data={data}
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
        />
      </div>
    </Card>
  );
}
