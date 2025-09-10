

const Contact = ()=> {
  return (
    <div className="bg-black text-white px-8 md:px-30 py-27.5">
      <div className="max-w-7xl mx-auto at flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-yellow-400 mb-4">Contact</h2>
          <p className="text-gray-300 mb-4">We'd love to hear from you!</p>
          <p className="text-gray-400">
            Whether you have a question about classes, want to become a tutor,
            or just want to say hi — our team is ready to help.
          </p>
        </div>

        {/* Right Section (Form) */}
        <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              className="w-full px-4 py-2 rounded bg-white text-black"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="jane@example.com"
              className="w-full px-4 py-2 rounded bg-white text-black"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Class</label>
            <input
              type="text"
              placeholder="12"
              className="w-full px-4 py-2 rounded bg-white text-black"
            />
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="123-456-7890"
              className="w-full px-4 py-2 rounded bg-white text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Message</label>
            <textarea
              placeholder="Your message..."
              rows={4}
              className="w-full px-4 py-2 rounded bg-white text-black"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 rounded hover:bg-yellow-500 hover:text-black transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact