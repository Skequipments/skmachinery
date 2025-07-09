import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[hsl(0deg_0%_9.13%)] text-white pt-12 pb-6">
      <div className="container-custom-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link href="/" className="block mb-4">
              <Image src="/assets/images/logo/sklogo.png" alt="Bonik" width={110} height={35} />
            </Link>
            <p className="text-gray-300 mb-4">
            S. K. Equipments – Established in 1998, we specialize in manufacturing and supplying high-quality testing equipment for leather, yarn, paper, dyeing, packaging, and more. Based in Noida, we are known for our innovation, reliability, and customer satisfaction across India.
            </p>
            {/* <div className="flex gap-4 mb-4">
              <Link href="https://play.google.com/store" target="_blank" className="block">
                <Image
                  src="https://ext.same-assets.com/4117257200/832929399.png"
                  alt="Google Play"
                  width={120}
                  height={40}
                />
              </Link>
              <Link href="https://www.apple.com/app-store/" target="_blank" className="block">
                <Image
                  src="https://ext.same-assets.com/4117257200/2258039254.png"
                  alt="App Store"
                  width={120}
                  height={40}
                />
              </Link>
            </div> */}
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-medium mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-gray-300 hover:text-white transition-colors">
                  Our Stores
                </Link>
              </li>
              <li>
                <Link href="/cares" className="text-gray-300 hover:text-white transition-colors">
                  Our Cares
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/how-to-buy" className="text-gray-300 hover:text-white transition-colors">
                  How to Buy
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-300 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="text-gray-300 hover:text-white transition-colors">
                  Corporate & Bulk Purchasing
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-5">D-50 1st Floor Sector-10, Noida, Gautam Buddha Nagar-201301, Uttar Pradesh, India</p>
              {/* <p className="mb-4">NY 10012, United States</p> */}

              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} />
                <span>info@skequipments.com</span>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <Phone size={16} />
                <span>+919818900247‬, ‪+919212324964</span>
              </div>

              <div className="flex gap-4">
                <Link href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-gray-300 transition-colors">
                  <Facebook />
                </Link>
                <Link href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-gray-300 transition-colors">
                  <Twitter />
                </Link>
                <Link href="https://youtube.com" aria-label="Youtube" className="text-white hover:text-gray-300 transition-colors">
                  <Youtube />
                </Link>
                <Link href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-gray-300 transition-colors">
                  <Instagram />
                </Link>
              </div>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-8 pt-3 pb-0 text-center flex flex-row items-center justify-center" style={{borderColor: 'hsl(0deg 0% 18.58%)'}}>
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} S. K. Equipments. All rights reserved.
          </p>
          <p className="text-gray-500">
            Designed by <Link href="https://www.socialcults.com" className="text-gray-400 hover:text-gray-300 transition-colors">Social Cults</Link>
          </p>
          
        </div>
      </div>
    </footer>
  )
}
