import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  LogOut,
  User,
  Settings,
  GraduationCap,
} from "lucide-react";
import useAuthStore from "../../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-base-100 border-b border-base-300 sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link to="/feed" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <GraduationCap className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-xl font-bold text-primary font-heading hidden lg:block">
          EduConnect
        </span>
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
        <label className="input input-bordered flex items-center gap-2 rounded-full">
          <Search className="w-4 h-4 text-base-content/40" />
          <input
            type="text"
            className="grow"
            placeholder="Search users, jobs, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </form>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <Link to="/notifications" className="btn btn-ghost btn-circle">
          <Bell className="w-5 h-5" />
        </Link>
        <Link to="/chat" className="btn btn-ghost btn-circle">
          <MessageCircle className="w-5 h-5" />
        </Link>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-9 rounded-full">
              {user?.profilePic?.url ? (
                <img src={user.profilePic.url} alt={user.name} />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
          >
            <li>
              <Link
                to={`/profile/${user?._id}`}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-error"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
