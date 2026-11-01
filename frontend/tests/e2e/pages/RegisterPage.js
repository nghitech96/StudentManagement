export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByLabel("Tên người dùng");
    this.email = page.getByLabel("Email");
    this.password = page.getByLabel("Mật khẩu", { exact: true });
    this.confirmPassword = page.getByLabel("Xác nhận mật khẩu");
    this.submitButton = page.getByRole("button", { name: "Tạo tài khoản" });
  }

  async open() {
    await this.page.goto("/register");
  }

  async createAccount({ username, email, password, confirmPassword = password }) {
    await this.username.fill(username);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.confirmPassword.fill(confirmPassword);
    await this.submitButton.click();
  }
}
