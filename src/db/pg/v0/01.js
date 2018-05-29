module.exports = {
  up: async (client) => {
    const transactions = [];
    transactions.push([
      "UPDATE data_version SET patch = 1 WHERE version = 0;"
      ]);
    client.transactions(transactions);
    console.info(`upgrade data to version: 0 patch: 1`);
  }
}