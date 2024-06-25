import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function CheckService(Component) {
  return function CheckService(props) {
    const serviceId = useSelector((state) => state.id.service_id);
    useEffect(() => {
      if (!serviceId) {
        return redirect("/");
      }
    }, [serviceId]);

    if (!serviceId) {
      return null;
    }

    return <Component {...props} />;
  };
}
