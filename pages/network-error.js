import Link from "next/link";
import RefreshIcon from '@mui/icons-material/Refresh';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Head from "next/head";
import Button from "@/components/ui/Button";

export default function NetworkError() {
  return (
    <>
    <Head>
      <title>خطأ في الشبكة | Venus Outlet</title>
      <meta
        name="description"
        content="تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت."
      />
    </Head>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] md:min-h-[calc(100vh-80px)] p-8 text-center">
        
        <WifiOffIcon className="text-accent mb-4" style={{ fontSize: 60 }} />

        <h1 className="text-4xl font-bold text-accent mb-4">
          خطأ في الشبكة
        </h1>

        <p className="text-gray-600 mb-6 max-w-md">
          تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت أو المحاولة لاحقاً.
        </p>

        <Button
          variant="secondary"
          onClick={() => window.location.reload()}
          className="  flex items-center gap-2"
        >
          <RefreshIcon />
          إعادة المحاولة
        </Button>

        <Link href="/" className="mt-4">
          <Button variant="primary" className="">
            العودة للصفحة الرئيسية
          </Button>
        </Link>
      </div>
    </>
  );
}
