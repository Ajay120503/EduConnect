import { NavLink } from "react-router-dom";
import { Home, Compass, Briefcase, User, PlusCircle } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useState } from "react";
import CreatePostModal from "../post/CreatePostModal";

const BottomNav = () => {
  const { user } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const navItems = [
    { to: "/feed", icon: Home, label: "Home" },
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/jobs", icon: Briefcase, label: "Jobs" },
    { to: `/profile/${user?._id}`, icon: User, label: "Profile" },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-50 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                  isActive ? "text-primary" : "text-base-content/50"
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}

          {/* Center Create Post Button */}
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex flex-col items-center gap-1 px-4 py-1 -mt-6"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-focus transition-all">
              <PlusCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-medium text-primary mt-1">Post</span>
          </button>

          {navItems.slice(2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                  isActive ? "text-primary" : "text-base-content/50"
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} />
      )}
    </>
  );
};

export default BottomNav;
