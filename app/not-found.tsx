import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center gap-5 py-24 text-center">
      <p className="tnum text-[48px] font-semibold leading-none tracking-tight">404</p>
      <h1 className="text-[17px] font-medium">This link does not exist.</h1>
      <p className="max-w-sm text-[12.5px] leading-relaxed text-ink2">
        It may have been deleted, or the slug was never claimed. Create your own short link in
        seconds.
      </p>
      <div className="flex gap-3">
        <Link href="/#shorten" className="btn btn-primary">
          Shorten a link
        </Link>
        <Link href="/" className="btn btn-ghost">
          Go home
        </Link>
      </div>
    </div>
  );
}
