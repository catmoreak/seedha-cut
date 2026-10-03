import { prisma } from "@/lib/prisma";
import LetterGlitch from "@/app/components/LetterGlitch";
import BackButton from "@/app/components/BackButton";
import PageFooter from "@/app/components/PageFooter";
import LocalTime from "@/app/components/LocalTime";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    shortCode: string;
  }>;
};

const cardStyle = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6";

export default async function AnalyticsPage({ params }: PageProps) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: {
      clickRecords: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!link) {
    return (
      <>
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
          <div className="fixed inset-0 z-0">
            <LetterGlitch glitchColors={["#0f172a", "#1e293b", "#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-6">
            <div className={`${cardStyle} text-center w-full max-w-sm`}>
              <h1 className="text-2xl font-bold">Link not found</h1>
              <p className="text-gray-400 text-sm mt-2">No analytics available for this code.</p>
            </div>
            <BackButton href="/" label="Home" />
          </div>
        </main>
        <PageFooter />
      </>
    );
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-black text-white p-4 sm:p-8">
        <div className="fixed inset-0 z-0">
          <LetterGlitch glitchColors={["#0f172a", "#1e293b", "#334155"]} glitchSpeed={80} centerVignette outerVignette smooth />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <BackButton href="/" label="Back to Home" />

          <div className={cardStyle}>
            <h1 className="text-2xl font-bold text-white mb-2">Analytics for /{link.shortCode}</h1>
            <p className="text-gray-400 text-sm break-all">Original URL: {link.originalUrl}</p>
            <div className="mt-4 flex gap-6 text-sm text-gray-300">
              <div>Total Clicks: <span className="font-semibold text-white">{link.clicks}</span></div>
              {link.launchAt && <div>Launch At: <span className="font-semibold text-white"><LocalTime value={link.launchAt} /></span></div>}
              {link.expiresAt && <div>Expires At: <span className="font-semibold text-white"><LocalTime value={link.expiresAt} /></span></div>}
            </div>
          </div>

          <div className={cardStyle}>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Visits ({link.clickRecords.length})</h2>
            {link.clickRecords.length === 0 ? (
              <p className="text-gray-400 text-sm">No clicks recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Device</th>
                      <th className="py-2 px-3">Source</th>
                      <th className="py-2 px-3">Referrer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {link.clickRecords.map((click) => (
                      <tr key={click.id}>
                        <td className="py-2 px-3"><LocalTime value={click.createdAt} /></td>
                        <td className="py-2 px-3">{click.device ?? "Unknown"}</td>
                        <td className="py-2 px-3">{click.source ?? "Unknown"}</td>
                        <td className="py-2 px-3 truncate max-w-xs">{click.referrer ?? "Direct"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <PageFooter />
    </>
  );
}
