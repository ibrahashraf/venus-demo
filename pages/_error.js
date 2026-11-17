import Link from "next/link";
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from "@/components/ui/Button";

export default function Error({ statusCode }) {
  return (
        <div className="flex flex-col items-center justify-center  min-h-[calc(100vh-73px)] md:min-h-[calc(100vh-80px)] p-8 text-center">
            <h1 className="text-4xl font-bold text-accent mb-4">
                {statusCode
                ? `خطأ ${statusCode}`
                : 'حدث خطأ غير متوقع'}
            </h1>
            <p className="text-gray-600 mb-6">
                عذراً! حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة لاحقاً.
            </p>
            <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className=""
            >
                حاول مرة أخرى
                <RefreshIcon className="mr-2" />
            </Button>
            <Link href="/">
                <Button variant="primary" className=" mt-4">
                    العودة للصفحة الرئيسية
                </Button>
            </Link>
        </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
