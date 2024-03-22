import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AppFunctional from "./AppFunctional";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  render(<AppFunctional />);
});

test("it renders AppFunctional Screen", () => {
  render(<AppFunctional />);
});

test("it moves right successfully", async () => {
  const rightBtn = screen.getByTestId("right");
  userEvent.click(rightBtn);

  const coords = await screen.findByText("Koordinatlar (3, 2)");
  expect(coords).toBeInTheDocument();
});

test("it moves left successfully", async () => {
  const leftBtn = screen.getByTestId("left");
  userEvent.click(leftBtn);

  const coords = await screen.findByText("Koordinatlar (1, 2)");
  expect(coords).toBeInTheDocument();
});

test("resets values successfully", async () => {
  const resetBtn = screen.getByTestId("reset");
  userEvent.click(resetBtn);
  const coords = await screen.findByText("Koordinatlar (2, 2)");
  expect(coords).toBeInTheDocument();
});

test("it moves up successfully", async () => {
  const upBtn = screen.getByTestId("up");
  userEvent.click(upBtn);

  const coords = await screen.findByText("Koordinatlar (2, 1)");
  expect(coords).toBeInTheDocument();
});

test("it moves down successfully", async () => {
  const downBtn = screen.getByTestId("down");
  userEvent.click(downBtn);

  const coords = await screen.findByText("Koordinatlar (2, 3)");
  expect(coords).toBeInTheDocument();
});

test("it changes email value correctly", () => {
  const email = screen.getByPlaceholderText("email girin");
  expect(email).toHaveValue("");

  userEvent.type(email, "taylancankose@gmail.com");
  fireEvent.change(email, { target: { value: "taylancankose@gmail.com" } });
  expect(email.value).toBe("taylancankose@gmail.com");
});

test("it submits form successfully", async () => {
  const upBtn = screen.getByTestId("up");
  userEvent.click(upBtn);
  const leftBtn = screen.getByTestId("left");
  userEvent.click(leftBtn);
  const coords = await screen.findByText("Koordinatlar (1, 1)");
  expect(coords).toBeInTheDocument();

  const form = screen.getByTestId("emailForm");
  const email = screen.getByTestId("email");

  userEvent.type(email, "taylancankose@gmail.com");

  fireEvent.submit(form);

  const result = screen.getByTestId("message");
  expect(result).toBeInTheDocument();
});
