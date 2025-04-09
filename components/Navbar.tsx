"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

function Navbar() {
  const links = [
    { href: "/", label: "首页" },
    { href: "/MBTI", label: "MBTI测试" },
    { href: "/pollinations/image", label: "AI文生图" },
    { href: "/Catmeows", label: "喵语" },
    { href: "/News", label: "AI推送每日新闻" },
    // { href: "/pollinations/cn2en", label: "AI中英互译" },
  ];
  const pathname = usePathname();
  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-item text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">耀乘出品</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-item text-sm ${
                  pathname === link.href ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <Link href="/" className="btn">
          首页
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
