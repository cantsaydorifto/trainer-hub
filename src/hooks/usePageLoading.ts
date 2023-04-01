import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const usePageLoading = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const routeEventStart = () => {
      setIsPageLoading(true);
    };
    const routeEventEnd = () => {
      setIsPageLoading(false);
    };

    Router.events.on("routeChangeStart", routeEventStart);
    Router.events.on("routeChangeComplete", routeEventEnd);
    Router.events.on("routeChangeError", routeEventEnd);
    return () => {
      Router.events.off("routeChangeStart", routeEventStart);
      Router.events.off("routeChangeComplete", routeEventEnd);
      Router.events.off("routeChangeError", routeEventEnd);
    };
  }, []);

  useEffect(() => {
    const rootElement = document.getElementById("__next");
    if (rootElement) {
      if (
        router.pathname === "/pokedex" ||
        router.pathname === "/pokedex/start"
      ) {
        rootElement.className = "root-2";
      } else {
        rootElement.className = "root";
      }
    }
  }, [router.pathname]);

  const loaderRoutes = ["/pokedex/all", "/pokedex/start"];

  const loadOnRoutes = loaderRoutes.includes(router.pathname);

  return { isPageLoading: isPageLoading && loadOnRoutes };
};
