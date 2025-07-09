// export interface Product {
//     id: number;
//     title: string;
//     image: string;
//     price: string;
//     originalPrice?: string;
//     rating: number;
//     reviews: number;
//     category: string;
//     slug: string;
//     description?: string;
//     specifications?: string[];
//   }
  
//   export const products: Product[] = [
//     {
//       id: 1,
//       title: 'All Kinds Of Toy Testing Equipments',
//       image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/GV/MI/SD/2556085/all-kinds-of-toy-testing-equipments-250x250.jpg',
//       price: '7,500.00',
//       rating: 4,
//       reviews: 4,
//       category: "Testing Equipment",
//       slug: 'all-kinds-of-toy-testing-equipments',
//       description: 'Comprehensive testing equipment for all types of toys to ensure safety and quality standards.',
//       specifications: [
//         'Material: Stainless Steel',
//         'Dimensions: 30x30x30 cm',
//         'Weight: 15 kg',
//         'Power: 220V, 50Hz'
//       ]
//     },
//     {
//       id: 2,
//       title: 'Sharp Edge Tester For Toys',
//       image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/XI/TL/IK/2556085/sharp-edge-tester-for-toys-500x500.jpg',
//       price: '145,650.00',
//       rating: 4,
//       reviews: 4,
//       category: "Testing Equipment",
//       slug: 'sharp-edge-tester-for-toys',
//       description: 'Precision instrument designed to detect sharp edges and points on toys according to safety standards.',
//       specifications: [
//         'Material: Aluminum Alloy',
//         'Dimensions: 50x40x35 cm',
//         'Weight: 25 kg',
//         'Standards: EN71, ASTM F963'
//       ]
//     },
//     {
//       id: 3,
//       title: 'Bursting Strength Tester',
//       image: 'https://5.imimg.com/data5/DC/YE/BZ/SELLER-2556085/bursting-strength-tester-500x500.jpg',
//       price: '65,650.00',
//       rating: 1,
//       reviews: 4,
//       category: "Paper Testing Equipment",
//       slug: 'bursting-strength-tester',
//       description: 'High-precision instrument for measuring the bursting strength of paper, cardboard, and other materials.',
//       specifications: [
//         'Material: Cast Iron',
//         'Dimensions: 60x50x45 cm',
//         'Weight: 35 kg',
//         'Pressure Range: 0-1000 kPa'
//       ]
//     },
//     {
//       id: 4,
//       title: 'Safety Helmet Testing Equipments Machine',
//       image: 'https://5.imimg.com/data5/SELLER/Default/2024/4/408536191/QE/LS/JZ/2556085/helmet-testing-equipments-500x500.webp',
//       price: '85,000.00',
//       rating: 3,
//       reviews: 4,
//       category: "HELMET TESTING EQUIPMENTS",
//       slug: 'safety-helmet-testing-equipments-machine',
//       description: 'Complete testing system for evaluating the impact resistance and penetration resistance of safety helmets.',
//       specifications: [
//         'Material: Steel Frame',
//         'Dimensions: 120x80x150 cm',
//         'Weight: 80 kg',
//         'Standards: EN 397, ANSI Z89.1'
//       ]
//     },
//     {
//         id: 5,
//         title: 'All Kinds Of Toy Testing Equipments',
//         image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/GV/MI/SD/2556085/all-kinds-of-toy-testing-equipments-250x250.jpg',
//         price: '7,500.00',
//         rating: 4,
//         reviews: 4,
//         category: "Testing Equipment",
//         slug: 'all-kinds-of-toy-testing-equipments',
//         description: 'Comprehensive testing equipment for all types of toys to ensure safety and quality standards.',
//         specifications: [
//           'Material: Stainless Steel',
//           'Dimensions: 30x30x30 cm',
//           'Weight: 15 kg',
//           'Power: 220V, 50Hz'
//         ]
//       }
        
//     // Add more products as needed
//   ];
  
//   export const getProductBySlug = (slug: string): Product | undefined => {
//     return products.find(product => product.slug === slug);
//   };
  
//   export const getFeaturedProducts = (count: number = 4): Product[] => {
//     return products.slice(0, count);
//   };