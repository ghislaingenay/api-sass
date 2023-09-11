import Link from "next/link";
import React from "react";

const Header = () => {
  const navTextClass = "font-medium text-sm text-black hover:opacity-70";
  const btnNavClass =
    "font-medium text-sm text-white bg-black px-4 py-2 rounded-lg hover:opacity-70";

  const liElements = [
    {
      name: "Features",
      href: "/#features",
      className: navTextClass,
    },
    {
      name: "Pricing",
      href: "/#pricing",
      className: navTextClass,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      className: btnNavClass,
    },
  ];
  return (
    <nav className="max-w-5xl m-auto w-full p-4">
      <div className="flex items-center gap-8 justify-between py-2">
        <Link
          href="/"
          className="text-2xl font-semibold text-black hover:opacity-70"
        >
          Logo
        </Link>
        <ul className="flex items-center gap-4 list-none list-inside">
          {liElements.map(({ name, href, className }) => (
            <li key={name}>
              <Link {...{ href, className }}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
    // </header>
  );
};

export default Header;
