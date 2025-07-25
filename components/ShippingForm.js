import { useEffect, useState } from "react";

export default function ShippingForm({state, shippingOptions, onSubmit}) {
  const [localState, setLocalState] = useState(state);
  useEffect(() => {
    setLocalState(state);
  }, [state]);
  return (
    <div>
      <input
        type="number"
        name="phone"
        placeholder="ادخل رقم الهاتف"
        className="w-full  rounded-sm p-3 focus:outline-none border-b border-gray-300 focus:border-black"
        value={localState.phone}
        onChange={e => setLocalState({...localState, phone: e.target.value})}
      />
        
      <input
        type="text"
        name="name"
        placeholder="الاسم"
        className="w-full  rounded-sm p-3 focus:outline-none border-b border-gray-300 focus:border-black"
        value={localState.name}
        onChange={e => setLocalState({...localState, name: e.target.value})}
      />
        
      <select
        name="governorate"
        className="w-full  rounded-sm p-3 focus:outline-none border-b border-gray-300 focus:border-black"
        value={localState.governorate}
        onChange={e => {
          const selected = e.target.value;
          const selectedGov = shippingOptions.find(g => g.governorate === selected);
          setLocalState(prev => ({
            ...prev,
            governorate: selected,
            shippingCost: selectedGov ? selectedGov.cost : 0,
            estimatedDelivery: selectedGov ? selectedGov.estimatedDelivery : '',
          }));

        }}
      >
        <option value="">اختر المحافظة</option>
        {shippingOptions.map(SO => (
          <option key={SO._id} value={SO.governorate}>{SO.governorate}</option>
        ))}
      </select>
        
      <input
        type="text"
        name="city"
        placeholder="المدينة"
        className="w-full  rounded-sm p-3 focus:outline-none border-b border-gray-300 focus:border-black"
        value={localState.city}
        onChange={e => setLocalState({...localState, city: e.target.value})}
      />
        
      <input
        type="text"
        name="address"
        placeholder="العنوان"
        className="w-full  rounded-sm p-3 focus:outline-none border-b border-gray-300 focus:border-black"
        value={localState.address}
        onChange={e => setLocalState({...localState, address: e.target.value})}
      />
      <div className="text-left">
        <button
          onClick={() => onSubmit(localState)}
          className="mt-4 bg-black border border-black text-white py-1 px-4 rounded hover:bg-neutral-50 hover:text-black transition"
        >
          حفظ
        </button>
      </div>
    </div>
  )
}