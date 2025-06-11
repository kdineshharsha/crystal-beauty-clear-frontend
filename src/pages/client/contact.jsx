import React, { useState } from "react";
import axios from "axios";
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/contact",
        formData
      );
      setStatus("Message sent successfully 💌");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong 💔");
    }
  };

  return (
    <div className="w-full mx-auto p-6 min-h-screen bg-primary ">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Contact Us
      </h2>
      <h3 className="text-lg text-center text-gray-600 mb-6">
        If you have any questions or comments please contact us via the form
        below. We would love to hear from you !
      </h3>
      <div className=" space-y-4 mb-10">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              required
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              required
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition"
          >
            Send Message
          </button>

          {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
        </form>{" "}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Get in Touch
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="text-green-500" />
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                +91 99999 99999 (WhatsApp)
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-500" />
              <a href="tel:+919999999999" className="hover:underline">
                +91 99999 99999 (Voice Call)
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-red-500" />
              <p>123 Love Street, Cozy City, Happy State, 000000, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
