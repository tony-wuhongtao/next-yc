import HomeHero from "@/components/HomeHero";
import { prisma } from "@/utils/db";

export const revalidate = 0; // 强制每次访问都重新获取数据

const HomePage = async () => {
  // 获取访问用户数（去重IP）
  const uniqueUsers = await prisma.log.groupBy({
    by: ["ip"],
    _count: {
      _all: true,
    },
  });

  // 获取访问次数（总条数）
  const totalVisits = await prisma.log.count();

  return (
    <div>
      <HomeHero />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-2 md:p-6">
            <div className="flex gap-2 md:gap-6 justify-center">
              <div className="flex items-center gap-4 bg-base-200 p-4 rounded-lg w-64">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <div>
                  <div className="text-base text-gray-500">访问用户</div>
                  <div className="text-2xl font-bold text-center">
                    {uniqueUsers.length}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-base-200 p-6 rounded-lg w-64">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <div>
                  <div className="text-base text-gray-500">访问次数</div>
                  <div className="text-2xl font-bold text-center">
                    {totalVisits}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
