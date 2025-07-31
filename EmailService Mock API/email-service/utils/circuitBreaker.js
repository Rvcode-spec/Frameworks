function wrap(fn) {
  let failureCount = 0;
  let open = false;

  return async (...args) => {
    if (open) throw new Error("Circuit is open");

    try {
      const result = await fn(...args);
      failureCount = 0;
      return result;
    } catch (error) {
      failureCount++;
      if (failureCount >= 3) open = true;
      throw error;
    }
  };
}

module.exports = { wrap };
