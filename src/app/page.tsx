
import Header from "@/components/Header";
import SearchBar from "@/components/search-bar";
import Listings from "@/components/listings";

export type Job = {
  _id: string | null | undefined;
  job_title: string;
  company_name: string;
  job_location: string;
  apply_link: string;
  job_description: string;
  source: string;
  created_at: string;
};

export type SearchKeyword = {
  keyword: string;
  count: number;
};

export default async function JobBoard({
  searchParams: SEARCH_PARAMS,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const searchParams = await SEARCH_PARAMS

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sticky header for mobile and desktop */}
      <header className=" bg-white/80 backdrop-blur shadow-sm">
        <Header />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* SearchBar is mobile-friendly */}
        <SearchBar />

        {/* Listings layout should handle various screen sizes */}
        <Listings searchParams={searchParams} />
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
}
