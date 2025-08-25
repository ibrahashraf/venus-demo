import { createPortal } from "react-dom";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import Button from "./ui/Button";

export default function ShippingFormModal({ onClose }) {
    const [shippingInfo, setShippingInfo] = useState({ name: "", phone: "", address: "", city: "", governorate: "" });
    const [shippingOptions, setShippingOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [formError, setFormError] = useState(null);

    // fetch shipping options once
    useEffect(() => {
        axiosClient
        .get("/api/shipping")
        .then((res) => setShippingOptions(res.data))
        .catch((err) => console.error(err));

        axiosClient
        .get("/api/shipping-info")
        .then((res) => setShippingInfo(res.data.shippingInfo || {}))
        .catch((err) => console.error(err));
    }, []);

    const validate = () => {
        const errors = {};
        if (!shippingInfo.name?.trim()) errors.name = "يرجى كتابة الاسم";
        if (!shippingInfo.phone?.trim()) errors.phone = "يرجى كتابة رقم الهاتف";
        if (!shippingInfo.address?.trim()) errors.address = "يرجى كتابة العنوان";
        if (!shippingInfo.city?.trim()) errors.city = "يرجى كتابة المدينة";
        if (!shippingInfo.governorate?.trim()) errors.governorate = "يرجى اختيار المحافظة";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const saveForm = async () => {
        if (!validate()) return;
        try {
            await axiosClient.put("/api/shipping-info", {
                name: shippingInfo.name,
                phone: shippingInfo.phone,
                address: shippingInfo.address,
                city: shippingInfo.city,
                governorate: shippingInfo.governorate,
            }, {skipRedirect: true});
        } catch (err) {
            console.error("Error saving address", err);
            setFormError("حدث خطأ في حفظ البيانات");
            setTimeout(() => setFormError(null), 3000);
        } finally {
            onClose();
        }
    };

    const handleChange = (field, value) => {
        setShippingInfo((prev) => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target.id === "shippingFormModalBackground") {
            onClose();
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
            id="shippingFormModalBackground"
            onClick={handleBackgroundClick}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 left-3 text-gray-500 hover:text-black"
                >
                    <Close />
                </button>

                <h2 className="text-xl font-semibold mb-4">بيانات الشحن</h2>

                {/* phone */}
                <input
                    type="number"
                    placeholder="ادخل رقم الهاتف"
                    className={`w-full rounded-sm p-3 focus:outline-none border-b ${
                        formErrors.phone ? "border-red-500" : "border-gray-300 focus:border-black"
                    }`}
                    value={shippingInfo.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
                {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}

                {/* name */}
                <input
                    type="text"
                    placeholder="الاسم"
                    className={`w-full rounded-sm p-3 mt-3 focus:outline-none border-b ${
                        formErrors.name ? "border-red-500" : "border-gray-300 focus:border-black"
                    }`}
                    value={shippingInfo.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}

                {/* governorate */}
                <select
                    className={`w-full rounded-sm p-3 mt-3 focus:outline-none border-b ${
                        formErrors.governorate
                        ? "border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                    value={shippingInfo.governorate || ""}
                    onChange={(e) => handleChange("governorate", e.target.value)}
                >
                    <option value="">اختر المحافظة</option>
                    {shippingOptions.map((SO) => (
                        <option key={SO._id} value={SO.governorate}>
                            {SO.governorate}
                        </option>
                    ))}
                </select>
                {formErrors.governorate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.governorate}</p>
                )}

                {/* city */}
                <input
                    type="text"
                    placeholder="المدينة"
                    className={`w-full rounded-sm p-3 mt-3 focus:outline-none border-b ${
                        formErrors.city ? "border-red-500" : "border-gray-300 focus:border-black"
                    }`}
                    value={shippingInfo.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                />
                {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                )}

                {/* address */}
                <input
                    type="text"
                    placeholder="العنوان"
                    className={`w-full rounded-sm p-3 mt-3 focus:outline-none border-b ${
                        formErrors.address
                        ? "border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                    value={shippingInfo.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                />
                {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                )}

                {/* save */}
                    {formError && <p className="text-red-500">{formError}</p>}
                <div className="flex mt-6 justify-between">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className=" py-2 px-6 "
                    >
                        الغاء
                    </Button>
                    <Button
                        variant="primary"
                        onClick={saveForm}
                        className="  py-2 px-6"
                    >
                        حفظ
                    </Button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.getElementById("shipping-form-modal-root"));
}
