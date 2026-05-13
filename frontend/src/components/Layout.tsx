import {
  ClipboardList,
  LogIn,
  LogOut,
  PackageSearch,
  ShoppingCart,
  ShieldCheck,
  TicketPercent
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">SQA</span>
          <span>
            <strong>E-commerce Mini</strong>
            <small>System demo for software quality assurance</small>
          </span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/">
            <PackageSearch size={18} />
            San pham
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/cart">
                <ShoppingCart size={18} />
                Gio hang
              </NavLink>
              <NavLink to="/orders">
                <ClipboardList size={18} />
                Don hang
              </NavLink>
            </>
          )}
          {user?.role === "ADMIN" && (
            <>
              <NavLink to="/admin/products">
                <ShieldCheck size={18} />
                Admin san pham
              </NavLink>
              <NavLink to="/admin/orders">
                <ClipboardList size={18} />
                Admin don
              </NavLink>
              <NavLink to="/admin/vouchers">
                <TicketPercent size={18} />
                Voucher
              </NavLink>
            </>
          )}
        </nav>

        <div className="account-tools">
          {isAuthenticated ? (
            <>
              <span className="account-chip">{user?.name}</span>
              <button className="icon-button" type="button" onClick={logout} title="Dang xuat">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link className="icon-link" to="/login" title="Dang nhap">
              <LogIn size={18} />
              Dang nhap
            </Link>
          )}
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
