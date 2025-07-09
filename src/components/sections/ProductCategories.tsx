import React from 'react';
import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  readMoreLink: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, imageUrl, readMoreLink }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <a
          href={readMoreLink}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          READ MORE
        </a>
      </div>
    </div>
  );
};

const ProductCategories = () => {
  const categories = [
    {
      title: 'Textile Testing Equipment',
      description: 'CESTER Fabric testing instruments with more the impact resistance, flexing yellowing',
      imageUrl: 'https://www.gester-instruments.com/uploadfile/category/61f83d8ed478b559f1e13fceddcb9cb2.png',
      readMoreLink: '#',
    },
    {
      title: 'Footwear Testing Equipment',
      description: 'High-quality testing solutions for footwear durability and performance',
      imageUrl: 'https://www.gester-instruments.com/uploadfile/category/8731915731addb762f70e212cac5f97f.png',
      readMoreLink: '#',
    },
    {
      title: 'Furniture Testing Equipment',
      description: 'Furniture testing machines are easy in operation, safe, reliable, and with high accuracy',
      imageUrl: 'https://www.gester-instruments.com/uploadfile/category/0e4cd14dd15993003bd7b50e95e35083.png',
      readMoreLink: '#',
    },
    {
      title: 'Paper and Packaging Testing Equipment',
      description: 'CESTER Paper Testing Equipment is designed in accordance with TAPPI and ISO standards',
      imageUrl: 'https://www.gester-instruments.com/uploadfile/category/8e2971ce8977d3c2968baf6903672396.png',
      readMoreLink: '#',
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">PRODUCT CATEGORIES</h2>
          <p className="text-lg text-blue-600 font-medium">JUST FOR PROFESSIONAL TESTER</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              description={category.description}
              imageUrl={category.imageUrl}
              readMoreLink={category.readMoreLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;