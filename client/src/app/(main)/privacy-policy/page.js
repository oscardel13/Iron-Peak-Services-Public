import Hero from "@/components/hero/hero.component";
import METADATA from "@/data/data";

export const metadata = {
  title: "Privacy Policy | Iron Peak Services",
  description:
    "Read the Privacy Policy for Iron Peak Services, outlining how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero so navbar doesn’t overlap */}
      <Hero>
        <div className="relative max-w-3xl mx-auto text-center space-y-4 px-4">
          <p className="text-sm tracking-[0.28em] text-gray-200 uppercase">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-100">
            How Iron Peak Services collects, uses, and protects your
            information.
          </p>
        </div>
      </Hero>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10 bg-white text-gray-800">
        <p className="text-gray-700">
          Last updated: {new Date().getFullYear()}
        </p>

        <p>
          Iron Peak Services (“we”, “our”, or “us”) is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you visit our website or
          contact us for services.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            1. Information We Collect
          </h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              Personal details such as name, phone number, and email address
            </li>
            <li>
              Project information you provide through forms or contact requests
            </li>
            <li>
              Usage data such as IP address, device info, and browsing activity
            </li>
            <li>Any information voluntarily submitted to us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            2. How We Use Your Information
          </h2>
          <p>We use collected information to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Provide quotes or respond to project inquiries</li>
            <li>Improve our website, services, and customer experience</li>
            <li>Communicate updates or follow-ups related to your inquiry</li>
            <li>Maintain internal records</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            3. Sharing Your Information
          </h2>
          <p>
            We do not sell your information. We may share data with trusted
            service providers who assist us (such as email or hosting services),
            or when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            4. Cookies & Tracking
          </h2>
          <p>
            We may use cookies or analytics tools to understand website traffic
            and improve performance. You can disable cookies in your browser
            settings if you prefer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            5. Data Security
          </h2>
          <p>
            We take reasonable measures to protect your information, but no
            internet transmission is 100% secure. We do not store sensitive
            financial data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            6. Your Rights
          </h2>
          <p>You may request:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>A copy of the personal data we have about you</li>
            <li>Correction or deletion of your information</li>
            <li>To opt out of communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-brand-text-primary">
            7. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or your personal
            data, contact us at:
          </p>
          <div className="mt-3 space-y-1">
            <p>📍 Denver, CO</p>
            <p>📞 {METADATA.phone}</p>
            <p>✉️ {METADATA.email}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
