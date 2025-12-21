# Sử dụng Node 18
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# --- FIX LỖI: Cài thêm ts-node-dev vào toàn cục (Global) để chắc chắn chạy được ---
RUN npm install -g ts-node-dev typescript

# Copy code nguồn
COPY . .

# Mở cổng 8080
EXPOSE 8080

# Chạy lệnh khởi động
CMD ["npm", "run", "start:dev"]