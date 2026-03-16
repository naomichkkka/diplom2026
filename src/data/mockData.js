// src/data/mockData.js
// Mock-данные для случаев, когда API недоступен

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Нежный букет из шаров',
    price: 3500,
    category: 'Букеты',
    description: 'Воздушный букет из 15 шаров пастельных тонов. Идеально подходит для романтических свиданий и дней рождения.',
    image_path: 'balloon-bouquet.jpg',
    is_popular: true,
    subtitle: 'Романтичный выбор'
  },
  {
    id: 2,
    name: 'Сет «День рождения»',
    price: 4200,
    category: 'Праздничные',
    description: 'Яркий праздничный набор из 20 шаров разных цветов с конфетти. Создаст праздничное настроение!',
    image_path: 'birthday-set.jpg',
    is_popular: true,
    subtitle: 'Для весёлого праздника'
  },
  {
    id: 3,
    name: 'Арка из шаров',
    price: 8500,
    category: 'Арки',
    description: 'Величественная арка из 50 шаров радужных цветов. Идеальна для свадеб и торжественных мероприятий.',
    image_path: 'balloon-arch.jpg',
    is_popular: false,
    subtitle: 'Украшение для входа'
  },
  {
    id: 4,
    name: 'Шары с гелием «Люкс»',
    price: 2800,
    category: 'Гелиевые',
    description: 'Набор из 10 больших гелиевых шаров с блестящим покрытием. Парят до 3 дней!',
    image_path: 'helium-lux.jpg',
    is_popular: true,
    subtitle: 'Парящая красота'
  },
  {
    id: 5,
    name: 'Фигурки персонажей',
    price: 5500,
    category: 'Фигурки',
    description: 'Фигурки любимых героев из воздушных шаров. Порадуют детей и взрослых!',
    image_path: 'character-figures.jpg',
    is_popular: false,
    subtitle: 'Для детских праздников'
  },
  {
    id: 6,
    name: 'Композиция «Сердце»',
    price: 4800,
    category: 'Букеты',
    description: 'Романтическая композиция в форме сердца из красных и розовых шаров. Идеально для признания в любви.',
    image_path: 'heart-composition.jpg',
    is_popular: true,
    subtitle: 'Выражение чувств'
  },
  {
    id: 7,
    name: 'Ходячий пёсик',
    price: 3200,
    category: 'Фигурки',
    description: 'Забавный ходячий пёсик из шаров — хит любого детского праздника!',
    image_path: 'walking-dog.jpg',
    is_popular: false,
    subtitle: 'Живой друг'
  },
  {
    id: 8,
    name: 'Шары под потолок',
    price: 6500,
    category: 'Праздничные',
    description: '50 разноцветных шаров для полного заполнения помещения. Создаёт волшебную атмосферу!',
    image_path: 'ceiling-balloons.jpg',
    is_popular: false,
    subtitle: 'Морское небо дома'
  }
];

export const MOCK_CATEGORIES = ['Букеты', 'Праздничные', 'Арки', 'Гелиевые', 'Фигурки'];

export const MOCK_USER = {
  id: 1,
  name: 'Администратор',
  email: 'admin@sharlandia.ru',
  role: 'admin'
};

export const MOCK_ORDERS = [
  { id: 1001, date: '2024-01-15', status: 'completed', total: 8500, items: 3 },
  { id: 1002, date: '2024-01-18', status: 'processing', total: 4200, items: 2 },
  { id: 1003, date: '2024-01-20', status: 'pending', total: 2800, items: 1 }
];
