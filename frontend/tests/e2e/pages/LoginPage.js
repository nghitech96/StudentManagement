export class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByLabel("Email");
    this.password = page.getByLabel("Mật khẩu");
    this.submitButton = page.getByRole("button", { name: "Đăng nhập" });
  }

  async open() {
    await this.page.goto("/login");
  }

  async signIn(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}
