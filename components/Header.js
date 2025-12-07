import {  signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { WishListContext } from "@/contexts/WishListContext";
import { Menu, Close, ShoppingCart, FavoriteBorder, PersonOutline, Search, Login } from '@mui/icons-material';
import SignInModal from '@/components/modals/SignInModal';
import SearchModal from '@/components/modals/SearchModal';
import UserModal from "@/components/modals/UserModal";
import { useRouter } from "next/router";
import axiosClient from "@/lib/axiosClient";

export default function Header() {
  const { data: session, status } = useSession();
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishListContext);
  const [dropdownOpenUser, setDropdownOpenUser] = useState(false);
  const [ categories, setCategories ] = useState([]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shouldBounce, setShouldBounce] = useState(false);
  const dropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    const handleRouteChange = (url) => {
      setIsHome(url === '/');
    };

    // Check on first render
    setIsHome(router.pathname === '/');

    // Listen to route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
  useEffect(() => {
    if (cart.length > 0) {
      setShouldBounce(true);
      const timer = setTimeout(() => setShouldBounce(false), 1000); // 500ms, adjust to match bounce animation duration
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  useEffect(() => {
      if (showSearch || showSignIn || mobileMenuOpen ) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    }, [showSearch, showSignIn, mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/api/categories', {skipRedirect: true});
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpenUser(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpenUser(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('cartMigrated');
    localStorage.removeItem('cart');
    signOut(); 
  };

  return (
    <header className={`transition duration-500 ease-in-out py-4 px-6  z-50 w-full sticky top-0 ${isScrolled || mobileMenuOpen ? 'bg-primary ' : 'bg-neutral-200 '}`} dir='rtl'>
      {isHome && (
        <div className={`  ${isScrolled || mobileMenuOpen ? 'bg-primary' : 'bg-accent'}  w-24 sm:w-32 md:w-40 h-full absolute top-0 transition right-[7%] sm:right-[20%]`} />
      )}
      <div className="container mx-auto flex justify-between items-center">
        {/* User Section */}
        <div className="flex items-center gap-5">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={"md:hidden z-50 "}
            aria-label={"Open menu"}
          >
            {mobileMenuOpen ? <Close fontSize="medium"  className={'text-neutral-200 animate-rotateIn'} /> : <Menu fontSize="medium"  className={isScrolled || mobileMenuOpen ? 'text-neutral-200' : 'text-primary'} /> }
          </button>
          {/* Desktop User Menu */}
          <div className=" items-center gap-4 relative" ref={dropdownRef}>
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUser(!showUser)}
                  className="relative group"
                >
                  <PersonOutline
                  fontSize='medium'
                  className={` group-hover:text-red-400 transition ${isScrolled || mobileMenuOpen ? 'text-neutral-200' : 'text-primary'}`}
                />
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/signin')}
                className='relative group'
              >
                <PersonOutline
                  fontSize='medium'
                  className={` group-hover:text-red-400 transition ${isScrolled || mobileMenuOpen ? 'text-neutral-200' : 'text-primary'}`}
                />
              </button>
            )}
          </div>
          
          {/* Cart */}
          <Link href="/Cart" className="relative group">
            <ShoppingCart fontSize="medium" className={` group-hover:text-red-400 transition ${isScrolled || mobileMenuOpen ? 'text-neutral-200' : 'text-primary'}`} />
            {cart.length > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ${
                  shouldBounce ? "animate-bounce" : ""
                }`}
              >
                {cart.length}
              </span>
            )}
          </Link>
          {/* Wishlist */}
          <Link href="/WishList" className="relative group">
            <FavoriteBorder fontSize="medium" className={` group-hover:text-red-400 transition ${isScrolled || mobileMenuOpen ? 'text-neutral-200' : 'text-primary'}`} />
            {wishlist.length > 0 && (
              <span
                className={"absolute -top-2 -right-2 bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            className='relative group'
            onClick={() => setShowSearch(true)}
          >
            <Search
              fontSize='medium'
              className={` group-hover:text-red-400 transition ${isScrolled || mobileMenuOpen ? 'text-neutral-200' : 'text-primary'}`}
            />

          </button>


          


        </div>
        

        {/* Center Navigation (Desktop only) */}
        <nav className={`hidden md:flex gap-8 text-xl ${isScrolled || mobileMenuOpen ? 'text-neutral-200' : 'text-primary'}`}>
          <Link href="/" className="hover:text-red-400 transition">الرئيسية</Link>
          <Link href="/Products" className="hover:text-red-400 transition">المنتجات</Link>
          {categories.length > 0 && categories.map((category) => (
            <Link 
              key={category._id} 
              href={`/Products?category=${category._id}`} 
              className="hover:text-red-400  transition"
            >{category.name}</Link>
          ))}
        </nav>

        
          <div className="flex items-center gap-4">
            {/* logo + text */}
            <Link href="/">
              <svg
                className={`transition md:h-12 md:w-24 max-md:h-10 max-md:w-20`}
                viewBox="0 0 2100 1000"
                fill="none"
              >
                <g>
                  <path
                    className={`transition ${isScrolled || mobileMenuOpen ? 'fill-neutral-200' : 'fill-accent'}`}
                    d="m 697.61101,27.11885 -22.59794,0.0864 c 4.59031,31.913398 -1.7116,31.256239 -1.7116,31.256239 -55.43673,14.472302 -66.38303,28.2024 -66.38303,27.83134 0,-0.371109 -0.353,0.370924 -0.353,0.370924 L 498.50923,185.27529 388.10076,87.217641 c 0,0 -0.35317,-0.74264 -0.35312,-0.37158 2e-4,0.371099 -10.94781,-13.356784 -66.38704,-27.819579 0,0 -6.46482,0.08786 -1.87953,-31.826308 l -22.43531,0.03177 c 0,0 -6.75576,46.271945 -10.6287,119.747256 0,0 3.54158,68.65009 22.96975,118.00099 l 33.90872,70.12959 c 0,0 24.01767,45.26814 26.84976,91.65311 0,0 15.54462,50.46578 -23.9889,139.53273 l -33.5428,12.9932 185.73587,388.75236 0.51588,1.07966 v 0 0 l 0.52256,-1.11363 182.74135,-389.2846 -33.5451,-12.98751 c -39.54704,-89.06047 -24.01037,-139.52836 -24.01037,-139.52836 2.82495,-46.38572 26.83541,-91.65825 26.83541,-91.65825 l 33.89779,-70.13552 c 19.42049,-49.35406 22.9516,-118.00405 22.9516,-118.00405 C 704.37475,72.933771 697.61101,27.118849 697.61101,27.11885 Z" 
                  />
                  <path
                    className={`transition ${isScrolled || mobileMenuOpen ? 'stroke-neutral-200' : 'stroke-accent'}`}
                    strokeWidth="40"
                    d="M 21.322189,13.147509 978.60091,13.101063 498.86534,970.63708 Z"
                  />
                  <text
                    className={`fill-accent translate-y-[919px] transition duration-500 ease-in-out
                      ${ isScrolled || mobileMenuOpen ? '-translate-x-[4000px] opacity-0': 'translate-x-[2100px] opacity-100'}
                    `}
                    fontSize="625.618"
                    fontFamily="'Microsoft Sans Serif', sans-serif"
                  >

                    <tspan
                      className='translate-x-[746px] translate-y-[919px]'
                    >
                      enus
                    </tspan>
                  </text>
                </g>
              </svg>
            </Link>

          </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-neutral-200  fixed  pt-20 h-[calc(100vh-73px)] overflow-y-auto w-screen top-[72px] left-0 z-50 animate-slideFromLeft ">
          <div className="flex items-center justify-between absolute top-0 w-full p-5">
            {session && (
              <div className="text-2xl font-bold bg-neutral-200 absolute top-6 left-1/2 transform -translate-x-1/2 text-accent">{session.user.name}</div>
            )}
          </div>
          <div className="flex p-1 pb-4 flex-col gap-4 text-2xl  [&>*]:w-full [&>*]:pt-6  [&>*]:pr-8  w-full items-center justify-start ">

            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              الرئيسية
            </Link>
            <Link href="/Products"onClick={() => setMobileMenuOpen(false)}>
              كل المنتجات
            </Link>
            {categories.length > 0 && categories.map((category) => (
              <Link 
                key={category._id} 
                href={`/Products?category=${category._id}`} 
                onClick={() => setMobileMenuOpen(false)}
                
              >{category.name}</Link>
            ))}
            <Link href="/ContactUs" onClick={() => setMobileMenuOpen(false)}>
              تواصل معنا 
            </Link>
            {session ? (
              <>
                <Link href="/Orders" onClick={() => setMobileMenuOpen(false)}>
                  الطلبات السابقة
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  router.push('/signin');
                  setMobileMenuOpen(false);
                }}
                className="pl-8"
              >
                تسجيل الدخول
                <Login className="text-3xl mr-2" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SignIn Modal */}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      {/* SignIn Modal */}
      {showUser && <UserModal onClose={() => setShowUser(false)} />}
      {/* Search Modal */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </header>
  );
}
