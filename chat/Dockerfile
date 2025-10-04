FROM node:20-alpine

WORKDIR /app

# Копіюємо package.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install --legacy-peer-deps --no-audit --progress=false

# Копіюємо весь код
COPY . .

# Порт чату
EXPOSE 5000

# Запуск головного файлу
CMD ["node", "index.js"]


