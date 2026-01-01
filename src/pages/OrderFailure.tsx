import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

const OrderFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const reason = (location.state as any)?.reason || searchParams.get("reason") || "Payment was not completed";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center">
              <XCircle className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Payment Failed</h1>
            <p className="text-muted-foreground break-words">
              {decodeURIComponent(reason)}
            </p>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>
              Don't worry, you haven't been charged. You can try again with a different payment method or retry the transaction.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              className="w-full"
              onClick={() => navigate("/checkout")}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/cart")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Cart
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderFailure;
