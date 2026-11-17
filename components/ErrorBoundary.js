// components/ErrorBoundary.js
import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "./ui/Button";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Component Error Boundary Caught:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false });
        if (this.props.onRetry) {
        this.props.onRetry();
        }
    };

    render() {
        if (this.state.hasError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border border-red-200 rounded-md text-center">
            <h2 className="text-xl font-bold text-accent mb-3">
                حدث خطأ أثناء تحميل هذا القسم. 
            </h2>
            <Button
                variant="secondary"
                onClick={this.handleRetry}
                className=" px-4 py-2   transition flex items-center justify-center"
            >
                إعادة المحاولة
                <RefreshIcon className="ml-2" />
            </Button>
            </div>
        );
        }

        return this.props.children;
    }
}
