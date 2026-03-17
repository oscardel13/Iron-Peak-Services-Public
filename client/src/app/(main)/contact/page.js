// app/contact/page.jsx (or wherever this file lives)
"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Hero from "@/components/hero/hero.component";
import METADATA from "@/data/data";
import { postAPI } from "@/utils/api";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

export default function ContactPage() {
  const [formFields, setFormFields] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    token: "",
  });
  const [submitStatus, setSubmitStatus] = useState("none"); // none | loading | true | false
  const [formDisabled, setFormDisabled] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [files, setFiles] = useState([]); // <--- attachments state
  const captchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Only digits
      let digits = value.replace(/\D/g, "");

      // Format as xxx-xxx-xxxx
      if (digits.length > 3 && digits.length <= 6)
        digits = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      else if (digits.length > 6)
        digits = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
          6,
          10,
        )}`;

      setFormFields((prev) => ({ ...prev, [name]: digits }));
    } else {
      setFormFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onCaptchaChange = (token) => {
    setFormFields((prev) => ({ ...prev, token: token || "" }));
  };
  const onCaptchaExpired = () =>
    setFormFields((prev) => ({ ...prev, token: "" }));
  const onCaptchaError = () =>
    setFormFields((prev) => ({ ...prev, token: "" }));

  const clearForm = () => {
    setFormFields({ name: "", phone: "", email: "", message: "", token: "" });
    setFiles([]);
  };

  // Handle file input change
  const handleFilesChange = (e) => {
    const fileList = Array.from(e.target.files || []);
    // You can enforce limits here if you want:
    // e.g., max 5 files, max 5MB each
    const maxFiles = 5;
    const maxSizeBytes = 5 * 1024 * 1024;

    const filtered = fileList.filter((file) => file.size <= maxSizeBytes);
    const limited = filtered.slice(0, maxFiles);
    setFiles(limited);
  };

  // Helper to convert a File to base64 string (no data: prefix)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result || "";
        // result looks like "data:image/png;base64,AAAA..."
        const base64 = String(result).split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setFeedbackMsg("");

    if (!formFields.token) {
      setFeedbackMsg("Please complete the reCAPTCHA before submitting.");
      setSubmitStatus("none");
      return;
    }

    try {
      // Build attachments array (base64) for Lambda
      const attachments = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          contentType: file.type,
          size: file.size,
          content: await fileToBase64(file), // base64 string
        })),
      );

      const payload = {
        ...formFields,
        attachments, // optional array
      };

      const res = await postAPI("/contact", payload);
      if (res.status === 200) {
        clearForm();
        captchaRef.current?.reset();
        setFormFields((prev) => ({ ...prev, token: "" }));
        setSubmitStatus("true");
        setFormDisabled(true);
        setFeedbackMsg("Thank you! Your message has been sent successfully.");
      } else {
        setSubmitStatus("false");
        setFeedbackMsg("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("false");
      setFeedbackMsg("An unexpected error occurred. Please try again.");
    }
  };

  const renderButton = () => {
    const base =
      "text-white font-semibold px-6 py-3 rounded-md transition duration-200";

    if (submitStatus === "loading") {
      return (
        <button
          disabled
          className={`${base} bg-brand-primary opacity-70 flex justify-center items-center`}
        >
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </button>
      );
    }

    if (submitStatus === "true") {
      return (
        <button
          disabled
          className={`${base} bg-green-600 flex justify-center items-center gap-2`}
        >
          Sent ✓
        </button>
      );
    }

    if (submitStatus === "false") {
      return (
        <button
          type="submit"
          disabled={formDisabled}
          className={`${base} bg-red-600 hover:bg-red-700`}
        >
          Try Again ✕
        </button>
      );
    }

    return (
      <button
        type="submit"
        disabled={formDisabled}
        className={`${base} bg-brand-primary hover:bg-brand-primary-hover`}
      >
        Submit
      </button>
    );
  };

  return (
    <div className="flex flex-col">
      <LocalBusinessJsonLd />
      {/* Hero */}
      <Hero>
        <h1 className="relative text-5xl md:text-6xl font-bold text-white">
          CONTACT
        </h1>
      </Hero>

      {/* Contact Section */}
      <section className="px-3 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 pb-10 lg:pb-0">
        {/* Left Side - Info */}
        <div className="flex flex-col justify-center pt-16 lg:p-16 xl:pl-40 2xl:pl-60">
          {/* CONTACT US HEADER */}
          <div className="flex flex-row h-min items-center gap-3 py-1">
            <div className="w-10 h-0.5 bg-brand-text-primary" />
            <h3 className="text-gray-700 font-bold">CONTACT US</h3>
          </div>
          <h2 className="text-3xl font-bold text-brand-text-primary my-6">
            HAPPY TO ANSWER ALL YOUR QUESTIONS
          </h2>

          {/* DETAILS */}
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold">Get A Free Quote</h3>
              <p className="text-gray-600 font-semibold">
                {`We prioritize maintaining continuous communication with our clients from the project's inception to its completion. If you require a free quote or have any questions or specific needs, please feel free to contact us. We're enthusiastic about assisting you!`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <a
                href={`${METADATA.clickablePhone}`}
                className="text-brand-text-primary font-semibold"
              >
                {METADATA.phone}
              </a>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <a
                href={`mailto:${METADATA.email}`}
                className="text-brand-text-primary font-semibold"
              >
                {METADATA.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white shadow-lg max-w-xl p-10 md:p-16">
          <p className="mb-6 text-gray-600">
            If you have questions about any of our services, please contact us
            by filling out the form below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1 tracking-widest">
                NAME
              </label>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="border border-gray-300 text-gray-700 placeholder-gray-600 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1 tracking-widest">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formFields.email}
                onChange={handleChange}
                required
                placeholder="Your email"
                className="border border-gray-300 text-gray-700 placeholder-gray-600 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1 tracking-widest">
                PHONE
              </label>
              <input
                type="tel"
                name="phone"
                value={formFields.phone}
                onChange={handleChange}
                required
                placeholder="xxx-xxx-xxxx"
                className="border border-gray-300 text-gray-700 placeholder-gray-600 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1 tracking-widest">
                MESSAGE
              </label>
              <textarea
                name="message"
                value={formFields.message}
                onChange={handleChange}
                required
                placeholder="Write your message..."
                rows="5"
                className="border border-gray-300 text-gray-700 placeholder-gray-600 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Attachments */}
            <div className="flex flex-col">
              <label className="text-gray-600 font-semibold mb-1 tracking-widest">
                ATTACHMENTS (OPTIONAL)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFilesChange}
                className="text-sm text-brand-secondary underline cursor-pointer border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                disabled={files.length >= 5}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can attach up to 5 images or videos (max ~5MB each) to help
                us understand your project.
              </p>
              {files.length > 0 && (
                <ul className="mt-2 text-xs text-gray-700 list-disc list-inside">
                  {files.map((file) => (
                    <li key={file.name}>
                      {file.name}{" "}
                      <span className="text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ReCAPTCHA */}
            <ReCAPTCHA
              sitekey="6Ld2ugksAAAAAKfn9xT066Z1SV7N1ewWKQRP_3S0"
              ref={captchaRef}
              onChange={onCaptchaChange}
              onExpired={onCaptchaExpired}
              onError={onCaptchaError}
            />

            {/* Submit */}
            <div className="flex flex-col gap-3">
              {renderButton()}
              {feedbackMsg && (
                <p
                  className={`text-sm font-medium ${
                    submitStatus === "true" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {feedbackMsg}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
