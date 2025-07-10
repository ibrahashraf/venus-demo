import axios from "axios"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { Close, Star } from "@mui/icons-material";
import { useRouter } from "next/router";



export default function TestimonialModal( { isOpen, onClose }) {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(null);
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
            toast.error('Please fill in all fields');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('/api/testimonials', {
                name,
                rating,
                comment,
            });
            if (response.status === 201) {
                router.push('/');
                toast.success('Thank you for your testimonial!');
                onClose();
                setName('');
                setRating(0);
                setComment('');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Submission failed');
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
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-fade-in" >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
                <Close />
            </button>
            <h2 className="text-xl font-bold">Submit a Testimonial</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white rounded shadow-md">
                <div className="flex flex-col mb-4 items-center">
                    <label className="block mb-1 font-medium">تقييمك</label>
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
                    className="p-2 border border-gray-300 rounded"
                />

                <textarea
                    placeholder="تعليقك"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border border-gray-300 rounded h-24"
                ></textarea>
                <button type="submit" className={`p-2 bg-blue-600 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    </div>,
    document.getElementById('modal-root-testimonial')
  );
}
