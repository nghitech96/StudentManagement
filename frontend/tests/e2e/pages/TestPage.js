export class TestPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Kiểm tra hệ thống" });
    this.runButton = page.getByRole("button", { name: "Chạy kiểm tra" });
  }

  async open() {
    await this.page.goto("/test");
  }

  async runHealthCheck() {
    await this.runButton.click();
  }
}
