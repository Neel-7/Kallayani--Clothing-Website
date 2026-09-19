import { Link } from "react-router-dom";
import { LotusMark } from "./BrandMotif";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`inline-flex w-max items-center gap-2.5 tablet:gap-[7px] ${light ? "text-white hover:underline" : "text-wine"}`}
      aria-label="Kallayani home"
    >
      <LotusMark
        className="h-[27px] w-[35px] shrink-0 overflow-visible tablet:h-[25px] tablet:w-[34px]"
        cutout={light ? "#171412" : "#fff"}
        aria-hidden="true"
      />
      <span className="font-brand text-[clamp(32px,1.9vw,37px)] font-semibold leading-none tracking-[-.035em] tablet:text-[32px]">
        Kallayani
      </span>
    </Link>
  );
}
