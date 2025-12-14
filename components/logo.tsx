import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

const Logo = ({width=26, height=26}) => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image width={width} height={height} src={logo} alt="logo" />
      <span className="text-lg font-bold tracking-tight">
        <span className="text-blue-500 font-extrabold text-xl">PR</span>
        <span className="underline">izm</span>
      </span>
    </Link>
  );
};

export default Logo;
