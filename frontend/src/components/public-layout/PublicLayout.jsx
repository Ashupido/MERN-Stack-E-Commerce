import { Outlet, useLocation } from 'react-router-dom';
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import MobileBottomNav from '../common/MobileBottomNav';

export default function PublicLayout() {
  const location = useLocation();
  const isRoleArea = ['/admin', '/seller', '/manager'].some((prefix) => location.pathname.startsWith(prefix));

  if (isRoleArea) {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-[4.75rem] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
