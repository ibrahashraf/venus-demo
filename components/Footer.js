import axiosClient from "@/lib/axiosClient";
import { Instagram, Facebook, Telegram, MusicNote, LocationOn, LocalPhone } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
export default function Footer() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!e.target.phone.value) {
            toast.error('يرجى إدخال رقم الهاتف');
            return;
        }
        setLoading(true);
        try {
            const response = await axiosClient.post("/api/subscribe", {
                phone: e.target.phone.value,   
            },{ skipRedirect: true });
            if (response.status === 201) {
                toast.success("تم الاشتراك بنجاح");
                e.target.reset();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="bg-neutral-50 text-primary py-10 px-6 lg:px-20" dir="ltr">
            <div className="grid grid-cols-1 lg:grid-cols-5  gap-12 lg:gap-2">
                <div dir="rtl" className="text-center flex flex-col items-center lg:items-end ">
                    <div className="flex justify-center flex-row-reverse lg:flex-col  items-end lg:items-center">
                        <svg
                            className={`transition h-18 w-36`}
                            viewBox="0 0 2100 1000"
                            fill="none"
                        >
                            <g>
                                <path
                                    className={`fill-accent`}
                                    d="m 697.61101,27.11885 -22.59794,0.0864 c 4.59031,31.913398 -1.7116,31.256239 -1.7116,31.256239 -55.43673,14.472302 -66.38303,28.2024 -66.38303,27.83134 0,-0.371109 -0.353,0.370924 -0.353,0.370924 L 498.50923,185.27529 388.10076,87.217641 c 0,0 -0.35317,-0.74264 -0.35312,-0.37158 2e-4,0.371099 -10.94781,-13.356784 -66.38704,-27.819579 0,0 -6.46482,0.08786 -1.87953,-31.826308 l -22.43531,0.03177 c 0,0 -6.75576,46.271945 -10.6287,119.747256 0,0 3.54158,68.65009 22.96975,118.00099 l 33.90872,70.12959 c 0,0 24.01767,45.26814 26.84976,91.65311 0,0 15.54462,50.46578 -23.9889,139.53273 l -33.5428,12.9932 185.73587,388.75236 0.51588,1.07966 v 0 0 l 0.52256,-1.11363 182.74135,-389.2846 -33.5451,-12.98751 c -39.54704,-89.06047 -24.01037,-139.52836 -24.01037,-139.52836 2.82495,-46.38572 26.83541,-91.65825 26.83541,-91.65825 l 33.89779,-70.13552 c 19.42049,-49.35406 22.9516,-118.00405 22.9516,-118.00405 C 704.37475,72.933771 697.61101,27.118849 697.61101,27.11885 Z" 
                                />
                                <path
                                    className={` stroke-accent`}
                                    strokeWidth="40"
                                    d="M 21.322189,13.147509 978.60091,13.101063 498.86534,970.63708 Z"
                                />
                                <text
                                    className={`fill-accent translate-y-[919px]  translate-x-[2100px] opacity-100 `}
                                    fontSize="625.618"
                                    fontFamily="'Microsoft Sans Serif', sans-serif"
                                >

                                    <tspan
                                        className='translate-x-[746px] translate-y-[919px]'
                                    >
                                        enus
                                    </tspan>
                                </text>
                            </g>
                        </svg>
                        <p className="text-[30px] text-primary font-semibold max-lg:-mb-[6px] max-lg:ml-1 lg:-mt-3"> outlet</p>
                    </div>
                </div>
                <div  className=" lg:pr-40 text-center lg:col-span-2 ">
                    <h3 className="text-md font-semibold">اشترك لتصلك احدث العروض</h3>
                    <p className="text-md text-neutral-500">احصل على أحدث العروض عبر واتساب</p>
                    <form
                        onSubmit={ (e) => {onSubmit(e)}}
                        className="flex mt-3"
                    >
                        <button type="submit" className="bg-neutral-500 flex-[1] flex items-center justify-center hover:bg-neutral-600 transition text-secondary px-4 py-2 rounded-l-lg">
                           {loading ? (<PuffLoader color="#fff" size={20} />) : 'اشترك'}
                        </button>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="رقم هاتفك"
                            className="flex-[3] p-2 rounded-r-lg border border-neutral-300 focus:outline-none text-right"
                        />
                    </form>
                </div>
                <div className="flex justify-evenly text-right lg:-ml-28 max-lg:pr-12  ">
                    <ul className="space-y-4 text-md text-neutral-500">
                        <li className="hover:text-primary"><Link href="/">الرئيسية</Link></li>
                        <li className="hover:text-primary"><Link href="/Products">المتجر</Link></li>
                        <li className="hover:text-primary"><Link href="/ContactUs">تواصل معنا</Link></li>
                    </ul>
                    <ul className="space-y-4 text-md text-neutral-500">
                        <li className="hover:text-primary"><Link href="/delete-data">حذف البيانات</Link></li>
                        <li className="hover:text-primary"><Link href="/privacy-policy">سياسة الخصوصية</Link></li>
                        <li className="hover:text-primary"><Link href="/terms">الشروط والأحكام</Link></li>
                    </ul>
                </div>
                <div>
                    <ul className="space-y-4 text-md text-right max-sm:text-center text-neutral-500 ">
                        <li className=" flex gap-1 max-sm:justify-center"> .المنصورة, اخر شارع السجن من شارع عبد السلام عارف<LocationOn sx={{color: "#9ca3af"}} /></li>
                        <li className=" flex gap-1 max-sm:justify-center">الاسكندرية, العجمي, منتصف شارع البيطاش, اول شارع السماليهي واحد<LocationOn sx={{color: "#9ca3af"}} /></li>
                        <li className=" flex gap-1 max-sm:justify-center justify-end max-sm:text-[20px]" > 011 47 111 094 <LocalPhone sx={{color: "#9ca3af"}} /></li>
                    </ul>
                </div>
                <div className="lg:mt-10 border-t lg:col-span-5 border-gray-600 p-6 flex flex-col lg:flex-row justify-between items-center text-md text-gray-400">
                    <div>
                        <p>© {new Date().getFullYear()} Venus Outlet. جميع الحقوق محفوظة.</p>
                    </div>
                    <div className="flex gap-2 mt-4 lg:mt-0">
                        <a target="_blank" href="https://www.facebook.com/venusegypt2017" className="hover:text-[#1877F2]" aria-label="Facebook"><Facebook fontSize="medium"  /></a>
                        <a target="_blank" href="https://www.instagram.com/venus.outlet.egypt/" className="hover:text-[#E1306C]"  aria-label="Instagram"><Instagram fontSize="medium" /></a>
                        <a target="_blank" href="https://t.me/venus_mansoura" className="hover:text-[#0088CC]" aria-label="Telegram"><Telegram fontSize="medium"  /></a>
                        <a target="_blank" href="https://www.tiktok.com/@venus.outlet" className="hover:text-black" aria-label="TikTok"><MusicNote fontSize="medium"  /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

