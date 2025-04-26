import Link from "next/link";

// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="container h-full mx-auto p-6 items-center justify-center flex">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Page you&apos;re trying to access doesn&apos;t exist
        </h1>
        <p className="mt-4 text-lg">
          You can go back to the homepage or contact support if you think this
          is an error.
        </p>
        <Link href="/" className="mt-6 inline-block text-blue-500">
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
}
