import Customer from "../cusomter";
import NavBar from "../navbar/navbar";
import { useState } from "react";
import Plans from "../plans";
import WashLogs from "../washLog";

// Components for each menu item
const CarWashLogs = () => <div>Car Wash Logs Component</div>;
// const Customer = () => <div>Customer Component</div>;
// const Plan = () => <div>Plan Component</div>;
const Invoices = () => <div>Invoices Component</div>;

const Apartment = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const components = [<WashLogs />, <Customer />, <Plans />, <Invoices />];

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
