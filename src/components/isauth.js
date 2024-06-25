import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

export default function WithAuth(Component) {
  return function WithAuth(props) {
    const token = getCookie("token");
    useEffect(() => {
      if (!token) {
        return redirect("/login");
      }
    }, [token]);

    if (!token) {
      return null;
    }

    return <Component {...props} />;
  };
}
