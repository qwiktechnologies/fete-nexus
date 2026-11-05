export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">404</p>
      <h1 className="mt-3 text-4xl text-navy-900">That page has moved on</h1>
      <a href="/" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-navy-900 px-5 font-bold text-white">Back home</a>
    </div>
  );
}
