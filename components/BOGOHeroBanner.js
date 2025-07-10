import { useContext, useEffect, useState } from "react";
import { PromotionDisplayContext } from "@/contexts/PromotionDisplayContext";
import Image from "next/image";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";

export default function BOGOHeroBanner() {
    const { getBOGODetails, promotions, loading: promotionsLoading } = useContext(PromotionDisplayContext);
    const [ promo, setPromo ] = useState(null);
    const [ buyProducts, setBuyProducts ]  = useState([]);
    const [ getProducts, setGetProducts ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (promotionsLoading) return;
        if (promotions.length === 0) {
            setLoading(false);
            return;
        }
        const loadBogo = async () => {
            setLoading(true);
            try {
                const data = await getBOGODetails();
                if (data) {
                    setPromo(data.promo);
                    setBuyProducts(data.buyProducts);
                    setGetProducts(data.getProducts);
                }
            } catch (error) {
                console.error("Error fetching BOGO details", error);
                setPromo(null);
                setBuyProducts([]);
                setGetProducts([]);
            } finally {
                setLoading(false);
            }
        };
        loadBogo();
    }, [promotionsLoading, promotions]);

    if (loading) return (
        <div className="flex justify-center items-center py-10">
            <ClipLoader color="#36d399" size={50} />
        </div>
    )
    if (!promo || buyProducts.length === 0 || getProducts.length === 0) return null;
    return (
        <div className="bg-gradient-to-r from-gray-100 to-gray-400 border border-gray-600 p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                        {promo.description}
                    </h1>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:w-1/2">
                            اشتري
                            <Image src={buyProducts[0]?.images?.[0]} alt={promo.description} width={500} height={500} className="w-full h-auto" />
                            <div className="w-full md:w-1/2">
                                <ul className="text-lg font-bold text-gray-800">
                                    {buyProducts.map((product) => (
                                        <li key={product._id}>{product.title}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            احصل على
                            <Image src={getProducts[0]?.images?.[0]} alt={promo.description} width={500} height={500} className="w-full h-auto" />
                            <div className="w-full md:w-1/2">
                                <ul className="text-lg font-bold text-gray-800">
                                    {getProducts.map((product) => (
                                        <li key={product._id}>{product.title}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Link href={`/bogo/${promo._id}`} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full`}>
                        احصل على الخصم
                    </Link>
                </div>
            </div>
        </div>
    );
}
