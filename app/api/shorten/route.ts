import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

const reservedAliases = [
  "api",
  "dashboard",
  "analytics",
  "admin",
  "login",
  "signup",
  "settings",
];

const aliasPattern = /^[A-Za-z0-9_-]{3,32}$/;

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function parseDate(value: unknown): Date | null | "invalid" {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? "invalid" : date;
}

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const { url, customAlias } = body;

    if (typeof url !== "string" || !url.trim()) {
      return badRequest("URL is required");
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.trim());
    } catch {
      return badRequest("Please enter a valid URL");
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return badRequest("Only http and https links can be shortened");
    }

    const launchAt = parseDate(body.launchAt);
    const expiresAt = parseDate(body.expiresAt);

    if (launchAt === "invalid") return badRequest("Invalid launch time");
    if (expiresAt === "invalid") return badRequest("Invalid expiry time");

    const now = new Date();

    if (launchAt && launchAt < now) {
      return badRequest("Launch time cannot be in the past");
    }

    if (expiresAt && expiresAt < now) {
      return badRequest("Expiry time cannot be in the past");
    }

    if (launchAt && expiresAt && expiresAt <= launchAt) {
      return badRequest("Expiry time must be after launch time");
    }

    const alias = typeof customAlias === "string" ? customAlias.trim() : "";

    if (alias && !aliasPattern.test(alias)) {
      return badRequest("Alias must be 3-32 characters: letters, numbers, - or _");
    }

    if (alias && reservedAliases.includes(alias.toLowerCase())) {
      return badRequest("This alias is reserved");
    }

    const shortCode = alias || nanoid(6);

    const existingAlias = await prisma.link.findUnique({
      where: {
        shortCode,
      },
    });

    if (existingAlias) {
      return badRequest("Alias already taken");
    }

    const newLink = await prisma.link.create({
      data: {
        originalUrl: parsedUrl.toString(),
        shortCode,
        launchAt,
        expiresAt,
      },
    });

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/+$/, "");

    return NextResponse.json({
      shortUrl: `${baseUrl}/${newLink.shortCode}`,
      shortCode: newLink.shortCode,
      originalUrl: newLink.originalUrl,
      launchAt: newLink.launchAt,
      expiresAt: newLink.expiresAt,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }

}