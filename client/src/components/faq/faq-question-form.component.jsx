"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { postAPI } from "@/utils/api";

const RECAPTCHA_SITE_KEY = "6Ld2ugksAAAAAKfn9xT066Z1SV7N1ewWKQRP_3S0";

export default function FaqQuestionForm() {
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
    token: "",
  });

  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState("");
  const captchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onCaptchaChange = (token) => {
    setFormFields((prev) => ({ ...prev, token: token || "" }));
  };

  const onCaptchaExpired = () => {
    setFormFields((prev) => ({ ...prev, token: "" }));
  };

  const onCaptchaError = () => {
    setFormFields((prev) => ({ ...prev, token: "" }));
  };

  const clearForm = () => {
    setFormFields({
      name: "",
      email: "",
      phone: "",
      question: "",
      token: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setStatusMessage("");

    if (!formFields.token) {
      setSubmitStatus("error");
      setStatusMessage("Please complete the reCAPTCHA before submitting.");
      return;
    }

    try {
      // Your Lambda expects: name, email, phone, message, token
      const payload = {
        name: formFields.name,
        email: formFields.email,
        phone: formFields.phone || "N/A",
        message: `FAQ question:\n\n${formFields.question}`,
        token: formFields.token,
      };

      const res = await postAPI("/contact", payload);
      console.log("FAQ form response:", res);

      if (res && res.message === "Emails sent successfully") {
        clearForm();
        if (captchaRef.current) captchaRef.current.reset();
        setFormFields((prev) => ({ ...prev, token: "" }));

        setSubmitStatus("success");
        setStatusMessage(
          "Thanks for your question! We’ve received it and will get back to you soon."
        );
      } else {
        setSubmitStatus("error");
        setStatusMessage(
          "Something went wrong sending your question. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
      setStatusMessage(
        "Something went wrong sending your question. Please try again."
      );
    }
  };

  const isSubmitting = submitStatus === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-6 md:p-8 space-y-5"
    >
      {/* Name */}
      <div className="flex flex-col">
        <label className="text-gray-600 font-semibold mb-1 tracking-widest text-xs">
          NAME
        </label>
        <input
          type="text"
          name="name"
          value={formFields.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="border border-gray-300 text-gray-700 placeholder-gray-500 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-gray-600 font-semibold mb-1 tracking-widest text-xs">
          EMAIL
        </label>
        <input
          type="email"
          name="email"
          value={formFields.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="border border-gray-300 text-gray-700 placeholder-gray-500 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* Phone (optional but sent to API) */}
      <div className="flex flex-col">
        <label className="text-gray-600 font-semibold mb-1 tracking-widest text-xs">
          PHONE (OPTIONAL)
        </label>
        <input
          type="tel"
          name="phone"
          value={formFields.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          className="border border-gray-300 text-gray-700 placeholder-gray-500 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* Question */}
      <div className="flex flex-col">
        <label className="text-gray-600 font-semibold mb-1 tracking-widest text-xs">
          QUESTION
        </label>
        <textarea
          name="question"
          value={formFields.question}
          onChange={handleChange}
          required
          placeholder="Ask us anything about your project..."
          rows={5}
          className="border border-gray-300 text-gray-700 placeholder-gray-500 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* reCAPTCHA */}
      <div className="flex justify-start">
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          ref={captchaRef}
          onChange={onCaptchaChange}
          onExpired={onCaptchaExpired}
          onError={onCaptchaError}
        />
      </div>

      {/* Status message */}
      {statusMessage && (
        <p
          className={`text-sm ${
            submitStatus === "success" ? "text-green-700" : "text-red-600"
          }`}
        >
          {statusMessage}
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full md:w-auto px-6 py-3 rounded-md font-semibold text-white transition ${
          isSubmitting
            ? "bg-brand-primary opacity-70 cursor-not-allowed"
            : "bg-brand-primary hover:bg-brand-primary-hover"
        }`}
      >
        {isSubmitting ? "Sending..." : "Send Question"}
      </button>
    </form>
  );
}
