import axiosClient from "@/lib/axiosClient";
import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";

export default function SubscriptionSection() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!e.target.phone.value) {
            toast.error('يرجى ادخال رقم الهاتف');
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
        <div dir="rtl" className=" bg-neutral-200 h-[calc(100vh-73px)] md:h-[calc(100vh-80px)] py-12 relative flex flex-col items-center justify-center">
            <div className=" z-[10] w-full bg-primary">
                <div className="container text-center flex flex-col items-center justify-center mx-auto relative p-10  max-w-screen gap-8">

                    <h3 className="text-4xl text-secondary font-semibold">اشترك معنا</h3>
                    <p className="text-xl sm:text-2xl text-neutral-100">استقبل أحدث العروض على واتساب</p>
                    <form
                        onSubmit={ (e) => {onSubmit(e)}}
                        className="flex mt-3 w-[100%] sm:w-[70%]"
                        >
                        <input
                            type="tel"
                            name="phone"
                            placeholder="رقم موبايلك"
                            className="flex-[3] p-3 rounded-r-lg border border-neutral-300 focus:outline-none text-right"
                            />
                        <button disabled={loading} type="submit" className="bg-accent flex-[1] flex items-center justify-center hover:bg-accent/80 transition text-secondary px-4 py-2 rounded-l-lg">
                            {loading ? (<PuffLoader color="#fff" size={20} />) : 'اشترك'}
                        </button>
                    </form>
                </div>
            </div>
                <div className="bg-accent z-[9] w-24 sm:w-32 md:w-40 absolute top-0 right-[20%] h-full " />
        </div>
    );
}
