module.exports = {
  handleError: (error) => {
    console.error("Error:", error.message);
    console.error("Error Details:", error.response?.data);
    process.exit(1);
  },
};
