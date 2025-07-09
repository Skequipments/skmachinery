
// This is a temporary script to add sample description data to one product for testing
// You can run this in the browser console or use it as reference to manually add data

const sampleDescription = `
<h3>Product Overview</h3>
<p>This is a high-quality testing equipment designed for professional use in textile testing laboratories.</p>

<h4>Key Features:</h4>
<ul>
<li>Precision testing capabilities</li>
<li>Durable construction</li>
<li>Easy-to-use interface</li>
<li>Accurate measurements</li>
</ul>

<h4>Applications:</h4>
<p>Perfect for textile manufacturers, quality control laboratories, and research institutions.</p>
`;

const sampleSpecs = [
  "Voltage: 220V/110V, 50/60Hz",
  "Power Consumption: 500W",
  "Testing Range: 0-100 units",
  "Accuracy: ±0.1%",
  "Dimensions: 500x400x300mm",
  "Weight: 25kg"
];

// To add this data to a product via admin panel:
// 1. Go to /admin/products
// 2. Edit any product
// 3. Add the above description in the description field
// 4. Add the specifications one by one
// 5. Save the product
// 6. Then test the product page

console.log('Sample Description:', sampleDescription);
console.log('Sample Specifications:', sampleSpecs);
