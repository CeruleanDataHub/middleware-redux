export default async function dispactThunk(thunk, f) {
    const response = await thunk.dispatch(f);
    if (response.error) {
        return thunk.rejectWithValue({ body: null, error: response.error });
    }
    const { payload: { body }} = response;
    return { body, error: null };
}
