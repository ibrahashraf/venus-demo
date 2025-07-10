import { useRouter } from "next/router";
import { useEffect, useState, useContext  } from "react";
import axios from "axios";
import { CartContext } from "@/contexts/CartContext";
import { PromotionContext } from "@/contexts/PromotionContext";
import { ClipLoader } from "react-spinners";
import Header from "@/components/Header";
import Image from "next/image";


export default function BogoOfferPage() {
    const router = useRouter();
    const { id } = router.query;

    const { addProduct } = useContext(CartContext);
    const { selectFreeGift } = useContext(PromotionContext);

    const [ promo, setPromo ] = useState(null);
    const [ buyProducts, setBuyProducts ]  = useState([]);
    const [ getProducts, setGetProducts ] = useState([]);
    const [ selectedBuys, setSelectedBuys ] = useState([]);
    const [ selectedGifts, setSelectedGifts ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const { data: allPromos } = await axios.get('/api/promotions');
                const promo = allPromos.find(p => p._id === id && p.promotionType === 'bogo');
                if (!promo) return;

                const { data: allProducts } = await axios.get('/api/products');
                const buy = allProducts.filter(p => promo.buyProducts.includes(p._id));
                const get = allProducts.filter(p => promo.getProducts.includes(p._id));

                setPromo(promo);
                setBuyProducts(buy);
                setGetProducts(get);
            } catch (error) {
                console.error('error loading bogo details', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [id]);

    function handleBuySelect(product, variant) {
        if (selectedBuys.length >= promo.buyQty) return;
        const cartProduct = {
            _id: product._id,
            images: product.images,
            title: product.title,
            selectedColor: variant.color,
            selectedSize: variant.size,
            stock: variant.stock,
            price: variant.price,
            category: product.category,
        }
        setSelectedBuys(prev => [...prev, cartProduct]);
    }

    function handleGiftSelect(product, variant) {
        if (selectedGifts.length >= promo.getQty) return;
        const cartProduct = {
            _id: product._id,
            images: product.images,
            title: product.title,
            selectedColor: variant.color,
            selectedSize: variant.size,
            stock: variant.stock,
            price: 0,
            category: product.category,
            isFree: true,
            promotionId: promo._id,
        }
        setSelectedGifts(prev => [...prev, cartProduct]);
    }

    function handleCompleteOffer() {
        if (selectedBuys.length < promo.buyQty) return;
        if (selectedGifts.length < promo.getQty) return;

        selectedBuys.forEach(p => addProduct(p));
        selectedGifts.forEach(p => addProduct(p));
        router.push('/Cart');
    }

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center">
            <ClipLoader color="#36d399" size={50} />
        </div>
    );

    if (!promo) return <h1>BOGO offer not found</h1>;

    return (
        <>
            <Header />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">{promo.title || 'BOGO Offer'}</h1>
                <p className="mb-6 text-gey-700">{promo.description}</p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Buy Products</h2>
                            {buyProducts.map(product => (
                                <div key={product._id} className="border p-4 mb-4 rounded shadow-md">
                                    <p className="font-bold mb-2">{product.title}</p>
                                    <Image src={product.images?.[0]} height={200} width={200} className="h-40 object-cover rounded mb-2" alt={product.title} />
                                    
                                    {/* Variant Selector */}
                                    <select
                                        className="w-full border rounded px-2 py-1 mb-2"
                                        onChange={(e) => handleBuySelect(product, product.variants.find(v => v._id === e.target.value))}
                                        disabled={selectedBuys.length >= promo.buyQty}
                                    >
                                    <option value="">اختر المقاس</option>
                                    {product.variants?.map((variant, idx) => (
                                        <option key={idx} value={variant._id}>
                                            {variant.name} — {variant.price} EGP
                                        </option>
                                    ))}
                                    </select>

                                    {selectedBuys.find(item => item.productId === product._id) && (
                                    <p className="text-green-600 text-sm">تم الاختيار</p>
                                    )}
                                </div>
                            ))}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2 ">Choose your gift</h2>
                        {getProducts.map(product => (
                            <div key={product._id} className="border p-4 mb-4 rounded shadow-md">
                                <p className="font-bold mb-2">{product.title}</p>
                                <Image height={200} width={200} alt={product.title} src={product.images?.[0]} className="h-40 object-cover rounded mb-2" />
                                
                                <select
                                    className="w-full border rounded px-2 py-1 mb-2"
                                    onChange={(e) => handleGiftSelect(product, product.variants.find(v => v._id === e.target.value))}
                                    disabled={selectedGifts.length >= promo.getQty}
                                >
                                <option value="">اختر الهدية</option>
                                {product.variants?.map((variant, idx) => (
                                    <option key={idx} value={variant._id}>
                                    {variant.name} — {variant.price} EGP
                                    </option>
                                ))}
                                </select>

                                {selectedGifts.find(item => item.productId === product._id) && (
                                <p className="text-blue-600 text-sm">تم اختيار الهدية</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-4 w-full bg-black text-white py-2 rounded disabled:opacity-50"
                        disabled={
                            selectedBuys.length !== promo.buyQty || selectedGifts.length !== promo.getQty
                        }
                        onClick={handleCompleteOffer}
                    >
                        إتمام العرض
                    </button>
                </div>
            </div>
        </>
    );
}