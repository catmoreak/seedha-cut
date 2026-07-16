import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    shortCode: string;
  }>;
};

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;
   
  const link = await prisma.link.findUnique({
    where: {
      shortCode,
    },
  });

  if (!link) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black">
        <h1 className="text-3xl font-bold">404 - Link Not Found</h1>
      </div>
    );
  }
  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          This link has expired.
        </h1>
      </div>
    );
  }

  
  await prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  redirect(link.originalUrl);
}