class Validator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  validate(input) {
    return this.strategy.validate(input);
  }
}

module.exports = Validator;
