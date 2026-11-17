import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { Close, Star } from "@mui/icons-material";
import { useRouter } from "next/router";
import axiosClient from "@/lib/axiosClient";
import Button from "../ui/Button";



export default function TestimonialModal( { isOpen, onClose }) {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(null);
    const [ error, setError ] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => {
          if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);
    const handleBackgroundClick = (e) => {
        if (e.target.id === "TestimonialModalBackground") {
          onClose();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !rating || !comment) {
            toast.error('يرجى ملء جميع الحقول');
            return;
        }
        try {
            setLoading(true);
            const response = await axiosClient.post('/api/testimonials', {
                name,
                rating,
                comment,
            }, {skipRedirect: true});
            if (response.status === 201) {
                router.push('/');
                toast.success('شكرًا لملاحظاتك!');
                onClose();
                setName('');
                setRating(0);
                setComment('');
            }
        } catch (error) {
            setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    }
    if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
        id="TestimonialModalBackground"
        onClick={handleBackgroundClick}
    >
        <div className="bg-white p-10 rounded-sm shadow-lg w-full max-w-md relative" >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
                <Close />
            </button>
            <h2 className="text-xl text-center font-bold">ما رأيك في تجربتك معنا؟</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white rounded shadow-md">
                <div className="flex flex-col mb-4 items-center">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            onClick={() => setRating(star)}
                            style={{
                            cursor: 'pointer',
                            color: rating >= star ? '#facc15' : '#d1d5db', // yellow-400 or gray-300
                            fontSize: 30,
                            }}
                        />
                        ))}
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="اسمك"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full  rounded-sm p-3 focus:outline-none border-b border-gray-300 focus:border-black"
                />

                <textarea
                    placeholder="تعليقك"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full  rounded-sm p-3 focus:outline-none border-b border-gray-300 focus:border-black"
                ></textarea>
                { error && <p className="text-red-500">{error}</p>}
                <Button type="submit" variant="primary" className={`p-2  font-bold }`} disabled={loading}>
                    {loading ? 'جاري الإرسال...' : 'إرسال'}
                </Button>
            </form>
        </div>
    </div>,
    document.getElementById('modal-root-testimonial')
  );
}
