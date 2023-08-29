import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import NoteForm from "./NoteForm.js";

test("<NoteForm /> updates parents state and calls onSubmit", async () => {
  //type something in input
  const user = userEvent.setup();
  const createNoteHandler = jest.fn();
  render(<NoteForm createNote={createNoteHandler} />);

  const inputBox = screen.getByPlaceholderText("Enter note content here");
  await user.type(inputBox, "Note Content");

  //press on the submit button
  const saveButton = screen.getByText("save");
  await user.click(saveButton);

  //get the things done
  //this checks that the createNoteHandler was called
  expect(createNoteHandler.mock.calls).toHaveLength(1);
  expect(createNoteHandler.mock.calls[0][0].content).toBe("Note Content");
});
