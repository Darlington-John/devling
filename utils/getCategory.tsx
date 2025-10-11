import connectMongo from '~/lib/connect-mongo';
import Article from '~/lib/models/article';
import Category from '~/lib/models/category';
import '~/lib/models/user';
export async function getCategory(category: string) {
	await connectMongo();

	const selectedCategory = await Category.findOne({ slug: category }).lean();
	if (!selectedCategory) return null;

	const articles = await Article.find({ category: selectedCategory._id })
		.populate({ path: 'author', select: 'first_name last_name' })
		.limit(6)
		.lean();

	return { ...selectedCategory, articles };
}

