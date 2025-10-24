// components/VatCalculator.tsx
"use client";

import { useState, useMemo, useEffect } from "react";

type Mode = "exclusive" | "inclusive";

function formatAED(v: number) {
    return (
        "AED " +
        v.toLocaleString("en-AE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );
}

export default function VatCalculator() {
    const [vatRate, setVatRate] = useState<number>(5);
    const [mode, setMode] = useState<Mode>("exclusive");
    const [amount, setAmount] = useState<number>(0);

    // which field was copied recently ("base" | "vat" | "total" | "summary" | null)
    const [copied, setCopied] = useState<string | null>(null);

    // math
    const { base, vat, total } = useMemo(() => {
        const rate = isNaN(vatRate) ? 0 : vatRate;
        const amt = isNaN(amount) ? 0 : amount;

        if (mode === "exclusive") {
            const b = amt;
            const v = b * (rate / 100);
            const t = b + v;
            return { base: b, vat: v, total: t };
        } else {
            const t = amt;
            const divisor = 1 + rate / 100;
            const b = divisor === 0 ? 0 : t / divisor;
            const v = t - b;
            return { base: b, vat: v, total: t };
        }
    }, [amount, vatRate, mode]);

    // summary text to copy in one go
    const summaryText = useMemo(() => {
        return `Base: ${formatAED(base)} | VAT: ${formatAED(
            vat
        )} | Total: ${formatAED(total)}`;
    }, [base, vat, total]);

    function copyToClipboard(text: string, label: string) {
        // Clipboard API with fallback
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(text).catch(() => {});
        } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand("copy");
            } catch (_) {}
            document.body.removeChild(ta);
        }

        setCopied(label);
    }

    // auto-clear "Copied" badge
    useEffect(() => {
        if (!copied) return;
        const id = setTimeout(() => setCopied(null), 1500);
        return () => clearTimeout(id);
    }, [copied]);

    return (
        <section className="bg-white shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
                <h1 className="text-xl font-semibold leading-tight">
                    Dubai VAT Calculator
                </h1>
                <p className="text-sm text-white/80 mt-1">
                    Calculate 5% VAT (or custom). Exclusive &amp; Inclusive. Tap result to
                    copy.
                </p>
            </header>

            {/* Body */}
            <div className="p-6 space-y-6">
                {/* VAT Rate */}
                <div>
                    <label
                        htmlFor="vatRate"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        VAT Rate (%)
                    </label>

                    <div className="relative">
                        <input
                            id="vatRate"
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-base font-medium text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={vatRate}
                            onChange={(e) => setVatRate(parseFloat(e.target.value))}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-slate-500 text-sm font-medium">
              %
            </span>
                    </div>

                    <p className="text-[13px] text-slate-500 mt-1">
                        UAE standard VAT is 5%.
                    </p>
                </div>

                {/* Mode Picker */}
                <div>
          <span className="block text-sm font-medium text-slate-700 mb-2">
            Calculation Mode
          </span>

                    <div className="grid grid-cols-2 gap-3 text-sm font-medium">
                        <button
                            type="button"
                            onClick={() => setMode("exclusive")}
                            className={[
                                "rounded-xl px-4 py-3 flex flex-col items-start shadow-sm focus:outline-none focus:ring-2",
                                mode === "exclusive"
                                    ? "border border-blue-500 bg-blue-50 text-blue-700 focus:ring-blue-500"
                                    : "border border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 focus:ring-blue-500",
                            ].join(" ")}
                        >
                            <span>Exclusive VAT</span>
                            <span className="text-[12px] font-normal leading-tight text-inherit/80">
                You enter amount <strong>before</strong> VAT.
              </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("inclusive")}
                            className={[
                                "rounded-xl px-4 py-3 flex flex-col items-start shadow-sm focus:outline-none focus:ring-2",
                                mode === "inclusive"
                                    ? "border border-blue-500 bg-blue-50 text-blue-700 focus:ring-blue-500"
                                    : "border border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 focus:ring-blue-500",
                            ].join(" ")}
                        >
                            <span>Inclusive VAT</span>
                            <span className="text-[12px] font-normal leading-tight text-inherit/80">
                You enter amount <strong>with</strong> VAT already inside.
              </span>
                        </button>
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <label
                        htmlFor="amountInput"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        {mode === "exclusive" ? (
                            <>
                                Amount{" "}
                                <span className="text-slate-400 font-normal">
                  (Excluding VAT)
                </span>
                            </>
                        ) : (
                            <>
                                Amount{" "}
                                <span className="text-slate-400 font-normal">
                  (Including VAT)
                </span>
                            </>
                        )}
                    </label>

                    <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm font-semibold select-none">
              AED
            </span>

                        <input
                            id="amountInput"
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 py-3 text-base font-medium text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            value={Number.isNaN(amount) ? "" : amount}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAmount(isNaN(val) ? 0 : val);
                            }}
                        />
                    </div>

                    <p className="text-[13px] text-slate-500 mt-1">
                        {mode === "exclusive"
                            ? "Enter net amount (before VAT)."
                            : "Enter gross amount (VAT already included)."}
                    </p>
                </div>

                {/* Results Card */}
                <div className="rounded-2xl bg-slate-100/70 border border-slate-200 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-700">Result</h2>
                            <p className="text-[13px] text-slate-500 leading-snug">
                                Tap any number to copy and paste into invoices / accounting.
                            </p>
                        </div>

                        {/* summary tap-to-copy on mobile/desktop */}
                        <button
                            type="button"
                            onClick={() => copyToClipboard(summaryText, "summary")}
                            className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-white text-slate-700 text-[13px] font-medium border border-slate-300 px-3 py-2 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.98]"
                        >
                            {copied === "summary" ? (
                                <>
                                    <CheckIcon className="h-4 w-4 text-blue-600" />
                                    <span>Copied</span>
                                </>
                            ) : (
                                <>
                                    <CopyIcon className="h-4 w-4" />
                                    <span>Copy all</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* 3 columns */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        {/* Base / net */}
                        <CopyCard
                            label="Base (No VAT)"
                            value={formatAED(base)}
                            isCopied={copied === "base"}
                            onCopy={() => copyToClipboard(base.toFixed(2), "base")}
                        />

                        {/* VAT amount */}
                        <CopyCard
                            label="VAT Amount"
                            value={formatAED(vat)}
                            isCopied={copied === "vat"}
                            onCopy={() => copyToClipboard(vat.toFixed(2), "vat")}
                        />

                        {/* Total incl VAT */}
                        <CopyCard
                            label="Total (Incl. VAT)"
                            value={formatAED(total)}
                            isCopied={copied === "total"}
                            onCopy={() => copyToClipboard(total.toFixed(2), "total")}
                        />
                    </div>

                    <p className="text-[13px] text-slate-500 mt-4 leading-relaxed break-words">
                        {summaryText}
                    </p>
                </div>
            </div>

            {/* Bottom strip */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 text-[12px] text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>VAT calculator for Dubai / UAE</span>
                <span>Tap any value to copy instantly</span>
            </div>
        </section>
    );
}

/**
 * Small card component for each number block with click-to-copy and "Copied" badge.
 */
function CopyCard({
                      label,
                      value,
                      onCopy,
                      isCopied,
                  }: {
    label: string;
    value: string;
    onCopy: () => void;
    isCopied: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onCopy}
            className="group relative text-left bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:border-blue-400 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-[0.99]"
        >
            <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wide flex items-center gap-2">
                <span>{label}</span>

                {isCopied ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 leading-none">
            <CheckIcon className="h-3 w-3 text-white" />
            Copied
          </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 leading-none group-hover:bg-blue-600 group-hover:text-white">
            <CopyIcon className="h-3 w-3" />
            Copy
          </span>
                )}
            </p>

            <p className="text-lg font-semibold text-slate-800 mt-1">{value}</p>
        </button>
    );
}

/** icons (lucide style, lightweight inline) */
function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
        >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
