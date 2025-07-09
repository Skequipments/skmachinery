import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Card1 from '@/images/card-1.jpg'
import Card2 from '@/images/card-2.jpg'
import Card3 from '@/images/card-3.jpg'

export default function PromoBannersSection() {
  return (
    <section className="py-10">
      <div className="container-custom-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="relative rounded-lg overflow-hidden h-[300px]">
            <Image
              src={Card1}
              alt="For Men's"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center p-8">
              <h3 className="text-white text-2xl font-bold mb-1">Testing Equipment <br /> That Delivers</h3>
              {/* <p className="text-white/90 mb-4">Starting At $29</p> */}
              <Button asChild className="bg-white text-black hover:bg-white/90 w-32">
                <Link href="/products">SHOP NOW</Link>
              </Button>
            </div>
          </div>


          <div className="relative rounded-lg overflow-hidden h-[300px]">
            <Image
              src={Card2}
              alt="Black Friday Sale"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-8">
              <h3 className="text-white text-3xl font-bold mb-4 text-center">Trusted by Professionals Since 1998</h3>
              <p className="text-white mb-2">Engineered for Precision</p>
              {/* <Button asChild className="bg-[hsl(var(--bonik-pink))] hover:bg-[hsl(var(--bonik-pink))/90] text-white">
                <Link href="/sale">Shop Now</Link>
              </Button> */}
              <Button asChild className="bg-white text-black hover:bg-white/90 w-32">
                <Link href="/about-us">Know More</Link>
              </Button>
            </div>
          </div>


          <div className="relative rounded-lg overflow-hidden h-[300px]">
            <Image
              src={Card3}
              alt="For Women's"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent flex flex-col justify-center items-end p-8">
              <h3 className="text-white text-2xl font-bold mb-1">From Lab to Line</h3>
              <p className="text-white/90 mb-4">Affordable, Reliable, Tested.</p>
              <Button asChild className="bg-white text-black hover:bg-white/90 w-32">
                <Link href="/products">SHOP NOW</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}