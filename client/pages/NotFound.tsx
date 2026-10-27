import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import Layout from "@/components/site/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex min-h-[60vh] items-center bg-gradient-to-b from-violet-50/60 to-white">
        <div className="container py-16 text-center">
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Oops! Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
            The page <span className="font-mono text-foreground/80">{location.pathname}</span> doesn't exist or has moved.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Button asChild>
              <Link to="/">
                <ArrowLeft /> Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/courses">
                <BookOpen /> Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
