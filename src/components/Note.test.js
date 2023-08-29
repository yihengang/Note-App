import Note from "./Note";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

test("First test", () => {
  const note = {
    content: "Contents of the note for testing",
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.getByText("Contents of the note for testing", {
    exact: false,
  });

  //if element is null, it will pass this!
  expect(element).toBeDefined();
});

// test("Second test", () => {
//   const note = {
//     content: "Contents of the note for testing",
//     important: true,
//   };

//   const { container } = render(<Note note={note} />);

//   const div = container.querySelector(".note");
//   expect(div).toHaveTextContent("Contents of the note for testing");
// });

test("Clicking the button calls event handler once", async () => {
  const note = {
    content: "Contents of the note for testing",
    important: true,
  };

  const clickHandler = jest.fn();

  render(<Note note={note} toggleImportance={clickHandler} />);
  //session started to interact with rendered component
  const user = userEvent.setup();
  const button = screen.getByText("make not important");
  await user.click(button);

  expect(clickHandler.mock.calls).toHaveLength(1);
});
