import { useEffect, useState } from "react";
import Button from "../ui/Button";

export default function ShippingForm({ state, shippingOptions, onSubmit }) {
  const [localState, setLocalState] = useState(state);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setLocalState(state);
    setFormErrors({});
  }, [state]);

  const validate = () => {
    const errors = {};
    if (!localState.name?.trim()) errors.name = "يرجى إدخال الاسم";
    if (!localState.phone?.trim()) errors.phone = "يرجى إدخال رقم الهاتف";
    if (!localState.address?.trim()) errors.address = "يرجى إدخال العنوان";
    if (!localState.city?.trim()) errors.city = "يرجى إدخال المدينة";
    if (!localState.governorate?.trim()) errors.governorate = "يرجى اختيار المحافظة";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveForm = () => {
    if (!validate()) return;
    onSubmit(localState);
  };

  const handleChange = (field, value) => {
    setLocalState((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div>
      <input
        type="number"
        name="phone"
        placeholder="أدخل رقم الهاتف"
        className={`w-full rounded-sm p-3 focus:outline-none border-b ${
          formErrors.phone ? "border-red-500" : "border-gray-300 focus:border-black"
        }`}
        value={localState.phone || ""}
        onChange={(e) => handleChange("phone", e.target.value)}
      />
      {formErrors.phone && (
        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
      )}

      <input
        type="text"
        name="name"
        placeholder="أدخل الاسم"
        className={`w-full rounded-sm p-3 focus:outline-none border-b ${
          formErrors.name ? "border-red-500" : "border-gray-300 focus:border-black"
        }`}
        value={localState.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      {formErrors.name && (
        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
      )}

      <select
        name="governorate"
        className={`w-full rounded-sm p-3 focus:outline-none border-b ${
          formErrors.governorate ? "border-red-500" : "border-gray-300 focus:border-black"
        }`}
        value={localState.governorate || ""}
        onChange={(e) => {
          const selected = e.target.value;
          const selectedGov = shippingOptions.find(
            (g) => g.governorate === selected
          );
          handleChange("governorate", selected);
          setLocalState((prev) => ({
            ...prev,
            shippingCost: selectedGov ? selectedGov.cost : 0,
            estimatedDelivery: selectedGov ? selectedGov.estimatedDelivery : "",
          }));
        }}
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

      <input
        type="text"
        name="city"
        placeholder="أدخل المدينة"
        className={`w-full rounded-sm p-3 focus:outline-none border-b ${
          formErrors.city ? "border-red-500" : "border-gray-300 focus:border-black"
        }`}
        value={localState.city || ""}
        onChange={(e) => handleChange("city", e.target.value)}
      />
      {formErrors.city && (
        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
      )}

      <input
        type="text"
        name="address"
        placeholder="أدخل العنوان"
        className={`w-full rounded-sm p-3 focus:outline-none border-b ${
          formErrors.address ? "border-red-500" : "border-gray-300 focus:border-black"
        }`}
        value={localState.address || ""}
        onChange={(e) => handleChange("address", e.target.value)}
      />
      {formErrors.address && (
        <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
      )}

      <div className="text-left">
        <Button
          variant="primary"
          onClick={saveForm}
          className="mt-4 py-1 px-5 "
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
