"use client";

import { useState, useEffect, useRef, type FC } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import ContentWrapper from "../wrappers/ContentWrapper/ContentWrapper";
import { useRootContext } from "@/context/RootContext";

type MenuItem = {
  title: string;
  href?: string;
  onClick?: () => void;
  items?: MenuItem[];
};

const Header: FC<{ title?: string }> = ({ title = "FINTRAKR" }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isMobile } = useRootContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false); // State to manage hydration
  const drawerRef = useRef<HTMLDivElement>(null); // Ref for the drawer
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  // Configure menu items based on session
  const menuItems: MenuItem[] = [
    ...(session ? [{ title: "Home", href: "/" }] : []),
    ...(session ? [{ title: "Finances", href: "/finances" }] : []),
    session
      ? { title: "Sign Out", onClick: () => signOut() }
      : { title: "Sign In", onClick: () => signIn() },
  ];

  useEffect(() => {
    setHydrated(true); // Set hydrated to true after the component mounts
  }, []);

  useEffect(() => {
    // Function to handle clicks outside the drawer or dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsDrawerOpen(false); // Close the drawer if clicked outside
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Add event listener for clicks outside
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  if (!hydrated) {
    return null; // Return null if not hydrated to avoid hydration mismatch
  }

  if (pathname === "/login") return null;

  return (
    <header className={styles.container} role="banner">
      <ContentWrapper className={styles.wrapperCls}>
        <Link href="/">
          <div className={isMobile ? styles.titleCenter : styles.titleLeft}>
            {title}
          </div>
        </Link>

        {isMobile ? (
          <button
            className={styles.menuButton}
            onClick={() => setIsDrawerOpen(!isDrawerOpen)} // Toggle drawer visibility
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        ) : (
          <nav className={styles.nav} aria-label="Main navigation">
            {menuItems.map((item) => (
              <div key={item.title} className={styles.menuItem}>
                {item.items ? (
                  <div
                    className={styles.dropdown}
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.title ? null : item.title
                      )
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setOpenDropdown(
                          openDropdown === item.title ? null : item.title
                        );
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    ref={dropdownRef}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.title}
                    aria-label={openDropdown === item.title ? `Close ${item.title} menu` : `Open ${item.title} menu`}
                  >
                    {item.title} ▾
                    {openDropdown === item.title && (
                      <div className={styles.dropdownMenu}>
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href || "#"}
                            className={styles.dropdownItem}
                            onClick={() => setOpenDropdown(null)} // Close dropdown on item click
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.onClick ? (
                  <button
                    className={styles.navLink}
                    onClick={item.onClick} // Execute onClick if provided
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link href={item.href || "#"} className={styles.navLink}>
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}

        {isMobile && isDrawerOpen && (
          <div className={styles.drawer} ref={drawerRef}>
            <button
              className={styles.closeButton}
              onClick={() => setIsDrawerOpen(false)} // Close drawer on button click
            >
              ✕
            </button>
            {menuItems.map((item) => (
              <div key={item.title} className={styles.drawerItem}>
                {item.items ? (
                  <details>
                    <summary>{item.title}</summary>
                    <div className={styles.drawerSubmenu}>
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href || "#"}
                          className={styles.drawerLink}
                          onClick={() => setIsDrawerOpen(false)} // Close drawer on item click
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : item.onClick ? (
                  <button
                    className={styles.drawerLink}
                    onClick={() => {
                      item?.onClick?.(); // Execute onClick if provided
                      setIsDrawerOpen(false); // Close drawer after click
                    }}
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={styles.drawerLink}
                    onClick={() => setIsDrawerOpen(false)} // Close drawer on item click
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </ContentWrapper>
    </header>
  );
};

export default Header;
