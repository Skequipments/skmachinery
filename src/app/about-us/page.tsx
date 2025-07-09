import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Gst from '@/components/certificates/GST1-1.webp';
import Iso from '@/components/certificates/ISO9001.webp';
import Msme from '@/components/certificates/MSME-1.webp';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 pt-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About S K Equipments</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Our Journey</h3>
              <p className="text-gray-600 mb-4">
                Founded in 1998, S. K. Equipments is a leading manufacturer and supplier of high-quality testing equipment for leather, fiber, yarn, paper, and fabrics. We take pride in delivering efficient and reliable machines that meet industry standards.
              </p>
              <p className="text-gray-600 mb-4">
                Our equipment is manufactured using the finest quality components and sophisticated technology, ensuring rigid design, smooth functioning, reliable usage, long working life, and low maintenance cost.
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Key Facts</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">Founded: 1998</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">Location: Noida, Uttar Pradesh, India</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">Employees: 11-25 People</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">Annual Turnover: ₹0-40 Lakhs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">Proprietor: Mr. Sheeraz Khan</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Infrastructure</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                Located in Noida, we have constructed a wide and ultramodern infrastructural base that helps us manufacture world-class equipment according to industry standards.
              </p>
              <p className="text-gray-600 mb-4">
                Our facility includes various departments: procurement, production, R&D, sales, quality testing, administration, warehousing, and packaging - all equipped with the latest machines and tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Facility Details:</h4>
              <ul className="grid grid-cols-2 gap-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Location: Semi-urban</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Building: Permanent</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Size: 200 sq. yards</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Space: Front porch</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Competitive Advantages</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="text-blue-500 text-2xl mb-3">🔬</div>
              <h4 className="text-lg font-semibold mb-2">Experienced R&D</h4>
              <p className="text-gray-600">We invest in continuous research and development to bring innovative solutions to our customers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="text-blue-500 text-2xl mb-3">💰</div>
              <h4 className="text-lg font-semibold mb-2">Financial Strength</h4>
              <p className="text-gray-600">Strong financial position and Total Quality Management ensure reliable products and services.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="text-blue-500 text-2xl mb-3">🏭</div>
              <h4 className="text-lg font-semibold mb-2">Production Capacity</h4>
              <p className="text-gray-600">Large production capacity enables us to meet diverse customer requirements efficiently.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h3>
          <p className="text-gray-600 mb-4">
            We are blessed with an adept and capable team of professionals including procuring agents, production managers, quality experts, storekeepers, and sales executives.
          </p>
          <p className="text-gray-600">
            Our team members are highly dedicated and put maximum effort to accomplish customer requirements on time. We conduct regular training sessions, seminars, and development programs to keep our team updated with the latest market trends.
          </p>
        </section>

        <section className="my-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Certifications</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[500px] mb-4 bottom">
                <Image
                  src={Gst}
                  alt="GST Certificate"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">GST Registration</h4>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[500px] mb-4 bottom ">
                <Image
                  src={Iso}
                  alt="ISO 9001 Certificate"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">ISO 9001 Certified</h4>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[500px] mb-4 bottom">
                <Image
                  src={Msme}
                  alt="MSME Certificate"
                  fill
                  className="object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">MSME Registration</h4>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default AboutUs;