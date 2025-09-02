import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="font-['Playfair Display'] text-3xl font-extrabold tracking-tight md:text-4xl">
        Contact Us
      </h1>
      <p className="mt-1 text-muted-foreground">
        We aim to reply within 24 hours.
      </p>
      {sent ? (
        <div className="mt-6 rounded-md border bg-secondary p-4">
          Thank you—your message has been sent.
        </div>
      ) : (
        <form
          className="mt-6 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input
            required
            placeholder="Full name"
            className="h-11 rounded-md border px-3"
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="h-11 rounded-md border px-3"
          />
          <textarea
            required
            placeholder="How can we help?"
            rows={6}
            className="rounded-md border p-3"
          />
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Send message
          </button>
        </form>
      )}
      <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
        <div>Email: call@dubaioasis.com</div>
        <div>Phone: +880 1825262871</div>
        <div>Address: Shop No: 56, Building No: 08 (2nd Floor), Chandni Chawk, Ac Market, Dhaka-1205, Bangladesh</div>
      </div>
    </section>
  );
}
