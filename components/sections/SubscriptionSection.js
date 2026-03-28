import axiosClient from "@/lib/axiosClient";
import { useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";

export default function SubscriptionSection() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!e.target.phone.value) {
            toast.error('Please enter your phone number');
            return;
        }
        setLoading(true);
        try {
            const response = await axiosClient.post("/api/subscribe", {
                phone: e.target.phone.value,   
            },{ skipRedirect: true });
            if (response.status === 201) {
                toast.success("Subscription successful");
                e.target.reset();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div  className=" bg-neutral-200 min-h-[calc(100vh-73px)] md:min-h-[calc(100vh-80px)] py-12 relative flex flex-col items-center justify-center">
            <div className=" z-[10] w-full bg-primary ">
                <div className="container text-center flex flex-col items-center justify-center mx-auto relative p-10  max-w-screen gap-8 ">

                    <h3 className="text-3xl sm:text-4xl text-secondary font-semibold">Subscribe to Our Newsletter</h3>
                    <form
                        onSubmit={ (e) => {onSubmit(e)}}
                        className="flex mt-3 w-[100%] sm:w-[70%] "
                        >
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Your phone number"
                            className="flex-[3] p-3 rounded-l-lg border border-neutral-300 focus:outline-none text-left"
                            />
                        <button disabled={loading} type="submit" className="bg-accent flex-[1] flex items-center justify-center hover:bg-accent/80 transition text-secondary px-4 py-2 rounded-r-lg">
                            {loading ? (<PuffLoader color="#fff" size={20} />) : 'Subscribe'}
                        </button>
                    </form>
                </div>
            </div>
                <div className="bg-white z-[9] w-24 sm:w-32 md:w-40 absolute top-0 left-[20%] h-full " />
        </div>
    );
}
