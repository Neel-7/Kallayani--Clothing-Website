import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-4 gap-x-4 gap-y-10 tablet:grid-cols-3 phone:grid-cols-2 phone:gap-x-3 phone:gap-y-7"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div className="animate-pulse" key={index}>
          <div className="aspect-[3/4] bg-soft" />
          <div className="mt-3 h-4 w-3/4 bg-soft" />
          <div className="mt-2 h-3 w-2/5 bg-soft" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton({ titleWidth = "w-52" }: { titleWidth?: string }) {
  return (
    <section className="mx-auto min-h-[65vh] max-w-[1400px] px-gutter py-12 phone:py-8">
      <div className={`h-11 ${titleWidth} animate-pulse bg-soft`} />
      <div className="mt-10">
        <ProductGridSkeleton />
      </div>
    </section>
  );
}

export function HomePageSkeleton() {
  return (
    <div aria-label="Loading Kallayani" aria-busy="true">
      <div className="grid min-h-[620px] animate-pulse grid-cols-2 bg-soft tablet:min-h-[680px] tablet:grid-cols-1">
        <div className="self-center px-gutter py-16">
          <div className="h-3 w-28 bg-line" />
          <div className="mt-6 h-16 w-4/5 bg-line" />
          <div className="mt-4 h-4 w-1/2 bg-line" />
        </div>
        <div className="bg-line/70 tablet:min-h-[360px]" />
      </div>
      <section className="px-gutter py-12">
        <ProductGridSkeleton count={4} />
      </section>
    </div>
  );
}

export function CollectionPageSkeleton() {
  return (
    <div aria-label="Loading collection" aria-busy="true">
      <div className="grid min-h-[460px] animate-pulse grid-cols-[.8fr_1.2fr] bg-soft tablet:grid-cols-1">
        <div className="self-center px-gutter py-12">
          <div className="h-12 w-48 bg-line" />
          <div className="mt-5 h-4 w-4/5 bg-line" />
        </div>
        <div className="bg-line/70 tablet:min-h-[280px]" />
      </div>
      <section className="px-gutter py-10">
        <ProductGridSkeleton count={4} />
      </section>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-[1200px] grid-cols-2 gap-[clamp(44px,6vw,88px)] px-gutter py-10 tablet:max-w-[600px] tablet:grid-cols-1">
      <div className="aspect-[3/4] animate-pulse bg-soft" />
      <div className="animate-pulse pt-8">
        <div className="h-3 w-32 bg-soft" />
        <div className="mt-6 h-14 w-4/5 bg-soft" />
        <div className="mt-5 h-4 w-24 bg-soft" />
        <div className="mt-10 h-28 w-full bg-soft" />
        <div className="mt-5 h-14 w-full bg-soft" />
      </div>
    </section>
  );
}

export function ApiErrorState({
  title = "We could not load this page.",
  message = "The catalogue may be temporarily unavailable. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-gutter text-center">
      <AlertCircle className="mb-5 text-wine" size={28} strokeWidth={1.5} />
      <h1 className="font-editorial text-[clamp(38px,5vw,58px)] font-medium leading-none">
        {title}
      </h1>
      <p className="mt-4 max-w-[48ch] text-sm leading-6 text-muted">{message}</p>
      <Button className="mt-7" type="button" onClick={onRetry}>
        <RefreshCw size={15} /> Try again
      </Button>
    </section>
  );
}
