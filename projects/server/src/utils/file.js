module.exports = {
  setFromFileNameToDBValue(filename) {
    return `/static/${filename}`;
  },
  getAbsolutePathPublicFile(filename) {
    return `${__dirname}/../../public/${filename}`;
  },
  getFilenameFromDbValue(dbValue) {
    const split = dbValue.split("/");
    if (split.length < 3) {
      return "";
    }
    return split[2];
  },
};
