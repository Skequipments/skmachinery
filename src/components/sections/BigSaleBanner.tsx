import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import banner from '@/images/banner.jpg'

export default function BigSaleBanner() {
  return (
    <section className="py-10 bg-white">
      <div className="container-custom-2">
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative h-[400px] flex items-center">
            <Image
              src={banner}
              alt="Summer Season Sale"
              fill
              className="object-cover"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
              <div className="flex flex-col justify-center h-full max-w-xl px-8 md:px-12">
                <div className="mb-4">
                  <span className="inline-block bg-[hsl(var(--bonik-pink))] text-white px-3 py-1 rounded-sm text-sm font-medium">
                    Extra <span className="font-bold">30% Off</span> Online
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Summer Season Sale
                </h2>
                <p className="text-white text-lg mb-6">
                  Free shipping on orders over $99
                </p>
                <Button asChild className="bonik-btn-primary w-36">
                  <Link href="/sale">Shop Now</Link>
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
