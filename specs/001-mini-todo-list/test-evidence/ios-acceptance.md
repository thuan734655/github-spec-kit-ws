# Nghiệm thu iOS — T026

**Trạng thái** — Chờ kết quả thực tế. Mọi ca bên dưới đang chờ xác minh.

Nguồn yêu cầu là [đặc tả đã duyệt](../spec.md), [T026](../tasks.md) và
[hướng dẫn kiểm thử](../quickstart.md). [Bằng chứng tự động](automated.md)
ghi riêng kết quả Jest và các kiểm tra trên Windows.

## Chuẩn bị

- Ghi ngày chạy, model iPhone, phiên bản iOS, phiên bản Expo Go hoặc mã bản cài,
  commit hoặc trạng thái mã nguồn, và loại kết nối.
- Dùng dữ liệu thử nghiệm. Với Expo Go, kết nối iPhone và máy tính cùng Wi-Fi,
  đăng nhập cùng tài khoản Expo trên CLI và Expo Go. Từ thư mục gốc chạy
  `npm ci`, `npx expo login`, rồi `npx expo start --go`.
  Quét QR bằng Camera trên iPhone và mở trong Expo Go.
  [Hướng dẫn Expo](https://docs.expo.dev/get-started/start-developing/)
- Ghi mỗi ca theo mẫu `ID | Đạt / Không đạt / Chưa chạy | Quan sát | Tệp bằng chứng (nếu có)`.
  Nếu không đạt, ghi bước lỗi và nội dung màn hình. Chỉ điền Đạt sau khi quan sát đủ kết quả mong đợi.

## Checklist trên iPhone

- [ ] IOS-01 · US1, SC-004 — Dùng danh sách thử trống. Kiểm tra lời nhắc thêm công việc. Bấm Add với ô trống, rồi thử chỉ có khoảng trắng. Cả hai lần phải báo cần tiêu đề và giữ danh sách trống.
- [ ] IOS-02 · US1 — Thêm “  A  ” rồi “B”. Kiểm tra danh sách là B, A, cả hai chưa hoàn thành và A đã bỏ khoảng trắng hai đầu.
- [ ] IOS-03 · US3, SC-004 — Đánh dấu A hoàn thành rồi bỏ đánh dấu. Ghi thứ tự và trạng thái sau mỗi lần. Chỉ trạng thái A thay đổi. Đánh dấu lại A để chuẩn bị thử lưu dữ liệu.
- [ ] IOS-04 · US4, SC-004 — Thêm một A nữa để có hai mục A khác trạng thái. Bấm Delete ở A mới rồi Cancel. Kiểm tra danh sách giữ nguyên. Bấm lại và xác nhận Delete. Chỉ A mới biến mất. Với một danh sách thử chỉ còn một mục, xóa mục cuối và kiểm tra thông báo danh sách trống.
- [ ] IOS-05 · US2 và US4 — Ghi danh sách có cả hai trạng thái và một tiêu đề đã xóa riêng biệt. Vuốt đóng hẳn Expo Go, mở lại dự án khi Metro vẫn truy cập được. So sánh tiêu đề, trạng thái và thứ tự trước/sau. Tiêu đề đã xóa không xuất hiện.
- [ ] IOS-06 · US2 — Khi dự án đang mở và danh sách đã tải, bật chế độ máy bay rồi xác nhận Wi-Fi và dữ liệu di động đã tắt. Thử thêm, đổi trạng thái và xác nhận xóa dữ liệu thử. Ghi hành vi quan sát được. Đây là ca thao tác ngoại tuyến khi ứng dụng đang chạy.
- [ ] IOS-07 · US2, SC-003 — Dùng bản iOS đã cài có nhúng bundle JavaScript. Tạo danh sách có cả hai trạng thái và xóa một mục riêng biệt. Ghi danh sách mốc. Tắt Wi-Fi và dữ liệu di động, đóng hẳn và mở lại bản cài ba lần liên tiếp. Sau từng lần ghi tiêu đề, trạng thái, thứ tự và xác nhận mục đã xóa vẫn vắng mặt. [Kiểm thử với bản release Expo](https://docs.expo.dev/guides/using-e2e/)
- [ ] IOS-08 · US2, FR-008 — Dùng môi trường kiểm thử có thể tạo lỗi đọc AsyncStorage một lần rồi đọc thành công. Xác minh thông báo lỗi và Retry hiện trên màn hình, không hiện trạng thái danh sách trống và không thể thay đổi công việc. Bấm Retry và kiểm tra danh sách cũ trở lại, thao tác được mở khóa. Expo Go hiện không có cơ chế tạo lỗi này từ giao diện. Nếu thiếu môi trường tạo lỗi, ghi Chưa chạy trên thiết bị. Các ca Jest giả lập được ghi riêng.
- [ ] IOS-09 · US2, FR-008 — Với môi trường có thể tạo lỗi ghi, thử lần lượt Add, đổi trạng thái và xác nhận xóa. Quan sát thông báo lỗi, danh sách đã lưu giữ nguyên, và bản nháp Add còn nguyên. Nếu thiếu môi trường tạo lỗi, ghi Chưa chạy trên thiết bị. Tắt mạng không tạo lỗi cho AsyncStorage.
- [ ] IOS-10 · US1, SC-002 — Trên cả bố cục iPhone màn hình nhỏ và lớn, tạo 20 mục đánh số. Cuộn tới đủ 20 mục và kiểm tra vùng an toàn. Mở bàn phím, thử Add và Dismiss keyboard. Ghi model và kết quả từng bố cục. Dùng công cụ kiểm tra bố cục để xác nhận vùng chạm tối thiểu 44 × 44 điểm; nếu chỉ thử chạm tay, ghi rõ số đo chưa xác minh.
- [ ] IOS-11 · US1–US4, SC-005 — Mở Settings → Accessibility → VoiceOver. Vuốt để chuyển tiêu điểm và chạm hai lần để kích hoạt. Ghi nhãn được đọc ở ô tiêu đề, Add, công việc, Delete, Cancel và nút xác nhận. Kiểm tra VoiceOver phân biệt trạng thái hoàn thành và chưa hoàn thành. Nếu chạy IOS-08 với VoiceOver, ghi thêm nhãn Retry.
- [ ] IOS-12 · SC-001 — Cho 5 người lần đầu dùng ứng dụng tự thêm một công việc. Bấm giờ từ lúc màn hình danh sách mở đến khi mục xuất hiện, không hướng dẫn thao tác. Ghi thời gian và có cần trợ giúp cho từng người, dùng mã P1–P5. Đạt khi ít nhất 4/5 người tự hoàn thành trong tối đa 30 giây.

## Nhật ký kết quả

Chưa có kết quả từ iPhone. T026 chờ bằng chứng cho các điều kiện nghiệm thu
trong đầu việc, gồm hai cỡ màn hình, năm người dùng lần đầu, ba lần mở lại
ngoại tuyến trên bản có bundle, các ca thao tác và VoiceOver. T027 chờ bước
rà soát bằng chứng riêng.
