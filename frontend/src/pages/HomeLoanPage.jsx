import { useMemo, useState } from "react";
import { API_BASE_URL, api } from "../api/http.js";
import PageHeading from "../components/PageHeading.jsx";

const scenarios = [
  {
    id: "TC001",
    name: "Save Draft - Valid Home Loan",
    description: "Save draft successfully with valid data",
    expectedStatus: 201,
    requestBody: {
      applicationId: "HL202610310001",
      productType: "HOME_LOAN",
      customer: {
        customerName: "NGUYEN VAN AN",
        identityNumber: "079999000001",
        identityType: "CCCD",
        phoneNumber: "0900000001",
        email: "nguyenvanan@example.com",
        dateOfBirth: "1995-05-15",
        address: {
          street: "123 Nguyen Trai",
          ward: "Ben Thanh",
          district: "District 1",
          city: "Ho Chi Minh",
          country: "Vietnam",
        },
      },
      loanInformation: {
        loanAmount: 2500000000,
        currency: "VND",
        tenor: 240,
        tenorUnit: "MONTH",
        interestRate: 8.5,
        purpose: "HOUSE_PURCHASE",
      },
      status: "DRAFT",
    },
  },
  {
    id: "TC002",
    name: "Save Draft - Minimum Loan Amount",
    description: "Save draft with minimum loan amount",
    expectedStatus: 201,
    requestBody: {
      applicationId: "HL202610310002",
      productType: "HOME_LOAN",
      customer: {
        customerName: "TRAN VAN BINH",
        identityNumber: "079999000002",
        identityType: "CCCD",
        phoneNumber: "0900000002",
        email: "tranvanbinh@example.com",
      },
      loanInformation: {
        loanAmount: 100000000,
        currency: "VND",
        tenor: 120,
        tenorUnit: "MONTH",
        purpose: "HOUSE_PURCHASE",
      },
      status: "DRAFT",
    },
  },
  {
    id: "TC003",
    name: "Save Draft - Negative Loan Amount",
    description: "Loan amount must not be negative",
    expectedStatus: 400,
    requestBody: {
      applicationId: "HL202610310003",
      productType: "HOME_LOAN",
      customer: {
        customerName: "NGUYEN VAN AN",
        identityNumber: "079999000003",
        identityType: "CCCD",
        phoneNumber: "0900000003",
      },
      loanInformation: {
        loanAmount: -100000000,
        currency: "VND",
        tenor: 240,
        tenorUnit: "MONTH",
      },
      status: "DRAFT",
    },
  },
  {
    id: "TC004",
    name: "Save Draft - Missing Customer Name",
    description: "Customer name is required",
    expectedStatus: 400,
    requestBody: {
      applicationId: "HL202610310004",
      productType: "HOME_LOAN",
      customer: {
        customerName: "",
        identityNumber: "079999000004",
        identityType: "CCCD",
        phoneNumber: "0900000004",
      },
      loanInformation: {
        loanAmount: 2500000000,
        currency: "VND",
        tenor: 240,
        tenorUnit: "MONTH",
      },
      status: "DRAFT",
    },
  },
  {
    id: "TC005",
    name: "Save Draft - Invalid Tenor",
    description: "Loan tenor must be greater than zero",
    expectedStatus: 400,
    requestBody: {
      applicationId: "HL202610310005",
      productType: "HOME_LOAN",
      customer: {
        customerName: "LE VAN CUONG",
        identityNumber: "079999000005",
        identityType: "CCCD",
        phoneNumber: "0900000005",
      },
      loanInformation: {
        loanAmount: 2500000000,
        currency: "VND",
        tenor: 0,
        tenorUnit: "MONTH",
      },
      status: "DRAFT",
    },
  },
  {
    id: "TC006",
    name: "Save Draft - Missing Application ID",
    description: "Application ID is required",
    expectedStatus: 400,
    requestBody: {
      productType: "HOME_LOAN",
      customer: {
        customerName: "NGUYEN VAN NAM",
        identityNumber: "079999000006",
        identityType: "CCCD",
        phoneNumber: "0900000006",
      },
      loanInformation: {
        loanAmount: 2500000000,
        currency: "VND",
        tenor: 240,
        tenorUnit: "MONTH",
      },
      status: "DRAFT",
    },
  },
];

const customerFields = [
  ["customerName", "Họ và tên", "text"],
  ["identityNumber", "Số giấy tờ", "text"],
  ["identityType", "Loại giấy tờ", "select"],
  ["phoneNumber", "Số điện thoại", "tel"],
  ["email", "Email", "email"],
  ["dateOfBirth", "Ngày sinh", "date"],
];
const addressFields = [
  ["street", "Số nhà, đường"],
  ["ward", "Phường / xã"],
  ["district", "Quận / huyện"],
  ["city", "Tỉnh / thành phố"],
  ["country", "Quốc gia"],
];
const loanFields = [
  ["loanAmount", "Số tiền vay", "number"],
  ["currency", "Loại tiền", "select"],
  ["tenor", "Thời hạn vay", "number"],
  ["tenorUnit", "Đơn vị thời hạn", "select"],
  ["interestRate", "Lãi suất (%/năm)", "number"],
  ["purpose", "Mục đích vay", "select"],
];

function getValues(requestBody) {
  const customer = requestBody.customer || {};
  const address = customer.address || {};
  const loan = requestBody.loanInformation || {};
  return {
    applicationId: requestBody.applicationId || "",
    ...Object.fromEntries(customerFields.map(([name]) => [name, customer[name] ?? ""])),
    ...Object.fromEntries(addressFields.map(([name]) => [name, address[name] ?? ""])),
    ...Object.fromEntries(loanFields.map(([name]) => [name, loan[name] ?? ""])),
  };
}

function buildDraft(scenario, values) {
  const draft = structuredClone(scenario.requestBody);
  const customer = { ...(draft.customer || {}) };
  const loan = { ...(draft.loanInformation || {}) };

  for (const [name] of customerFields) {
    if (values[name] !== "" || Object.hasOwn(customer, name)) customer[name] = values[name];
  }

  const address = { ...(customer.address || {}) };
  const hasAddress = Object.hasOwn(customer, "address") || addressFields.some(([name]) => values[name] !== "");
  if (hasAddress) {
    for (const [name] of addressFields) {
      if (values[name] !== "" || Object.hasOwn(address, name)) address[name] = values[name];
    }
    customer.address = address;
  }
  if (Object.keys(customer).length) draft.customer = customer;

  if (values.applicationId !== "" || Object.hasOwn(draft, "applicationId")) {
    draft.applicationId = values.applicationId;
  }
  for (const [name] of loanFields) {
    const value = values[name];
    if (value !== "" || Object.hasOwn(loan, name)) {
      loan[name] = ["loanAmount", "tenor", "interestRate"].includes(name) && value !== ""
        ? Number(value)
        : value;
    }
  }
  if (Object.keys(loan).length) draft.loanInformation = loan;

  return draft;
}

function Field({ name, label, type, value, onChange, options }) {
  const inputProps = {
    id: name,
    name,
    value,
    onChange,
  };

  return (
    <label className="loan-field" htmlFor={name}>
      <span>{label}</span>
      {options ? (
        <select {...inputProps}>
          <option value="">-- Chọn --</option>
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>{optionLabel}</option>
          ))}
        </select>
      ) : (
        <input {...inputProps} type={type || "text"} step={type === "number" ? "any" : undefined} />
      )}
    </label>
  );
}

function FormFields({ fields, values, onChange, optionsByField = {} }) {
  return fields.map(([name, label, type]) => (
    <Field
      key={name}
      name={name}
      label={label}
      type={type}
      value={values[name]}
      onChange={onChange}
      options={optionsByField[name]}
    />
  ));
}

function prettyJSON(value) {
  return JSON.stringify(value, null, 2);
}

export default function HomeLoanPage() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [values, setValues] = useState(() => getValues(scenarios[0].requestBody));
  const [endpoint, setEndpoint] = useState(`${API_BASE_URL}/api/drafts`);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const scenario = scenarios.find((item) => item.id === scenarioId);
  const requestBody = useMemo(() => buildDraft(scenario, values), [scenario, values]);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function changeScenario(event) {
    const selected = scenarios.find((item) => item.id === event.target.value);
    setScenarioId(selected.id);
    setValues(getValues(selected.requestBody));
    setResponse(null);
  }

  async function submitDraft(event) {
    event.preventDefault();
    setLoading(true);
    const startedAt = performance.now();
    try {
      const result = await api.saveDraft(endpoint, requestBody);
      setResponse({ ...result, duration: Math.round(performance.now() - startedAt) });
    } catch (error) {
      setResponse({
        ok: false,
        status: "Network Error",
        headers: {},
        body: { message: error.message },
        duration: Math.round(performance.now() - startedAt),
      });
    } finally {
      setLoading(false);
    }
  }

  const optionsByField = {
    identityType: [["CCCD", "CCCD"], ["CMND", "CMND"], ["PASSPORT", "Hộ chiếu"]],
    currency: [["VND", "VND"], ["USD", "USD"]],
    tenorUnit: [["MONTH", "Tháng"], ["YEAR", "Năm"]],
    purpose: [
      ["HOUSE_PURCHASE", "Mua nhà"],
      ["REFINANCE", "Tái tài trợ"],
      ["RENOVATION", "Sửa chữa nhà"],
    ],
  };
  const responseHeaders = response
    ? Object.entries(response.headers).map(([name, value]) => `${name}: ${value}`).join("\n") || "Không có response headers."
    : "Chưa có response headers.";

  return (
    <>
      <PageHeading
        eyebrow="HOME LOAN · SAVE DRAFT"
        title="Đăng ký vay mua nhà"
        description="Điền thông tin khoản vay, gửi request Save Draft và xem response API ngay bên dưới."
        action={<span className="count-pill">POST · application/json</span>}
      />

      <form className="loan-form reference-loan-form" onSubmit={submitDraft}>
        <section className="panel loan-panel" aria-label="Cấu hình request">
          <div className="loan-fields">
            <Field
              name="scenario"
              label="Mẫu dữ liệu kiểm thử"
              value={scenarioId}
              onChange={changeScenario}
              options={scenarios.map((item) => [item.id, `${item.id} - ${item.name}`])}
            />
            <Field
              name="endpoint"
              label="API endpoint"
              value={endpoint}
              onChange={(event) => setEndpoint(event.target.value)}
              type="text"
            />
          </div>
          <p className="loan-hint" aria-live="polite">
            {scenario.id} · {scenario.description} · Expected status: {scenario.expectedStatus}. Chỉ dùng dữ liệu giả; API demo phản hồi payload và không lưu hồ sơ.
          </p>
        </section>

        <section className="panel loan-panel" aria-label="Thông tin khách hàng">
          <div className="loan-panel-heading"><h2>Thông tin khách hàng</h2></div>
          <div className="loan-fields">
            <FormFields fields={customerFields} values={values} onChange={updateField} optionsByField={optionsByField} />
          </div>
          <h3 className="loan-subheading">Địa chỉ</h3>
          <div className="loan-fields loan-fields-three">
            <FormFields fields={addressFields} values={values} onChange={updateField} />
          </div>
        </section>

        <section className="panel loan-panel" aria-label="Thông tin khoản vay">
          <div className="loan-panel-heading"><h2>Thông tin khoản vay</h2></div>
          <div className="loan-fields loan-fields-three">
            <Field
              name="applicationId"
              label="Mã hồ sơ"
              value={values.applicationId}
              onChange={updateField}
            />
            <FormFields fields={loanFields} values={values} onChange={updateField} optionsByField={optionsByField} />
          </div>
        </section>

        <section className="panel loan-panel" aria-label="Gửi request và kết quả">
          <div className="loan-actions">
            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi Save Draft"}
            </button>
            <span className="count-pill">POST · application/json</span>
          </div>
          <h2 className="loan-subheading">Request body sẽ gửi</h2>
          <pre id="request-preview" className="loan-code">{prettyJSON(requestBody)}</pre>
          <div className="loan-response-heading">
            <h2>API response</h2>
            <span className={`count-pill${response ? (response.ok ? " response-success" : " response-failure") : ""}`} role="status">
              {response ? `${response.status} ${response.statusText || ""}`.trim() : "Chưa gửi request"}
            </span>
            <span className="count-pill">{response ? `${response.duration} ms` : "-- ms"}</span>
          </div>
          <pre className="loan-code" aria-label="Response body">
            {response ? prettyJSON(response.body) : "Response sẽ hiển thị tại đây."}
          </pre>
          <h2 className="loan-subheading">Response headers</h2>
          <pre className="loan-code">{responseHeaders}</pre>
        </section>
      </form>
    </>
  );
}
