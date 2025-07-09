// app/api/subcategories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = "mongodb+srv://rohitkrsah27:rohitpk27@categories.ef3m4kr.mongodb.net/productDb?retryWrites=true&w=majority&appName=categories";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  tls: true 
};

async function connectDB() {
  const client = new MongoClient(MONGODB_URI, options);
  await client.connect();
  return client;
}

export async function GET() {
  let client;
  try {
    client = await connectDB();
    const database = client.db('productDb');
    const collection = database.collection('subcategories');
    const subcategories = await collection.find({}).toArray();

    return NextResponse.json(subcategories, { status: 200 });
  } catch (error) {
    console.error('MongoDB GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  } finally {
    await client?.close();
  }
}

export async function POST(request: NextRequest) {
  let client;
  try {
    const subcategoryData = await request.json();
    client = await connectDB();
    const database = client.db('productDb');

    // Validation
    if (!subcategoryData.title || !subcategoryData.category) {
      return NextResponse.json(
        { error: 'Title and category are required fields' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!subcategoryData.slug) {
      subcategoryData.slug = subcategoryData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if parent category exists
    const parentCategory = await database.collection('categories').findOne({
      title: subcategoryData.category
    });

    if (!parentCategory) {
      return NextResponse.json(
        { error: 'Parent category does not exist' },
        { status: 400 }
      );
    }

    const result = await database.collection('subcategories').insertOne({
      ...subcategoryData,
      parentCategoryId: parentCategory._id
    });

    const newSubcategory = await database.collection('subcategories').findOne({
      _id: result.insertedId
    });

    return NextResponse.json(newSubcategory, { status: 201 });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subcategory' },
      { status: 500 }
    );
  } finally {
    await client?.close();
  }
}

export async function PUT(request: NextRequest) {
  let client;
  try {
    const subcategoryData = await request.json();
    client = await connectDB();
    const database = client.db('productDb');

    if (!subcategoryData._id) {
      return NextResponse.json(
        { error: 'Subcategory ID is required for update' },
        { status: 400 }
      );
    }

    const { _id, ...updateData } = subcategoryData;
    const objectId = new ObjectId(_id);

    // If category is being updated, verify it exists
    if (updateData.category) {
      const parentCategory = await database.collection('categories').findOne({
        title: updateData.category
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category does not exist' },
          { status: 400 }
        );
      }
      updateData.parentCategoryId = parentCategory._id;
    }

    const result = await database.collection('subcategories').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    const updatedSubcategory = await database.collection('subcategories').findOne({ _id: objectId });
    return NextResponse.json(updatedSubcategory);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to update subcategory' },
      { status: 500 }
    );
  } finally {
    await client?.close();
  }
}

export async function DELETE(request: NextRequest) {
  let client;
  try {
    const { id } = await request.json();
    client = await connectDB();
    const database = client.db('productDb');

    if (!id) {
      return NextResponse.json(
        { error: 'Subcategory ID is required for deletion' },
        { status: 400 }
      );
    }

    const objectId = new ObjectId(id);

    // First check if any products reference this subcategory
    const productsCount = await database.collection('products').countDocuments({
      subCategoryId: objectId
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subcategory with associated products' },
        { status: 400 }
      );
    }

    const deleteResult = await database.collection('subcategories').deleteOne({ _id: objectId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  } finally {
    await client?.close();
  }
}