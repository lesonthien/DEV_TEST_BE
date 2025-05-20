export const config = {
  db: {
    type: process.env.DB_TYPE,
    synchronize: false,
    logging: process.env.DB_LOGGING,
    host: process.env.DB_HOST,
    port: 1521,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    extra: {
      poolMax: 200, // Tối đa 200 kết nối
      poolMin: 0, // Không cần giữ sẵn kết nối vì còn pool của database
      poolIncrement: 5, // Mỗi lần cần thêm, mở thêm 5 kết nối
      poolTimeout: 300, // Giữ kết nối trong 5 phút trước khi đóng nếu không dùng
    },
    autoLoadEntities: true,
  },
  foo: 'pro-bar',
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
