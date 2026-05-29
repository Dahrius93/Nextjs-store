// pagina about ma con animazione tailwind <reveal></reveal>
// questo componente è 'use client' tuttavia questa pagina
// rimane server side. Google vede comunque quello che c'è scritto tra i tag
// cambia solamente che viene mostrato all'utente mano a mano che scrolla in basso

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Reveal from "@/components/global/Reveal";
import { LuArmchair, LuLeaf, LuTruck, LuHeartHandshake } from "react-icons/lu";
import aboutImage from "@/public/images/hero2.jpg";
import storyImage from "@/public/images/product-big.jpg";

const stats = [
  { value: "70+", label: "Years of craft" },
  { value: "50k+", label: "Happy homes" },
  { value: "1,200+", label: "Curated pieces" },
  { value: "98%", label: "5-star reviews" },
];

const values = [
  {
    icon: LuArmchair,
    title: "Timeless design",
    description:
      "Pieces selected for comfort and character — made to look good for decades, not seasons.",
  },
  {
    icon: LuLeaf,
    title: "Sustainable sourcing",
    description:
      "Responsibly sourced materials and partners who share our respect for the planet.",
  },
  {
    icon: LuTruck,
    title: "Delivered with care",
    description:
      "Safe, tracked delivery right to your door — assembly-ready and protected every mile.",
  },
  {
    icon: LuHeartHandshake,
    title: "People-first service",
    description:
      "A support team that treats your space like their own, from first click to final placement.",
  },
];

function AboutPage() {
  return (
    <section className="py-8">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <span className="inline-block bg-primary/10 text-primary text-sm font-medium tracking-wide px-4 py-1.5 rounded-full">
            Our story
          </span>
          <h1 className="mt-6 flex flex-wrap gap-x-3 gap-y-2 items-center text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            We love
            <span className="bg-primary py-2 px-4 rounded-lg tracking-widest text-white">
              store
            </span>
          </h1>
          <p className="mt-6 text-lg tracking-wide leading-8 text-muted-foreground">
            Since 1950, we&apos;ve been helping people turn houses into homes.
            Our mission is a simple, fast, and reliable shopping experience — a
            growing catalog of beautiful furniture and a team always ready to
            help you find exactly what you&apos;re looking for.
          </p>
          <Button asChild size="lg" className="mt-10">
            <Link href="/products">Explore our collection</Link>
          </Button>
        </Reveal>
        <Reveal
          delay={150}
          className="relative h-[22rem] sm:h-[28rem] w-full overflow-hidden rounded-2xl shadow-lg"
        >
          <Image
            src={aboutImage}
            alt="A beautifully furnished living room"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            priority
          />
        </Reveal>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 100}>
            <Card className="text-center transition-shadow hover:shadow-md">
              <CardContent className="py-8">
                <p className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground tracking-wide">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* Values */}
      <div className="mt-24">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            What we stand for
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-8">
            Every piece we offer is held to the same set of promises.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Reveal key={value.title} delay={index * 100}>
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-wide">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-7">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Story */}
      <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal className="relative h-[20rem] sm:h-[26rem] w-full overflow-hidden rounded-2xl shadow-lg order-last lg:order-first">
          <Image
            src={storyImage}
            alt="A signature furniture piece from our catalog"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </Reveal>
        <Reveal delay={150}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            From a single workshop to your living room
          </h2>
          <Separator className="my-6" />
          <p className="text-lg text-muted-foreground leading-8">
            What began as a small family workshop has grown into a destination
            for thoughtfully designed furniture. Three generations later, we
            still believe the best spaces are built around how you actually live
            — warm, functional, and unmistakably yours.
          </p>
          <p className="mt-6 text-lg text-muted-foreground leading-8">
            Today we bring that same care to every order, pairing modern
            convenience with the craftsmanship we were founded on.
          </p>
        </Reveal>
      </div>

      {/* CTA */}
      <Reveal className="mt-24 block rounded-2xl bg-primary px-8 py-14 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to make your space yours?
        </h2>
        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto leading-8">
          Browse our latest arrivals and find the pieces that feel like home.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-8">
          <Link href="/products">Shop the collection</Link>
        </Button>
      </Reveal>
    </section>
  );
}
export default AboutPage;
