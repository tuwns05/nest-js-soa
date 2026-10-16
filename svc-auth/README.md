# Bài thực hành 2: Router, Middleware và JWT

Service `svc-auth` xử lý đăng nhập, cấp JWT, bảo vệ API và ghi log request.

| Thông tin | Giá trị |
| --- | --- |
| Cổng mặc định | `3004` |
| Database | `SOA_BTH`, bảng `dbo.User` |
| Swagger | [http://localhost:3004/api](http://localhost:3004/api) |

## Vì sao áp dụng SOA?

Nghiệp vụ xác thực được đóng gói trong service chạy độc lập, có API và database riêng. Service sản phẩm sử dụng JWT do auth cấp để xác thực request, giúp tái sử dụng chức năng đăng nhập và tách dữ liệu tài khoản khỏi dữ liệu sản phẩm.

## Chạy service

Từ thư mục gốc project:

```powershell
cd svc-auth
npm.cmd install
npm.cmd run start:dev
```

Mặc định kết nối `LAPTOP-TUNWS\VIETTUAN` bằng Windows Authentication và ODBC Driver 17. Có thể đổi qua biến môi trường `DB_HOST`, `DB_INSTANCE`, `DB_NAME`. Bảng `dbo.User` cần có tài khoản sẵn với các cột `IdUser`, `UserName`, `Password`.

## API và cách thử

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| POST | `/auth/login` | Kiểm tra tài khoản, trả `access_token` |
| GET | `/auth/profile` | Kiểm tra JWT, hiện trả `Hello World` |

Gửi body JSON sau tới `POST /auth/login` bằng tài khoản trong database:

```json
{
  "username": "tai_khoan_cua_ban",
  "password": "mat_khau_cua_ban"
}
```

Dùng token trả về trong header `Authorization: Bearer <token>` để gọi `/auth/profile` hoặc [API sản phẩm của BTH3](../svc-product/README.md). Token hết hạn sau **60 giây**; thiếu, sai hoặc hết hạn trả `401`.

Guard thực hiện xác thực JWT; middleware ghi method, URL và status. Bản thực hành hiện so sánh mật khẩu trực tiếp với database và chưa lưu token vào cột `Token`.

[← Tổng quan project](../README.md)
