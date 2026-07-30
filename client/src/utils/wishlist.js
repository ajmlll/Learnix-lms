const WISHLIST_KEY = 'learnix_wishlist';

export const getWishlist = () => {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading wishlist from localStorage:', err);
    return [];
  }
};

export const isInWishlist = (courseId) => {
  if (!courseId) return false;
  const list = getWishlist();
  return list.some((item) => (item._id || item.id)?.toString() === courseId.toString());
};

export const toggleWishlist = (course) => {
  if (!course) return false;
  const courseId = (course._id || course.id)?.toString();
  if (!courseId) return false;

  let list = getWishlist();
  const index = list.findIndex((item) => (item._id || item.id)?.toString() === courseId);

  let isAdded = false;
  if (index > -1) {
    list.splice(index, 1);
    isAdded = false;
  } else {
    const courseToSave = {
      _id: course._id || course.id,
      id: course.id || course._id,
      title: course.title,
      subtitle: course.subtitle || course.description || '',
      thumbnail: course.thumbnail,
      price: course.price,
      originalPrice: course.originalPrice,
      rating: course.rating || 5.0,
      category: course.category,
      instructor: course.instructor,
      level: course.level || 'All Levels',
    };
    list.push(courseToSave);
    isAdded = true;
  }

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch (err) {
    console.error('Error saving wishlist to localStorage:', err);
  }

  return isAdded;
};

export const removeFromWishlist = (courseId) => {
  if (!courseId) return;
  let list = getWishlist();
  const updated = list.filter((item) => (item._id || item.id)?.toString() !== courseId.toString());
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch (err) {
    console.error('Error removing from wishlist in localStorage:', err);
  }
};
