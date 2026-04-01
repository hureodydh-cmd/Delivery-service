import Product from "../models/Product.js";

const sampleProducts = [
  {
    title: "Белый хлеб",
    description: "Свежий домашний белый хлеб для утренних бутербродов.",
    price: 250,
    category: "Хлеб",
    image: "/kartinki/bread.jpg",
    stock: 30,
  },
  {
    title: "Яблоки",
    description: "Сочные яблоки из свежего урожая для здоровых перекусов.",
    price: 180,
    category: "Фрукты",
    image: "/kartinki/apples.jpeg",
    stock: 40,
  },
  {
    title: "Сыр",
    description: "Ароматный сыр для завтрака, салатов и горячих блюд.",
    price: 550,
    category: "Молочные продукты",
    image: "/kartinki/cheese.webp",
    stock: 25,
  },
  {
    title: "Молоко",
    description: "Свежие молочные продукты для семьи и домашних рецептов.",
    price: 220,
    category: "Молочные продукты",
    image: "/kartinki/milk.jpg",
    stock: 50,
  },
  {
    title: "Яйца",
    description: "Свежие куриные яйца для выпечки и завтраков.",
    price: 300,
    category: "Молочные продукты",
    image: "/kartinki/eggs.webp",
    stock: 60,
  },
  {
    title: "Рис",
    description: "Крупа высокого качества для любимых блюд.",
    price: 200,
    category: "Крупы",
    image: "/kartinki/rice.jpeg",
    stock: 45,
  },
  {
    title: "Сок",
    description: "Освежающий фруктовый сок для семьи и друзей.",
    price: 260,
    category: "Напитки",
    image: "/kartinki/juice.jpeg",
    stock: 35,
  },
  {
    title: "Печенье",
    description: "Нежное печенье для чая и сладких перекусов.",
    price: 320,
    category: "Сладкое",
    image: "/kartinki/cookies.jpeg",
    stock: 20,
  },
];

const seedProducts = async () => {
  const count = await Product.countDocuments();

  if (count > 0) {
    return;
  }

  await Product.insertMany(sampleProducts);
  console.log("Sample products seeded");
};

export default seedProducts;
