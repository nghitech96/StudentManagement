# Student Management

## Chạy ứng dụng local

Yêu cầu: JDK 25+ (LTS) và Node.js 20+.

### 1. Khởi động backend

Mở terminal thứ nhất tại `StudentManagement\demo`:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend dùng H2 in-memory, không cần cài MySQL. Mặc định API chạy tại `http://localhost:8082`.

Để xem dữ liệu, mở `http://localhost:8082/h2-console` khi backend đang chạy. Dùng JDBC URL `jdbc:h2:mem:student_management`, username `sa` và để trống password. Cơ sở dữ liệu chỉ tồn tại trong bộ nhớ và sẽ được tạo lại khi khởi động lại backend. H2 Console chỉ được bật trong profile `local`; backend profile này chỉ lắng nghe kết nối từ máy local.

### 2. Khởi động giao diện React

Mở terminal thứ hai tại `StudentManagement\frontend`:

```powershell
npm install
npm run dev
```

Mở `http://localhost:5173`. Vite proxy các request `/api` sang backend ở cổng `8082`.

Giao diện có các màn hình:

- `/login` — đăng nhập bằng email và mật khẩu.
- `/register` — tạo tài khoản.
- `/users` — danh sách người dùng sau khi đăng nhập.
- `/test` — kiểm tra kết nối tới backend.
- `/home-loan` — trang demo public; chọn một trong sáu kịch bản mẫu, chỉnh dữ liệu hồ sơ và gửi `POST /api/drafts`. Trang hiển thị request body, HTTP status, thời gian, response body và headers. API hiện phản hồi payload để kiểm thử, chưa lưu hồ sơ vào database.

## Kiểm tra

Backend:

```powershell
Set-Location .\demo
.\mvnw.cmd test
```

Frontend:

```powershell
Set-Location .\frontend
npm run build
npm run test:e2e
```

Các kiểm thử giao diện dùng Playwright và Page Object Model, với page objects tại `frontend\tests\e2e\pages`.

## Triển khai demo public

Frontend dùng GitHub Pages tại `https://nghitech96.github.io/StudentManagement/`; backend Spring Boot chạy riêng trên Render từ blueprint [render.yaml](./render.yaml). Workflow [deploy-frontend.yml](./.github/workflows/deploy-frontend.yml) tự build, test và deploy frontend mỗi khi có thay đổi trong `frontend/` được push lên `main`.

1. Tạo Render Blueprint từ repository này và tạo web service `student-management-api` theo `render.yaml`. Service chạy profile `production`, kiểm tra sức khỏe qua `/api/health`, và giới hạn `POST /api/drafts` ở 30 request/phút/IP.
2. Sau khi Render cấp URL, thêm repository variable `API_BASE_URL` trong **GitHub → Settings → Secrets and variables → Actions → Variables**; giá trị là origin backend, ví dụ `https://student-management-api.onrender.com` (không thêm `/api`).
3. Trong **GitHub → Settings → Pages**, chọn **GitHub Actions** làm nguồn deploy rồi chạy workflow `Deploy frontend to GitHub Pages` hoặc push thay đổi frontend lên `main`.
4. Chỉ `POST /api/drafts` được gọi không cần đăng nhập; request từ trình duyệt chỉ được CORS cho phép từ `https://nghitech96.github.io`. Các API quản lý khác vẫn giữ xác thực hiện có. CORS chỉ giới hạn trình duyệt, không ngăn gọi API bằng curl/script; rate limit là biện pháp giảm lạm dụng chứ không phải xác thực người gọi.
5. Backend demo dùng H2 trong bộ nhớ và không lưu hồ sơ vay. Rate limit lưu trong bộ nhớ của instance, nên sẽ reset khi dịch vụ khởi động lại; Render Free có thể đưa service vào trạng thái ngủ. Chỉ dùng dữ liệu giả, không gửi CCCD/email/số điện thoại thật.

Không commit secret hoặc URL có credential vào repository. GitHub Actions cần được bật quyền deploy Pages; service Render cần được tạo sau khi cấu hình được push lên GitHub.
