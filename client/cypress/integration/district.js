describe("Unit test District pages", () => {
  const districts = ["Avalon", "Kingston-and-the-Islands"];

  districts.forEach(name => {
    it("loads", () => {
      cy.visit(`/riding/${name}`);
    });

    it("has home link", () => {
      assert(cy.get("a[href='/']").should("be.visible"));
    });

    it("has one image", () => {
      assert(
        cy
          .get(".dynamic-image")
          .should("be.visible")
          .should("have.length", 1)
      );
    });

    it("has two sources", () => {
      assert(
        cy
          .get("table.sources tr")
          .should("have.length", 3)
          .should("be.visible")
      );
    });
  });
});
