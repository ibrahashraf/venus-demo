import { useState } from 'react';
import Header from '@/components/Header';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Telegram as TelegramIcon,
  MusicNote as MusicNoteIcon,
  LocationOn as LocationOnIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
  LocalGroceryStore as LocalGroceryStoreIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [showWhyUs, setShowWhyUs] = useState(false);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
          <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">
            تواصل معنا
          </h1>

          <div className="flex flex-col gap-4">
            <LinkPhoneWithCopy phone="+20 11 47111094" />
            <LinkPhoneWithCopy phone="+20 50 2385877" />
            <LinkButton
              icon={<WhatsAppIcon className="text-green-500" />}
              label="راسلنا على واتساب"
              href="https://wa.me/201147111094"
            />
            <LinkButton
              icon={<LocalGroceryStoreIcon sx={{ fontSize: 30 }} className="text-red-500" />}
              label="Shopping Online"
              href="https://0265-102-186-158-76.ngrok-free.app"
            />
            <LinkButton
              icon={<FacebookIcon className="text-blue-800" />}
              label="فيسبوك"
              href="https://www.facebook.com/venusegypt2017"
            />
            <LinkButton
              icon={<InstagramIcon className="text-pink-500" />}
              label="انستجرام"
              href="https://www.instagram.com/venus.outlet.egypt"
            />
            <LinkButton
              icon={<TelegramIcon className="text-blue-400" />}
              label="تليجرام"
              href="https://t.me/venus_mansoura"
            />
            <LinkButton
              icon={<MusicNoteIcon className="text-black" />}
              label="تيك توك"
              href="https://www.tiktok.com/@venus.outlet"
            />
            <LinkButton
              icon={<EmailIcon className="text-red-500" />}
              label="venus.outlet2015@gmail.com"
              href="mailto:venus.outlet2015@gmail.com"
            />

            <button
              onClick={() => setShowWhyUs(true)}
              className="w-full flex justify-center items-center gap-3 px-6 py-4 text-lg font-bold text-center rounded-xl border border-gray-200 shadow-md bg-white text-gray-900 
                transition-all duration-200 ease-in-out 
                hover:bg-blue-50 hover:text-blue-800 hover:shadow-lg 
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 
                cursor-pointer"
            >
              <span className="text-xl text-indigo-700">لماذا نحن</span>
            </button>

            <ExpandableAddressButton
              icon={<LocationOnIcon className="text-purple-600" />}
              label="فرع المنصورة"
              address="شارع السجن من شارع عبد السلام عارف من ناحيه مستشفى العرب"
              mapLink="https://maps.app.goo.gl/H3Nu1c9jMHroNZzq7"
              iframe={`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3418.589655770775!2d31.38682958350123!3d31.03768040853047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f79dc597e897b7%3A0xad959dc5eb2c0ea9!2sVenus%20Outlet!5e0!3m2!1sen!2seg!4v1746143714721!5m2!1sen!2seg" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
            />
            <ExpandableAddressButton
              icon={<LocationOnIcon className="text-purple-600" />}
              label="فرع الاسكندرية"
              address="العجمي منتصف شارع البيطاش اول شارع السماليهي واحد"
              mapLink="https://maps.app.goo.gl/7oaHxwSdeapz3tBBA"
              iframe={`<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d213.47146898974728!2d29.7853313!3d31.1224175!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5952c5b1294eb%3A0x91a84efc9cc653ee!2s4QFP%2B354%2C%20Abnaa%20Al%20Samaleme%2C%20Al%20Beitash%20Gharb%2C%20Dekhela%2C%20Alexandria%20Governorate%205314540!5e0!3m2!1sen!2seg!4v1746143584589!5m2!1sen!2seg" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
            />
          </div>
        </div>
      </main>

      {showWhyUs && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative text-right">
            <button
              onClick={() => setShowWhyUs(false)}
              className="absolute top-4 left-4 text-gray-500 hover:text-red-500 text-xl"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-indigo-700 mb-4">لماذا نحن؟</h2>
            <p className="text-gray-800 leading-loose whitespace-pre-line text-lg">
              في ڤينوس أوتلت، نحن أكثر من مجرد متجر ملابس — نحن وجهتك المفضلة للأناقة والجودة والسعر المناسب.
              {"\n\n"}نُقدّم تشكيلات مميزة من الملابس النسائية، الرجالية، وملابس الأطفال، تناسب كل الأذواق والمناسبات.
              {"\n\n"}نؤمن أن كل شخص يستحق أن يبدو بأفضل إطلالة دون أن يدفع الكثير، ولهذا نحرص على الجمع بين الجودة العالية والأسعار المناسبة في كل قطعة نقدمها.
              {"\n\n"}نخدم عملاءنا من خلال فروعنا المميزة، إلى جانب متجرنا الإلكتروني الذي يوفر تجربة تسوق سهلة وآمنة من أي مكان وفي أي وقت.
              {"\n\n"}مرحباً بك في ڤينوس — حيث الأناقة تبدأ بسعر يناسبك.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function LinkButton({ icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex justify-center items-center gap-3 px-6 py-4 text-lg font-bold text-center rounded-xl border border-gray-200 shadow-md bg-white text-gray-900 
        transition-all duration-200 ease-in-out 
        hover:bg-blue-50 hover:text-blue-800 hover:shadow-lg 
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 
        cursor-pointer"
    >
      <div className="text-2xl">{icon}</div>
      <span>{label}</span>
    </a>
  );
}

function LinkPhoneWithCopy({ phone }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    await navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <a
      href={`tel:${phone}`}
      className="w-full flex justify-between items-center px-6 py-4 text-lg font-bold text-center rounded-xl border border-gray-200 shadow-md bg-white text-gray-900 
        transition-all duration-200 ease-in-out 
        hover:bg-blue-50 hover:text-blue-800 hover:shadow-lg 
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 
        cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <PhoneIcon className="text-blue-600 text-2xl" />
        <span>{phone}</span>
      </div>

      <button
        onClick={handleCopy}
        className="text-gray-500 hover:text-green-600 focus:outline-none"
        title="نسخ الرقم"
      >
        {copied ? (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <CheckCircleIcon fontSize="small" className="ml-1" />
            تم النسخ
          </div>
        ) : (
          <ContentCopyIcon fontSize="small" />
        )}
      </button>
    </a>
  );
}

function ExpandableAddressButton({ icon, label, address, mapLink, iframe }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(!expanded);

  return (
    <div className="w-full">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-6 py-4 text-lg font-bold rounded-xl border border-gray-200 shadow-md bg-white text-gray-900
          transition-all duration-200 ease-in-out
          hover:bg-blue-50 hover:text-blue-800 hover:shadow-lg
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300
          cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <span>{label}</span>
        </div>
        {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      </button>

      {expanded && (
        <div className="bg-gray-50 rounded-xl mt-2 p-4 border text-right text-sm leading-relaxed">
          <p className="mb-2 text-xl text-gray-800">{address}</p>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium mb-4 block"
          >
            فتح الخريطة
          </a>

          {iframe && (
            <div className="mt-4 w-full overflow-hidden rounded-xl">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={iframe.match(/src="([^"]+)"/)?.[1] || ''}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute top-0 left-0 w-full h-full border-0 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
