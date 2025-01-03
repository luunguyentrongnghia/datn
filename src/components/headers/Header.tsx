import { pathnames } from "@/lib/pathnames";
import { generateDefaultAvatar } from "@/lib/utils";
import useMeStore from "@/zustand/useMeStore";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import Image from "../layous/Image";
import menu from "./menu";
import useStickyHeader from "./useStickyHeader";
import slugify from "slugify";
import useAppStore from "@/zustand/useAppStore";
import { toast } from "sonner";
const Header = () => {
  const navigate = useNavigate();
  const { me, logout } = useMeStore();
  const stickyHeaderRef = useStickyHeader();
  const { propetyTypeBuy, propetyTypeLease } = useAppStore();
  const NavigateCreateProperty = () => {
    if (me) {
      navigate(pathnames.users.Layout + pathnames.users.createPost);
    } else {
      toast.error("Yêu cầu đăng nhập");
    }
  };
  return (
    <header className="shadow-md">
      <div className="bg-section-bg-6">
        <div className="container text-white text-13px md:text-sm font-bold">
          <div className="flex justify-center md:justify-between items-center flex-wrap md:flex-nowrap">
            <div className="flex justify-center md:block pt-2 md:pt-0">
              <ul className="basis-full md:basis-auto flex gap-6 lg:gap-9 items-center">
                <li>
                  <a
                    className="hover:text-secondary-color"
                    href="mailto:info@webmail.com?Subject=Flower%20greetings%20to%20you"
                  >
                    <i className="fa-regular fa-envelope text-secondary-color font-bold mr-0.5"></i>
                    Luutrongnghia281102@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-secondary-color"
                    href="locations.html"
                  >
                    <i className="fa-solid fa-location-dot text-secondary-color font-bold mr-0.5"></i>
                    Tam kỳ ,Quảng Nam
                  </a>
                </li>
              </ul>
            </div>
            <div className="basis-full md:basis-auto flex justify-center md:block py-5px md:py-0">
              <ul className="text flex items-center gap-15px">
                <li>
                  <a href="https://www.facebook.com/" title="Facebook">
                    <i className="fab fa-facebook-f font-bold"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.x.com/" title="Twitter">
                    <i className="fab fa-twitter font-bold"></i>
                  </a>
                </li>

                <li>
                  <a href="https://www.instagram.com/" title="Instagram">
                    <i className="fab fa-instagram font-bold"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.dribbble.com/" title="Dribbble">
                    <i className="fab fa-dribbble font-bold"></i>
                  </a>
                </li>
                <li>
                  <p
                    onClick={NavigateCreateProperty}
                    className="text-white cursor-pointer px-4 md:px-5 py-0.5px md:py-10px ml-2 lg:ml-5 bg-secondary-color inline-block bg-opacity-100 hover:bg-opacity-60 hover:text-white"
                  >
                    Đăng tin
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className="sticky-header z-small bg-white transition-all duration-700 "
        ref={stickyHeaderRef}
      >
        <div className="container flex flex-col md:flex-row justify-center md:justify-between items-center relative py-21px">
          <div className="mt-10px mb-22px md:mt-0 md:mb-0 leading-1">
            <Link to={pathnames.publics.Layout}>
              <img src="/public/logo.png" alt="" />
            </Link>
          </div>
          <nav className="flex-grow hidden xl:block">
            <ul className="flex items-center justify-center gap-15px xl:gap-5">
              <li className="relative group">
                <Link
                  to={"/"}
                  className="text-lg xl:text-15px 2xl:text-lg text-heading-color hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px"
                >
                  Trang chủ
                </Link>
              </li>
              <li className="relative group">
                <Link
                  to={
                    pathnames.publics.Layout +
                    pathnames.publics.property +
                    "bán"
                  }
                  state={{ listingType: "bán" }}
                  className="text-lg xl:text-15px 2xl:text-lg text-heading-color hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px"
                >
                  Mua bán
                </Link>
                <ul className="py-15px border-t-[5px] border-secondary-color bg-white w-dropdown shadow-box-shadow-4 absolute left-0 top-full opacity-0 invisible translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-xl">
                  {propetyTypeBuy.map((el) => (
                    <li key={el.id} className="group/nested relative">
                      <Link
                        className="whitespace-nowrap px-30px py-2"
                        to={
                          pathnames.publics.property +
                          slugify(el.listingType, {
                            lower: true,
                            strict: true,
                          }) +
                          "/" +
                          el.id
                        }
                      >
                        {el.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="relative group">
                <Link
                  to={pathnames.publics.property + "cho thuê"}
                  state={{ listingType: "cho thuê" }}
                  className="text-lg xl:text-15px 2xl:text-lg text-heading-color hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px"
                >
                  Cho thuê
                </Link>
                <ul className="py-15px border-t-[5px] border-secondary-color bg-white w-dropdown shadow-box-shadow-4 absolute left-0 top-full opacity-0 invisible translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-xl">
                  {propetyTypeLease.map((el) => (
                    <li key={el.id} className="group/nested relative">
                      <Link
                        className="whitespace-nowrap px-30px py-2"
                        to={
                          pathnames.publics.property +
                          slugify(el.listingType, {
                            lower: true,
                            strict: true,
                          }) +
                          "/" +
                          el.id
                        }
                        state={{ property_type_id: el.id }}
                      >
                        {el.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <div>
            <ul className="flex items-center gap-10px">
              <li className="group relative ">
                <a
                  href="#"
                  className={clsx(
                    "h-50px w-50px rounded-md text-heading-color shadow-box-shadow-1 flex justify-center items-center transition-all duration-300",
                    !me?.avatar && "hover:bg-secondary-color hover:text-white"
                  )}
                >
                  {!me ? (
                    <i className="fa-regular fa-user font-bold text-lg"></i>
                  ) : (
                    <Image
                      fallbackSrc={generateDefaultAvatar(me.fullname)}
                      src={me.avatar}
                      className="rounded-full h-[80%] w-[80%]"
                    />
                  )}
                </a>
                <ul className="py-10px mt-3 w-150px rounded-md shadow-box-shadow-4 absolute right-0 top-full opacity-0 invisible translate-y-4 bg-white transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-xl">
                  {!me ? (
                    <>
                      <li>
                        <Link
                          to={"login"}
                          className="whitespace-nowrap px-15px py-5px"
                        >
                          Sign in
                        </Link>
                      </li>
                      <li>
                        <a
                          className="whitespace-nowrap px-15px py-5px"
                          href={"register"}
                        >
                          Register
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      {menu.map((el) => (
                        <li key={el.id}>
                          <Link
                            className="whitespace-nowrap px-15px py-5px"
                            to={el.path}
                          >
                            {el.label}
                          </Link>
                        </li>
                      ))}
                      <li
                        onClick={() => logout()}
                        className=" whitespace-nowrap px-15px py-5px cursor-pointer"
                      >
                        <i className="mx-2 fa-solid fa-right-from-bracket"></i>
                        Đăng xuất
                      </li>
                    </>
                  )}
                </ul>
              </li>
              <li className="block xl:hidden">
                <div className="show-drawer d-xl-none h-50px w-50px text-heading-color shadow-box-shadow-1 flex justify-center items-center transition-all duration-300 relative">
                  <a href="#ltn__utilize-drawer " className="utilize-toggle">
                    <svg viewBox="0 0 800 600">
                      <path
                        d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200"
                        id="top"
                      ></path>
                      <path d="M300,320 L540,320" id="middle"></path>
                      <path
                        d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190"
                        id="bottom"
                        transform="translate(480, 320) scale(1, -1) translate(-480, -318) "
                      ></path>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
