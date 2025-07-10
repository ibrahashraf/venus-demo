import React from 'react'

export default function CheckOutForm(
    { 
        goToPayment,
        user,
        state,
        dispatch,
        appliedCoupon,
        couponCode,
        setCouponCode,
        isApplyingCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
        isLoading,
    }
) {
    return (
        <>
            <div className="bg-white shadow rounded-lg p-6 space-y-5 text-right">
                <h2 className="text-2xl font-bold mb-4">معلومات التوصيل</h2>
        
                <input
                    type="number"
                    name="phone"
                    placeholder="ادخل رقم الهاتف"
                    className="w-full  rounded-sm p-3 focus:outline-none border-b-2 border-gray-300 focus:border-black"
                    value={state.phone}
                    onChange={e => dispatch({type: 'SET_FIELD', field: 'phone', value: e.target.value})}
                />
        
                <input
                    type="text"
                    name="name"
                    placeholder="الاسم"
                    className="w-full  rounded-sm p-3 focus:outline-none border-b-2 border-gray-300 focus:border-black"
                    value={state.name}
                    onChange={e => dispatch({type: 'SET_FIELD', field: 'name', value: e.target.value})}
                />
        
                <select
                    name="governorate"
                    className="w-full  rounded-sm p-3 focus:outline-none border-b-2 border-gray-300 focus:border-black"
                    value={state.governorate}
                    onChange={e => {
                        const selected = e.target.value;
                        dispatch({type: 'SET_FIELD', field: 'governorate', value: selected});
                        const selectedGov = state.shippingOptions.find(g => g.governorate === selected);
                        dispatch({type: 'SET_FIELD', field: 'shippingCost', value: selectedGov ? selectedGov.shippingCost : 0});
                        dispatch({type: 'SET_FIELD', field: 'estimatedDelivery', value: selectedGov ? selectedGov.estimatedDelivery : ''});
                    }}
                >
                    <option value="">اختر المحافظة</option>
                    {state.shippingOptions.map(SO => (
                        <option key={SO._id} value={SO.governorate}>{SO.governorate}</option>
                    ))}
                </select>
        
                <input
                    type="text"
                    name="city"
                    placeholder="المدينة"
                    className="w-full  rounded-sm p-3 focus:outline-none border-b-2 border-gray-300 focus:border-black"
                    value={state.city}
                    onChange={e => dispatch({type: 'SET_FIELD', field: 'city', value: e.target.value})}
                />
        
                <input
                    type="text"
                    name="address"
                    placeholder="العنوان"
                    className="w-full  rounded-sm p-3 focus:outline-none border-b-2 border-gray-300 focus:border-black"
                    value={state.address}
                    onChange={e => dispatch({type: 'SET_FIELD', field: 'address', value: e.target.value})}
                />
                {!appliedCoupon ? (
                    <>
                    <label className="font-medium block mb-1">هل تملك كود خصم؟</label>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="أدخل كود الخصم"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="w-full rounded-sm p-3 border-b-2 border-gray-300 focus:outline-none focus:border-black"
                        />
                        <button
                            onClick={applyCoupon}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={isApplyingCoupon || !couponCode.trim()}
                        >
                            {isApplyingCoupon ? "جاري التحقق..." : "تفعيل الكوبون"}
                        </button>
                        {couponError && <p className="text-red-500">{couponError}</p>}
                    </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between bg-green-100 text-green-800 px-4 py-2 rounded">
                        <span>تم تطبيق الكوبون: {couponCode}</span>
                        <button onClick={removeCoupon} className="text-red-500 hover:underline">إزالة</button>
                    </div>
                )}


                { !user && <div className="g-recaptcha" data-sitekey="6LcsZzErAAAAAAtjfb9B6AOqxKUATGHvCKURF6CC"></div>}

                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Paymob"
                            checked={state.paymentMethod === "Paymob"}
                            onChange={(e) => dispatch({type: 'SET_FIELD', field: 'paymentMethod', value: e.target.value})}
                        />
                        <span>الدفع الإلكتروني</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Pay on Delivery"
                            checked={state.paymentMethod === "Pay on Delivery"}
                            onChange={(e) => dispatch({type: 'SET_FIELD', field: 'paymentMethod', value: e.target.value})}
                        />
                        <span>الدفع عند الاستلام</span>
                    </label>
                </div>
        
                <button
                    className={`w-full bg-black text-white font-bold py-3 rounded-md hover:bg-white hover:text-black hover:border hover:border-black transition ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                    onClick={goToPayment}
                    disabled={isLoading}
                >
                    {isLoading ? 'جاري المعالجة...' : 'اتمام الطلب'}
                </button>
            </div>
        </>
    )
}
