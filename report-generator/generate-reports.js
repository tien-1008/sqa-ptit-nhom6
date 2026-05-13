const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const ROOT_DIR = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");
const EVIDENCE_DIRS = [
  path.join(REPORTS_DIR, "evidence"),
  path.join(REPORTS_DIR, "evidence", "screenshots"),
  path.join(REPORTS_DIR, "evidence", "unit-test-result"),
  path.join(REPORTS_DIR, "evidence", "api-test-result")
];

const STATUS_VALUES = ["PASS", "FAIL", "BLOCKED", "NOT RUN", "N/A"];
const SEVERITY_VALUES = ["Critical", "High", "Medium", "Low", "Info"];
const PRIORITY_VALUES = ["High", "Medium", "Low"];

const COLORS = {
  header: "1F4E78",
  subHeader: "D9EAF7",
  accent: "E2F0D9",
  border: "B7C9D6"
};

for (const directory of [REPORTS_DIR, ...EVIDENCE_DIRS]) {
  fs.mkdirSync(directory, { recursive: true });
}

function textValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function widthForColumn(column) {
  let maxLength = 12;
  column.eachCell({ includeEmpty: true }, (cell) => {
    const cellText = textValue(cell.value);
    const longestLine = cellText
      .split(/\r?\n/)
      .reduce((longest, line) => Math.max(longest, line.length), 0);
    maxLength = Math.max(maxLength, longestLine + 2);
  });
  return Math.min(Math.max(maxLength, 12), 42);
}

function applyValidation(worksheet) {
  const headerRow = worksheet.getRow(1);
  for (let columnNumber = 1; columnNumber <= worksheet.columnCount; columnNumber += 1) {
    const header = textValue(headerRow.getCell(columnNumber).value);
    let allowedValues = null;

    if (["Status", "Trạng thái", "Result"].includes(header)) {
      allowedValues = STATUS_VALUES;
    }

    if (header.includes("Severity") || header === "Mức độ ảnh hưởng") {
      allowedValues = SEVERITY_VALUES;
    }

    if (header === "Priority") {
      allowedValues = PRIORITY_VALUES;
    }

    if (!allowedValues) continue;

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
      worksheet.getCell(rowNumber, columnNumber).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${allowedValues.join(",")}"`],
        showErrorMessage: true,
        errorTitle: "Giá trị không hợp lệ",
        error: `Chỉ dùng một trong các giá trị: ${allowedValues.join(", ")}.`
      };
    }
  }
}

function styleWorksheet(worksheet) {
  const border = {
    top: { style: "thin", color: { argb: COLORS.border } },
    left: { style: "thin", color: { argb: COLORS.border } },
    bottom: { style: "thin", color: { argb: COLORS.border } },
    right: { style: "thin", color: { argb: COLORS.border } }
  };

  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: Math.max(worksheet.rowCount, 1), column: Math.max(worksheet.columnCount, 1) }
  };

  worksheet.eachRow((row, rowNumber) => {
    row.height = rowNumber === 1 ? 24 : 42;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = {
        vertical: "top",
        horizontal: rowNumber === 1 ? "center" : "left",
        wrapText: true
      };
      cell.border = border;
      if (rowNumber === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: COLORS.header }
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" }
        };
      }
    });
  });

  worksheet.columns.forEach((column) => {
    column.width = widthForColumn(column);
  });

  applyValidation(worksheet);
}

function addTableSheet(workbook, name, headers, rows) {
  const worksheet = workbook.addWorksheet(name);
  worksheet.addRow(headers);
  rows.forEach((row) => worksheet.addRow(row));
  styleWorksheet(worksheet);
  return worksheet;
}

function addOverviewSheet(workbook, name, rows) {
  const worksheet = addTableSheet(workbook, name, ["Mục", "Nội dung"], rows);
  worksheet.getColumn(1).width = 28;
  worksheet.getColumn(2).width = 90;
  return worksheet;
}

function createWorkbook(title) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SQA E-commerce Mini System";
  workbook.lastModifiedBy = "Codex report generator";
  workbook.created = new Date("2026-05-12T00:00:00+07:00");
  workbook.modified = new Date("2026-05-12T00:00:00+07:00");
  workbook.title = title;
  workbook.subject = "Bộ báo cáo phục vụ bài tập nhóm môn Đảm bảo chất lượng phần mềm";
  workbook.company = "Nhóm SQA";
  return workbook;
}

function countBy(rows, index, value) {
  return rows.filter((row) => row[index] === value).length;
}

function countSeverity(rows, index) {
  return SEVERITY_VALUES.reduce((result, severity) => {
    result[severity] = rows.filter((row) => row[index] === severity).length;
    return result;
  }, {});
}

function percentage(value, total) {
  if (!total) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

const planScopeRows = [
  [
    "SCOPE-01",
    "Authentication & Authorization",
    "Đăng ký, đăng nhập, JWT, role USER / ADMIN",
    "Kiểm tra validate email/password, token, 401/403, phân quyền route admin.",
    "UI, API/Black-box, Unit",
    "Nguyễn Huy Trường",
    "Đối chiếu `auth.schema.ts`, `AuthContext.tsx` và middleware backend."
  ],
  [
    "SCOPE-02",
    "Product Management",
    "List/detail/filter, CRUD admin, public active product",
    "Kiểm tra tìm kiếm, lọc danh mục/giá/tồn kho, product inactive và delete history.",
    "UI, API/Black-box, Review code",
    "Hồ Quang Trường",
    "Có test backend cho create product, inactive visibility, delete 409."
  ],
  [
    "SCOPE-03",
    "Cart & Checkout",
    "Giỏ hàng, số lượng, tổng tiền, checkout",
    "Kiểm tra tồn kho, cart empty, shipping payload, checkout transaction, clear cart.",
    "UI, API/Black-box, Unit",
    "Hoàng Xuân Thảo",
    "Liên quan `CartPage.tsx`, `CheckoutPage.tsx`, `order.service.ts`."
  ],
  [
    "SCOPE-04",
    "Order Management",
    "Orders mine, admin order list, status transition",
    "Kiểm tra ma trận chuyển trạng thái, huỷ đơn, khôi phục tồn kho, admin authorization.",
    "UI, API/Black-box, Unit",
    "Ngô Quang Tiến",
    "Có unit test cho state transition."
  ],
  [
    "SCOPE-05",
    "Voucher & Product Review",
    "Voucher create/apply, review sản phẩm đã mua",
    "Kiểm tra voucher expired/limit/min order và review completed/duplicate/purchased item.",
    "UI, API/Black-box, Unit",
    "Trần Chí Trung",
    "Có test backend cho voucher apply, review duplicate và `items[].reviewed`."
  ]
];

const staffingRows = [
  ["1", "Nguyễn Huy Trường", "SQA phụ trách Auth", "Authentication & Authorization", "Review yêu cầu auth, test login/register/admin guard.", "Checklist auth, test result, defect note."],
  ["2", "Hồ Quang Trường", "SQA phụ trách Product", "Product Management", "Review API product, test CRUD/filter/public visibility.", "Checklist product, UI/API test result."],
  ["3", "Hoàng Xuân Thảo", "SQA phụ trách Cart", "Cart & Checkout", "Test giỏ hàng, checkout, tồn kho, shipping validation.", "Test execution sheet, defect về checkout UX nếu có."],
  ["4", "Ngô Quang Tiến", "SQA phụ trách Order", "Order Management", "Review state machine, test order list/transition/cancel.", "Transition matrix, API/UI test result."],
  ["5", "Trần Chí Trung", "SQA phụ trách Voucher/Review", "Voucher & Product Review", "Test voucher rule, review rule, duplicate review.", "Defect log, review result, recommendation."]
];

const scheduleRows = [
  ["PLAN-01", "Phân tích yêu cầu", "Đọc SRS, README, business rule và phạm vi hệ thống.", "Cả nhóm", "2026-05-12", "2026-05-12", "Danh sách yêu cầu kiểm thử", "PASS", "Đã đối chiếu từ `docs/SRS.md`."],
  ["PLAN-02", "Lập kế hoạch kiểm thử", "Chốt phạm vi, nhân sự, tiêu chí pass/fail.", "Nguyễn Huy Trường + nhóm trưởng", "2026-05-12", "2026-05-12", "Workbook kế hoạch kiểm thử", "PASS", "Sinh trong file `01_Ke_hoach_kiem_thu_nhom.xlsx`."],
  ["PLAN-03", "Review tài liệu", "Review README, SRS, API document, database design, test plan.", "Cả nhóm", "2026-05-13", "2026-05-13", "Checklist review tài liệu", "NOT RUN", "Dữ liệu mẫu đã điền trong workbook review."],
  ["PLAN-04", "Review code", "Đối chiếu controller/service/schema, response, auth, query an toàn.", "Cả nhóm", "2026-05-13", "2026-05-14", "Checklist review code theo module", "NOT RUN", "Có finding UI/UX mức Low/Medium."],
  ["PLAN-05", "Thiết kế test case", "Chuyển business rule thành test case UI/API/unit/negative.", "Cả nhóm", "2026-05-14", "2026-05-14", "Danh sách test case theo thành viên", "PASS", "Workbook 03 có 75 test case."],
  ["PLAN-06", "Chuẩn bị dữ liệu test", "Dùng seed account, voucher, order completed/pending.", "Hoàng Xuân Thảo + Trần Chí Trung", "2026-05-14", "2026-05-14", "Test data baseline", "PASS", "Bám `README.md` và seed backend."],
  ["PLAN-07", "Kiểm thử giao diện", "Chạy luồng user/admin trên React frontend.", "Cả nhóm", "2026-05-15", "2026-05-15", "Ảnh chụp UI, status manual case", "NOT RUN", "Lưu trong `reports/evidence/screenshots/`."],
  ["PLAN-08", "Kiểm thử API/black-box", "Gọi endpoint login, product, cart, checkout, order, voucher, review.", "Cả nhóm", "2026-05-15", "2026-05-15", "API result, black-box verdict", "NOT RUN", "Có thể dùng Supertest/Postman/curl."],
  ["PLAN-09", "Kiểm thử đơn vị", "Đọc test sẵn có, bổ sung unit test nếu cần.", "Ngô Quang Tiến + Trần Chí Trung", "2026-05-15", "2026-05-15", "Unit test log", "PASS", "Repo hiện có test transition order đã pass."],
  ["PLAN-10", "Ghi nhận defect", "Tạo defect log, severity, priority, suggestion.", "Cả nhóm", "2026-05-16", "2026-05-16", "Defect Log", "PASS", "Workbook 03 tạo 9 bug mẫu."],
  ["PLAN-11", "Tổng hợp báo cáo", "Gộp checklist, test result, defect, kết luận.", "Nhóm trưởng", "2026-05-16", "2026-05-16", "Markdown report và ba workbook", "PASS", "Sinh bởi generator trong `report-generator/`."]
];

const riskRows = [
  ["RISK-01", "Khác biệt Node.js hoặc binary SQLite làm setup lỗi.", "High", "Medium", "Ghi rõ `npm.cmd`, kiểm tra `db:init`, `db:seed`, build và test.", "Hoàng Xuân Thảo", "NOT RUN"],
  ["RISK-02", "Thiếu bằng chứng ảnh chụp khi báo cáo hoàn tất.", "Medium", "Medium", "Chuẩn hóa Evidence Index và thư mục screenshot/test result.", "Trần Chí Trung", "NOT RUN"],
  ["RISK-03", "Manual UI test chưa đồng bộ actual result giữa 5 người.", "Medium", "High", "Dùng workbook 03 làm nguồn nhập status duy nhất.", "Nhóm trưởng", "NOT RUN"],
  ["RISK-04", "Test data seed bị thay đổi trong lúc demo.", "Medium", "Medium", "Reset database bằng script init/seed trước phiên kiểm thử.", "Hoàng Xuân Thảo", "NOT RUN"],
  ["RISK-05", "Phân loại severity/priority không nhất quán.", "Low", "Medium", "Dùng checklist review và defect log mẫu trong report.", "Trần Chí Trung", "NOT RUN"],
  ["RISK-06", "Git link thật chưa được điền vào báo cáo.", "Low", "High", "Cập nhật `reports/evidence/source-code-link.md` trước khi nộp.", "Nhóm trưởng", "NOT RUN"]
];

const passFailCriteriaRows = [
  ["CRIT-01", "API contract", "HTTP code và `{ success, message, data }` đúng như tài liệu.", "Sai status code hoặc response không thống nhất.", "Áp dụng cho auth/product/cart/order/voucher/review."],
  ["CRIT-02", "Authorization", "User thường bị chặn khỏi admin API; admin truy cập hợp lệ.", "401/403 sai hoặc lộ dữ liệu admin.", "Ưu tiên kiểm tra route `/api/admin/*`."],
  ["CRIT-03", "Business rule checkout", "Không vượt tồn kho, voucher hợp lệ, order `PENDING`, cart được clear.", "Sai tổng tiền, stock âm, cart không reset, voucher sai logic.", "Mức rủi ro cao."],
  ["CRIT-04", "Order transition", "Chỉ cho transition hợp lệ; terminal state không quay lại trước.", "Cho phép `COMPLETED -> PENDING` hoặc logic trái ma trận.", "Có unit test hỗ trợ."],
  ["CRIT-05", "Review", "Chỉ review sản phẩm đã mua trong order completed và không trùng.", "Review được khi chưa mua hoặc duplicate không bị chặn.", "Đối chiếu API + UI."],
  ["CRIT-06", "UI workflow", "Form hiển thị lỗi đủ rõ, không mất dữ liệu vô cớ.", "Không báo lỗi, thông điệp khó hiểu hoặc nút hành động gây nhầm.", "Có defect mẫu cho cart/checkout/voucher UX."]
];

const reviewIssueRows = [
  ["RI-01", "Review code", "Product", "Hard delete product có order/review history từng có nguy cơ lỗi server.", "High", "Hồ Quang Trường", "PASS", "Đã xử lý bằng phản hồi 409 và ghi chú nghiệp vụ."],
  ["RI-02", "Review API", "Product", "San phẩm `INACTIVE` từng có nguy cơ xuất hiện ở public route.", "Medium", "Hồ Quang Trường", "PASS", "Đã tách public list và admin list."],
  ["RI-03", "Review UI", "Product Review", "Form review từng còn hiển thị sau khi gửi thành công.", "Low", "Trần Chí Trung", "PASS", "Đã dùng `items[].reviewed` để ẩn form."],
  ["RI-04", "Review UI", "Admin Product", "Tác vụ xóa sản phẩm từng thiếu bước xác nhận.", "Low", "Hồ Quang Trường", "PASS", "Đã thêm confirm dialog."],
  ["RI-05", "Review UI", "Cart", "Link checkout ở header giỏ hàng vẫn hiện khi giỏ trống.", "Low", "Hoàng Xuân Thảo", "FAIL", "Nên ẩn/disable CTA hoặc đổi thành link quay lại danh sách sản phẩm."],
  ["RI-06", "Review UI", "Checkout", "Field shipping không có required/inline validation ở client trước khi gửi.", "Medium", "Hoàng Xuân Thảo", "FAIL", "Bổ sung required, helper text và phản hồi lỗi theo field."],
  ["RI-07", "Review UI", "Authentication", "JWT hết hạn chưa được client chủ động xóa khỏi local state.", "Medium", "Nguyễn Huy Trường", "FAIL", "Bổ sung xử lý 401 toàn cục hoặc logout khi token invalid."],
  ["RI-08", "Review UI", "Voucher", "Lỗi voucher và lỗi checkout dùng chung vùng thông báo, nguồn lỗi chưa nổi bật.", "Low", "Trần Chí Trung", "FAIL", "Tách message cho voucher preview và lỗi submit order."],
  ["RI-09", "Review evidence", "Báo cáo SQA", "Git link và ảnh minh chứng thực tế vẫn cần nhóm điền trước khi nộp.", "Info", "Cả nhóm", "N/A", "Giữ placeholder có kiểm soát trong `source-code-link.md` và Evidence Index."]
];

const reviewSeverityCount = countSeverity(reviewIssueRows, 4);

const documentReviewRows = [
  ["DOC-01", "README.md", "Tổng quan", "Có hướng dẫn backend/frontend/database/test.", "Mô tả rõ lệnh `npm` và biến thể `npm.cmd` cho Windows.", "Đủ để người dùng dựng project local.", "PASS", "Info", "Giữ nguyên.", "Nguyễn Huy Trường", "Khớp với trạng thái repo hiện tại."],
  ["DOC-02", "README.md", "Tài khoản mẫu", "Có credential demo và warning secret local.", "Có admin/user sample, có ghi chú JWT secret `.env`.", "Đạt.", "PASS", "Info", "Không đổi.", "Nguyễn Huy Trường", "Phù hợp báo cáo."],
  ["DOC-03", "SRS.md", "Requirement", "Business rule phải phản ánh luồng thực thi.", "Có rule inactive product, delete history 409, order transition, review completed.", "Khớp code hiện tại.", "PASS", "Info", "Dùng làm chuẩn traceability.", "Hồ Quang Trường", "Không phát hiện lệch lớn."],
  ["DOC-04", "SRS.md", "Use case", "Use case chính có alternate flow.", "Có UC login, checkout voucher, order status, review.", "Đạt.", "PASS", "Info", "Có thể bổ sung sequence diagram nếu báo cáo cần.", "Hồ Quang Trường", "Không bắt buộc."],
  ["DOC-05", "API_DOCUMENT.md", "API contract", "Endpoint, body, auth flag và response mẫu rõ ràng.", "Đã mô tả auth/product/cart/voucher/order/review.", "Đạt.", "PASS", "Info", "Dùng làm nguồn test API.", "Hoàng Xuân Thảo", "Có ghi chú `items[].reviewed`."],
  ["DOC-06", "API_DOCUMENT.md", "Error response", "Có ví dụ lỗi nghiệp vụ.", "Có mẫu voucher expired và note delete product 409.", "Đạt.", "PASS", "Info", "Bổ sung ví dụ 403 admin nếu cần.", "Hoàng Xuân Thảo", "Gợi ý cải tiến nhỏ."],
  ["DOC-07", "DATABASE_DESIGN.md", "Schema", "Bảng, quan hệ, constraint chính được ghi rõ.", "Có users/categories/products/cart/vouchers/orders/order_items/reviews.", "Đạt.", "PASS", "Info", "Phù hợp kiểm thử dữ liệu.", "Ngô Quang Tiến", "Có unique constraint review."],
  ["DOC-08", "DATABASE_DESIGN.md", "Business rule DB", "Transaction và constraint quan trọng được mô tả.", "Có checkout transaction, stock, rating, order status.", "Đạt.", "PASS", "Info", "Giữ nguyên.", "Ngô Quang Tiến", "Khớp `schema.ts`."],
  ["DOC-09", "TEST_PLAN.md", "Scope & risk", "Mục tiêu, phạm vi, môi trường, rủi ro có thể dùng cho báo cáo.", "Đã có nhân sự, entry/exit, loại kiểm thử.", "Đạt.", "PASS", "Info", "Dùng workbook 01 để triển khai chi tiết.", "Trần Chí Trung", "Không cần viết lại."],
  ["DOC-10", "TEST_PLAN.md", "Pass/fail", "Tiêu chí phải bám các business rule quan trọng.", "Có tiêu chí auth, lỗi 500, tổng tiền, tồn kho, transition.", "Đạt.", "PASS", "Info", "Giữ nguyên.", "Trần Chí Trung", "Khả dụng cho nhóm."],
  ["DOC-11", "REVIEW_CHECKLIST.md", "Review checklist", "Checklist phải bao phủ tài liệu, API, code, security và UI/UX.", "Có đủ 5 nhóm checklist, bao gồm auth, response, query SQL, UI form và bảng.", "Đạt.", "PASS", "Info", "Dùng trực tiếp cho sheet review code/tài liệu.", "Nguyễn Huy Trường", "Đáp ứng yêu cầu bài tập."],
  ["DOC-12", "TEST_CASES.md", "Test case baseline", "Test case phải bao phủ đủ 5 module và có case pass/fail.", "Có test case auth, product, cart/checkout, order, voucher, review; có negative case.", "Đạt.", "PASS", "Info", "Workbook 03 mở rộng thành 75 test case theo 5 thành viên.", "Trần Chí Trung", "Đủ dữ liệu để copy vào Excel template."]
];

const authCodeReviewRows = [
  ["AUTH-CR-01", "Authentication", "backend/src/modules/auth/auth.controller.ts", "Cấu trúc code rõ ràng", "Controller chỉ nhận request, gọi service và trả response.", "Luồng controller/service/schema tách bạch.", "PASS", "Info", "Giữ cách tổ chức hiện tại.", "Nguyễn Huy Trường", "Dễ review."],
  ["AUTH-CR-02", "Authentication", "backend/src/modules/auth/auth.schema.ts", "Validate input", "Email/password/name có quy tắc cụ thể.", "Zod kiểm tra email, normalize lower-case, password complexity.", "PASS", "Info", "Dùng trực tiếp trong test schema nếu mở rộng.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-03", "Authentication", "backend/src/modules/auth/auth.service.ts", "Xử lý lỗi", "Sai credential không làm lộ thông tin nhạy cảm.", "Service trả lỗi xác thực gọn, không trả password hash.", "PASS", "Info", "Duy trì thông báo trung tính.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-04", "Authorization", "backend/src/middleware/auth.middleware.ts", "Phân quyền", "Request protected phải yêu cầu JWT hợp lệ.", "Middleware auth/admin được dùng ở route riêng.", "PASS", "Info", "Tiếp tục cover 401/403 trong API test.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-05", "Authentication", "backend/src/config/env.ts", "Không hardcode secret", "JWT secret lấy từ env, không commit secret thật.", "Repo có `.env.example`; secret runtime lấy qua config.", "PASS", "Info", "Không ghi token thật vào báo cáo.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-06", "Authentication", "backend/src/app.ts", "Response thống nhất", "API thành công/lỗi theo envelope chung.", "Auth route đi qua handler chung.", "PASS", "Info", "Giữ format `{ success, message, data }`.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-07", "Authentication", "backend/src/modules/auth/*", "Tách controller/service/model", "Module có ranh giới rõ.", "Controller/service/schema/model tách nhiệm vụ.", "PASS", "Info", "Đạt yêu cầu project rules.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-08", "Authentication", "backend/src/modules/auth/auth.service.ts", "Query database an toàn", "SQL có placeholder tham số.", "Truy vấn dùng `.prepare(...).get(...)` với input param.", "PASS", "Info", "Không phát hiện nối chuỗi SQL.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-09", "Authentication", "backend/tests/commerce-api.test.ts", "Có test tương ứng", "Ít nhất có test login thực thi được.", "Có test `logs in with seeded user credentials`.", "PASS", "Info", "Có thể thêm case sai mật khẩu.", "Nguyễn Huy Trường", ""],
  ["AUTH-CR-10", "Authentication UI", "frontend/src/context/AuthContext.tsx; frontend/src/lib/api.ts", "Dễ bảo trì / session expiry", "Client nên xử lý token invalid/expired nhất quán.", "Token lưu localStorage, API throw lỗi nhưng không tự logout khi 401.", "FAIL", "Medium", "Bổ sung interceptor/handler chung cho 401 để dọn session.", "Nguyễn Huy Trường", "Finding RI-07."]
];

const productCodeReviewRows = [
  ["PROD-CR-01", "Product", "backend/src/modules/products/product.controller.ts", "Cấu trúc code rõ ràng", "Controller mỏng, service xử lý nghiệp vụ.", "Đạt.", "PASS", "Info", "Giữ nguyên.", "Hồ Quang Trường", ""],
  ["PROD-CR-02", "Product", "backend/src/modules/products/product.schema.ts", "Validate input", "Giá, tồn kho, trạng thái, query boundary được validate.", "Có min price, stock >= 0, refine `minPrice <= maxPrice`.", "PASS", "Info", "Phù hợp black-box test.", "Hồ Quang Trường", ""],
  ["PROD-CR-03", "Product", "backend/src/modules/products/product.service.ts", "Xử lý lỗi", "Delete product history không trả 500.", "Service chủ động trả 409 khi có order/review history.", "PASS", "Info", "Đã sửa đúng finding cũ.", "Hồ Quang Trường", ""],
  ["PROD-CR-04", "Product", "backend/src/modules/products/product.routes.ts", "Phân quyền", "CRUD admin phải đi qua middleware admin.", "Có endpoint public và `/api/admin/products` riêng.", "PASS", "Info", "Đạt.", "Hồ Quang Trường", ""],
  ["PROD-CR-05", "Product", "backend/src/config/env.ts", "Không hardcode secret", "Module product không chứa secret.", "Không phát hiện credential/token trong module.", "N/A", "Info", "Không áp dụng sâu cho module này.", "Hồ Quang Trường", ""],
  ["PROD-CR-06", "Product", "backend/src/app.ts", "Response thống nhất", "Các route product trả envelope chung.", "Đạt.", "PASS", "Info", "Giữ response contract.", "Hồ Quang Trường", ""],
  ["PROD-CR-07", "Product", "backend/src/modules/products/*", "Tách controller/service/model", "Code module có cấu trúc dễ review.", "Đạt.", "PASS", "Info", "Đúng project rules.", "Hồ Quang Trường", ""],
  ["PROD-CR-08", "Product", "backend/src/modules/products/product.service.ts", "Query database an toàn", "Filter/search dùng placeholder SQL hợp lý.", "Không thấy nối trực tiếp input thành SQL nguy hiểm.", "PASS", "Info", "Duy trì cách build query hiện tại.", "Hồ Quang Trường", ""],
  ["PROD-CR-09", "Product", "backend/tests/commerce-api.test.ts", "Có test tương ứng", "Có test CRUD/rule trọng yếu.", "Có create product, inactive visibility, delete 409.", "PASS", "Info", "Có thể thêm test price boundary.", "Hồ Quang Trường", ""],
  ["PROD-CR-10", "Product", "frontend/src/pages/AdminProductsPage.tsx", "Dễ bảo trì", "UI admin có hành động xóa an toàn.", "Đã có confirm dialog trước thao tác delete.", "PASS", "Info", "Finding cũ đã đóng.", "Hồ Quang Trường", ""]
];

const cartCodeReviewRows = [
  ["CART-CR-01", "Cart & Checkout", "backend/src/modules/cart/cart.service.ts", "Cấu trúc code rõ ràng", "Cart service tập trung nghiệp vụ giỏ hàng.", "Đạt.", "PASS", "Info", "Dễ review.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-02", "Cart & Checkout", "backend/src/modules/orders/order.schema.ts", "Validate input", "Shipping, phone, voucher code được validate.", "Schema kiểm tra độ dài và regex phone.", "PASS", "Info", "Backend validation đủ.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-03", "Cart & Checkout", "backend/src/modules/orders/order.service.ts", "Xử lý lỗi", "Cart empty, inactive item, stock thiếu trả lỗi nghiệp vụ.", "Có AppError 409 rõ nghĩa.", "PASS", "Info", "Phù hợp black-box.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-04", "Cart & Checkout", "backend/src/modules/orders/order.routes.ts", "Phân quyền", "Checkout bắt buộc auth.", "Route protected.", "PASS", "Info", "Đạt.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-05", "Cart & Checkout", "backend/src/config/env.ts", "Không hardcode secret", "Module không chứa secret.", "Không phát hiện secret.", "N/A", "Info", "Không áp dụng sâu.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-06", "Cart & Checkout", "backend/src/app.ts", "Response thống nhất", "Lỗi checkout vẫn theo format chung.", "Đạt.", "PASS", "Info", "Giữ nguyên.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-07", "Cart & Checkout", "backend/src/modules/cart/*; backend/src/modules/orders/*", "Tách controller/service/model", "Cart và order tách module nhưng checkout dùng transaction.", "Đạt.", "PASS", "Info", "Ranh giới module hợp lý.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-08", "Cart & Checkout", "backend/src/modules/orders/order.service.ts", "Query database an toàn", "Insert/update checkout dùng prepared statement.", "Đạt.", "PASS", "Info", "Không phát hiện nối SQL từ user input.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-09", "Cart & Checkout", "backend/tests/commerce-api.test.ts", "Có test tương ứng", "Có test add cart và checkout.", "Đạt.", "PASS", "Info", "Có thể thêm stock exceed automated case.", "Hoàng Xuân Thảo", ""],
  ["CART-CR-10", "Cart UI", "frontend/src/pages/CartPage.tsx", "Dễ bảo trì / Button/link hợp lệ", "CTA checkout nên phản ánh cart state.", "Link `Tiep tuc checkout` vẫn hiện khi `cart.items.length === 0`.", "FAIL", "Low", "Ẩn hoặc disable CTA khi cart trống.", "Hoàng Xuân Thảo", "Finding RI-05."],
  ["CART-CR-11", "Checkout UI", "frontend/src/pages/CheckoutPage.tsx", "Validate input", "Field shipping nên có required/inline feedback trước submit.", "Inputs chưa gắn `required`; lỗi chỉ hiện sau khi backend trả về.", "FAIL", "Medium", "Bổ sung validation client tương ứng schema backend.", "Hoàng Xuân Thảo", "Finding RI-06."]
];

const orderCodeReviewRows = [
  ["ORD-CR-01", "Order", "backend/src/modules/orders/order.service.ts", "Cấu trúc code rõ ràng", "State transition được gom vào service.", "Đạt.", "PASS", "Info", "Đọc dễ, ma trận transition rõ.", "Ngô Quang Tiến", ""],
  ["ORD-CR-02", "Order", "backend/src/modules/orders/order.schema.ts", "Validate input", "Order id/status phải được validate.", "Có schema cho orderId và enum status.", "PASS", "Info", "Đạt.", "Ngô Quang Tiến", ""],
  ["ORD-CR-03", "Order", "backend/src/modules/orders/order.service.ts", "Xử lý lỗi", "Transition sai trả 409 thay vì cập nhật im lặng.", "Có `AppError` khi trạng thái không hợp lệ.", "PASS", "Info", "Phù hợp test invalid transition.", "Ngô Quang Tiến", ""],
  ["ORD-CR-04", "Order", "backend/src/modules/orders/order.routes.ts", "Phân quyền", "Mine route và admin order route phải tách quyền.", "Đạt.", "PASS", "Info", "Cần giữ API test 401/403.", "Ngô Quang Tiến", ""],
  ["ORD-CR-05", "Order", "backend/src/config/env.ts", "Không hardcode secret", "Module order không chứa secret.", "Không áp dụng.", "N/A", "Info", "Không áp dụng sâu.", "Ngô Quang Tiến", ""],
  ["ORD-CR-06", "Order", "backend/src/app.ts", "Response thống nhất", "Update/list order giữ contract chung.", "Đạt.", "PASS", "Info", "Giữ nguyên.", "Ngô Quang Tiến", ""],
  ["ORD-CR-07", "Order", "backend/src/modules/orders/*", "Tách controller/service/model", "Controller/service/model/schema độc lập.", "Đạt.", "PASS", "Info", "Đúng chuẩn repo.", "Ngô Quang Tiến", ""],
  ["ORD-CR-08", "Order", "backend/src/modules/orders/order.service.ts", "Query database an toàn", "Các truy vấn order dùng placeholder.", "Đạt.", "PASS", "Info", "Không phát hiện vấn đề SQL cơ bản.", "Ngô Quang Tiến", ""],
  ["ORD-CR-09", "Order", "backend/tests/order-status.unit.test.ts", "Có test tương ứng", "Transition matrix phải có unit test.", "Có test forward và backward/terminal.", "PASS", "Info", "Đã pass trong audit trước.", "Ngô Quang Tiến", ""],
  ["ORD-CR-10", "Order", "frontend/src/pages/AdminOrdersPage.tsx", "Dễ bảo trì", "UI admin phản ánh route order riêng, có thể kiểm thử thủ công.", "Màn hình có select status và reload theo API.", "PASS", "Info", "Có thể bổ sung badge/status color sau.", "Ngô Quang Tiến", ""]
];

const voucherReviewCodeRows = [
  ["VR-CR-01", "Voucher", "backend/src/modules/vouchers/voucher.service.ts", "Cấu trúc code rõ ràng", "Evaluate voucher tách khỏi controller.", "Đạt.", "PASS", "Info", "Dễ unit test.", "Trần Chí Trung", ""],
  ["VR-CR-02", "Voucher", "backend/src/modules/vouchers/voucher.schema.ts", "Validate input", "Code, discount, expiry, usage limit cần schema rõ.", "Schema/service phối hợp kiểm tra dữ liệu.", "PASS", "Info", "Đạt.", "Trần Chí Trung", ""],
  ["VR-CR-03", "Voucher", "backend/src/modules/vouchers/voucher.service.ts", "Xử lý lỗi", "Expired, inactive, over usage, min subtotal phải trả lỗi riêng.", "Service trả thông báo phân biệt.", "PASS", "Info", "Phù hợp test black-box.", "Trần Chí Trung", ""],
  ["VR-CR-04", "Review", "backend/src/modules/reviews/review.service.ts", "Phân quyền", "Review chỉ dành cho user có JWT và order hợp lệ.", "Service kiểm tra completed order và ownership.", "PASS", "Info", "Đạt.", "Trần Chí Trung", ""],
  ["VR-CR-05", "Voucher/Review", "backend/src/config/env.ts", "Không hardcode secret", "Module không chứa secret/token.", "Không phát hiện.", "N/A", "Info", "Không áp dụng sâu.", "Trần Chí Trung", ""],
  ["VR-CR-06", "Voucher/Review", "backend/src/app.ts", "Response thống nhất", "Cả voucher và review dùng envelope chung.", "Đạt.", "PASS", "Info", "Giữ nguyên.", "Trần Chí Trung", ""],
  ["VR-CR-07", "Voucher/Review", "backend/src/modules/vouchers/*; backend/src/modules/reviews/*", "Tách controller/service/model", "Module tách rõ theo domain.", "Đạt.", "PASS", "Info", "Đúng project rules.", "Trần Chí Trung", ""],
  ["VR-CR-08", "Voucher/Review", "backend/src/modules/vouchers/voucher.service.ts", "Query database an toàn", "Lookup voucher và insert review dùng prepared statement.", "Đạt.", "PASS", "Info", "Không phát hiện nối SQL input.", "Trần Chí Trung", ""],
  ["VR-CR-09", "Voucher/Review", "backend/tests/commerce-api.test.ts", "Có test tương ứng", "Có test voucher apply, usage seed, review duplicate.", "Đạt.", "PASS", "Info", "Đủ baseline quan trọng.", "Trần Chí Trung", ""],
  ["VR-CR-10", "Checkout UI", "frontend/src/pages/CheckoutPage.tsx", "Dễ bảo trì / thông báo lỗi", "Lỗi voucher nên tách ngữ cảnh với lỗi checkout.", "Cùng state `error` dùng cho load cart, voucher apply và order submit.", "FAIL", "Low", "Tách error state theo khu vực để người dùng hiểu nguồn lỗi.", "Trần Chí Trung", "Finding RI-08."]
];

function testRow(id, module, fn, type, scenario, preconditions, steps, data, expected, actual, status, severity, tester, evidence, note) {
  return [
    id,
    module,
    fn,
    type,
    scenario,
    preconditions,
    steps,
    data,
    expected,
    actual,
    status,
    severity,
    tester,
    evidence,
    note
  ];
}

const authTestRows = [
  testRow("AUTH-TC-01", "Authentication & Authorization", "Register", "UI", "Đăng ký hợp lệ trên form frontend.", "Frontend/backend chạy local.", "Mở `/register`, nhập name/email/password hợp lệ, submit.", "new.user@example.com / NewUser@123", "Đi tới trang sản phẩm hoặc trạng thái đăng nhập thành công.", "Chờ nhóm chạy manual UI.", "NOT RUN", "", "Nguyễn Huy Trường", "screenshots/AUTH-TC-01.png", "UI case."),
  testRow("AUTH-TC-02", "Authentication & Authorization", "Register", "UI", "Đăng ký email sai format.", "Trang register mở được.", "Nhập email `abc`, password hợp lệ, submit.", "abc / NewUser@123", "Hiển thị lỗi validate, không tạo user.", "Chờ nhóm chạy manual UI.", "NOT RUN", "", "Nguyễn Huy Trường", "screenshots/AUTH-TC-02.png", "Negative UI."),
  testRow("AUTH-TC-03", "Authentication & Authorization", "Register", "UI", "Đăng ký mật khẩu yếu.", "Trang register mở được.", "Nhập password `12345678`, submit.", "weak@example.com / 12345678", "Hiển thị lỗi password complexity.", "Chờ nhóm chạy manual UI.", "NOT RUN", "", "Nguyễn Huy Trường", "screenshots/AUTH-TC-03.png", "Negative UI."),
  testRow("AUTH-TC-04", "Authentication & Authorization", "Logout", "UI", "Logout phía client.", "Đã login user seed.", "Click logout trong layout.", "user@example.com", "Token/user localStorage bị xóa, menu về guest state.", "Chờ nhóm chạy manual UI.", "NOT RUN", "", "Nguyễn Huy Trường", "screenshots/AUTH-TC-04.png", "Client-side flow."),
  testRow("AUTH-TC-05", "Authentication & Authorization", "Admin guard", "UI", "User thường mở màn admin.", "Đăng nhập role USER.", "Điều hướng vào route admin qua URL.", "role USER", "Không thấy dữ liệu admin hoặc bị route guard chặn.", "Chờ nhóm chạy manual UI.", "NOT RUN", "", "Nguyễn Huy Trường", "screenshots/AUTH-TC-05.png", "Security UI."),
  testRow("AUTH-TC-06", "Authentication & Authorization", "Login", "Black-box/API", "Đăng nhập user seed hợp lệ.", "Database đã seed.", "POST `/api/auth/login`.", "user@example.com / User@123", "HTTP 200, có token JWT và role USER.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Nguyễn Huy Trường", "api-test-result/AUTH-TC-06.txt", "Khớp test backend hiện có."),
  testRow("AUTH-TC-07", "Authentication & Authorization", "Login", "Black-box/API", "Đăng nhập sai mật khẩu.", "User seed tồn tại.", "POST `/api/auth/login` với password sai.", "user@example.com / Wrong@123", "HTTP 401, success=false.", "Chưa chạy trong workbook baseline.", "NOT RUN", "", "Nguyễn Huy Trường", "api-test-result/AUTH-TC-07.txt", "Negative API."),
  testRow("AUTH-TC-08", "Authentication & Authorization", "Admin API", "Black-box/API", "User thường gọi API admin.", "Có token USER.", "POST `/api/admin/products`.", "Payload product hợp lệ", "HTTP 403.", "Chưa chạy trong workbook baseline.", "NOT RUN", "", "Nguyễn Huy Trường", "api-test-result/AUTH-TC-08.txt", "Security API."),
  testRow("AUTH-TC-09", "Authentication & Authorization", "Admin API", "Black-box/API", "Admin gọi API admin hợp lệ.", "Có token ADMIN.", "GET `/api/admin/products`.", "admin@example.com / Admin@123", "HTTP 200, nhận danh sách sản phẩm.", "Chưa ghi nhận kết quả thực thi riêng.", "NOT RUN", "", "Nguyễn Huy Trường", "api-test-result/AUTH-TC-09.txt", "Access API."),
  testRow("AUTH-TC-10", "Authentication & Authorization", "Auth me", "Black-box/API", "Đọc profile từ token hợp lệ.", "Đã login.", "GET `/api/auth/me`.", "Bearer token", "HTTP 200, trả user hiện tại.", "Chưa chạy trong workbook baseline.", "NOT RUN", "", "Nguyễn Huy Trường", "api-test-result/AUTH-TC-10.txt", "Contract API."),
  testRow("AUTH-TC-11", "Authentication & Authorization", "Password schema", "Unit", "Schema từ chối password thiếu chữ hoa.", "Có runner Vitest nếu nhóm bổ sung.", "Gọi register schema với password yếu.", "abc123456", "Parse fail.", "Chưa có unit test tách riêng trong repo.", "NOT RUN", "", "Nguyễn Huy Trường", "unit-test-result/AUTH-TC-11.txt", "Đề xuất bổ sung."),
  testRow("AUTH-TC-12", "Authentication & Authorization", "Email normalization", "Unit", "Schema lower-case email.", "Có runner Vitest nếu nhóm bổ sung.", "Parse email in hoa.", "USER@EXAMPLE.COM", "Kết quả được chuẩn hóa lower-case.", "Chưa chạy.", "NOT RUN", "", "Nguyễn Huy Trường", "unit-test-result/AUTH-TC-12.txt", "Đề xuất bổ sung."),
  testRow("AUTH-TC-13", "Authentication & Authorization", "Route guard helper", "Unit", "Kiểm tra helper quyết định role UI.", "Nếu tách logic guard thành hàm testable.", "Gọi helper với role USER/ADMIN.", "USER, ADMIN", "Kết quả boolean đúng.", "Chưa có helper/unit test riêng.", "NOT RUN", "", "Nguyễn Huy Trường", "unit-test-result/AUTH-TC-13.txt", "Ý tưởng cải tiến."),
  testRow("AUTH-TC-14", "Authentication & Authorization", "JWT expiry UX", "Negative/Fail", "JWT hết hạn trên client.", "Có token hết hạn trong localStorage.", "Mở trang protected hoặc gọi API sau khi token hết hạn.", "Expired JWT", "Client tự dọn session hoặc hướng người dùng login lại rõ ràng.", "Hiện tại `api.ts` chỉ throw lỗi; `AuthContext` chưa tự logout khi 401.", "FAIL", "Medium", "Nguyễn Huy Trường", "screenshots/AUTH-TC-14.png", "Khớp review issue RI-07."),
  testRow("AUTH-TC-15", "Authentication & Authorization", "Required fields", "Negative/Fail", "Submit login khi bỏ trống required field.", "Trang login mở được.", "Để trống email hoặc password rồi submit.", "email/password rỗng", "Form hiện thông báo validate phù hợp.", "Chưa chạy manual.", "NOT RUN", "", "Nguyễn Huy Trường", "screenshots/AUTH-TC-15.png", "Negative UI.")
];

const productTestRows = [
  testRow("PROD-TC-01", "Product Management", "Product list", "UI", "Xem danh sách sản phẩm public.", "Frontend/backend chạy, seed data sẵn sàng.", "Mở trang sản phẩm.", "Seed products", "Danh sách hiển thị sản phẩm active.", "Chờ manual UI.", "NOT RUN", "", "Hồ Quang Trường", "screenshots/PROD-TC-01.png", ""),
  testRow("PROD-TC-02", "Product Management", "Search", "UI", "Tìm kiếm sản phẩm theo từ khóa.", "Trang list mở được.", "Nhập `Keyboard` vào search và áp dụng.", "Keyboard", "Danh sách phù hợp từ khóa.", "Chờ manual UI.", "NOT RUN", "", "Hồ Quang Trường", "screenshots/PROD-TC-02.png", ""),
  testRow("PROD-TC-03", "Product Management", "Category filter", "UI", "Lọc theo danh mục.", "Có category seed.", "Chọn category, quan sát list.", "Mechanical / Office / ...", "Chỉ hiện product cùng danh mục.", "Chờ manual UI.", "NOT RUN", "", "Hồ Quang Trường", "screenshots/PROD-TC-03.png", ""),
  testRow("PROD-TC-04", "Product Management", "Detail", "UI", "Xem chi tiết sản phẩm.", "Có product active.", "Click product card.", "productId hợp lệ", "Trang detail hiển thị tên, giá, tồn kho, mô tả.", "Chờ manual UI.", "NOT RUN", "", "Hồ Quang Trường", "screenshots/PROD-TC-04.png", ""),
  testRow("PROD-TC-05", "Product Management", "Admin create", "UI", "Admin thêm sản phẩm bằng form.", "Đăng nhập ADMIN.", "Nhập payload hợp lệ và submit.", "Regression Mouse / 650000 / stock 9", "UI báo thành công và list reload.", "Chờ manual UI.", "NOT RUN", "", "Hồ Quang Trường", "screenshots/PROD-TC-05.png", ""),
  testRow("PROD-TC-06", "Product Management", "Create product", "Black-box/API", "Admin tạo sản phẩm hợp lệ.", "Có token ADMIN.", "POST `/api/admin/products`.", "Payload Regression Mouse", "HTTP 201, trả product mới.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Hồ Quang Trường", "api-test-result/PROD-TC-06.txt", "Automated."),
  testRow("PROD-TC-07", "Product Management", "Visibility", "Black-box/API", "Public ẩn product inactive, admin vẫn xem được.", "Admin có thể tạo product `INACTIVE`.", "Gọi public list/detail và admin list.", "status=INACTIVE", "Public không trả product; admin list có.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Hồ Quang Trường", "api-test-result/PROD-TC-07.txt", "Automated."),
  testRow("PROD-TC-08", "Product Management", "Delete product", "Black-box/API", "Xóa product đã có order history.", "Product seed đã từng nằm trong order item.", "DELETE `/api/admin/products/:id`.", "Product seed có history", "HTTP 409, không 500.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Hồ Quang Trường", "api-test-result/PROD-TC-08.txt", "Automated."),
  testRow("PROD-TC-09", "Product Management", "Price validation", "Black-box/API", "Admin nhập giá âm.", "Có token ADMIN.", "POST product với price < 0.", "price=-1000", "HTTP 400 validation failed.", "Chưa chạy trong workbook baseline.", "NOT RUN", "", "Hồ Quang Trường", "api-test-result/PROD-TC-09.txt", "Negative API."),
  testRow("PROD-TC-10", "Product Management", "Update product", "Black-box/API", "Admin sửa giá và tồn kho sản phẩm.", "Có token ADMIN và product tồn tại.", "PATCH `/api/admin/products/:productId`.", "price=990000, stock=3", "HTTP 200, product được cập nhật và list admin phản ánh dữ liệu mới.", "Chưa chạy trong workbook baseline.", "NOT RUN", "", "Hồ Quang Trường", "api-test-result/PROD-TC-10.txt", "Update API."),
  testRow("PROD-TC-11", "Product Management", "Filter schema", "Unit", "Schema chặn `minPrice > maxPrice`.", "Có runner Vitest nếu nhóm bổ sung.", "Parse query schema.", "minPrice=5000000,maxPrice=1000000", "Parse fail.", "Chưa có unit test tách riêng.", "NOT RUN", "", "Hồ Quang Trường", "unit-test-result/PROD-TC-11.txt", "Đề xuất."),
  testRow("PROD-TC-12", "Product Management", "Product payload", "Unit", "Schema chặn stock âm.", "Có runner Vitest nếu nhóm bổ sung.", "Parse product payload.", "stock=-1", "Parse fail.", "Chưa chạy.", "NOT RUN", "", "Hồ Quang Trường", "unit-test-result/PROD-TC-12.txt", "Đề xuất."),
  testRow("PROD-TC-13", "Product Management", "Image URL", "Unit", "Schema cho phép image URL hợp lệ hoặc rỗng.", "Có runner Vitest nếu nhóm bổ sung.", "Parse hai payload imageUrl.", "https URL / empty string", "Payload hợp lệ.", "Chưa chạy.", "NOT RUN", "", "Hồ Quang Trường", "unit-test-result/PROD-TC-13.txt", "Boundary."),
  testRow("PROD-TC-14", "Product Management", "Unauthorized create", "Negative/Fail", "User thường không được tạo sản phẩm.", "Có token USER.", "POST `/api/admin/products`.", "Payload hợp lệ", "HTTP 403.", "Chưa chạy riêng trong workbook.", "NOT RUN", "", "Hồ Quang Trường", "api-test-result/PROD-TC-14.txt", "Negative access."),
  testRow("PROD-TC-15", "Product Management", "Price filter boundary", "Negative/Fail", "Lọc khoảng giá sai thứ tự.", "Không cần auth.", "GET products với `minPrice > maxPrice`.", "minPrice=9000000,maxPrice=1000", "HTTP 400.", "Chưa chạy.", "NOT RUN", "", "Hồ Quang Trường", "api-test-result/PROD-TC-15.txt", "Negative filter.")
];

const cartTestRows = [
  testRow("CART-TC-01", "Cart & Checkout", "Add item", "UI", "Thêm sản phẩm vào giỏ từ trang sản phẩm.", "Đăng nhập USER.", "Click thêm vào giỏ với product còn tồn kho.", "productId active", "Badge/cart state cập nhật.", "Chờ manual UI.", "NOT RUN", "", "Hoàng Xuân Thảo", "screenshots/CART-TC-01.png", ""),
  testRow("CART-TC-02", "Cart & Checkout", "Update quantity", "UI", "Tăng/giảm số lượng trong cart.", "Cart có item.", "Click icon plus/minus.", "quantity 1 -> 2 -> 1", "Subtotal và total cập nhật.", "Chờ manual UI.", "NOT RUN", "", "Hoàng Xuân Thảo", "screenshots/CART-TC-02.png", ""),
  testRow("CART-TC-03", "Cart & Checkout", "Remove item", "UI", "Xóa item khỏi cart.", "Cart có item.", "Click icon thùng rác.", "productId hợp lệ", "Item biến mất, total cập nhật.", "Chờ manual UI.", "NOT RUN", "", "Hoàng Xuân Thảo", "screenshots/CART-TC-03.png", ""),
  testRow("CART-TC-04", "Cart & Checkout", "Total amount", "UI", "Tổng tiền cart hiển thị đúng.", "Cart có nhiều item.", "Đối chiếu subtotal từng dòng và total.", "2 item seed", "Total = tổng subtotal.", "Chờ manual UI.", "NOT RUN", "", "Hoàng Xuân Thảo", "screenshots/CART-TC-04.png", ""),
  testRow("CART-TC-05", "Cart & Checkout", "Empty cart CTA", "UI", "Cart trống không nên thúc người dùng checkout.", "Cart empty.", "Mở `/cart`.", "Không item", "CTA checkout nên ẩn/disable hoặc chuyển sang mua hàng.", "Header `Tiep tuc checkout` vẫn hiển thị khi cart trống.", "FAIL", "Low", "Hoàng Xuân Thảo", "screenshots/CART-TC-05.png", "Khớp RI-05."),
  testRow("CART-TC-06", "Cart & Checkout", "Add to cart", "Black-box/API", "Thêm sản phẩm vào cart.", "Có token USER.", "POST `/api/cart/items`.", "productId=1, quantity=1", "HTTP 201, cart summary trả item.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Hoàng Xuân Thảo", "api-test-result/CART-TC-06.txt", "Automated."),
  testRow("CART-TC-07", "Cart & Checkout", "Checkout", "Black-box/API", "Checkout cart hợp lệ.", "Cart có item hợp lệ.", "POST `/api/orders/checkout`.", "shipping payload hợp lệ", "HTTP 201, order PENDING, cart clear.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Hoàng Xuân Thảo", "api-test-result/CART-TC-07.txt", "Automated."),
  testRow("CART-TC-08", "Cart & Checkout", "Stock limit", "Black-box/API", "Thêm số lượng vượt stock.", "Có token USER.", "POST cart item vượt tồn kho.", "quantity lớn hơn stock", "HTTP 409.", "Chưa chạy trong workbook baseline.", "NOT RUN", "", "Hoàng Xuân Thảo", "api-test-result/CART-TC-08.txt", "Negative API."),
  testRow("CART-TC-09", "Cart & Checkout", "Empty checkout", "Black-box/API", "Checkout khi cart empty.", "Cart empty.", "POST checkout.", "shipping payload hợp lệ", "HTTP 409 Cart is empty.", "Chưa chạy.", "NOT RUN", "", "Hoàng Xuân Thảo", "api-test-result/CART-TC-09.txt", "Negative API."),
  testRow("CART-TC-10", "Cart & Checkout", "Voucher checkout", "Black-box/API", "Checkout có voucher hợp lệ.", "Cart đủ min subtotal.", "POST checkout kèm `voucherCode`.", "WELCOME10", "Order có discount và final amount đúng.", "Chưa chạy riêng trong workbook.", "NOT RUN", "", "Hoàng Xuân Thảo", "api-test-result/CART-TC-10.txt", "Integration."),
  testRow("CART-TC-11", "Cart & Checkout", "Cart total formula", "Unit", "Tính total theo price x quantity.", "Nếu tách helper/service unit.", "Gọi logic tổng hợp item.", "2 x 300000 + 1 x 500000", "Total = 1100000.", "Chưa có unit tách riêng.", "NOT RUN", "", "Hoàng Xuân Thảo", "unit-test-result/CART-TC-11.txt", "Đề xuất."),
  testRow("CART-TC-12", "Cart & Checkout", "Checkout transaction", "Unit", "Transaction rollback khi stock thiếu.", "Nếu mock DB transaction.", "Mô phỏng item hết stock trong transaction.", "quantity > stock", "Không tạo order/không trừ kho.", "Chưa chạy.", "NOT RUN", "", "Hoàng Xuân Thảo", "unit-test-result/CART-TC-12.txt", "Đề xuất rủi ro cao."),
  testRow("CART-TC-13", "Cart & Checkout", "Quantity schema", "Unit", "Schema từ chối quantity <= 0.", "Có unit schema nếu nhóm bổ sung.", "Parse payload cart.", "quantity=0", "Parse fail.", "Chưa chạy.", "NOT RUN", "", "Hoàng Xuân Thảo", "unit-test-result/CART-TC-13.txt", "Boundary."),
  testRow("CART-TC-14", "Cart & Checkout", "Shipping UI validation", "Negative/Fail", "Bỏ trống shipping address ở UI checkout.", "Checkout page mở được.", "Xóa địa chỉ và submit.", "shippingAddress rỗng", "UI nên chặn sớm hoặc hiển thị inline error rõ.", "Inputs chưa gắn `required`; lỗi phụ thuộc phản hồi backend.", "FAIL", "Medium", "Hoàng Xuân Thảo", "screenshots/CART-TC-14.png", "Khớp RI-06."),
  testRow("CART-TC-15", "Cart & Checkout", "Quantity over stock", "Negative/Fail", "Tăng số lượng cart vượt stock từ UI.", "Cart có item.", "Click plus vượt tồn kho hiện tại.", "stock boundary", "UI hiển thị lỗi và không cập nhật cart.", "Chờ manual UI.", "NOT RUN", "", "Hoàng Xuân Thảo", "screenshots/CART-TC-15.png", "Negative UI.")
];

const orderTestRows = [
  testRow("ORD-TC-01", "Order Management", "My orders", "UI", "User xem danh sách đơn của mình.", "Đăng nhập USER.", "Mở `/orders`.", "Seed orders", "Chỉ đơn của user hiển thị.", "Chờ manual UI.", "NOT RUN", "", "Ngô Quang Tiến", "screenshots/ORD-TC-01.png", ""),
  testRow("ORD-TC-02", "Order Management", "Order status", "UI", "Hiển thị trạng thái đơn hàng.", "Có order pending/completed seed.", "Quan sát badge/status.", "PENDING, COMPLETED", "Label trạng thái rõ ràng.", "Chờ manual UI.", "NOT RUN", "", "Ngô Quang Tiến", "screenshots/ORD-TC-02.png", ""),
  testRow("ORD-TC-03", "Order Management", "Admin orders", "UI", "Admin xem toàn bộ đơn.", "Đăng nhập ADMIN.", "Mở admin order page.", "Seed data", "List có nhiều order và thông tin customer.", "Chờ manual UI.", "NOT RUN", "", "Ngô Quang Tiến", "screenshots/ORD-TC-03.png", ""),
  testRow("ORD-TC-04", "Order Management", "Admin transition", "UI", "Admin đổi PENDING -> CONFIRMED.", "Có order PENDING.", "Chọn status mới và submit.", "CONFIRMED", "UI báo thành công và dòng order cập nhật.", "Chờ manual UI.", "NOT RUN", "", "Ngô Quang Tiến", "screenshots/ORD-TC-04.png", ""),
  testRow("ORD-TC-05", "Order Management", "Order total", "UI", "Hiển thị tổng tiền và discount trên order.", "Order đã seed với voucher.", "Mở order detail/list.", "WELCOME10", "Total/discount/final amount khớp dữ liệu seed.", "Chờ manual UI.", "NOT RUN", "", "Ngô Quang Tiến", "screenshots/ORD-TC-05.png", ""),
  testRow("ORD-TC-06", "Order Management", "Update status", "Black-box/API", "Admin cập nhật status theo transition hợp lệ.", "Có admin token và order PENDING.", "PATCH `/api/admin/orders/:id/status`.", "CONFIRMED", "HTTP 200, status updated.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Ngô Quang Tiến", "api-test-result/ORD-TC-06.txt", "Automated."),
  testRow("ORD-TC-07", "Order Management", "Shipping transition", "Black-box/API", "CONFIRMED -> SHIPPING.", "Có order CONFIRMED.", "PATCH status.", "SHIPPING", "HTTP 200.", "Chưa chạy.", "NOT RUN", "", "Ngô Quang Tiến", "api-test-result/ORD-TC-07.txt", ""),
  testRow("ORD-TC-08", "Order Management", "Complete transition", "Black-box/API", "SHIPPING -> COMPLETED.", "Có order SHIPPING.", "PATCH status.", "COMPLETED", "HTTP 200.", "Chưa chạy.", "NOT RUN", "", "Ngô Quang Tiến", "api-test-result/ORD-TC-08.txt", ""),
  testRow("ORD-TC-09", "Order Management", "Invalid transition", "Black-box/API", "COMPLETED -> PENDING bị chặn.", "Có order completed.", "PATCH status.", "PENDING", "HTTP 409.", "Chưa chạy riêng trong workbook.", "NOT RUN", "", "Ngô Quang Tiến", "api-test-result/ORD-TC-09.txt", "Negative API."),
  testRow("ORD-TC-10", "Order Management", "Cancel order", "Black-box/API", "Cancel order khi còn PENDING.", "Có order PENDING.", "PATCH status.", "CANCELLED", "HTTP 200 và stock được restore.", "Chưa chạy.", "NOT RUN", "", "Ngô Quang Tiến", "api-test-result/ORD-TC-10.txt", "Rủi ro inventory."),
  testRow("ORD-TC-11", "Order Management", "Forward transitions", "Unit", "Cho phép transition tiến hợp lệ.", "Vitest backend.", "Chạy unit test `allows forward transitions`.", "PENDING->CONFIRMED, CONFIRMED->SHIPPING", "Test PASS.", "Đã PASS trong `order-status.unit.test.ts`.", "PASS", "", "Ngô Quang Tiến", "unit-test-result/ORD-TC-11.txt", "Automated."),
  testRow("ORD-TC-12", "Order Management", "Backward/terminal", "Unit", "Từ chối transition lùi hoặc terminal.", "Vitest backend.", "Chạy unit test `rejects invalid backward or terminal transitions`.", "COMPLETED->PENDING, CANCELLED->CONFIRMED", "Test PASS.", "Đã PASS trong `order-status.unit.test.ts`.", "PASS", "", "Ngô Quang Tiến", "unit-test-result/ORD-TC-12.txt", "Automated."),
  testRow("ORD-TC-13", "Order Management", "Cancel stock restore", "Unit", "Khôi phục stock sau cancel.", "Nếu bổ sung unit/integration test.", "Mock order items và update status CANCELLED.", "quantity theo order items", "Stock tăng đúng.", "Chưa có test tách riêng.", "NOT RUN", "", "Ngô Quang Tiến", "unit-test-result/ORD-TC-13.txt", "Đề xuất."),
  testRow("ORD-TC-14", "Order Management", "Unauthorized admin list", "Negative/Fail", "User thường xem admin orders.", "Có token USER.", "GET `/api/admin/orders`.", "Bearer USER", "HTTP 403.", "Chưa chạy.", "NOT RUN", "", "Ngô Quang Tiến", "api-test-result/ORD-TC-14.txt", "Negative access."),
  testRow("ORD-TC-15", "Order Management", "Cancel completed order", "Negative/Fail", "Không cho cancel order COMPLETED.", "Có order completed.", "PATCH status CANCELLED.", "COMPLETED -> CANCELLED", "HTTP 409.", "Chưa chạy.", "NOT RUN", "", "Ngô Quang Tiến", "api-test-result/ORD-TC-15.txt", "Negative transition.")
];

const voucherReviewTestRows = [
  testRow("VR-TC-01", "Voucher & Product Review", "Create voucher", "UI", "Admin tạo voucher hợp lệ.", "Đăng nhập ADMIN.", "Mở admin vouchers, nhập form, submit.", "SPRING15", "UI báo tạo thành công, list reload.", "Chờ manual UI.", "NOT RUN", "", "Trần Chí Trung", "screenshots/VR-TC-01.png", ""),
  testRow("VR-TC-02", "Voucher & Product Review", "Voucher preview", "UI", "User apply voucher hợp lệ ở checkout.", "Cart đủ giá trị tối thiểu.", "Nhập `WELCOME10`, click áp dụng.", "WELCOME10", "Preview hiển thị discount và final amount.", "Chờ manual UI.", "NOT RUN", "", "Trần Chí Trung", "screenshots/VR-TC-02.png", ""),
  testRow("VR-TC-03", "Voucher & Product Review", "Review form", "UI", "User review sản phẩm thuộc order completed.", "Seed completed order tồn tại.", "Mở orders, nhập rating/comment, submit.", "order 1 / product 4", "Review tạo thành công.", "Chờ manual UI.", "NOT RUN", "", "Trần Chí Trung", "screenshots/VR-TC-03.png", ""),
  testRow("VR-TC-04", "Voucher & Product Review", "Reviewed state", "UI", "Form review biến mất sau khi đã review.", "Review vừa tạo hoặc seed trạng thái reviewed.", "Reload order page.", "items[].reviewed=true", "UI không cho submit trùng.", "Chờ manual UI.", "NOT RUN", "", "Trần Chí Trung", "screenshots/VR-TC-04.png", ""),
  testRow("VR-TC-05", "Voucher & Product Review", "Voucher error UX", "UI", "Thông điệp lỗi voucher phân biệt với lỗi checkout.", "Checkout page mở được.", "Apply voucher sai mã hoặc hết hạn.", "NOTFOUND / EXPIRED20", "Thông báo gắn rõ với khu vực voucher.", "Hiện lỗi dùng chung state `error` của checkout, ngữ cảnh chưa tách.", "FAIL", "Low", "Trần Chí Trung", "screenshots/VR-TC-05.png", "Khớp RI-08."),
  testRow("VR-TC-06", "Voucher & Product Review", "Apply voucher", "Black-box/API", "Apply voucher trên cart hợp lệ.", "Cart seed đủ điều kiện.", "POST `/api/vouchers/apply`.", "WELCOME10", "HTTP 200, discount/final đúng.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Trần Chí Trung", "api-test-result/VR-TC-06.txt", "Automated."),
  testRow("VR-TC-07", "Voucher & Product Review", "Seed usage consistency", "Black-box/API", "used_count voucher phản ánh order giảm giá đã seed.", "Database đã seed.", "Gọi API/list voucher hoặc đọc assertion test.", "WELCOME10", "used_count khớp order seed.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Trần Chí Trung", "api-test-result/VR-TC-07.txt", "Automated baseline."),
  testRow("VR-TC-08", "Voucher & Product Review", "Create review", "Black-box/API", "Tạo review cho completed order hợp lệ.", "User có order completed chưa review.", "POST `/api/reviews`.", "orderId=1, productId=4, rating=5", "HTTP 201.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Trần Chí Trung", "api-test-result/VR-TC-08.txt", "Automated."),
  testRow("VR-TC-09", "Voucher & Product Review", "Duplicate review", "Black-box/API", "Không cho review trùng cùng order/product.", "Review đã tạo.", "POST lại cùng payload.", "orderId/productId giống lần trước", "HTTP 409.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Trần Chí Trung", "api-test-result/VR-TC-09.txt", "Automated."),
  testRow("VR-TC-10", "Voucher & Product Review", "Reviewed flag", "Black-box/API", "`orders/mine` đánh dấu item đã review.", "Review vừa tạo.", "GET `/api/orders/mine`.", "order 1 / product 4", "`items[].reviewed=true`.", "Đã PASS trong `commerce-api.test.ts`.", "PASS", "", "Trần Chí Trung", "api-test-result/VR-TC-10.txt", "Automated."),
  testRow("VR-TC-11", "Voucher & Product Review", "Max discount", "Unit", "Voucher percent respect max discount.", "Nếu nhóm bổ sung unit `evaluateVoucher`.", "Gọi service với subtotal lớn.", "discount percent > maxDiscount", "discountAmount không vượt maxDiscount.", "Chưa có unit test tách riêng.", "NOT RUN", "", "Trần Chí Trung", "unit-test-result/VR-TC-11.txt", "Đề xuất."),
  testRow("VR-TC-12", "Voucher & Product Review", "Rating schema", "Unit", "Rating phải trong 1-5.", "Nếu nhóm bổ sung unit schema review.", "Parse rating 0 và 6.", "0, 6", "Parse fail.", "Chưa chạy.", "NOT RUN", "", "Trần Chí Trung", "unit-test-result/VR-TC-12.txt", "Boundary."),
  testRow("VR-TC-13", "Voucher & Product Review", "Duplicate uniqueness", "Unit", "Unique review theo user/order/product.", "Nếu mock repository hoặc SQLite temp DB.", "Insert review trùng.", "same user/order/product", "Constraint hoặc service trả conflict.", "Chưa chạy.", "NOT RUN", "", "Trần Chí Trung", "unit-test-result/VR-TC-13.txt", "Đề xuất."),
  testRow("VR-TC-14", "Voucher & Product Review", "Expired/usage limit voucher", "Negative/Fail", "Voucher hết hạn hoặc vượt số lần sử dụng bị từ chối.", "Cart có item và voucher seed tồn tại.", "POST `/api/vouchers/apply` với voucher expired hoặc usage limit đã đạt.", "EXPIRED20 / LIMIT0", "HTTP 409 expired hoặc usage limit reached.", "Chưa chạy trong workbook baseline.", "NOT RUN", "", "Trần Chí Trung", "api-test-result/VR-TC-14.txt", "Negative API."),
  testRow("VR-TC-15", "Voucher & Product Review", "Review not purchased", "Negative/Fail", "Không cho review product chưa mua.", "User có token.", "POST review với product không thuộc completed order.", "productId không thuộc order", "HTTP 409/404 theo nhánh nghiệp vụ.", "Chưa chạy.", "NOT RUN", "", "Trần Chí Trung", "api-test-result/VR-TC-15.txt", "Negative API.")
];

const allExecutionRows = [
  ...authTestRows,
  ...productTestRows,
  ...cartTestRows,
  ...orderTestRows,
  ...voucherReviewTestRows
];

const testStatusIndex = 10;
const totalTests = allExecutionRows.length;
const totalPass = countBy(allExecutionRows, testStatusIndex, "PASS");
const totalFail = countBy(allExecutionRows, testStatusIndex, "FAIL");
const totalBlocked = countBy(allExecutionRows, testStatusIndex, "BLOCKED");
const totalNotRun = countBy(allExecutionRows, testStatusIndex, "NOT RUN");
const verdictCount = totalPass + totalFail + totalBlocked;

const defectRows = [
  ["BUG-01", "Product Management", "Xóa product có order/review history từng có nguy cơ lỗi server.", "High", "High", "Admin xóa product đã từng nằm trong order items.", "Trả 409 và thông báo nghiệp vụ.", "Đã sửa: service trả 409 thay vì để DB ném lỗi không kiểm soát.", "PASS", "Hồ Quang Trường", "Giữ regression test delete history.", "api-test-result/BUG-01.txt"],
  ["BUG-02", "Product Management", "Product `INACTIVE` từng có thể lộ ở public list.", "Medium", "Medium", "Đặt product inactive rồi gọi public endpoint.", "Public không trả product inactive.", "Đã sửa: public route chỉ trả ACTIVE, admin có endpoint riêng.", "PASS", "Hồ Quang Trường", "Giữ test visibility.", "api-test-result/BUG-02.txt"],
  ["BUG-03", "Product Review", "Form review từng còn hiển thị sau khi gửi thành công.", "Low", "Medium", "Submit review hợp lệ và reload UI.", "Form chuyển sang trạng thái đã review.", "Đã sửa nhờ `items[].reviewed` và reload order state.", "PASS", "Trần Chí Trung", "Giữ test duplicate review.", "api-test-result/BUG-03.txt"],
  ["BUG-04", "Admin Product UI", "Thiếu confirm dialog trước thao tác delete.", "Low", "Low", "Admin click delete product.", "Có bước xác nhận thao tác phá hủy.", "Đã sửa: frontend hỏi xác nhận trước khi gọi API.", "PASS", "Hồ Quang Trường", "Giữ manual UI check.", "screenshots/BUG-04.png"],
  ["BUG-05", "Cart UI", "Link checkout vẫn hiện khi giỏ hàng trống.", "Low", "Medium", "Đăng nhập user, mở `/cart` khi cart empty.", "CTA checkout nên ẩn hoặc disable.", "Header vẫn hiển thị `Tiep tuc checkout`.", "FAIL", "Hoàng Xuân Thảo", "Ẩn hoặc disable CTA theo `cart.items.length`.", "screenshots/BUG-05.png"],
  ["BUG-06", "Checkout UI", "Shipping fields thiếu required/inline validation ở client.", "Medium", "Medium", "Xóa shipping address rồi submit checkout.", "UI chặn sớm hoặc báo field-level error.", "Client gửi request; lỗi phụ thuộc backend trả về.", "FAIL", "Hoàng Xuân Thảo", "Bổ sung required/helper validation theo schema backend.", "screenshots/BUG-06.png"],
  ["BUG-07", "Voucher UX", "Lỗi voucher và lỗi checkout dùng chung vùng thông báo.", "Low", "Low", "Apply voucher sai mã rồi submit checkout.", "Người dùng thấy lỗi gắn đúng ngữ cảnh thao tác.", "Cùng `error` state được tái sử dụng, khó phân biệt nguồn lỗi.", "FAIL", "Trần Chí Trung", "Tách `voucherError` và `checkoutError`.", "screenshots/BUG-07.png"],
  ["BUG-08", "Authentication UX", "JWT hết hạn chưa tự dọn session client.", "Medium", "Medium", "Đặt token expired trong localStorage và mở màn protected.", "Client clear session hoặc redirect login rõ ràng.", "API ném lỗi, nhưng local token/user chưa bị dọn tự động.", "FAIL", "Nguyễn Huy Trường", "Xử lý 401 toàn cục tại `api.ts` hoặc AuthProvider.", "screenshots/BUG-08.png"],
  ["BUG-09", "Admin Voucher UI", "Danh sách voucher chưa có lọc nhanh active/expired.", "Low", "Low", "Admin mở màn voucher khi dữ liệu nhiều.", "Có filter hoặc trạng thái nổi bật để review nhanh.", "Bảng hiện toàn bộ voucher không có lọc/nhãn trạng thái thao tác nhanh.", "FAIL", "Trần Chí Trung", "Bổ sung filter nhỏ hoặc badge status nếu mở rộng.", "screenshots/BUG-09.png"],
  ["BUG-10", "Order Management", "Màu/nhãn trạng thái đơn hàng trên UI admin chưa phân biệt đủ rõ.", "Low", "Low", "Admin mở màn quản lý đơn hàng và quan sát các trạng thái PENDING/CONFIRMED/SHIPPING/COMPLETED/CANCELLED.", "Trạng thái có nhãn hoặc màu đủ dễ phân biệt khi rà soát nhiều đơn.", "UI hiện trạng thái dạng text/select cơ bản, vẫn dùng được nhưng chưa hỗ trợ scan nhanh.", "FAIL", "Ngô Quang Tiến", "Bổ sung badge màu theo trạng thái và mô tả transition kế tiếp.", "screenshots/BUG-10.png"]
];

const defectSeverityCount = countSeverity(defectRows, 3);

const evidenceRows = [
  ["EVD-001", "Authentication", "AUTH-TC-06", "API test result", "AUTH-TC-06.txt", "reports/evidence/api-test-result/AUTH-TC-06.txt", "Lưu output login API hoặc trích terminal test."],
  ["EVD-002", "Product", "PROD-TC-06", "API test result", "PROD-TC-06.txt", "reports/evidence/api-test-result/PROD-TC-06.txt", "Minh chứng create product admin."],
  ["EVD-003", "Cart & Checkout", "CART-TC-07", "API test result", "CART-TC-07.txt", "reports/evidence/api-test-result/CART-TC-07.txt", "Minh chứng checkout success."],
  ["EVD-004", "Order", "ORD-TC-11", "Unit test result", "ORD-TC-11.txt", "reports/evidence/unit-test-result/ORD-TC-11.txt", "Minh chứng unit transition."],
  ["EVD-005", "Voucher & Review", "VR-TC-09", "API test result", "VR-TC-09.txt", "reports/evidence/api-test-result/VR-TC-09.txt", "Minh chứng duplicate review bị chặn."],
  ["EVD-006", "Cart UI", "BUG-05", "Screenshot", "BUG-05.png", "reports/evidence/screenshots/BUG-05.png", "Ảnh CTA checkout khi cart empty."],
  ["EVD-007", "Checkout UI", "BUG-06", "Screenshot", "BUG-06.png", "reports/evidence/screenshots/BUG-06.png", "Ảnh form shipping thiếu inline validation."],
  ["EVD-008", "Voucher UX", "BUG-07", "Screenshot", "BUG-07.png", "reports/evidence/screenshots/BUG-07.png", "Ảnh vùng lỗi voucher dùng chung."],
  ["EVD-009", "Auth UX", "BUG-08", "Screenshot", "BUG-08.png", "reports/evidence/screenshots/BUG-08.png", "Ảnh trạng thái token expired sau API fail."],
  ["EVD-010", "Source", "N/A", "Source link", "source-code-link.md", "reports/evidence/source-code-link.md", "Tài liệu đặt Git link, branch và lệnh clone/chạy."],
  ["EVD-011", "Order UI", "BUG-10", "Screenshot", "BUG-10.png", "reports/evidence/screenshots/BUG-10.png", "Ảnh trạng thái đơn hàng trên màn admin order."],
  ["EVD-012", "Baseline", "N/A", "Sample API artifact", "API_TEST_RESULT_SAMPLE.md", "test-artifacts/API_TEST_RESULT_SAMPLE.md", "Artifact mẫu sẵn có của repo."],
  ["EVD-013", "Traceability", "N/A", "Traceability matrix", "TRACEABILITY_MATRIX_SAMPLE.md", "test-artifacts/TRACEABILITY_MATRIX_SAMPLE.md", "Nguồn phụ trợ cho báo cáo nhóm."]
];

async function buildPlanWorkbook() {
  const workbook = createWorkbook("01 - Kế hoạch kiểm thử nhóm");
  addOverviewSheet(workbook, "Tong quan", [
    ["Tên dự án", "SQA E-commerce Mini System"],
    ["Môn học", "Đảm bảo chất lượng phần mềm"],
    ["Nhóm", "Nhóm bài tập SQA - 5 thành viên"],
    ["Mục tiêu kiểm thử", "Xác nhận hệ thống mini e-commerce vận hành đúng các rule auth, product, cart, checkout, order, voucher và review; tạo bằng chứng cho báo cáo SQA."],
    ["Phạm vi kiểm thử", "UI, API/black-box, unit test baseline, review tài liệu, review code, defect log và bằng chứng chạy local."],
    ["Ngoài phạm vi kiểm thử", "Thanh toán thật, email/SMS thật, load test lớn, pentest chuyên sâu, tích hợp cloud trả phí."],
    ["Môi trường kiểm thử", "Windows 10/11, Node.js LTS, SQLite local file, Chrome/Edge, VSCode terminal, npm.cmd."],
    ["Công nghệ sử dụng", "React + Vite + TypeScript; Node.js + Express + TypeScript; SQLite; JWT; Zod; Vitest + Supertest."],
    ["Link source code Git", "Để trống placeholder, cập nhật trong `reports/evidence/source-code-link.md` trước khi nộp."],
    ["Người lập kế hoạch", "Nhóm SQA / Technical Writer"],
    ["Ngày lập", "2026-05-12"]
  ]);
  addTableSheet(
    workbook,
    "Pham vi kiem thu",
    ["ID", "Module", "Chức năng", "Mô tả phạm vi kiểm thử", "Loại kiểm thử áp dụng", "Người phụ trách", "Ghi chú"],
    planScopeRows
  );
  addTableSheet(workbook, "Nhan su", ["STT", "Thành viên", "Vai trò", "Module phụ trách", "Nhiệm vụ chính", "Deliverable"], staffingRows);
  addTableSheet(
    workbook,
    "Lich kiem thu",
    ["ID", "Hoạt động", "Mô tả", "Người phụ trách", "Ngày bắt đầu", "Ngày kết thúc", "Kết quả đầu ra", "Trạng thái", "Ghi chú"],
    scheduleRows
  );
  addTableSheet(workbook, "Rui ro", ["ID", "Rủi ro", "Mức độ ảnh hưởng", "Khả năng xảy ra", "Biện pháp xử lý", "Người theo dõi", "Trạng thái"], riskRows);
  addTableSheet(workbook, "Tieu chi Pass Fail", ["ID", "Hạng mục", "Tiêu chí Pass", "Tiêu chí Fail", "Ghi chú"], passFailCriteriaRows);
  await workbook.xlsx.writeFile(path.join(REPORTS_DIR, "01_Ke_hoach_kiem_thu_nhom.xlsx"));
}

async function buildReviewWorkbook() {
  const workbook = createWorkbook("02 - Kết quả review nhóm");
  addOverviewSheet(workbook, "Tong quan review", [
    ["Mục tiêu review", "Đối chiếu yêu cầu, API, database, code và UI với project rules và SRS."],
    ["Tài liệu/source được review", "README.md, SRS.md, API_DOCUMENT.md, DATABASE_DESIGN.md, TEST_PLAN.md và các module backend/frontend trọng yếu."],
    ["Checklist sử dụng", "`docs/REVIEW_CHECKLIST.md` và checklist mở rộng trong workbook này."],
    ["Số lỗi phát hiện", `${reviewIssueRows.length} finding review trọng yếu.`],
    ["Số lỗi Critical/High/Medium/Low", `Critical ${reviewSeverityCount.Critical}; High ${reviewSeverityCount.High}; Medium ${reviewSeverityCount.Medium}; Low ${reviewSeverityCount.Low}.`],
    ["Kết luận chung", "Kiến trúc và rule backend đáp ứng tốt bài tập SQA. Một số điểm UI/UX và session handling còn là finding mức Low/Medium phù hợp để nhóm phân tích, retest và đề xuất cải tiến."]
  ]);
  addTableSheet(
    workbook,
    "Review tai lieu",
    ["Review ID", "Tài liệu", "Module", "Checklist Item", "Expected", "Actual", "Result", "Severity", "Recommendation", "Reviewer", "Note"],
    documentReviewRows
  );
  addTableSheet(
    workbook,
    "Review code Auth",
    ["Review ID", "Module", "File/Component", "Checklist Item", "Expected", "Actual", "Result", "Severity", "Recommendation", "Reviewer", "Note"],
    authCodeReviewRows
  );
  addTableSheet(
    workbook,
    "Review code Product",
    ["Review ID", "Module", "File/Component", "Checklist Item", "Expected", "Actual", "Result", "Severity", "Recommendation", "Reviewer", "Note"],
    productCodeReviewRows
  );
  addTableSheet(
    workbook,
    "Review code Cart Checkout",
    ["Review ID", "Module", "File/Component", "Checklist Item", "Expected", "Actual", "Result", "Severity", "Recommendation", "Reviewer", "Note"],
    cartCodeReviewRows
  );
  addTableSheet(
    workbook,
    "Review code Order",
    ["Review ID", "Module", "File/Component", "Checklist Item", "Expected", "Actual", "Result", "Severity", "Recommendation", "Reviewer", "Note"],
    orderCodeReviewRows
  );
  addTableSheet(
    workbook,
    "Review code Voucher Review",
    ["Review ID", "Module", "File/Component", "Checklist Item", "Expected", "Actual", "Result", "Severity", "Recommendation", "Reviewer", "Note"],
    voucherReviewCodeRows
  );
  addTableSheet(
    workbook,
    "Tong hop loi review",
    ["ID", "Loại review", "Module", "Vấn đề", "Severity", "Người phụ trách xử lý", "Trạng thái", "Ghi chú"],
    reviewIssueRows
  );
  await workbook.xlsx.writeFile(path.join(REPORTS_DIR, "02_Ket_qua_review_nhom.xlsx"));
}

async function buildExecutionWorkbook() {
  const workbook = createWorkbook("03 - Kết quả kiểm thử 5 thành viên");
  addOverviewSheet(workbook, "Tong quan ket qua", [
    ["Tổng số test case", String(totalTests)],
    ["Số PASS", String(totalPass)],
    ["Số FAIL", String(totalFail)],
    ["Số BLOCKED", String(totalBlocked)],
    ["Số NOT RUN", String(totalNotRun)],
    ["Tỷ lệ PASS", `${percentage(totalPass, verdictCount)} trên test case đã có verdict (${verdictCount}/${totalTests}).`],
    ["Tổng số defect", String(defectRows.length)],
    ["Kết luận", "Workbook thể hiện baseline báo cáo: các test backend đã xác minh được ghi PASS, các finding UI có verdict FAIL, còn phần manual test giữ NOT RUN để nhóm cập nhật sau khi thu thập screenshot/evidence."]
  ]);

  const executionHeaders = [
    "Test Case ID",
    "Module",
    "Function",
    "Test Type",
    "Test Scenario",
    "Preconditions",
    "Test Steps",
    "Test Data",
    "Expected Result",
    "Actual Result",
    "Status",
    "Severity nếu Fail",
    "Tester",
    "Evidence",
    "Note"
  ];

  addTableSheet(workbook, "TV1_Auth", executionHeaders, authTestRows);
  addTableSheet(workbook, "TV2_Product", executionHeaders, productTestRows);
  addTableSheet(workbook, "TV3_Cart_Checkout", executionHeaders, cartTestRows);
  addTableSheet(workbook, "TV4_Order", executionHeaders, orderTestRows);
  addTableSheet(workbook, "TV5_Voucher_Review", executionHeaders, voucherReviewTestRows);
  addTableSheet(
    workbook,
    "Defect Log",
    ["Bug ID", "Module", "Title", "Severity", "Priority", "Steps To Reproduce", "Expected Result", "Actual Result", "Status", "Assignee", "Recommendation", "Evidence"],
    defectRows
  );
  addTableSheet(
    workbook,
    "Evidence Index",
    ["Evidence ID", "Module", "Test Case ID / Bug ID", "Loại minh chứng", "Tên file minh chứng", "Đường dẫn", "Ghi chú"],
    evidenceRows
  );
  await workbook.xlsx.writeFile(path.join(REPORTS_DIR, "03_Ket_qua_kiem_thu_5_thanh_vien.xlsx"));
}

async function main() {
  await buildPlanWorkbook();
  await buildReviewWorkbook();
  await buildExecutionWorkbook();
  console.log("Generated reports:");
  console.log(path.join(REPORTS_DIR, "01_Ke_hoach_kiem_thu_nhom.xlsx"));
  console.log(path.join(REPORTS_DIR, "02_Ket_qua_review_nhom.xlsx"));
  console.log(path.join(REPORTS_DIR, "03_Ket_qua_kiem_thu_5_thanh_vien.xlsx"));
}

main().catch((error) => {
  console.error("Failed to generate SQA reports.", error);
  process.exitCode = 1;
});
