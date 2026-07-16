import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, customSlug, expiresAt } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }
 
    let shortCode = customSlug ? customSlug.trim() : "";

    if (shortCode) {
      const validSlugRegex = /^[a-zA-Z0-9_-]+$/;
      if (!validSlugRegex.test(shortCode)) {
        return NextResponse.json(
          { error: "Custom slug can only contain letters, numbers, hyphens, and underscores" },
          { status: 400 }
        );
      }

      const existing = await prisma.link.findUnique({
        where: { shortCode },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Custom slug is already in use" },
          { status: 400 }
        );
      }
    } else {
      shortCode = nanoid(6);
    }

    let expiryDate: Date | null = null;
    if (expiresAt) {
      expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiration date" },
          { status: 400 }
        );
      }
    }

    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode: shortCode,
        expiresAt: expiryDate,
      },
    });

    const urlObj = new URL(request.url);
    const origin = urlObj.origin;

    return NextResponse.json({
      shortCode: newLink.shortCode,
      shortUrl: `${origin}/${newLink.shortCode}`,
      originalUrl: newLink.originalUrl,
      expiresAt: newLink.expiresAt,
    });

  } catch (error) {
    console.error("[POST /api/shorten]", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
