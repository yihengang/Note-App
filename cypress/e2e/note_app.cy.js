describe("Note app", function () {
  beforeEach(function () {
    cy.visit("");
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      username: "cason",
      name: "Cason Ang",
      password: "Password",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2023"
    );
  });

  it("user can log in", function () {
    cy.contains("log in").click();
    cy.get("#username").type("cason");
    cy.get("#password").type("Password");
    cy.get("#login-button").click();
    cy.contains("Cason Ang logged in");
  });

  it("login fails with wrong password", function () {
    cy.contains("log in").click();
    cy.get("#username").type("cason");
    cy.get("#password").type("wrong password");
    cy.get("#login-button").click();
    cy.get(".error").contains("Wrong credentials");
    cy.get(".error")
      .should("contain", "Wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");
    cy.get("html").should("not.contain", "Cason Ang logged in");
    cy.contains("Cason Ang logged in").should("not.exist");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      // cy.contains("log in").click();
      // cy.get("#username").type("cason");
      // cy.get("#password").type("Password");
      // cy.get("#login-button").click();
      cy.login({ username: "cason", password: "Password" });
    });

    it("new note can be created", function () {
      cy.contains("new note").click();
      cy.get("#new-content").type("This is the new note content");
      cy.contains("save").click();
      cy.contains("This is the new note content");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.createNote({
          content: "another note cypress",
          important: true,
        });
      });

      it("it can be made not important", function () {
        cy.contains("another note cypress")
          .parent()
          .find("button")
          .contains("make not important")
          .click();
        cy.contains("another note cypress")
          .parent()
          .find("button")
          .contains("make important");
      });
    });

    describe("and several note exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
      });

      it("one of those can be made important", function () {
        cy.contains("second note").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.get("@theButton").should("contain", "make not important");
      });
    });
  });
});
