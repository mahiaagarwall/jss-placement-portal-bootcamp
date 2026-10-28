import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <p className="font-heading text-6xl font-bold text-primary">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        <code>{pathname}</code> is not a valid address.
      </p>
      <Button asChild><Link to="/">Back to all companies</Link></Button>
    </div>
  );
};

export default NotFound;
