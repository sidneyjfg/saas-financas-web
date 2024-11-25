const bcrypt = require("bcryptjs");

const testPassword = async () => {
  const plainTextPassword = "123456"; // Senha fornecida no login
  const storedHash = "$2a$10$UCALCvumqmAndJk/ZSdYxukRWPR2lfq8P8mzAMznD8B2/ZJCCuYxC"; // Substitua pelo hash armazenado no banco

  const isMatch = await bcrypt.compare(plainTextPassword, storedHash);
  console.log("Password comparison result:", isMatch);
};

testPassword();
