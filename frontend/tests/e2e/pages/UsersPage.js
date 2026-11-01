export class UsersPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Quản lý người dùng" });
    this.search = page.getByRole("textbox", { name: "Tìm người dùng" });
  }

  async open() {
    await this.page.goto("/users");
  }

  async searchFor(value) {
    await this.search.fill(value);
  }
}
