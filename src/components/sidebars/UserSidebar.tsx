import useMeStore from "@/zustand/useMeStore";
import React from "react";
import { NavLink } from "react-router-dom";
import NavUser from "./NavUser";
const UserSidebar = () => {
  const { me, logout } = useMeStore();
  return (
    <div className="lg:col-start-1 lg:col-span-3">
      <ul className="tab-links lg:mr-30px border border-b-0 border-border-color-1">
        {NavUser.map((el) => (
          <li className="border-b border-border-color-1" key={el.id}>
            <NavLink
              to={el.path}
              className={({ isActive }) =>
                `flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize ${
                  isActive ? "bg-black !text-white" : ""
                }`
              }
            >
              <span className="leading-1.8 lg:leading-1.8">{el.label}</span>
              {el.icon}
            </NavLink>
          </li>
        ))}
        <li className="border-b border-border-color-1">
          <button
            onClick={() => logout()}
            className="flex justify-between items-center px-5 py-15px w-full text-sm lg:text-base hover:text-secondary-color transition-all duration-300 capitalize"
          >
            <span className="leading-1.8 lg:leading-1.8">Logout </span>
            <i className="fas fa-sign-out-alt text-sm"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
