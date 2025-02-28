import RefreshMdl from "../model/refresh.js";

const createRefreshToken = async (data) => {
  const result = await RefreshMdl.create(data);
  return result.toJSON();
};

export default {
  createRefreshToken,
};
