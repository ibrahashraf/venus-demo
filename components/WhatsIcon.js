import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Close } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
  const handleClickOutside = (event) => {
    const el = ref.current;
    if (el && !el.contains(event.target)) {
      setIsOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [ref]);

  if (router.pathname === '/ContactUs' || router.pathname === '/Cart' || router.pathname === '/Linktree') {
    return null;
  }
  

  return (
    <div className='fixed bottom-4 right-4 flex justify-center z-[50] items-center gap-3' ref={ref} >
      { isOpen && (
        <div className='bg-[#25D366] animate-slideFromLeft hover:bg-[#10602e] transition duration-200 ease-in-out text-secondary font-bold py-1 rounded-md px-4 flex justify-center items-center'>
          <a
            href="https://wa.me/5011111111111"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 36  }} className=' rounded-full p-0.5 mr-1' />
              Chat with us on WhatsApp
          </a>
        </div>
      )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              
              className={
                `${ isOpen ? "bg-primary" : "bg-[#25D366]"} text-secondary rounded-full p-2 shadow-lg  block transition duration-200 ease-in-out hover:scale-110`
              }
              aria-label="Chat on WhatsApp"
            >
              { isOpen ? (<Close fontSize='large' className='text-[35px] sm:text-[60px]' />) : (<WhatsAppIcon fontSize='large' className='text-[35px] sm:text-[60px]' />)}
            </button>
    </div>
  );
}
