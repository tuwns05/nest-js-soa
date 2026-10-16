# Thực hành kiến trúc hướng dịch vụ (SOA)

Project NestJS gồm các REST API, mỗi service phụ trách một nghiệp vụ, chạy trên cổng riêng và kết nối database SQL Server riêng.

## Các bài thực hành

| Bài | Service | Cổng mặc định | Database | Tài liệu | Swagger |
| --- | --- | --- | --- | --- | --- |
| BTH2: Router, Middleware và JWT | `svc-auth` | `3004` | `SOA_BTH` | [Bài thực hành 2](svc-auth/README.md) | [Swagger Auth](http://localhost:3004/api) |
| BTH3: Quản lý sản phẩm | `svc-product` | `3005` | `SOA_Product` | [Bài thực hành 3](svc-product/README.md) | [Swagger Product](http://localhost:3005/api) |

### BTH2: Dịch vụ xác thực

Đăng nhập, cấp JWT, bảo vệ API bằng guard và ghi log request bằng middleware.

**Code mở cổng `3004`:** [`app.listen(process.env.PORT ?? 3004)` trong main.ts](svc-auth/src/main.ts#L19).

**Áp dụng SOA:** đóng gói nghiệp vụ xác thực thành service độc lập tại cổng `3004`, quản lý tài khoản trong `SOA_BTH`. Token được cấp có thể dùng ở service sản phẩm, giúp tái sử dụng chức năng xác thực.

### BTH3: Dịch vụ quản lý sản phẩm

Cung cấp API thêm, xem, sửa, xóa sản phẩm; yêu cầu JWT do BTH2 cấp.

**Code mở cổng `3005`:** [`app.listen(process.env.PORT ?? 3005)` trong main.ts](svc-product/src/main.ts#L11).

**Áp dụng SOA:** service chạy độc lập tại cổng `3005`, quản lý dữ liệu trong `SOA_Product`. Product kiểm tra JWT mà không truy vấn database tài khoản. Mỗi service có API riêng, giao tiếp với client qua HTTP; mã kết nối database dùng chung nhưng mỗi tiến trình có connection pool riêng.

