import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function CheckPosition(Component) {
  return function CheckPosition(props) {
    const positionId = useSelector((state) => state.id.position_id);
    useEffect(() => {
      if (!positionId) {
        return redirect("/");
      }
    }, [positionId]);

    if (!positionId) {
      return null;
    }

    return <Component {...props} />;
  };
}
