import Togglable from "./Togglable";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("<Togglable />", () => {
  let container;
  beforeEach(() => {
    //he container is a property returned from the render function. It represents the top-level DOM element that contains the rendered component and its child elements.
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container;
  });

  test("renders its children", async () => {
    await screen.getAllByText("togglable content");
  });

  test("at the start, the children are not displayed", () => {
    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display: none");
  });

  test("after clicking this button, children are displayed", async () => {
    const button = screen.getByText("show...");
    const user = userEvent.setup();

    await user.click(button);

    const div = container.querySelector(".togglableContent");
    expect(div).not.toHaveStyle("display: none");
  });

  test("toggled content can be closed", async () => {
    const button = screen.getByText("show...");
    const user = userEvent.setup();

    await user.click(button);
    const cancelButton = screen.getByText("cancel");
    await user.click(cancelButton);

    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display: none");
  });
});
