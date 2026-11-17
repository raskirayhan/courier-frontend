"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    // Simulate inquiry submission
    await new Promise((res) => setTimeout(res, 1000));
    setSubmitted(true);
    toast.success("Thank you! Your message has been sent to our dispatch team.");
    reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />

      <main className="flex-1 bg-slate-50">
        {/* Contact Hero */}
        <section className="bg-slate-900 text-white py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Badge className="bg-blue-600 text-white border-none text-xs">
              24/7 Dedicated Support
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Get in Touch with Our Logistics Experts
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Have questions about nationwide rates, corporate accounts, or active deliveries? We&apos;re here to help.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Contact Info */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-slate-200">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Headquarters & Central Hub</h3>

                    <div className="space-y-4 text-sm text-slate-600">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Physical Address</p>
                          <p className="text-xs text-slate-500">Central Logistics Hub, Tejgaon I/A, Dhaka-1208, Bangladesh</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Phone Support</p>
                          <p className="text-xs text-slate-500">+880 9612-445566 (Toll-Free Hotline)</p>
                          <p className="text-xs text-slate-500">+880 1711-000000 (Operations Mobile)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Email Inquiries</p>
                          <p className="text-xs text-slate-500">support@swifttrack.com</p>
                          <p className="text-xs text-slate-500">dispatch@swifttrack.com</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Operating Hours</p>
                          <p className="text-xs text-slate-500">Customer Care: 24/7 Everyday</p>
                          <p className="text-xs text-slate-500">Hub Dispatch: 8:00 AM – 10:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Contact Form */}
              <div className="lg:col-span-7">
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-8">
                    {submitted ? (
                      <div className="py-12 text-center space-y-3">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                        <p className="text-sm text-slate-600 max-w-sm mx-auto">
                          Our operations team will review your inquiry and get back to you within 2 hours.
                        </p>
                        <Button onClick={() => setSubmitted(false)} variant="outline">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="name">Your Name *</Label>
                            <Input id="name" placeholder="Raski Rayhan" {...register("name")} />
                            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
                            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" placeholder="017xxxxxxxx" {...register("phone")} />
                            {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="subject">Subject *</Label>
                            <Input id="subject" placeholder="e.g. Corporate Rate Inquiry" {...register("subject")} />
                            {errors.subject && <p className="text-xs text-red-600">{errors.subject.message}</p>}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="message">Your Message *</Label>
                          <textarea
                            id="message"
                            rows={4}
                            placeholder="Tell us about your delivery requirements..."
                            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            {...register("message")}
                          />
                          {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
                        </div>

                        <Button type="submit" size="lg" className="w-full gap-2 font-semibold" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Sending Inquiry...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" /> Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
