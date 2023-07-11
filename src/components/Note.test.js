import Note from "./Note";
import { render, screen } from "@testing-library/react";

test("", () => {
  const note = {
    content: "Contents of the note for testing",
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.getByText("Contents of the note for testing");
  expect(element).toBeDefined();
});
