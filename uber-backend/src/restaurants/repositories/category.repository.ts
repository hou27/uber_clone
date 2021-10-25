import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

/**
 * The difference between this type of repository and the previous one is that it does not expose all the methods Repository has.
 * AbstractRepository does not have any public methods, it only has protected methods, like manager and repository, which you can use in your own public methods.
 * Extending AbstractRepository is useful if you don't want to expose all methods the standard Repository has to the public.
 */

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.findOne({ slug: categorySlug });
    if (!category) {
      category = await this.save(
        this.create({ slug: categorySlug, name: categoryName }),
      );
    }
    return category;
  }
}
