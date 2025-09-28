import Category from "@/models/Category";

export async function GET(request) {
  // console.log('GET /api/category',request.nextUrl.searchParams.get("pno"))
  const pno = request.nextUrl.searchParams.get("pno")
  if (pno) {
    // get size from URL, convert to int, default to 3 if not provided
    const size = parseInt(request.nextUrl.searchParams.get("size"), 3) || 3; // TODO fix this hard code
    // calculate startIndex based on pno and the new size
    const startIndex = (parseInt(pno, 10) - 1) * size;
    const categories = await Category.find()
      .sort({ order: -1 })
      .skip(startIndex)
      .limit(size)
    return Response.json(categories)
  }

  const s = request.nextUrl.searchParams.get("s")
  if (s) {
    const categories = await Category
      .find({ name: { $regex: s, $options: 'i' } })
      .sort({ order: -1 })
    return Response.json(categories)
  }

  const categories = await Category.find().sort({ order: -1 })
  return Response.json(categories)
}

export async function POST(request) {
  const body = await request.json()
  const category = new Category(body)
  await category.save()
  return Response.json(category)
}



// for V2
export async function PUT(request) {
  const body = await request.json()
  const category = await Category.findByIdAndUpdate(body._id, body)
  return Response.json(category)
}