import type { Page } from "@playwright/test";

export const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

export async function createDefaultTodos(page: Page) {
  for (const item of TODO_ITEMS) {
    await page.locator(".new-todo").fill(item);
    await page.locator(".new-todo").press("Enter");
  }
}

export async function checkNumberOfTodosInLocalStorage(
  page: Page,
  expected: number
) {
  await page.waitForFunction((e) => {
    return JSON.parse(localStorage["react-todos"]).length === e;
  }, expected);
}

export async function checkNumberOfCompletedTodosInLocalStorage(
  page: Page,
  expected: number
) {
  await page.waitForFunction((e) => {
    return (
      JSON.parse(localStorage["react-todos"]).filter(
        (todo: { completed: boolean }) => todo.completed
      ).length === e
    );
  }, expected);
}

export async function visitTestApp(page: Page) {
  await page.goto("https://demo.playwright.dev/todomvc");
}
