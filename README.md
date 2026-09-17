# nest-js-soa

Backend sử dụng NestJS 12, TypeScript và TypeORM để kết nối SQL Server. Dự án hiện có các module `user`, `auth` và cấu hình Swagger để tra cứu API.

> **Trạng thái hiện tại:** phần đăng nhập đang được phát triển. `src/auth/auth.service.ts` còn thiếu giá trị `accessToken` và phần thân hàm `generateJwtToken`, nên chưa thể build/chạy thành công. Cấu hình dependency injection cũng cần hoàn thiện; xem mục “Các phần cần hoàn thiện” bên dưới trước khi chạy ứng dụng.

## Yêu cầu môi trường

- Node.js và npm. Môi trường đang dùng trong workspace: Node.js `24.15.0`, npm `11.12.1`.
- Windows để sử dụng cấu hình Windows Authentication hiện có.
- SQL Server với database `SOA_DATN` và tài khoản Windows có quyền truy cập.
- Microsoft ODBC Driver 17 for SQL Server, được sử dụng bởi `msnodesqlv8`.

Repository có `package-lock.json`; dùng `npm ci` để cài dependency theo lockfile. Các hướng dẫn bên dưới dùng PowerShell. Nếu PowerShell chặn `npm.ps1`, thay `npm` bằng `npm.cmd`.

## Cài đặt và chạy local

### 1. Cài dependency

Mở terminal tại thư mục gốc của repository:

```powershell
npm ci
```

### 2. Cấu hình SQL Server

Chỉnh trực tiếp cấu hình `TypeOrmModule.forRoot()` trong [src/app.module.ts](src/app.module.ts) theo máy của bạn:

| Cấu hình                          | Giá trị hiện tại                | Ý nghĩa                                             |
| --------------------------------- | ------------------------------- | --------------------------------------------------- |
| `host`                            | `localhost`                     | Máy chủ SQL Server                                  |
| `database`                        | `SOA_DATN`                      | Database cần tồn tại trước khi chạy                 |
| `extra.driver`                    | `ODBC Driver 17 for SQL Server` | ODBC driver cần cài trên máy                        |
| `extra.options.instanceName`      | `VIETTUAN`                      | Tên SQL Server instance, thay bằng instance của bạn |
| `extra.options.trustedConnection` | `true`                          | Dùng tài khoản Windows đang chạy Node.js            |
| `extra.options.encrypt`           | `false`                         | Cấu hình dành cho local development                 |
| `synchronize`                     | `false`                         | Không tự tạo bảng hoặc cập nhật schema              |

Kết nối hiện tại tương ứng với `localhost\VIETTUAN`. Không cần nhập SQL username/password khi dùng Windows Authentication.

Repository chưa có migration hoặc script tạo/seed database. Cần chuẩn bị schema phù hợp với entity [SinhVien](src/user/user.entity.ts), gồm các cột `MaSv`, `HoTen`, `Email`, `Lop`, `MatKhau`. Trao đổi với người quản lý database để lấy schema/dữ liệu dùng cho phát triển.

Hiện ứng dụng chưa cấu hình đọc file `.env`; tạo `.env` sẽ không tự thay đổi kết nối database. Xem thêm [hướng dẫn kết nối database](src/database/README.md).

### 3. Chạy ứng dụng

Sau khi hoàn thiện các phần mã nguồn còn thiếu ở cuối tài liệu:

```powershell
npm run start:dev
```

Ứng dụng chờ kết nối database thành công trước khi mở cổng HTTP. Cổng mặc định là `3000`; có thể thay đổi qua biến môi trường trong terminal:

```powershell
$env:PORT = '3001'
npm run start:dev
```

Khi khởi động thành công, truy cập:

| Địa chỉ mặc định          | Mục đích                      |
| ------------------------- | ----------------------------- |
| http://localhost:3000/    | `GET /` trả về `Hello World!` |
| http://localhost:3000/api | Swagger UI                    |

Nếu đổi `PORT`, dùng cổng tương ứng trong URL. Swagger hiện vẫn dùng tiêu đề mẫu `Cats example`. Các controller `auth` và `user` chưa khai báo endpoint, nên chưa có API đăng nhập hoặc tra cứu sinh viên để gọi qua HTTP.

## Các lệnh thường dùng

| Lệnh                  | Mục đích                                                    |
| --------------------- | ----------------------------------------------------------- |
| `npm run start`       | Biên dịch và chạy ứng dụng                                  |
| `npm run start:dev`   | Chạy và tự tải lại khi sửa mã nguồn                         |
| `npm run start:debug` | Chạy watch mode với Node.js debugger                        |
| `npm run build`       | Biên dịch vào thư mục `dist/`                               |
| `npm run start:prod`  | Chạy bản đã build; cần chạy `npm run build` trước           |
| `npm run lint`        | Kiểm tra `src/` và `test/` bằng Oxlint, có kiểm tra type    |
| `npm run format`      | Format và ghi lại các file TypeScript trong `src/`, `test/` |
| `npm test`            | Chạy unit test một lần bằng Vitest                          |
| `npm run test:watch`  | Chạy unit test ở watch mode                                 |
| `npm run test:cov`    | Chạy unit test và thu thập coverage                         |
| `npm run test:e2e`    | Chạy end-to-end test                                        |

Script `deploy` có trong `package.json`, nhưng repository chưa có hướng dẫn cấu hình môi trường triển khai cụ thể.

## Kiểm thử

- Unit test được tìm theo mẫu `**/*.spec.ts` trong [vitest.config.ts](vitest.config.ts). Hiện chưa có file unit test; `npm test` có thể báo `No test files found`.
- E2E test nằm ở [test/app.e2e-spec.ts](test/app.e2e-spec.ts), kiểm tra `GET /` trả về `Hello World!`.
- E2E test import toàn bộ `AppModule`, vì vậy cần mã nguồn biên dịch được, dependency injection hợp lệ và kết nối SQL Server hoạt động. Test hiện chưa mock database.

Trước khi gửi thay đổi, chạy các kiểm tra phù hợp:

```powershell
npm run build
npm run lint
npm run test:e2e
```

Khi bổ sung unit test, chạy thêm `npm test`.

## Cấu trúc mã nguồn

```text
src/
  main.ts                 # Khởi động HTTP server, Swagger và cấu hình PORT
  app.module.ts           # Module gốc và kết nối TypeORM / SQL Server
  app.controller.ts       # Endpoint GET /
  app.service.ts          # Trả về lời chào mẫu
  auth/                   # Logic đăng nhập đang phát triển
  user/                   # Entity SinhVien và service truy vấn sinh viên
  database/README.md      # Chi tiết cấu hình kết nối SQL Server
test/
  app.e2e-spec.ts          # E2E test cho GET /
vitest.config.ts           # Cấu hình unit test
vitest.config.e2e.ts       # Cấu hình E2E test
```

Dự án dùng ES modules (`"type": "module"`) và TypeScript `NodeNext`. Khi import file nội bộ, giữ đuôi `.js` như mã nguồn hiện tại, ví dụ `import { UserService } from '../user/user.service.js'`.

## Các phần cần hoàn thiện

Các vấn đề sau đang có trong mã nguồn, không phải lỗi cài đặt trên máy của bạn:

1. **Hoàn thiện `AuthService`:** bổ sung giá trị trả về `accessToken` và triển khai `generateJwtToken()` để sửa lỗi cú pháp hiện tại.
2. **Đăng ký repository:** thêm `TypeOrmModule.forFeature([SinhVien])` vào `UserModule` để cung cấp repository được inject trong `UserService`. `autoLoadEntities: true` không tự quét mọi file entity.
3. **Kết nối các module:** export `UserService` từ `UserModule` và import `UserModule` vào `AuthModule` để `AuthService` có thể inject service này.
4. **Loại bỏ đăng ký trùng:** `AppModule` đang khai báo lại `UserService` và `UserController` dù đã import `UserModule`; cần để `UserModule` quản lý các thành phần này.
5. **Bổ sung API:** các controller `auth` và `user` hiện chưa có handler HTTP.

## Xử lý lỗi thường gặp

| Hiện tượng                                                      | Cách kiểm tra                                                                                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Build báo lỗi trong `auth.service.ts`                           | Hoàn thiện phần đăng nhập như mô tả ở trên                                                                                                  |
| Nest không resolve được `SinhVienRepository` hoặc `UserService` | Kiểm tra `forFeature`, `imports`, `exports` và đăng ký provider trùng                                                                       |
| Không tìm thấy ODBC driver                                      | Kiểm tra đã cài ODBC Driver 17 và tên driver khớp cấu hình                                                                                  |
| Không kết nối được `localhost\VIETTUAN`                         | Kiểm tra SQL Server instance đang chạy, sửa `host`/`instanceName`; kiểm tra TCP/IP và SQL Server Browser khi kết nối named instance qua TCP |
| Windows Authentication bị từ chối                               | Kiểm tra quyền truy cập database của tài khoản Windows đang chạy terminal                                                                   |
| Không tìm thấy bảng `SinhVien`                                  | Kiểm tra database/schema; `synchronize: false` không tạo bảng tự động                                                                       |
| Cổng `3000` đã được sử dụng                                     | Đổi biến môi trường `PORT` hoặc dừng ứng dụng đang chiếm cổng                                                                               |

## License

`package.json` hiện khai báo `UNLICENSED` và `private: true`.
