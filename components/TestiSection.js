import { useEffect, useState } from "react";
import TestiSlider from "./TestiSlider";
import TestimonialModal from "./TestimonialModal";
import ErrorBoundary from "./ErrorBoundary";
import axiosClient from "@/lib/axiosClient";
import Button from "./ui/Button";


export default function TestiSection() {
    const [testimonials, setTestimonials] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axiosClient.get("/api/testimonials", {skipRedirect: true}).then((res) => {
            setTestimonials(res.data);
        }).catch((err) => console.log(err)).finally(() => setLoading(false));
    }, []);

    if (!loading && !testimonials.length) return null;

    return (
        <div className="bg-neutral-200 h-[calc(100vh-73px)] md:h-[calc(100vh-80px)] py-12 relative">
            <div className="container mx-auto text-center z-[10] relative h-full flex justify-center flex-col items-center max-w-screen gap-8">
                <h1 className="text-4xl text-center font-bold text-primary">
                    آراء العملاء
                </h1>
                <div className="w-full">
                    {loading 
                        ? (
                            <div className="w-full h-[50%] sm:h-[70%]  flex justify-center items-center py-16 px-6">
                                <div className="bg-white shadow-lg rounded-xl p-10 max-w-3xl w-full h-full skeleton text-center ">
                                </div>
                            </div>
                        ) : (
                            <ErrorBoundary>
                                <TestiSlider testimonials={testimonials} />
                            </ErrorBoundary>
                        )
                    }
                </div>
                <div>
                    <Button variant="secondary" onClick={() => setShowModal(true)} className="py-2 bg-transparent text-xl px-4 ">
                        اترك تقييمك
                    </Button>
                    <TestimonialModal isOpen={showModal} onClose={() => setShowModal(false)} />
                </div>
            </div>
            <div className="bg-accent w-24 sm:w-32 md:w-40 absolute top-0 right-[20%] h-full " />
        </div>
    );
}