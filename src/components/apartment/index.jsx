import Customer from "../cusomter";
import NavBar from "../navbar/navbar";
import { useState } from "react";
import Plans from "../plans";
import WashLogs from "../washLog";
import Invoice from "../invoice";
import Subscriptions from "../subscription";

const Apartment = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const components = [<WashLogs />, <Customer />, <Plans />, <Invoice />, <Subscriptions/>];

  return (
    <>
      <NavBar onMenuSelect={setSelectedIndex} />
      <div style={{ padding: "16px" }}>
        {components[selectedIndex]}
      </div>
    </>
  );
};

export default Apartment;
