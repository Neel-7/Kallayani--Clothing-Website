export function BrandSignature() {
  return (
    <section
      className="mx-gutter flex items-center justify-between gap-8 py-8 phone:flex-col phone:items-start phone:gap-[14px] phone:py-[26px]"
      aria-label="The Kallayani signature"
    >
      <h2 className="font-serif text-[clamp(28px,3vw,42px)] font-normal leading-[1.1] tracking-[-.025em] text-wine phone:text-[29px]">
        Heritage in every thread.
      </h2>
      <p className="text-sm leading-[1.65] text-muted">
        From the looms of Bengal and South India.
        <br />
        Chosen with care. Worn with love.
      </p>
    </section>
  );
}
