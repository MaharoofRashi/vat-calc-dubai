// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Dubai VAT Calculator (5%) | Free UAE VAT Tool",
    description:
        "Free Dubai & UAE VAT calculator. Calculate 5% VAT, exclusive or inclusive, get instant breakdown, and tap to copy values for invoicing or accounting.",
    keywords: [
        "Dubai VAT calculator",
        "UAE VAT 5%",
        "VAT exclusive",
        "VAT inclusive",
        "invoice calculator",
        "tax calculator UAE",
        "TRN VAT",
    ],
    openGraph: {
        title: "Dubai VAT Calculator (5%)",
        description:
            "Instant 5% VAT calculation for Dubai and UAE. Works with exclusive and inclusive amounts.",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "https://vat-calc.supremeservices.ae/",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="bg-slate-50 text-slate-800 antialiased">
        <body className="min-h-screen flex items-center justify-center p-4">
        {children}
        </body>
        </html>
    );
}
