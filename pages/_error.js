import Link from "next/link";
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from "@/components/ui/Button";

export default function Error({ statusCode }) {
  return (
        <div className="flex flex-col items-center justify-center  min-h-[calc(100vh-73px)] md:min-h-[calc(100vh-80px)] p-8 text-center">
            <h1 className="text-4xl font-bold text-accent mb-4">
                {statusCode
                ? `Error ${statusCode}`
                : 'An unexpected error occurred'}
            </h1>
            <p className="text-gray-600 mb-6">
                Sorry! An error occurred while loading the page. Please try again later.
            </p>
            <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className=""
            >
                Try Again
                <RefreshIcon className="mr-2" />
            </Button>
            <Link href="/">
                <Button variant="primary" className=" mt-4">
                    Return to Home Page
                </Button>
            </Link>
        </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
