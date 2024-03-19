import { Outlet } from "react-router";
import { Header } from "../Header";

export const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
