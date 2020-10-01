export default async function dispatchThunk(thunk, f) {
  const response = await thunk.dispatch(f);
  if (response.error) {
    return thunk.rejectWithValue({ body: null, error: response.payload.error });
  }
  const {
    payload: { body },
  } = response;
  return { body, error: null };
}

export const getUsersOutputMapper = (data) => {
  return data.map(
    ({ user_id, name, email, logins_count, last_login, blocked }, idx) => ({
      id: idx,
      userId: user_id,
      name,
      email: email || '',
      logins: logins_count,
      lastLogin: last_login,
      blocked: blocked || false,
      roles: [],
    })
  );
};
