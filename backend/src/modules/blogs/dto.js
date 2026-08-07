class BlogDTO {
  static toResponse(blog) {
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      author: blog.author,
      category: blog.category ? blog.category.name : null,
      createdAt: blog.createdAt,
    };
  }
}

module.exports = BlogDTO;
