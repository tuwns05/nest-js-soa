# Bài thực hành 3: Xây dựng dịch vụ quản lý sản phẩm (Product Management)

Service `svc-product` cung cấp REST API thêm, xem, sửa và xóa sản phẩm. Người dùng phải đăng nhập qua [service auth của BTH2](../svc-auth/README.md) để lấy JWT trước khi gọi API.

| Thông tin | Giá trị |
| --- | --- |
| Cổng mặc định | `3005` |
| Database | `SOA_Product`, bảng `dbo.products` |
| Swagger | [http://localhost:3005/api](http://localhost:3005/api) |

## Vì sao áp dụng SOA?

Product phụ trách riêng nghiệp vụ sản phẩm, chạy trên cổng và database riêng với auth. Service tự kiểm tra JWT do auth cấp, không truy vấn database tài khoản. Hai service có thể chạy và phát triển riêng; mã kết nối database dùng chung nhưng mỗi tiến trình mở connection pool riêng.

## Chạy service

Từ thư mục gốc project:

```powershell
cd svc-product
npm.cmd install
Copy-Item .env.example .env
npm.cmd run start:dev
```

Chỉ sao chép `.env` ở lần thiết lập đầu tiên. Sửa file này nếu cần đổi SQL Server hoặc cổng chạy. Mặc định dùng `LAPTOP-TUNWS\VIETTUAN`, Windows Authentication và ODBC Driver 17. Database `SOA_Product` cần có bảng `products` với các cột `id` tự tăng, `name`, `description`, `price`, `quantity`, `created_at`, `updated_at`.

## API

Tất cả endpoint đều yêu cầu `Authorization: Bearer <token>`.

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/products` | Lấy danh sách sản phẩm |
| GET | `/products/:id` | Lấy chi tiết sản phẩm |
| POST | `/products` | Thêm sản phẩm |
| PUT | `/products/:id` | Cập nhật sản phẩm |
| DELETE | `/products/:id` | Xóa sản phẩm |

Body JSON cho POST và PUT:

```json
{
  "name": "Bàn phím cơ",
  "description": "Bàn phím kết nối USB",
  "price": 750000.25,
  "quantity": 20
}
```

`name`, `price`, `quantity` bắt buộc; `description` có thể bỏ qua. Giá không âm, tối đa hai chữ số thập phân; số lượng là số nguyên không âm. Service tự gán thời gian tạo/cập nhật.

## Thử bằng Swagger hoặc Postman

1. Chạy auth ở cổng `3004`, gọi `POST /auth/login` để lấy `access_token`.
2. Mở [Swagger Product](http://localhost:3005/api), bấm **Authorize**, dán chỉ token; hoặc chọn **Bearer Token** trong Postman.
3. Gọi POST để tạo sản phẩm, lấy `id` trả về để thử GET chi tiết, PUT và DELETE.

Token có hiệu lực **60 giây**. Hai service cần dùng cùng `JWT_SECRET` nếu thay khóa mặc định. API trả `400` khi dữ liệu sai, `401` khi token thiếu/sai/hết hạn, `404` khi không có sản phẩm.

Chạy `npm.cmd test` để build và kiểm thử HTTP với database giả lập.

[← Tổng quan project](../README.md)
