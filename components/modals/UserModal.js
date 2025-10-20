import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import { useRef, useState } from "react";
import { Close } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import Link from "next/link";
import DeleteUserModal from "./DeleteUserModal";
import ShippingFormModal from "./ShippingFormModal";

export default function UserModal({ onClose }) {
    const [openDelete, setOpenDelete] = useState(false);
    const [openShipping, setOpenShipping] = useState(false);
    const { data: session, status } = useSession();
    const userModalRef = useRef();

    const handleSignOut = () => {
        localStorage.removeItem('cartMigrated');
        localStorage.removeItem('cart');
        signOut();
      };
    const handleBackgroundClick = (e) => {
      if (e.target.id === "userModalBackground") {
        onClose();
      }
    };
    const modalContent = session ? (
        <div
            id='userModalBackground'
            className="fixed inset-0 z-[51]  flex items-center justify-center bg-black/50"
            onClick={handleBackgroundClick}
        >
            <div
                ref={userModalRef}
                className=" z-[1000] overflow-y-auto animate-slideFromLeft pt-20 shadow-lg bg-neutral-200 fixed  h-screen w-screen md:w-1/3 xl:w-1/4  top-0 right-0   "
            >
                <div className="flex items-center justify-betwee absolute top-0 w-full p-5">
                    <button
                        onClick={() => onClose()} 
                    >
                        <Close className=" text-primary text-4xl " />
                    </button>
                    <div className="text-2xl font-bold bg-neutral-200 absolute top-6 left-1/2 transform -translate-x-1/2 text-accent">{session.user.name}</div>
                    <div />
                </div>
                <div className="flex p-1 pb-4 flex-col gap-4 text-2xl  [&>*]:w-full [&>*]:pt-6  [&>*]:pr-8  w-full items-center justify-start ">
                    <Link href="/WishList" onClick={ () => onClose} >
                        قائمة المفضلة
                    </Link>
                    <Link href="/Cart" >
                        المشتريات
                    </Link>
                    <button
                        
                        onClick={() => {setOpenShipping(true)}}
                        className="text-right"
                    >
                        تعديل بيانات الشحن
                    </button>
                    <Link href="/Orders" onClick={ () => onClose} >
                        متابعةالطلبات
                    </Link>
                    <button
                        onClick={() => {setOpenDelete(true)}}
                        className="text-right"
                        
                    >
                        حذف الحساب
                    </button>
                    <button
                        onClick={() => handleSignOut()}
                        
                    >
                        تسجيل الخروج <LogoutIcon />
                    </button>
                </div>
            </div>
            {openShipping && <ShippingFormModal onClose={() => setOpenShipping(false)} />}
            {openDelete && <DeleteUserModal onClose={() => setOpenDelete(false)} />}
        </div>
    ) : null;
    return createPortal(modalContent, document.getElementById('user-modal-root'));
}
