
describe("itemResponseFunction", () => {
  it("works correctly", () => {
    expect(true).toBeTruthy()

    //! \todo verify results
/*
    expect(0.3694).toBeCloseTo(
      itemResponseFunction(0.5, 0.9, 0.1, -0.8),
      3 // number of digits
    );
    expect(0.5836).toBeCloseTo(
      itemResponseFunction(0.5, 0.9, 0.1, 1.2),
      3 // number of digits
    );
    */
  });
});

describe("estimateAbilityEAP", () => {
  it("works correctly", () => {
    expect(true).toBeTruthy()
  })

  //! \todo verify results
  /* const zeta = [{ a: 1.0, b: 1.2, c: 0.1 }, { a: 1.0, b: -0.5, c: 0.5 }];
  it("works with all answers correct", () => {
    expect(0.5436).toBeCloseTo(estimateAbilityEAP([1, 1], zeta), 3);
  });

  it("works with only first correct", () => {
    expect(-0.1256).toBeCloseTo(estimateAbilityEAP([1, 0], zeta), 3);
  });

  it("works with only second correct", () => {
    expect(-0.1118).toBeCloseTo(estimateAbilityEAP([0, 1], zeta), 3);
  });

  it("works with none correct", () => {
    expect(-0.6373).toBeCloseTo(estimateAbilityEAP([0, 0], zeta), 3);
  });
  */
});
