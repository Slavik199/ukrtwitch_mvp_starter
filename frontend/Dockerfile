FROM node:20-alpine AS builder

WORKDIR /app

# Копіюємо package.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install --legacy-peer-deps --no-audit --progress=false

# Копіюємо весь код
COPY . .

# Збірка фронтенду
RUN npm run build

# Другий етап — невеликий сервер для статики
FROM node:20-alpine

WORKDIR /app

# Копіюємо збірку з попереднього етапу
COPY --from=builder /app/dist ./dist

# Встановлюємо простий HTTP сервер
RUN npm install -g http-server

EXPOSE 3000

# Запуск фронтенду
CMD ["http-server", "dist", "-p", "3000"]


