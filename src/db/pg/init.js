module.exports = {
  up: async (client) => {
    const transactions = [];
    transactions.push([
      "CREATE TABLE IF NOT EXISTS data_version (version integer, patch integer);"
      ], [
      "CREATE TABLE IF NOT EXISTS users (uid UUID PRIMARY KEY, access_key char(16), access_token char(32));"
      ], [
      "INSERT INTO data_version (version, patch) VALUES (0, 0);"
      ]);
    client.transactions(transactions);
    console.info('init database');
  }
}