// app/page.tsx
import VatCalculator from "@/components/VatCalculator";

export default function HomePage() {
    return (
        <main className="w-full max-w-xl">
            <VatCalculator />

            <footer className="text-[12px] text-slate-500 text-center mt-8 leading-relaxed">
                <p>UAE / Dubai VAT Calculator • Default 5% VAT • Free to use</p>
                <p>Not official tax advice. Please confirm with your accountant.</p>
            </footer>
        </main>
    );
}
