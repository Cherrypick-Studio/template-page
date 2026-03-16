"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-[#EBEBEB] bg-white p-10">
        <span className="text-2xl font-semibold text-[#1A1A1A]">Thank you!</span>
        <p className="text-center text-[#666666]">
          Your message has been sent successfully. We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-3xl border border-[#EBEBEB] bg-white p-8 lg:p-10">
      <h3 className="text-2xl font-semibold text-[#1A1A1A]">Send us a message</h3>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" type="text" required placeholder="John Doe" />
      </div>

      <div className="flex lg:flex-row flex-col gap-4 w-full">
        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" required placeholder="john@example.com" />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="text" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" type="text" required placeholder="How can we help you?" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" required rows={5} placeholder="Tell us more about your inquiry..." className="resize-none" />
      </div>

      <Button type="submit" disabled={loading} className="ml-auto mt-2 w-fit h-12">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
