import React, { useState } from 'react';
import Buttton from '../components/Button';
import ThreejsPlane from '../components/ImagePlane';
import Transition from '../components/Transition';

const Contact = () => {
  // State variables for form fields
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = () => {
    // Your logic for handling form submission (mock logic for now)
    console.log('Form submitted');

    // Reset form fields to null
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <section className="px-5 xl:px-0 h-screen w-screen flex items-center justify-center">
      <Transition />
      <ThreejsPlane />
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md z-10">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-950 bg-blend-darken:text-white">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-semibold text-center text-gray-50 dark:text-gray-400 sm:text-xl">
          Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.
        </p>
        <form className="space-y-8">
          <div>
            <label htmlFor="email" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name@het.com"
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Let us know how we can help you"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your message
            </label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-container border border-solid text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Leave a comment..."
            ></textarea>
          </div>
          <Buttton text="Send message" onClick={handleSubmit} />
        </form>
      </div>
    </section>
  );
};

export default Contact;
